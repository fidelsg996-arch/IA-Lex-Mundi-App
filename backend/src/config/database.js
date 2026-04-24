const mongoose = require('mongoose');
const logger = require('../utils/logger');

// URI de MongoDB Atlas con credenciales actualizadas
const MONGO_URI = "mongodb+srv://admin_user:FC7BrqOXXhw1zfs6@cluster0.qx6ez3t.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // Opciones para evitar warnings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('✅ MongoDB Atlas conectado correctamente');
    console.log('✅ MongoDB Atlas conectado correctamente');
  } catch (error) {
    logger.error('❌ Error de conexión a MongoDB:', error.message);
    console.error('❌ Error de conexión a MongoDB:', error.message);
    // No salir del proceso para permitir reintentos
    throw error;
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose conectado a MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Error en conexión Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose desconectado de MongoDB Atlas');
});

module.exports = { connectDB };