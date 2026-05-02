import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';
import SalaDuelo from './SalaDuelo';

const Clasificacion = ({ torneo, participante, onAvanzarGrupos, onVolver, setParticipante, onDueloFinalizado }) => {
  const { user } = useAuth();
  const { realizarPago } = useBilletera();
  const [competencias, setCompetencias] = useState([]);
  const [competenciaActual, setCompetenciaActual] = useState(0);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [mostrarDuelo, setMostrarDuelo] = useState(false);
  const [dueloActual, setDueloActual] = useState(null);
  const [competenciaCompletada, setCompetenciaCompletada] = useState(false);
  const [pagandoReingreso, setPagandoReingreso] = useState(false);

  const METAS_COMPETENCIAS = 3;
  const PUNTOS_POR_COMPETENCIA = 10;
  const PUNTOS_MAXIMOS = METAS_COMPETENCIAS * PUNTOS_POR_COMPETENCIA;  // ✅ CORREGIDO
  const PUNTOS_MIN_CLASIFICACION = 15;  // 50% de 30 puntos

  useEffect(() => {
    cargarCompetencias();
  }, []);

  const cargarCompetencias = () => {
    const stored = localStorage.getItem(`clasificacion_${torneo.id}_${participante.usuarioId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setCompetencias(data.competencias || []);
      setPuntajeTotal(data.puntajeTotal || 0);
      setCompetenciaActual(data.competenciaActual || 0);
    } else {
      setCompetencias([]);
      setPuntajeTotal(0);
      setCompetenciaActual(0);
    }
  };

  const guardarProgreso = (nuevasCompetencias, nuevoPuntaje, nuevaCompetenciaActual) => {
    const data = {
      competencias: nuevasCompetencias,
      puntajeTotal: nuevoPuntaje,
      competenciaActual: nuevaCompetenciaActual
    };
    localStorage.setItem(`clasificacion_${torneo.id}_${participante.usuarioId}`, JSON.stringify(data));
  };

  const iniciarCompetencia = () => {
    setMostrarDuelo(true);
    setCompetenciaCompletada(false);
  };

  const finalizarCompetencia = async (puntos, gano, puntosRival, nombreRival) => {
    setMostrarDuelo(false);
    
    if (!gano && !competenciaCompletada) {
      const reingreso = await ofrecerReingreso();
      if (reingreso) return;
    }
    
    const puntosObtenidos = gano ? PUNTOS_POR_COMPETENCIA : 0;
    const nuevaCompetencia = {
      id: Date.now(),
      numero: competenciaActual + 1,
      puntos: puntosObtenidos,
      gano: gano,
      fecha: new Date().toISOString(),
      puntajeRival: puntosRival,
      nombreRival: nombreRival
    };
    
    const nuevasCompetencias = [...competencias, nuevaCompetencia];
    const nuevoPuntajeTotal = puntajeTotal + puntosObtenidos;
    const nuevaCompetenciaActual = competenciaActual + 1;
    
    setCompetencias(nuevasCompetencias);
    setPuntajeTotal(nuevoPuntajeTotal);
    setCompetenciaActual(nuevaCompetenciaActual);
    setCompetenciaCompletada(true);
    
    guardarProgreso(nuevasCompetencias, nuevoPuntajeTotal, nuevaCompetenciaActual);
    
    if (nuevaCompetenciaActual >= METAS_COMPETENCIAS) {
      if (nuevoPuntajeTotal >= PUNTOS_MIN_CLASIFICACION) {
        alert(`✅ ¡FELICIDADES! Clasificaste con ${nuevoPuntajeTotal} puntos.`);
        const updatedParticipante = { ...participante, fase: 'clasificacion_completada' };
        localStorage.setItem(participante.id, JSON.stringify(updatedParticipante));
        setParticipante(updatedParticipante);
        onAvanzarGrupos();
      } else {
        alert(`❌ No alcanzaste la puntuación mínima. Necesitas ${PUNTOS_MIN_CLASIFICACION} puntos y obtuviste ${nuevoPuntajeTotal}.`);
        onVolver();
      }
    }
  };

  const ofrecerReingreso = async () => {
    const precioReingreso = 30;
    return new Promise((resolve) => {
      const confirmar = window.confirm(
        `💀 Has perdido la competencia.\n\n` +
        `¿Quieres reingresar pagando $${precioReingreso} MXN?\n` +
        `(Los reingresos te permiten seguir compitiendo por la clasificación)`
      );
      if (confirmar) {
        setPagandoReingreso(true);
        realizarPago(precioReingreso, `Reingreso clasificación torneo: ${torneo.titulo}`)
          .then((exito) => {
            setPagandoReingreso(false);
            if (exito) {
              alert(`✅ Reingreso exitoso. Puedes intentar de nuevo la competencia.`);
              resolve(true);
            } else {
              alert(`❌ No se pudo procesar el pago.`);
              resolve(false);
            }
          });
      } else {
        resolve(false);
      }
    });
  };

  const competenciasRestantes = METAS_COMPETENCIAS - competenciaActual;
  const puntajeNecesario = Math.max(0, PUNTOS_MIN_CLASIFICACION - puntajeTotal);
  const competenciaEnCurso = competenciaActual < METAS_COMPETENCIAS && !competenciaCompletada;

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
          <p className="text-xl font-semibold text-gray-700">Procesando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Tarjeta principal */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">{torneo.titulo}</h2>
          <p className="text-xl md:text-2xl font-semibold text-red-200">🏆 Fase de Clasificación</p>
          <div className="mt-4 inline-block bg-white/20 rounded-full px-6 py-2">
            <span className="text-4xl md:text-5xl font-black">{puntajeTotal}</span>
            <span className="text-xl">/{PUNTOS_MAXIMOS}</span>
            <span className="ml-2 text-base">puntos totales</span>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="p-6">
          {/* Progreso general */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-gray-700">📊 Progreso de clasificación</span>
              <span className="text-lg font-semibold text-red-600">{competenciaActual}/{METAS_COMPETENCIAS} competencias</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div 
                className="bg-green-500 h-5 rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-white text-xs font-bold"
                style={{ width: `${(competenciaActual / METAS_COMPETENCIAS) * 100}%` }}
              >
                {competenciaActual > 0 && `${Math.round((competenciaActual / METAS_COMPETENCIAS) * 100)}%`}
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-5xl md:text-6xl font-black text-blue-600 mb-2">{competencias.length}</div>
              <p className="text-lg font-semibold text-blue-700">⚔️ Competencias</p>
              <p className="text-sm text-blue-500">realizadas</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-5xl md:text-6xl font-black text-green-600 mb-2">
                {competencias.filter(c => c.gano).length}
              </div>
              <p className="text-lg font-semibold text-green-700">🏆 Victorias</p>
              <p className="text-sm text-green-500">competencia completa</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-5xl md:text-6xl font-black text-amber-600 mb-2">{puntajeTotal}</div>
              <p className="text-lg font-semibold text-amber-700">⭐ Puntos</p>
              <p className="text-sm text-amber-500">acumulados</p>
            </div>
          </div>

          {/* Reglas */}
          <div className="bg-gray-100 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span> Reglas de clasificación:
            </h3>
            <ul className="space-y-2 text-base text-gray-700">
              <li className="flex items-start gap-2">• <span className="flex-1"><span className="font-bold">3 competencias</span> de {PUNTOS_POR_COMPETENCIA} puntos máximos cada una</span></li>
              <li className="flex items-start gap-2">• <span className="flex-1"><span className="font-bold">{PUNTOS_POR_COMPETENCIA} puntos</span> = victoria automática en la competencia</span></li>
              <li className="flex items-start gap-2">• <span className="flex-1">Máximo <span className="font-bold">{PUNTOS_MAXIMOS} puntos</span> posibles</span></li>
              <li className="flex items-start gap-2">• <span className="flex-1">Mínimo <span className="font-bold">{PUNTOS_MIN_CLASIFICACION} puntos</span> (50% de aciertos) para clasificar</span></li>
              <li className="flex items-start gap-2">• <span className="flex-1"><span className="font-bold">20 segundos por pregunta</span> | 15 preguntas por competencia</span></li>
              <li className="flex items-start gap-2">• <span className="flex-1">En caso de empate: <span className="font-bold">muerte súbita</span> — quien falle primero queda ELIMINADO</span></li>
            </ul>
          </div>

          {/* Estado actual */}
          {competenciaEnCurso ? (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 text-center border-2 border-red-300">
              <div className="mb-4">
                <span className="text-4xl md:text-5xl">⚔️</span>
              </div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Competencia actual</h3>
              <p className="text-xl font-semibold text-gray-700 mb-1">{competenciaActual + 1}/{METAS_COMPETENCIAS}</p>
              <p className="text-lg text-gray-600 mb-4">Puntaje necesario: <span className="font-bold text-red-600">{puntajeNecesario} pts más</span></p>
              <p className="text-md text-gray-500 mb-6">Te quedan {competenciasRestantes} competencias para alcanzar la meta</p>
              
              <button
                onClick={iniciarCompetencia}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg"
              >
                🎮 Iniciar Competencia
              </button>
            </div>
          ) : competenciaActual >= METAS_COMPETENCIAS ? (
            <div className="bg-green-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">¡Clasificación Completada!</h3>
              <p className="text-lg text-gray-700 mb-4">
                {puntajeTotal >= PUNTOS_MIN_CLASIFICACION 
                  ? `✅ Has obtenido ${puntajeTotal} puntos. ¡Felicidades! Pasas a la siguiente fase.` 
                  : `❌ Obtuviste ${puntajeTotal} puntos. No alcanzaste la puntuación mínima de ${PUNTOS_MIN_CLASIFICACION} puntos.`}
              </p>
              <button
                onClick={() => puntajeTotal >= PUNTOS_MIN_CLASIFICACION ? onAvanzarGrupos() : onVolver()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all"
              >
                {puntajeTotal >= PUNTOS_MIN_CLASIFICACION ? 'Continuar a Grupos' : 'Volver a Torneos'}
              </button>
            </div>
          ) : competenciaCompletada ? (
            <div className="bg-amber-100 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">✔️</div>
              <h3 className="text-xl font-bold text-amber-700 mb-2">Competencia Completada</h3>
              <button
                onClick={() => setCompetenciaCompletada(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Siguiente Competencia
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Clasificacion;