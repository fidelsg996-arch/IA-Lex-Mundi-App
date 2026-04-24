const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async (to, subject, html, text = null) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"IA Lex Mundi" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #0A2540; color: white; padding: 20px; text-align: center; }
      .button { display: inline-block; padding: 10px 20px; background: #2D9CDB; color: white; text-decoration: none; border-radius: 5px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h1>IA Lex Mundi International Law</h1></div>
        <div class="content">
          <h2>¡Bienvenido, ${user.name}!</h2>
          <p>Nos alegra tenerte en nuestra comunidad de profesionales del derecho.</p>
          <p>Tu plan actual es <strong>${user.plan === 'free' ? 'Gratuito' : user.plan}</strong> con ${user.consultationLimit} consultas IA por mes.</p>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Ir al Dashboard</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(user.email, 'Bienvenido a IA Lex Mundi', html);
};

const sendRenewalReminder = async (user, amount, nextDate) => {
  const html = `
    <div class="container">
      <h2>Recordatorio de Renovación</h2>
      <p>Hola ${user.name},</p>
      <p>Tu suscripción al plan <strong>${user.plan}</strong> se renovará automáticamente en 5 días.</p>
      <p><strong>Monto a cobrar:</strong> $${amount} MXN</p>
      <p><strong>Fecha de renovación:</strong> ${new Date(nextDate).toLocaleDateString('es-MX')}</p>
      <p><a href="${process.env.FRONTEND_URL}/profile/subscription">Gestionar Suscripción</a></p>
    </div>
  `;
  return await sendEmail(user.email, 'Recordatorio: Tu suscripción se renovará pronto', html);
};

const sendCertificateEmail = async (user, certificateTitle, certificateUrl, type = 'course') => {
  const html = `
    <div class="container">
      <h2>¡Felicidades!</h2>
      <p>Hola ${user.name},</p>
      <p>Has completado exitosamente ${type === 'course' ? 'el curso' : 'el diplomado'}:</p>
      <h2>${certificateTitle}</h2>
      <p>Tu certificado ha sido generado.</p>
      <p><a href="${certificateUrl}">Descargar Certificado</a></p>
    </div>
  `;
  return await sendEmail(user.email, `¡Tu certificado de ${certificateTitle} está listo!`, html);
};

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <div class="container">
      <h2>Restablecer Contraseña</h2>
      <p>Hola ${user.name},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p><a href="${resetUrl}">Restablecer Contraseña</a></p>
      <p>Este enlace expirará en 1 hora.</p>
    </div>
  `;
  return await sendEmail(user.email, 'Restablece tu contraseña', html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendRenewalReminder,
  sendCertificateEmail,
  sendPasswordResetEmail,
};