const PDFDocument = require('pdfkit');

const generateCertificatePDF = async (userData, courseData, type = 'course') => {
  return new Promise((resolve) => {
    const buffers = [];
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
    });
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
    
    // Diseño del certificado
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f5f5f5');
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#D4AF37');
    
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#0A2540');
    doc.text('IA LEX MUNDI', 50, 80);
    doc.font('Helvetica').fontSize(12).fillColor('#666');
    doc.text('International Law', 50, 108);
    
    doc.font('Helvetica-Bold').fontSize(32).fillColor('#D4AF37');
    doc.text('CERTIFICADO', 0, 180, { align: 'center' });
    
    doc.font('Helvetica').fontSize(14).fillColor('#333');
    doc.text('Otorgado a:', 0, 280, { align: 'center' });
    
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#0A2540');
    doc.text(userData.name, 0, 320, { align: 'center' });
    
    doc.font('Helvetica').fontSize(14).fillColor('#333');
    doc.text(`Por haber completado satisfactoriamente el ${type === 'course' ? 'curso' : 'diplomado'}:`, 0, 400, { align: 'center' });
    
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#2D9CDB');
    doc.text(courseData.title, 0, 450, { align: 'center' });
    
    doc.font('Helvetica').fontSize(12).fillColor('#666');
    doc.text(`Con una duración de ${courseData.durationHours} horas`, 0, 520, { align: 'center' });
    
    const today = new Date();
    doc.font('Helvetica').fontSize(10).fillColor('#999');
    doc.text(`Expedido el ${today.toLocaleDateString('es-MX')}`, 0, 620, { align: 'center' });
    
    doc.font('Helvetica').fontSize(8).fillColor('#ccc');
    doc.text('Documento firmado digitalmente con FIEL SAT', 0, doc.page.height - 40, { align: 'center' });
    
    doc.end();
  });
};

module.exports = { generateCertificatePDF };