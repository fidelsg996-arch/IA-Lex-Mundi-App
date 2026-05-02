import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ConstanciaPhase = ({ curso, user, onBack }) => {
  const certificateRef = useRef();

  const generarPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    let loadingMsg = null;

    try {
      // Mostrar mensaje de carga
      loadingMsg = document.createElement('div');
      loadingMsg.textContent = 'Generando PDF, por favor espere...';
      loadingMsg.style.position = 'fixed';
      loadingMsg.style.top = '50%';
      loadingMsg.style.left = '50%';
      loadingMsg.style.transform = 'translate(-50%, -50%)';
      loadingMsg.style.backgroundColor = 'rgba(0,0,0,0.8)';
      loadingMsg.style.color = 'white';
      loadingMsg.style.padding = '20px';
      loadingMsg.style.borderRadius = '10px';
      loadingMsg.style.zIndex = '9999';
      document.body.appendChild(loadingMsg);

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`constancia-${curso.titulo.replace(/\s/g, '-')}.pdf`);
      
      if (loadingMsg && loadingMsg.parentNode) {
        document.body.removeChild(loadingMsg);
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Intenta nuevamente.');
      if (loadingMsg && loadingMsg.parentNode) {
        document.body.removeChild(loadingMsg);
      }
    }
  };

  const fecha = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const registro = `CUR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const usuarioNombre = user?.displayName || user?.email || 'Despacho Jurídico';

  return (
    <div className="px-4 py-3">
      <button onClick={onBack} className="mb-4 text-amber-600 font-semibold flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Volver al curso
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Constancia - se usa para generar PDF */}
        <div className="p-8 flex justify-center">
          <div 
            ref={certificateRef} 
            className="border-8 border-amber-600 rounded-lg bg-gradient-to-r from-amber-100 to-yellow-100 p-8 text-center"
            style={{ width: '800px', minHeight: '600px' }}
          >
            <div className="text-6xl mb-4">⚖️📜</div>
            <p className="text-sm text-gray-600">IA LEX MUNDI</p>
            <p className="text-xs text-gray-500">INTERNATIONAL LAW PLATFORM</p>
            
            <h2 className="text-2xl font-bold text-gray-800 mt-6">CONSTANCIA DE PARTICIPACIÓN</h2>
            <div className="border-t-2 border-amber-600 w-24 mx-auto my-4"></div>
            
            <p className="text-sm text-gray-700">La Dirección General de Formación Jurídica de</p>
            <p className="font-bold text-gray-800">IA Lex Mundi International Law Platform</p>
            <p className="text-sm text-gray-700">hace constar que</p>
            
            <p className="text-xl font-bold text-gray-800 mt-4">{usuarioNombre}</p>
            <p className="text-sm text-gray-700 mt-4">ha completado satisfactoriamente el curso:</p>
            
            <p className="text-lg font-bold text-amber-700 mt-2">{curso.titulo}</p>
            
            <div className="grid grid-cols-2 gap-8 mt-8 max-w-md mx-auto">
              <div>
                <div className="border-t border-gray-400 pt-2">
                  <p className="text-xs text-gray-600">Coordinación Académica</p>
                  <p className="font-semibold text-sm">Mtra. Carmen Fuentes Leal</p>
                </div>
              </div>
              <div>
                <div className="border-t border-gray-400 pt-2">
                  <p className="text-xs text-gray-600">Dirección General</p>
                  <p className="font-semibold text-sm">Dr. Alejandro Ríos Vargas</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              <p>No. de Registro: {registro}</p>
            </div>
            
            <div className="mt-3 p-2 bg-gray-100 rounded-lg text-xs text-gray-600 inline-block">
              <p>Documento verificable en: https://lexmundi.ia/verificar/{registro}</p>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">Ciudad de México, a {fecha}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-6 flex gap-4 justify-center border-t">
          <button 
            onClick={generarPDF} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Descargar PDF
          </button>
          <button 
            onClick={onBack} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">school</span>
            Volver al curso
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstanciaPhase;