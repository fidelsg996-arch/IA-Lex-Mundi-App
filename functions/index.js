/**
 * Cloud Functions para Lex Mundi IA
 * Integración con Stripe Connect para torneos y premios en efectivo
 */

const { onCall, onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const Stripe = require("stripe");
const cors = require("cors");
const { getConfig } = require("./config");

// Inicializar Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Configuración global
setGlobalOptions({ maxInstances: 10, region: "us-central1" });

// ============================================
// CONFIGURACIÓN DE STRIPE
// ============================================

// Obtener configuración
const config = getConfig();
const STRIPE_SECRET_KEY = config.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET_PLATFORM = config.STRIPE_WEBHOOK_SECRET_PLATFORM;
const STRIPE_WEBHOOK_SECRET_CONNECT = config.STRIPE_WEBHOOK_SECRET_CONNECT;
const APP_URL = config.APP_URL;

// Validar que la clave secreta existe
if (!STRIPE_SECRET_KEY) {
  console.error("ERROR: STRIPE_SECRET_KEY no está configurada");
} else {
  console.log("✅ Stripe secret key configurada correctamente");
}

// Inicializar Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

// Middleware CORS para funciones HTTP
const corsHandler = cors({ origin: true });

// ============================================
// UTILIDADES CORREGIDAS
// ============================================

function generatePrizeCode(tournamentId, winnerId) {
  const prefix = "LX";
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const tournamentHash = tournamentId?.toString().slice(-4) || "0000";
  return `${prefix}-${tournamentHash}-${timestamp}-${random}`;
}

// FUNCIÓN CORREGIDA - Recibe el request completo
function validateAuth(request) {
  // Verificar que existe el objeto auth
  if (!request.auth) {
    console.error('No auth object in request');
    throw new Error("Debes iniciar sesión para realizar esta acción");
  }
  
  // En Firebase Functions v2, el UID está en request.auth.uid
  const uid = request.auth.uid;
  
  if (!uid) {
    console.error('Auth object structure:', JSON.stringify(request.auth));
    throw new Error("No se pudo obtener el ID de usuario");
  }
  
  console.log(`✅ Usuario autenticado: ${uid}`);
  return uid;
}

// ============================================
// FUNCIÓN INTERNA: PROCESAR PAGO DE PREMIO
// ============================================

async function processPrizePayment(prizeId, connectedAccountId, amount, tournamentId, prizeCode) {
  try {
    const balance = await stripe.balance.retrieve();
    const availableUSD = balance.available.find(b => b.currency === "usd")?.amount || 0;

    if (availableUSD < amount * 100) {
      logger.error(`Fondos insuficientes: disponible ${availableUSD}, necesario ${amount * 100}`);
      
      await db.collection("prizes").doc(prizeId).update({
        status: "failed",
        failure_reason: "insufficient_funds",
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      throw new Error("Fondos insuficientes en la plataforma");
    }

    try {
      const payout = await stripe.payouts.create(
        {
          amount: Math.round(amount * 100),
          currency: "usd",
          method: "instant",
          description: `🏆 Premio Torneo Lex Mundi - ${tournamentId}`,
          metadata: {
            tournament_id: tournamentId,
            prize_id: prizeId,
            prize_code: prizeCode,
          },
        },
        {
          stripeAccount: connectedAccountId,
        }
      );

      logger.info(`Payout instantáneo enviado: ${payout.id} por $${amount}`);

      await db.collection("prizes").doc(prizeId).update({
        status: "paid",
        paid_at: admin.firestore.FieldValue.serverTimestamp(),
        payout_id: payout.id,
        payout_method: "instant",
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, payoutId: payout.id, method: "instant" };
      
    } catch (instantError) {
      if (instantError.code === "instant_payouts_not_available") {
        logger.info("Instant payout no disponible, usando payout estándar...");
        
        const payout = await stripe.payouts.create(
          {
            amount: Math.round(amount * 100),
            currency: "usd",
            method: "standard",
            description: `🏆 Premio Torneo Lex Mundi - ${tournamentId}`,
            metadata: {
              tournament_id: tournamentId,
              prize_id: prizeId,
              prize_code: prizeCode,
            },
          },
          {
            stripeAccount: connectedAccountId,
          }
        );
        
        await db.collection("prizes").doc(prizeId).update({
          status: "paid",
          paid_at: admin.firestore.FieldValue.serverTimestamp(),
          payout_id: payout.id,
          payout_method: "standard",
          updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        return { success: true, payoutId: payout.id, method: "standard" };
      }
      
      throw instantError;
    }

  } catch (error) {
    logger.error("Error en processPrizePayment:", error);
    
    await db.collection("prizes").doc(prizeId).update({
      status: "failed",
      failure_reason: error.message,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    throw error;
  }
}

// ============================================
// 1. CREAR CUENTA CONNECT EXPRESS
// ============================================

exports.createConnectAccount = onCall(async (request) => {
  try {
    const uid = validateAuth(request);
    const { email, fullName, country = "MX" } = request.data;

    logger.info(`Creando cuenta Connect para usuario: ${uid}`);

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (userData?.stripe_account_id) {
      const accountLink = await stripe.accountLinks.create({
        account: userData.stripe_account_id,
        refresh_url: `${APP_URL}/onboarding/refresh`,
        return_url: `${APP_URL}/onboarding/complete`,
        type: "account_onboarding",
      });

      return {
        success: true,
        accountId: userData.stripe_account_id,
        onboardingLink: accountLink.url,
        existingAccount: true,
      };
    }

    const account = await stripe.accounts.create({
      type: "express",
      country: country,
      email: email,
      business_type: "individual",
      individual: {
        first_name: fullName?.split(" ")[0] || "Usuario",
        last_name: fullName?.split(" ").slice(1).join(" ") || "Lex",
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      settings: {
        payouts: {
          schedule: {
            interval: "manual",
          },
        },
      },
    });

    logger.info(`Cuenta Connect creada: ${account.id}`);

    await db.collection("users").doc(uid).set({
      stripe_account_id: account.id,
      stripe_onboarding_completed: false,
      stripe_payouts_enabled: false,
      stripe_account_country: country,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${APP_URL}/onboarding/refresh`,
      return_url: `${APP_URL}/onboarding/complete?uid=${uid}`,
      type: "account_onboarding",
    });

    return {
      success: true,
      accountId: account.id,
      onboardingLink: accountLink.url,
      existingAccount: false,
    };

  } catch (error) {
    logger.error("Error en createConnectAccount:", error);
    throw new Error(error.message);
  }
});

// ============================================
// 2. VERIFICAR ESTADO DE ONBOARDING
// ============================================

exports.getOnboardingStatus = onCall(async (request) => {
  try {
    const uid = validateAuth(request);
    logger.info(`Verificando onboarding para usuario: ${uid}`);

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData?.stripe_account_id) {
      return {
        success: true,
        hasStripeAccount: false,
        onboardingCompleted: false,
        payoutsEnabled: false,
        stripeAccountId: null,
      };
    }

    try {
      const account = await stripe.accounts.retrieve(userData.stripe_account_id);
      
      await db.collection("users").doc(uid).update({
        stripe_onboarding_completed: account.details_submitted,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_charges_enabled: account.charges_enabled,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        hasStripeAccount: true,
        onboardingCompleted: account.details_submitted || false,
        payoutsEnabled: account.payouts_enabled || false,
        chargesEnabled: account.charges_enabled || false,
        stripeAccountId: userData.stripe_account_id,
      };
      
    } catch (stripeError) {
      logger.error("Error retrieving Stripe account:", stripeError);
      return {
        success: true,
        hasStripeAccount: true,
        onboardingCompleted: userData.stripe_onboarding_completed || false,
        payoutsEnabled: userData.stripe_payouts_enabled || false,
        stripeAccountId: userData.stripe_account_id,
      };
    }

  } catch (error) {
    logger.error("Error en getOnboardingStatus:", error);
    throw new Error(error.message);
  }
});

// ============================================
// 3. CREAR PAYMENT INTENT
// ============================================

exports.createPaymentIntent = onCall(async (request) => {
  try {
    const uid = validateAuth(request);
    const { amount, currency = "usd", metadata = {} } = request.data;

    if (!amount || amount <= 0) {
      throw new Error("Monto inválido");
    }

    logger.info(`Creando PaymentIntent de ${amount} ${currency} para usuario: ${uid}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      metadata: {
        userId: uid,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
    };

  } catch (error) {
    logger.error("Error en createPaymentIntent:", error);
    throw new Error(error.message);
  }
});

// ============================================
// 4. ASIGNAR PREMIO (ADMIN)
// ============================================

exports.assignPrize = onCall(async (request) => {
  try {
    const uid = validateAuth(request);
    
    const userDoc = await db.collection("users").doc(uid).get();
    const isAdmin = userDoc.data()?.role === "admin";
    
    if (!isAdmin) {
      throw new Error("No tienes permisos para asignar premios");
    }

    const { tournamentId, winnerId, winnerName, winnerEmail, amount, rank } = request.data;

    if (!tournamentId || !winnerId || !amount) {
      throw new Error("Faltan datos requeridos");
    }

    const prizeCode = generatePrizeCode(tournamentId, winnerId);
    const prizeId = `${tournamentId}_${winnerId}_${Date.now()}`;

    const prizeData = {
      id: prizeId,
      tournament_id: tournamentId,
      winner_id: winnerId,
      winner_name: winnerName,
      winner_email: winnerEmail,
      amount: amount,
      rank: rank || 1,
      code: prizeCode,
      status: "pending",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      paid_at: null,
      payout_id: null,
    };

    await db.collection("prizes").doc(prizeId).set(prizeData);

    const winnerDoc = await db.collection("users").doc(winnerId).get();
    const winnerData = winnerDoc.data();

    let status = "pending_onboarding";
    
    if (winnerData?.stripe_onboarding_completed && winnerData?.stripe_payouts_enabled) {
      status = "processing";
      processPrizePayment(prizeId, winnerData.stripe_account_id, amount, tournamentId, prizeCode)
        .catch(err => logger.error("Error procesando pago automático:", err));
    }

    return {
      success: true,
      prizeId: prizeId,
      prizeCode: prizeCode,
      status: status,
    };

  } catch (error) {
    logger.error("Error en assignPrize:", error);
    throw new Error(error.message);
  }
});

// ============================================
// 5. RECLAMAR PREMIO
// ============================================

exports.claimPrize = onCall(async (request) => {
  try {
    const uid = validateAuth(request);
    const { prizeCode } = request.data;

    if (!prizeCode) {
      throw new Error("Código de premio requerido");
    }

    const prizesSnapshot = await db.collection("prizes")
      .where("code", "==", prizeCode)
      .where("winner_id", "==", uid)
      .limit(1)
      .get();

    if (prizesSnapshot.empty) {
      throw new Error("Código inválido o premio no pertenece a este usuario");
    }

    const prizeDoc = prizesSnapshot.docs[0];
    const prize = prizeDoc.data();

    if (prize.status === "paid") {
      throw new Error("Este premio ya fue reclamado");
    }

    if (prize.status === "processing") {
      throw new Error("El premio ya está siendo procesado");
    }

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData?.stripe_account_id) {
      throw new Error("No tienes una cuenta de pagos configurada");
    }

    if (!userData.stripe_onboarding_completed || !userData.stripe_payouts_enabled) {
      const accountLink = await stripe.accountLinks.create({
        account: userData.stripe_account_id,
        refresh_url: `${APP_URL}/onboarding/refresh`,
        return_url: `${APP_URL}/onboarding/complete?uid=${uid}&prizeCode=${prizeCode}`,
        type: "account_onboarding",
      });

      return {
        success: false,
        requiresOnboarding: true,
        onboardingLink: accountLink.url,
        message: "Debes completar la verificación de identidad para recibir tu premio",
      };
    }

    await db.collection("prizes").doc(prizeDoc.id).update({
      status: "processing",
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    const result = await processPrizePayment(
      prizeDoc.id,
      userData.stripe_account_id,
      prize.amount,
      prize.tournament_id,
      prize.code
    );

    return {
      success: true,
      message: `¡Premio de $${prize.amount} USD reclamado! Llegará a tu tarjeta en menos de 30 minutos.`,
      payoutId: result.payoutId,
      method: result.method,
    };

  } catch (error) {
    logger.error("Error en claimPrize:", error);
    throw new Error(error.message);
  }
});

// ============================================
// 6. OBTENER PREMIOS DEL USUARIO
// ============================================

exports.getMyPrizes = onCall(async (request) => {
  try {
    const uid = validateAuth(request);

    const prizesSnapshot = await db.collection("prizes")
      .where("winner_id", "==", uid)
      .orderBy("created_at", "desc")
      .get();

    const prizes = [];
    prizesSnapshot.forEach(doc => {
      const data = doc.data();
      prizes.push({
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate?.() || null,
        paid_at: data.paid_at?.toDate?.() || null,
      });
    });

    return {
      success: true,
      prizes: prizes,
    };

  } catch (error) {
    logger.error("Error en getMyPrizes:", error);
    throw new Error(error.message);
  }
});

// ============================================
// 7. WEBHOOK DE STRIPE
// ============================================

exports.stripeWebhook = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const sig = req.headers["stripe-signature"];
    let event;

    const webhookSecret = STRIPE_WEBHOOK_SECRET_PLATFORM || 'temporal';

    if (webhookSecret === 'temporal') {
      logger.warn("Webhook secret temporal - verificación deshabilitada");
      try {
        event = JSON.parse(req.body);
      } catch (err) {
        logger.error("Error parsing webhook body:", err);
        return res.status(400).send("Invalid webhook body");
      }
    } else {
      try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
      } catch (err) {
        logger.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }

    logger.info(`Evento recibido: ${event.type}`);

    if (event.type === "account.updated") {
      const account = event.data.object;
      
      const usersSnapshot = await db.collection("users")
        .where("stripe_account_id", "==", account.id)
        .limit(1)
        .get();

      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        const userId = userDoc.id;

        await db.collection("users").doc(userId).update({
          stripe_onboarding_completed: account.details_submitted,
          stripe_payouts_enabled: account.payouts_enabled,
          stripe_charges_enabled: account.charges_enabled,
          updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info(`Usuario ${userId} actualizado - Onboarding: ${account.details_submitted}`);
      }
    }

    res.json({ received: true });
  });
});

// ============================================
// 8. HEALTH CHECK
// ============================================

exports.healthCheck = onRequest((req, res) => {
  corsHandler(req, res, () => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      stripe: !!stripe,
      config: {
        hasSecretKey: !!STRIPE_SECRET_KEY,
        hasWebhookSecret: !!(STRIPE_WEBHOOK_SECRET_PLATFORM && STRIPE_WEBHOOK_SECRET_PLATFORM !== 'temporal'),
        appUrl: APP_URL,
      },
    });
  });
});

// ============================================
// 9. OBTENER BALANCE (ADMIN)
// ============================================

exports.getPlatformBalance = onCall(async (request) => {
  try {
    const uid = validateAuth(request);
    
    const userDoc = await db.collection("users").doc(uid).get();
    const isAdmin = userDoc.data()?.role === "admin";
    
    if (!isAdmin) {
      throw new Error("Acceso no autorizado");
    }

    const balance = await stripe.balance.retrieve();
    
    return {
      success: true,
      available: balance.available,
      pending: balance.pending,
      instant_available: balance.instant_available,
    };

  } catch (error) {
    logger.error("Error en getPlatformBalance:", error);
    throw new Error(error.message);
  }
});