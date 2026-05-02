const mongoose = require('mongoose');
const logger = require('../utils/logger');

// URI de MongoDB Atlas
const MONGO_URI = "mongodb+srv://admin_user:diug9buHDvrc2EMe@cluster0.qx6ez3t.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB Atlas conectado correctamente');
    console.log('✅ MongoDB Atlas conectado correctamente');
  } catch (error) {
    logger.error('❌ Error de conexión a MongoDB:', error.message);
    console.error('❌ Error de conexión a MongoDB:', error.message);
    process.exit(1);
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

// Cerrar conexión al detener la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔴 Conexión a MongoDB cerrada por terminación de la app');
  process.exit(0);
});

module.exports = { connectDB };