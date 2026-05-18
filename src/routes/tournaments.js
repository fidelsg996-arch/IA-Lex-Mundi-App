const express = require('express');
const router = express.Router();
const { stripe } = require('../config/stripe');

/**
 * POST /api/tournaments/:id/register
 * Inscribe a un usuario en un torneo (cobra la inscripción)
 */
router.post('/:tournamentId/register', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { userId, paymentMethodId } = req.body;

    // Obtener usuario y torneo de la BD
    const user = await db.users.findById(userId);
    const tournament = await db.tournaments.findById(tournamentId);

    if (!user.stripe_account_id) {
      return res.status(400).json({ error: 'Usuario no tiene cuenta Stripe' });
    }

    // Crear PaymentIntent (cargo normal en TU cuenta de plataforma)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: tournament.registration_fee * 100, // Stripe usa centavos
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        type: 'tournament_registration',
        tournament_id: tournamentId,
        user_id: userId,
        user_email: user.email,
        tournament_name: tournament.name
      }
    });

    // Registrar inscripción en tu BD
    await db.registrations.create({
      user_id: userId,
      tournament_id: tournamentId,
      payment_intent_id: paymentIntent.id,
      status: 'confirmed'
    });

    res.json({
      success: true,
      registration_id: paymentIntent.id,
      amount: tournament.registration_fee
    });

  } catch (error) {
    console.error('Error en inscripción:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;