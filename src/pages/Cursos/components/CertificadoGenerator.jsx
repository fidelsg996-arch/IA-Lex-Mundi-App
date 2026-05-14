// src/pages/Cursos/components/CertificadoGenerator.jsx
import jsPDF from 'jspdf';

const CertificadoGenerator = ({ curso, usuario }) => {
  const generarCertificado = () => {
    const nombre = (usuario?.displayName || usuario?.email?.split('@')[0] || 'PARTICIPANTE').toUpperCase();
    const hoy = new Date();
    const fecha = `${hoy.getDate()} de ${hoy.toLocaleString('es-MX', { month: 'long' })} de ${hoy.getFullYear()}`;
    const horas = parseInt(curso.duracion) || 300;
    const creditos = Math.round(horas / 25);
    
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text('IA LEX MUNDI INTERNATIONAL LAW PLATFORM', 105, 25, { align: 'center' });
    doc.setFontSize(22);
    doc.setFont('times', 'bold');
    doc.text('IA LEX MUNDI', 105, 45, { align: 'center' });
    doc.setFontSize(28);
    doc.text('CERTIFICADO', 105, 80, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text('La Dirección Académica de IA LEX MUNDI INTERNATIONAL LAW,', 105, 110, { align: 'center' });
    doc.setFont('times', 'bold');
    doc.text('CERTIFICA QUE', 105, 125, { align: 'center' });
    doc.setFontSize(18);
    doc.text(nombre, 105, 150, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text('ha participado con aprovechamiento en el curso', 105, 190, { align: 'center' });
    doc.setFontSize(13);
    doc.setFont('times', 'bold');
    doc.text(curso.titulo.toUpperCase(), 105, 210, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text(`con una duración de ${horas} horas (${creditos} créditos)`, 105, 235, { align: 'center' });
    doc.text(`Ciudad de México a ${fecha}`, 190, 295, { align: 'right' });
    doc.setFont('times', 'bold');
    doc.text('Dra. Aline Fortune Montesuri', 55, 330, { align: 'center' });
    doc.text('Dr. Alejandro Ríos Vargas', 155, 330, { align: 'center' });
    doc.save(`certificado_${curso.titulo.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="mt-3 p-3 bg-green-100 rounded-lg text-center">
      <p className="text-green-700 text-sm font-semibold mb-2">🏆 Curso completado</p>
      <button onClick={generarCertificado} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm w-full flex items-center justify-center gap-2">
        📄 Descargar Certificado
      </button>
    </div>
  );
};

export default CertificadoGenerator;