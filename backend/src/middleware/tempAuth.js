// TEMPORAL: Middleware para pruebas sin autenticación JWT
const User = require('../models/User');

const tempAuth = async (req, res, next) => {
  console.log('🚀 [tempAuth] EJECUTANDO MIDDLEWARE');
  console.log('📨 URL:', req.method, req.url);
  
  // Obtener email del header (enviado por el frontend)
  const email = req.headers['x-user-email'];
  console.log('📧 Email recibido:', email);
  
  if (email) {
    try {
      let user = await User.findOne({ email });
      if (user) {
        req.user = { 
          id: user._id, 
          email: user.email, 
          name: user.name,
          role: user.role || 'user'
        };
        console.log(`✅ [tempAuth] Usuario autenticado: ${email} (ID: ${user._id})`);
      } else {
        console.log(`⚠️ [tempAuth] Usuario NO encontrado: ${email}`);
        // Crear usuario temporal si no existe
        user = await User.create({
          email: email,
          name: email.split('@')[0] || 'UsuarioTemp',
          password: 'temporal123',
          role: 'user'
        });
        req.user = { 
          id: user._id, 
          email: user.email, 
          name: user.name,
          role: 'user'
        };
        console.log(`🆕 [tempAuth] Usuario temporal CREADO: ${email} (ID: ${user._id})`);
      }
    } catch (error) {
      console.error('❌ [tempAuth] Error:', error.message);
    }
  } else {
    console.log('⚠️ [tempAuth] No se recibió email en el header');
  }
  
  next();
};

module.exports = { tempAuth };