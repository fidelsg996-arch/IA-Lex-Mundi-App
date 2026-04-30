import React, { useState } from 'react';

const ReglasTorneo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setVisible(!visible)} 
        className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800"
      >
        <span className="material-symbols-outlined text-sm">info</span>
        {visible ? 'Ocultar reglas' : 'Ver reglas del torneo'}
      </button>
      
      {visible && (
        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
          <h3 className="font-bold text-gray-800 mb-2">⚖️ Reglas del Torneo Legal</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>Cada duelo</strong> consta de 5 preguntas de opción múltiple sobre derecho.</li>
            <li>• <strong>Puntuación:</strong> 10 puntos por cada respuesta correcta.</li>
            <li>• <strong>Tiempo:</strong> 30 segundos por pregunta.</li>
            <li>• <strong>Victoria:</strong> El participante con mayor puntuación en el duelo gana.</li>
            <li>• <strong>Empate:</strong> En caso de empate, se declara un nuevo duelo de desempate.</li>
            <li>• <strong>Clasificación:</strong> Se requiere acumular 3 victorias para avanzar a la fase de grupos.</li>
            <li>• <strong>Premio:</strong> El campeón del torneo recibe un premio en efectivo o académico.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReglasTorneo;