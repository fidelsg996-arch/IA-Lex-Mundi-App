import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SalaDuelo from './SalaDuelo';

const Clasificacion = ({ torneo, participante, onAvanzarGrupos, onVolver, setParticipante, onDueloFinalizado }) => {
  const { user } = useAuth();
  const [competencias, setCompetencias] = useState([]);
  const [competenciaActual, setCompetenciaActual] = useState(0);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [mostrarDuelo, setMostrarDuelo] = useState(false);
  const [pagandoReingreso, setPagandoReingreso] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const METAS_COMPETENCIAS = 3;
  const PUNTOS_POR_COMPETENCIA = 10;
  const PUNTOS_MAXIMOS = METAS_COMPETENCIAS * PUNTOS_POR_COMPETENCIA;
  const PUNTOS_MIN_CLASIFICACION = 15;

  // Cargar progreso guardado
  useEffect(() => {
    const stored = localStorage.getItem(`clasificacion_${torneo.id}_${participante.usuarioId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setCompetencias(data.competencias || []);
      setPuntajeTotal(data.puntajeTotal || 0);
      setCompetenciaActual(data.competenciaActual || 0);
    }
  }, [torneo.id, participante.usuarioId]);

  // Guardar progreso
  const guardarProgreso = (nuevasCompetencias, nuevoPuntaje, nuevaCompetenciaActual) => {
    const data = {
      competencias: nuevasCompetencias,
      puntajeTotal: nuevoPuntaje,
      competenciaActual: nuevaCompetenciaActual
    };
    localStorage.setItem(`clasificacion_${torneo.id}_${participante.usuarioId}`, JSON.stringify(data));
  };

  const finalizarCompetencia = (puntos, gano, puntosRival, nombreRival) => {
    setMostrarDuelo(false);
    
    if (!gano) {
      // Perdió la competencia
      const reingresar = window.confirm('💀 Perdiste la competencia. ¿Quieres reingresar pagando $30 MXN?');
      if (reingresar) {
        setMensaje('✅ Reingreso exitoso. Puedes intentar de nuevo.');
        setTimeout(() => setMensaje(''), 2000);
        return;
      } else {
        alert('❌ Has sido eliminado del torneo.');
        onVolver();
        return;
      }
    }
    
    // Ganó la competencia
    const nuevaCompetencia = {
      id: Date.now(),
      numero: competenciaActual + 1,
      puntos: PUNTOS_POR_COMPETENCIA,
      gano: true,
      puntajeRival: puntosRival,
      nombreRival: nombreRival,
      fecha: new Date().toISOString()
    };
    
    const nuevasCompetencias = [...competencias, nuevaCompetencia];
    const nuevoPuntajeTotal = puntajeTotal + PUNTOS_POR_COMPETENCIA;
    const nuevaCompetenciaActual = competenciaActual + 1;
    
    setCompetencias(nuevasCompetencias);
    setPuntajeTotal(nuevoPuntajeTotal);
    setCompetenciaActual(nuevaCompetenciaActual);
    
    guardarProgreso(nuevasCompetencias, nuevoPuntajeTotal, nuevaCompetenciaActual);
    
    setMensaje(`✅ ¡Victoria! Ganaste ${PUNTOS_POR_COMPETENCIA} puntos`);
    setTimeout(() => setMensaje(''), 2000);
    
    // Verificar si completó todas las competencias
    if (nuevaCompetenciaActual >= METAS_COMPETENCIAS) {
      if (nuevoPuntajeTotal >= PUNTOS_MIN_CLASIFICACION) {
        alert(`✅ ¡FELICIDADES! Clasificaste con ${nuevoPuntajeTotal} puntos.`);
        setTimeout(() => onAvanzarGrupos(), 1500);
      } else {
        alert(`❌ No alcanzaste la puntuación mínima. Necesitabas ${PUNTOS_MIN_CLASIFICACION} puntos y obtuviste ${nuevoPuntajeTotal}.`);
        setTimeout(() => onVolver(), 1500);
      }
    }
  };

  if (mostrarDuelo) {
    return <SalaDuelo 
      torneo={torneo}
      participante={participante}
      fase="clasificacion"
      onCompetenciaFinalizada={finalizarCompetencia}
      onVolver={() => setMostrarDuelo(false)}
    />;
  }

  if (pagandoReingreso) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Procesando pago...</p>
        </div>
      </div>
    );
  }

  const competenciasRealizadas = competencias.length;
  const competenciasRestantes = METAS_COMPETENCIAS - competencias.length;
  const puntajeNecesario = Math.max(0, PUNTOS_MIN_CLASIFICACION - puntajeTotal);
  const puedeCompetir = competencias.length < METAS_COMPETENCIAS;
  const victorias = competencias.filter(c => c.gano).length;

  // Si ya completó las 3 competencias pero no avanzó automáticamente, mostrar botón manual
  const competenciasCompletadas = competencias.length >= METAS_COMPETENCIAS;
  const califico = puntajeTotal >= PUNTOS_MIN_CLASIFICACION;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white text-center">
          <h2 className="text-3xl font-black">{torneo.titulo}</h2>
          <p className="text-xl">🏆 Fase de Clasificación</p>
          <div className="mt-4 bg-white/20 rounded-full px-6 py-2 inline-block">
            <span className="text-4xl font-black">{puntajeTotal}</span>
            <span className="text-xl">/{PUNTOS_MAXIMOS}</span>
            <span className="ml-2 text-sm">puntos totales</span>
          </div>
        </div>

        <div className="p-6">
          {/* Barra de progreso */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-bold">📊 Progreso de clasificación</span>
              <span className="text-red-600 font-bold">{competencias.length}/{METAS_COMPETENCIAS} competencias</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(competencias.length / METAS_COMPETENCIAS) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-600">{competencias.length}</div>
              <p className="text-sm text-gray-600">⚔️ Competencias</p>
              <p className="text-xs text-gray-400">realizadas</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-600">{victorias}</div>
              <p className="text-sm text-gray-600">🏆 Victorias</p>
              <p className="text-xs text-gray-400">competencia completa</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-amber-600">{puntajeTotal}</div>
              <p className="text-sm text-gray-600">⭐ Puntos</p>
              <p className="text-xs text-gray-400">acumulados</p>
            </div>
          </div>

          {/* Reglas */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-2">📋 Reglas de clasificación:</h3>
            <ul className="space-y-1 text-sm">
              <li>• <span className="font-bold">3 competencias</span> de 10 puntos máximos cada una</li>
              <li>• <span className="font-bold">10 puntos</span> = victoria automática en la competencia</li>
              <li>• Máximo <span className="font-bold">{PUNTOS_MAXIMOS} puntos</span> posibles</li>
              <li>• Mínimo <span className="font-bold">{PUNTOS_MIN_CLASIFICACION} puntos</span> (50% de aciertos) para clasificar</li>
              <li>• <span className="font-bold">20 segundos por pregunta</span> | 15 preguntas por competencia</li>
              <li>• En caso de empate: <span className="font-bold">muerte súbita</span> — quien falle primero queda ELIMINADO</li>
            </ul>
          </div>

          {/* Mensaje temporal */}
          {mensaje && (
            <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center">
              {mensaje}
            </div>
          )}

          {/* Estado actual / Botón para competir */}
          {competenciasCompletadas ? (
            <div className="bg-green-100 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">¡Clasificación Completada!</h3>
              <p className="text-gray-700 mb-4">
                {califico 
                  ? `✅ ¡Felicidades! Clasificaste con ${puntajeTotal} puntos.` 
                  : `❌ No alcanzaste la puntuación mínima. Obtuviste ${puntajeTotal} de ${PUNTOS_MIN_CLASIFICACION} puntos necesarios.`}
              </p>
              <button
                onClick={() => califico ? onAvanzarGrupos() : onVolver()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl text-xl"
              >
                {califico ? '🎮 Continuar a Grupos' : '🔙 Volver a Torneos'}
              </button>
            </div>
          ) : puedeCompetir ? (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 text-center border-2 border-red-300">
              <div className="text-5xl mb-3">⚔️</div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Competencia actual</h3>
              <p className="text-xl font-semibold">{competencias.length + 1}/{METAS_COMPETENCIAS}</p>
              <p className="text-gray-600 mb-2">Puntaje necesario: <span className="font-bold text-red-600">{puntajeNecesario} pts más</span></p>
              <p className="text-gray-500 mb-6">Te quedan {competenciasRestantes} competencias para alcanzar la meta</p>
              
              <button
                onClick={() => setMostrarDuelo(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl text-xl transition-all"
              >
                🎮 Iniciar Competencia
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Clasificacion;