const express = require('express');
const router = express.Router();
const { stripe, webhookSecret } = require('../config/stripe');

/**
 * Manejador de eventos específicos
 */
const eventHandlers = {
  'payment_intent.succeeded': async (event) => {
    const paymentIntent = event.data.object;
    const metadata = paymentIntent.metadata;

    console.log(`✅ Pago exitoso: ${paymentIntent.id}`);

    // Si es inscripción a torneo, actualizar estado en BD
    if (metadata.type === 'tournament_registration') {
      await db.registrations.update(
        { payment_intent_id: paymentIntent.id },
        { status: 'paid', payment_status: 'succeeded' }
      );
      
      // Incrementar prize pool del torneo
      await db.tournaments.incrementPrizePool(
        metadata.tournament_id,
        paymentIntent.amount
      );
    }
  },

  'account.updated': async (event) => {
    const account = event.data.object;
    
    // Buscar usuario por stripe_account_id
    const user = await db.users.findOne({ 
      stripe_account_id: account.id 
    });
    
    if (user && account.details_submitted && account.payouts_enabled) {
      // El usuario completó su onboarding
      await db.users.update(user.id, { 
        onboarding_status: 'completed',
        payouts_enabled: true
      });
      
      console.log(`✅ Usuario ${user.email} completó onboarding`);
      
      // Verificar si tiene premios pendientes
      const pendingPrizes = await db.prizes.find({
        winner_id: user.id,
        status: 'pending_onboarding'
      });
      
      // Procesar cada premio pendiente
      for (const prize of pendingPrizes) {
        await processPrizePayout(prize, account.id);
      }
    }
  },

  'payout.created': async (event) => {
    const payout = event.data.object;
    console.log(`💰 Payout creado: ${payout.id} por $${payout.amount/100}`);
  },

  'payout.failed': async (event) => {
    const payout = event.data.object;
    console.error(`❌ Payout fallido: ${payout.id}`, payout.failure_message);
    // Notificar al administrador
  }
};

/**
 * Función auxiliar para procesar el pago del premio
 */
async function processPrizePayout(prize, connectedAccountId) {
  const { stripe } = require('../config/stripe');
  
  try {
    const payout = await stripe.payouts.create(
      {
        amount: prize.amount * 100,
        currency: 'usd',
        method: 'instant',  // Para que llegue en <30 min
        description: `Premio Torneo Lex Mundi - ${prize.rank} lugar`,
        metadata: {
          tournament_id: prize.tournament_id,
          prize_id: prize.id,
          type: 'tournament_prize'
        }
      },
      {
        stripeAccount: connectedAccountId
      }
    );
    
    await db.prizes.update(prize.id, { 
      status: 'paid',
      payout_id: payout.id,
      paid_at: new Date()
    });
    
    console.log(`✅ Premio de $${prize.amount} enviado a ${connectedAccountId}`);
    
  } catch (error) {
    console.error(`Error enviando premio: ${error.message}`);
    if (error.code === 'instant_payouts_not_available') {
      // Fallback a método estándar
      await sendStandardPayout(prize, connectedAccountId);
    }
  }
}

/**
 * Endpoint del webhook
 * IMPORTANTE: Usar bodyParser.raw() para verificar firma
 */
router.post('/stripe-webhook', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // Verificar la firma usando el SDK oficial
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error(`⚠️ Error verificando firma: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Procesar el evento con el handler correspondiente
    const handler = eventHandlers[event.type];
    
    if (handler) {
      try {
        await handler(event);
        res.json({ received: true });
      } catch (err) {
        console.error(`Error procesando ${event.type}:`, err);
        res.status(500).send('Internal Server Error');
      }
    } else {
      console.log(`Evento no manejado: ${event.type}`);
      res.json({ received: true });
    }
  }
);

module.exports = router;