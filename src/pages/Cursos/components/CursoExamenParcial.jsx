// src/pages/Cursos/components/CursoExamenParcial.jsx
import { useState } from 'react';

const CursoExamenParcial = ({ modulo, curso, onClose, onAprobar }) => {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  
  const examenes = {
    0: {
      titulo: '📝 Examen - Introducción al Derecho Laboral',
      preguntas: [
        {
          texto: '¿Cuál es el principio que protege al trabajador en caso de duda?',
          opciones: [
            'Principio de irrenunciabilidad',
            'Principio in dubio pro operario',
            'Principio de continuidad',
            'Principio de primacía de la realidad'
          ],
          correcta: 1
        },
        {
          texto: '¿En qué año se promulgó la Constitución Mexicana que incluye el artículo 123?',
          opciones: ['1910', '1917', '1921', '1931'],
          correcta: 1
        },
        {
          texto: '¿Cuál es la principal fuente del Derecho Laboral en México?',
          opciones: [
            'Reglamentos internos',
            'Contratos colectivos',
            'Constitución y Ley Federal del Trabajo',
            'Jurisprudencia'
          ],
          correcta: 2
        }
      ]
    }
  };

  const examen = examenes[modulo];
  if (!examen) return null;

  const responder = (idx) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[preguntaActual] = idx;
    setRespuestas(nuevasRespuestas);
  };

  const siguiente = () => {
    if (preguntaActual < examen.preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      // Calcular calificación
      let aciertos = 0;
      respuestas.forEach((resp, idx) => {
        if (resp === examen.preguntas[idx].correcta) aciertos++;
      });
      const calificacion = (aciertos / examen.preguntas.length) * 100;
      if (calificacion >= 60) {
        alert(`✅ Aprobaste con ${Math.round(calificacion)}%`);
        onAprobar();
        onClose();
      } else {
        alert(`❌ No aprobaste. Obtuviste ${Math.round(calificacion)}%. Necesitas 60%`);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-auto">
        <div className="text-center mb-4">
          <span className="text-5xl">📝</span>
          <h2 className="text-2xl font-bold mt-2">{examen.titulo}</h2>
          <p className="text-gray-500">Calificación mínima: 60%</p>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Pregunta {preguntaActual + 1} de {examen.preguntas.length}</p>
          <p className="text-lg font-medium mb-4">{examen.preguntas[preguntaActual].texto}</p>
          <div className="space-y-3">
            {examen.preguntas[preguntaActual].opciones.map((opcion, idx) => (
              <label key={idx} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${respuestas[preguntaActual] === idx ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                <input type="radio" name="pregunta" value={idx} checked={respuestas[preguntaActual] === idx} onChange={() => responder(idx)} className="w-4 h-4 accent-blue-600" />
                <span>{opcion}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button onClick={() => preguntaActual > 0 && setPreguntaActual(preguntaActual - 1)} disabled={preguntaActual === 0} className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50">← Anterior</button>
          <button onClick={siguiente} disabled={respuestas[preguntaActual] === undefined} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
            {preguntaActual === examen.preguntas.length - 1 ? 'Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CursoExamenParcial;