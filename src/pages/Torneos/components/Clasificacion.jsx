import { useState } from 'react';
import SalaDuelo from './SalaDuelo';

const Clasificacion = ({ torneo, participante, onAvanzarGrupos, onVolver, setParticipante, onDueloFinalizado }) => {
  const [competenciasCompletadas, setCompetenciasCompletadas] = useState(participante.duelosClasificacion || 0);
  const [puntajeTotal, setPuntajeTotal] = useState(participante.puntajeClasificacion || 0);
  const [victorias, setVictorias] = useState(participante.victoriasClasificacion || 0);
  const [enCompetencia, setEnCompetencia] = useState(false);
  const [dueloActual, setDueloActual] = useState((participante.duelosClasificacion || 0) + 1);

  const handleCompetenciaFinalizada = (puntos, gano, puntosRival, nombreRival) => {
    const nuevasComp = competenciasCompletadas + 1;
    const nuevoPuntaje = puntajeTotal + puntos;
    const nuevasVictorias = victorias + (gano ? 1 : 0);
    
    setCompetenciasCompletadas(nuevasComp);
    setPuntajeTotal(nuevoPuntaje);
    setVictorias(nuevasVictorias);
    setEnCompetencia(false);
    
    const updated = { ...participante, duelosClasificacion: nuevasComp, puntajeClasificacion: nuevoPuntaje, victoriasClasificacion: nuevasVictorias };
    setParticipante(updated);
    localStorage.setItem(participante.id, JSON.stringify(updated));
    
    onDueloFinalizado(puntos, gano, puntosRival, nombreRival);
    
    if (nuevasComp >= 3) {
      const puntajeMinimo = 15;
      if (nuevoPuntaje >= puntajeMinimo) {
        alert(`✅ ¡Clasificaste a la fase de grupos! Puntaje: ${nuevoPuntaje}/30 pts`);
        onAvanzarGrupos();
      } else {
        alert(`❌ No clasificaste. Puntaje mínimo: ${puntajeMinimo} pts. Obtuviste: ${nuevoPuntaje}/30 pts`);
        onVolver();
      }
    } else {
      setDueloActual(dueloActual + 1);
    }
  };

  const handleSalir = () => {
    if (window.confirm('⚠️ Si sales del torneo ahora, quedarás ELIMINADO. ¿Estás seguro?')) {
      const updated = { ...participante, eliminado: true };
      localStorage.setItem(participante.id, JSON.stringify(updated));
      onVolver();
    }
  };

  if (enCompetencia) {
    return <SalaDuelo torneo={torneo} participante={participante} fase="clasificacion" onCompetenciaFinalizada={handleCompetenciaFinalizada} onVolver={() => setEnCompetencia(false)} />;
  }

  const MAX_PUNTOS_POSIBLE = 30;
  const progreso = (puntajeTotal / MAX_PUNTOS_POSIBLE) * 100;
  const puntajeNecesario = 15 - puntajeTotal;
  const duelosRestantes = 3 - competenciasCompletadas;

  return (
    <div className="px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{torneo.titulo}</h1>
              <p className="text-red-200 text-sm mt-1">Fase de Clasificación</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{puntajeTotal}/{MAX_PUNTOS_POSIBLE}</p>
              <p className="text-xs text-red-200">puntaje total</p>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          {/* Barra de progreso */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso de clasificación</span>
              <span>{competenciasCompletadas}/3 competencias</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progreso}%` }}></div>
            </div>
          </div>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{competenciasCompletadas}</p>
              <p className="text-xs text-gray-500">Competencias</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{victorias}</p>
              <p className="text-xs text-gray-500">Victorias</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{puntajeTotal}</p>
              <p className="text-xs text-gray-500">Puntos</p>
            </div>
          </div>
          
          {/* Reglas de clasificación */}
          <div className="bg-amber-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-amber-800 mb-2">📋 Reglas de clasificación:</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• 3 competencias de 10 puntos máximos cada una</li>
              <li>• 10 puntos = victoria automática en la competencia</li>
              <li>• Máximo 30 puntos posibles</li>
              <li>• Mínimo 15 puntos (50% de aciertos) para clasificar</li>
              <li>• 20 segundos por pregunta | 15 preguntas por competencia</li>
              <li>• <strong className="font-bold">En caso de empate: muerte súbita</strong> — quien falle primero queda ELIMINADO</li>
            </ul>
          </div>
          
          {/* Estado actual */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Competencia actual</span>
              <span className="text-sm font-bold text-red-600">{dueloActual}/3</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Puntaje necesario</span>
              <span className={`text-sm font-bold ${puntajeNecesario > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {puntajeNecesario > 0 ? `${puntajeNecesario} pts más` : 'Meta alcanzada ✨'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Competencias restantes</span>
              <span className="text-sm font-bold text-blue-600">{duelosRestantes}</span>
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={() => setEnCompetencia(true)}
              className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold hover:bg-red-600 transition"
            >
              {competenciasCompletadas === 0 ? 'Comenzar clasificación' : `Continuar clasificación (Competencia ${dueloActual}/3)`}
            </button>
            <button
              onClick={handleSalir}
              className="px-4 py-2.5 border border-red-300 rounded-xl text-red-600 hover:bg-red-50 transition"
            >
              Salir
            </button>
          </div>
          
          <p className="text-xs text-red-500 text-center mt-3">⚠️ Salir del torneo = ELIMINACIÓN</p>
        </div>
      </div>
    </div>
  );
};

export default Clasificacion;