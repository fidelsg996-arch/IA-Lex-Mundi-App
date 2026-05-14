// src/pages/Cursos/components/CursoExamenFinal.jsx
import { useState } from 'react';

const CursoExamenFinal = ({ curso, onClose, onCompletar }) => {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState([]);

  const examen = {
    titulo: '🎓 EXAMEN FINAL',
    preguntas: [
      {
        texto: '¿Cuál es el artículo de la Constitución Mexicana que regula las relaciones laborales?',
        opciones: ['Artículo 14', 'Artículo 16', 'Artículo 123', 'Artículo 134'],
        correcta: 2
      },
      {
        texto: '¿Qué ley reglamenta el artículo 123 constitucional?',
        opciones: ['Código Civil Federal', 'Ley Federal del Trabajo', 'Ley del Seguro Social', 'Ley de Infonavit'],
        correcta: 1
      },
      {
        texto: '¿Cuál es la duración máxima de la jornada laboral diurna?',
        opciones: ['6 horas', '7 horas', '8 horas', '9 horas'],
        correcta: 2
      },
      {
        texto: '¿Cuánto corresponde de aguinaldo mínimo por ley?',
        opciones: ['10 días', '15 días', '20 días', '30 días'],
        correcta: 1
      },
      {
        texto: '¿Qué principio establece que en caso de duda se favorece al trabajador?',
        opciones: ['Principio de continuidad', 'Principio de irrenunciabilidad', 'Principio in dubio pro operario', 'Principio de primacía de la realidad'],
        correcta: 2
      }
    ]
  };

  const responder = (idx) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[preguntaActual] = idx;
    setRespuestas(nuevasRespuestas);
  };

  const finalizar = () => {
    if (respuestas.length !== examen.preguntas.length || respuestas.some(r => r === undefined)) {
      alert('Responde todas las preguntas');
      return;
    }
    let aciertos = 0;
    respuestas.forEach((resp, idx) => {
      if (resp === examen.preguntas[idx].correcta) aciertos++;
    });
    const calificacion = (aciertos / examen.preguntas.length) * 100;
    if (calificacion >= 60) {
      alert(`🎉 ¡Felicidades! Completaste el curso con ${Math.round(calificacion)}%`);
      onCompletar();
      onClose();
    } else {
      alert(`❌ No aprobaste. Obtuviste ${Math.round(calificacion)}%. Necesitas 60%`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-auto">
        <div className="text-center mb-4">
          <span className="text-5xl">🎓</span>
          <h2 className="text-2xl font-bold mt-2">{examen.titulo}</h2>
          <p className="text-gray-500">Calificación mínima: 60%</p>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Pregunta {preguntaActual + 1} de {examen.preguntas.length}</p>
          <p className="text-lg font-medium mb-4">{examen.preguntas[preguntaActual].texto}</p>
          <div className="space-y-3">
            {examen.preguntas[preguntaActual].opciones.map((opcion, idx) => (
              <label key={idx} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${respuestas[preguntaActual] === idx ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'}`}>
                <input type="radio" name="pregunta" value={idx} checked={respuestas[preguntaActual] === idx} onChange={() => responder(idx)} className="w-4 h-4 accent-green-600" />
                <span>{opcion}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button onClick={() => preguntaActual > 0 && setPreguntaActual(preguntaActual - 1)} disabled={preguntaActual === 0} className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50">← Anterior</button>
          <button onClick={finalizar} disabled={respuestas[preguntaActual] === undefined} className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">
            {preguntaActual === examen.preguntas.length - 1 ? 'Finalizar curso' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CursoExamenFinal;