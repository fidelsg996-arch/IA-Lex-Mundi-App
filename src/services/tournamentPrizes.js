const { stripe } = require('../config/stripe');

/**
 * Finaliza un torneo y distribuye los premios automáticamente
 * @param {string} tournamentId - ID del torneo
 */
async function finalizeTournamentAndDistributePrizes(tournamentId) {
  // 1. Obtener torneo y sus ganadores
  const tournament = await db.tournaments.findById(tournamentId);
  const winners = await db.tournament_results.findByTournament(tournamentId);
  
  console.log(`🏆 Finalizando torneo ${tournament.name}`);
  console.log(`💰 Prize pool total: $${tournament.prize_pool}`);

  // 2. Distribuir premios según posiciones
  const prizeDistribution = calculatePrizeDistribution(
    tournament.prize_pool,
    tournament.prize_structure // ej: { 1: 0.5, 2: 0.3, 3: 0.2 }
  );

  // 3. Procesar cada ganador
  for (const winner of winners) {
    const prizeAmount = prizeDistribution[winner.rank];
    if (!prizeAmount) continue;

    const user = await db.users.findById(winner.user_id);
    
    if (!user.stripe_account_id) {
      console.error(`Usuario ${user.id} no tiene cuenta Stripe`);
      await notifyAdminMissingAccount(user, prizeAmount);
      continue;
    }

    // Verificar estado del onboarding
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    
    // Crear registro del premio en BD
    const prizeRecord = await db.prizes.create({
      tournament_id: tournamentId,
      winner_id: user.id,
      amount: prizeAmount,
      rank: winner.rank,
      status: account.payouts_enabled ? 'processing' : 'pending_onboarding'
    });

    if (account.payouts_enabled && account.details_submitted) {
      // ✅ Onboarding completado - enviar premio AHORA
      await sendInstantPrize(account.id, prizeAmount, {
        tournament_id: tournamentId,
        winner_name: user.full_name,
        winner_email: user.email,
        rank: winner.rank,
        prize_id: prizeRecord.id
      });
      
      await db.prizes.update(prizeRecord.id, { status: 'paid' });
      
    } else {
      // ❌ Onboarding incompleto - enviar email de invitación
      await sendOnboardingEmail(user, prizeAmount, tournament.name);
      console.log(`📧 Email enviado a ${user.email} para completar onboarding`);
    }
  }
  
  // 4. Marcar torneo como finalizado
  await db.tournaments.update(tournamentId, { 
    status: 'completed',
    finalized_at: new Date()
  });
}

/**
 * Envía el premio usando Instant Payouts (<30 minutos)
 */
async function sendInstantPrize(connectedAccountId, amountUSD, metadata) {
  try {
    const payout = await stripe.payouts.create(
      {
        amount: amountUSD * 100,
        currency: 'usd',
        method: 'instant',  // 🔑 Esto activa el pago instantáneo
        description: `Premio Torneo Lex Mundi - ${metadata.rank}° lugar`,
        metadata: {
          tournament_id: metadata.tournament_id,
          prize_id: metadata.prize_id,
          winner_email: metadata.winner_email,
          type: 'tournament_prize',
          auto_paid: 'true'
        }
      },
      {
        stripeAccount: connectedAccountId
      }
    );
    
    console.log(`✅ Premio de $${amountUSD} enviado instantáneamente a ${connectedAccountId}`);
    return payout;
    
  } catch (error) {
    console.error('Error en pago instantáneo:', error);
    
    if (error.code === 'insufficient_funds') {
      console.error('⚠️ Fondos insuficientes en balance de la plataforma');
      await notifyAdminLowBalance(amountUSD);
    }
    
    throw error;
  }
}

/**
 * Calcula la distribución de premios según porcentajes
 */
function calculatePrizeDistribution(totalPrizePool, structure) {
  const distribution = {};
  for (const [rank, percentage] of Object.entries(structure)) {
    distribution[rank] = Math.round(totalPrizePool * percentage);
  }
  return distribution;
}

/**
 * Envía email al ganador para completar onboarding
 */
async function sendOnboardingEmail(user, prizeAmount, tournamentName) {
  // Usar SendGrid, Resend, o nodemailer
  const onboardingLink = user.onboarding_link;
  
  await emailService.send({
    to: user.email,
    subject: `🎉 ¡Felicidades! Has ganado $${prizeAmount} en ${tournamentName}`,
    html: `
      <h1>¡Eres el ganador!</h1>
      <p>Has ganado <strong>$${prizeAmount} USD</strong> en el torneo ${tournamentName}.</p>
      <p>Para recibir tu premio, completa tu perfil en Stripe (solo toma 2 minutos):</p>
      <a href="${onboardingLink}" style="background:#635bff; color:white; padding:12px 24px; text-decoration:none; border-radius:8px;">
        Recibir mi premio ahora
      </a>
      <p>El dinero estará disponible en tu tarjeta de débito en menos de 30 minutos después de completar el proceso.</p>
      <hr>
      <p><small>Stripe requiere verificar tu identidad por razones de seguridad y cumplimiento legal.</small></p>
    `
  });
}

module.exports = {
  finalizeTournamentAndDistributePrizes,
  sendInstantPrize
};