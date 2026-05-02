const mongoose = require('mongoose');
const logger = require('../utils/logger');

// URI DIRECTA (hardcodeada temporalmente)
const MONGO_URI = "mongodb+srv://app_user:v2CMyxHZ47C491jM@cluster0.qx6ez3t.mongodb.net/ia-lex-mundi?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    console.log('🔍 Conectando a MongoDB Atlas...');
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('✅ MongoDB Atlas conectado correctamente');
    console.log('✅ MongoDB Atlas conectado correctamente');
  } catch (error) {
    logger.error('❌ Error de conexión a MongoDB:', error.message);
    console.error('❌ Error de conexión a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };