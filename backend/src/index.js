const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// 🔐 IMPORTANTE: IMPORTAMOS SEGURIDAD
const { verifyToken, requireRole, requirePlan } = require('./middleware/auth');

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Trust proxy
app.set('trust proxy', 1);

// ✅ CORS SEGURO (ACTUALIZADO PARA TORNEOS)
const allowedOrigins = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://ia-lex-mundi.netlify.app',
  'https://venerable-lily-a6c2e8.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-user-email'],
  exposedHeaders: ['Content-Type', 'Authorization', 'x-user-email']
}));

// ✅ RATE LIMIT
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Demasiadas solicitudes, por favor intenta más tarde',
  skip: (req) => req.path === '/health'
});

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', limiter);

// =========================
// 🔓 RUTAS PÚBLICAS
// =========================
app.use('/api/auth', require('./routes/auth'));
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API de IA Lex Mundi funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// =========================
// 🔐 RUTAS PROTEGIDAS (LOGIN)
// =========================
app.use('/api/users', verifyToken, require('./routes/users'));
app.use('/api/cases', verifyToken, require('./routes/cases'));
app.use('/api/documents', verifyToken, require('./routes/documents'));
app.use('/api/procedures', verifyToken, require('./routes/procedures'));
app.use('/api/leyes', verifyToken, require('./routes/leyes'));

// =========================
// 📁 RUTAS DE EXPEDIENTES (NUEVO MÓDULO)
// =========================
app.use('/api/expedientes', verifyToken, require('./routes/expedientes'));

// =========================
// 🏆 RUTAS DE TORNEOS (SIN VERIFYTOKEN - USA TEMPAUTH)
// =========================
app.use('/api/torneos', require('./routes/torneos'));

// =========================
// 💰 RUTAS PREMIUM
// =========================
app.use('/api/analysis', verifyToken, requirePlan('premium'), require('./routes/analysis'));
app.use('/api/education', verifyToken, requirePlan('premium'), require('./routes/education'));
app.use('/api/library', verifyToken, requirePlan('premium'), require('./routes/library'));
app.use('/api/quiz', verifyToken, requirePlan('premium'), require('./routes/quiz'));

// =========================
// 💳 PAGOS (usuario logueado)
// =========================
app.use('/api/payments', verifyToken, require('./routes/payments'));
app.use('/api/subscription', verifyToken, require('./routes/subscription'));

// =========================
// 👑 ADMIN
// =========================
app.use('/api/admin', verifyToken, requireRole('admin'), require('./routes/admin'));

// =========================
// ❤️ HEALTH CHECK
// =========================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'IA Lex Mundi International Law',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`
  ╔═══════════════════════════════════════════════════════════╗
  ║     IA Lex Mundi International Law - Backend v1.0         ║
  ║     Servidor corriendo en puerto ${PORT}                     ║
  ║     API: http://localhost:${PORT}/api                      ║
  ║     Health: http://localhost:${PORT}/health                ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});

// Inicializar planes
let retries = 0;

const initPlans = async () => {
  try {
    const { initDefaultPlans } = require('./models/Plan');
    await initDefaultPlans();
    logger.info('✅ Planes inicializados correctamente');
  } catch (error) {
    logger.error('❌ Error inicializando planes:', error.message);

    if (retries < 5) {
      retries++;
      setTimeout(initPlans, 10000);
    }
  }
};

initPlans();