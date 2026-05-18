const express = require('express');
const router = express.Router();
const { stripe } = require('../config/stripe');

/**
 * POST /api/auth/register
 * Registra un nuevo usuario y crea automáticamente su cuenta Stripe Connect Express
 */
router.post('/register', async (req, res) => {
  try {
    const { email, fullName, country } = req.body;

    // 1. Crear usuario en tu base de datos (ejemplo con pseudo-código)
    const user = await db.users.create({
      email,
      full_name: fullName,
      country,
      role: 'participant'
    });

    // 2. Crear cuenta Stripe Connect Express usando Accounts V2 API
    const account = await stripe.v2.core.accounts.create({
      display_name: fullName,
      contact_email: email,
      dashboard: 'express',  // Dashboard simplificado para el usuario
      defaults: {
        responsibilities: {
          fees_collector: 'stripe',
          losses_collector: 'stripe',
        },
      },
      identity: {
        country: country,
        entity_type: 'individual',
      },
      configuration: {
        merchant: {
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true }  // Para recibir pagos
          },
        },
      },
    });

    // 3. Guardar el account_id en tu BD
    await db.users.update(user.id, {
      stripe_account_id: account.id,
      onboarding_status: 'pending'
    });

    // 4. Generar link de onboarding (se usará si el usuario gana)
    const accountLink = await stripe.v2.core.accountLinks.create({
      account: account.id,
      use_case: {
        type: 'account_onboarding',
        account_onboarding: {
          configurations: ['merchant'],
          refresh_url: `${process.env.APP_URL}/onboarding/refresh`,
          return_url: `${process.env.APP_URL}/onboarding/complete?userId=${user.id}`,
        },
      },
    });

    // Guardar el link por si se necesita después
    await db.users.update(user.id, {
      onboarding_link: accountLink.url
    });

    res.status(201).json({
      success: true,
      user: { id: user.id, email, onboarding_status: 'pending' }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;