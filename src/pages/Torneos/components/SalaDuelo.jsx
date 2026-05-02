import { useState, useEffect } from 'react';
import { obtenerPreguntasParaFase } from '../data/preguntasPorFase';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';

const SalaDuelo = ({ torneo, participante, fase, onCompetenciaFinalizada, onVolver }) => {
  const TOTAL_PREGUNTAS = 15;
  const META_PUNTOS = 10;
  const TIEMPO_POR_PREGUNTA = 20;
  const PRECIO_REINGRESO = 30; // Precio para reingresar al torneo

  const { user, isAdmin } = useAuth();
  const { saldo, pagarConBilletera } = useBilletera();
  
  const esSuscriptor = user?.plan === 'pro' || user?.plan === 'premium';
  const reingresosGratis = esSuscriptor;

  const [buscando, setBuscando] = useState(true);
  const [rival, setRival] = useState(null);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [rivalPuntuacion, setRivalPuntuacion] = useState(0);
  const [estado, setEstado] = useState('usuario');
  const [mensaje, setMensaje] = useState('');
  const [rondaActual, setRondaActual] = useState(1);
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [tiempo, setTiempo] = useState(TIEMPO_POR_PREGUNTA);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(false);
  
  // ✅ Sistema de reingresos
  const [mostrarModalReingreso, setMostrarModalReingreso] = useState(false);
  const [reingresosUsados, setReingresosUsados] = useState(0);
  const [maxReingresos] = useState(3); // Máximo 3 reingresos por torneo

  useEffect(() => {
    let nombreFase = 'clasificacion';
    if (fase === 'grupos') nombreFase = 'grupos';
    else if (fase === 'eliminatorias') nombreFase = 'eliminatorias';
    else if (fase === 'final') nombreFase = 'final';
    
    const preguntasObtenidas = obtenerPreguntasParaFase(nombreFase, TOTAL_PREGUNTAS);
    setPreguntas(preguntasObtenidas);
    
    setTimeout(() => {
      setBuscando(false);
      setRival({ nombre: 'Carlos Méndez' });
      setMensaje('¡Rival encontrado! Responde la pregunta');
    }, 2000);
  }, [fase]);

  useEffect(() => {
    let timer;
    if (!buscando && !dueloTerminado && estado === 'usuario' && tiempo > 0 && !respuestaSeleccionada) {
      timer = setTimeout(() => setTiempo(tiempo - 1), 1000);
    } else if (tiempo === 0 && estado === 'usuario' && !dueloTerminado && !respuestaSeleccionada) {
      setRespuestaSeleccionada(true);
      setMensaje('⏰ TIEMPO AGOTADO - 0 puntos');
      procesarRespuestaUsuario(false);
    }
    return () => clearTimeout(timer);
  }, [tiempo, estado, dueloTerminado, respuestaSeleccionada, buscando]);

  // ✅ Función para reiniciar el duelo (reingreso)
  const reiniciarDuelo = () => {
    setPuntuacion(0);
    setRivalPuntuacion(0);
    setPreguntaIndex(0);
    setRondaActual(1);
    setEstado('usuario');
    setRespuestaSeleccionada(false);
    setTiempo(TIEMPO_POR_PREGUNTA);
    setDueloTerminado(false);
    setMensaje('🔄 Has reingresado al torneo. ¡Suerte!');
    setTimeout(() => setMensaje(''), 2000);
  };

  // ✅ Procesar reingreso
  const procesarReingreso = async () => {
    if (reingresosUsados >= maxReingresos) {
      alert('❌ Ya no puedes reingresar más veces en este torneo');
      setMostrarModalReingreso(false);
      onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
      return;
    }

    if (reingresosGratis) {
      // Reingreso gratuito para suscriptores
      setReingresosUsados(reingresosUsados + 1);
      reiniciarDuelo();
      setMostrarModalReingreso(false);
      alert('✅ Reingreso gratis por tu suscripción');
    } else if (saldo >= PRECIO_REINGRESO) {
      const exito = pagarConBilletera(PRECIO_REINGRESO, `Reingreso torneo: ${torneo?.titulo}`);
      if (exito) {
        setReingresosUsados(reingresosUsados + 1);
        reiniciarDuelo();
        setMostrarModalReingreso(false);
        alert(`✅ Reingreso exitoso. Pagaste $${PRECIO_REINGRESO} MXN`);
      } else {
        alert('❌ Error al procesar el pago');
        setMostrarModalReingreso(false);
        onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
      }
    } else {
      alert(`❌ Saldo insuficiente para reingreso. Necesitas $${PRECIO_REINGRESO} MXN`);
      setMostrarModalReingreso(false);
      onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
    }
  };

  const procesarRespuestaUsuario = (esCorrecta) => {
    const nuevaPuntuacion = puntuacion + (esCorrecta ? 1 : 0);
    setPuntuacion(nuevaPuntuacion);
    
    if (nuevaPuntuacion >= META_PUNTOS) {
      setDueloTerminado(true);
      setMensaje(`🏆 ¡Alcanzaste ${META_PUNTOS} puntos! Ganas el duelo`);
      setTimeout(() => {
        onCompetenciaFinalizada(nuevaPuntuacion, true, rivalPuntuacion, rival?.nombre);
      }, 1500);
      return;
    }
    
    setEstado('rival');
    setTimeout(() => {
      procesarRespuestaRival();
    }, 1000);
  };

  const procesarRespuestaRival = () => {
    const acierta = Math.random() < 0.6;
    const nuevaPuntuacion = rivalPuntuacion + (acierta ? 1 : 0);
    setRivalPuntuacion(nuevaPuntuacion);
    setMensaje(acierta ? `⚔️ ${rival?.nombre} acertó la pregunta` : `⚔️ ${rival?.nombre} falló la pregunta`);
    
    if (nuevaPuntuacion >= META_PUNTOS) {
      // ✅ En lugar de terminar, preguntar si quiere reingresar
      setDueloTerminado(true);
      setMostrarModalReingreso(true);
      return;
    }
    
    setEstado('resultado');
    setTimeout(() => {
      if (preguntaIndex + 1 < TOTAL_PREGUNTAS) {
        setPreguntaIndex(preguntaIndex + 1);
        setRondaActual(rondaActual + 1);
        setEstado('usuario');
        setRespuestaSeleccionada(false);
        setTiempo(TIEMPO_POR_PREGUNTA);
        setMensaje(`Pregunta ${rondaActual + 1} de ${TOTAL_PREGUNTAS}`);
        setTimeout(() => setMensaje(''), 1000);
      } else {
        const gano = puntuacion > nuevaPuntuacion;
        if (!gano && reingresosUsados < maxReingresos) {
          setMostrarModalReingreso(true);
        } else {
          setDueloTerminado(true);
          setMensaje(`🏆 DUELO FINALIZADO | ${gano ? 'VICTORIA' : 'DERROTA'} | ${puntuacion} - ${nuevaPuntuacion}`);
          setTimeout(() => {
            onCompetenciaFinalizada(puntuacion, gano, nuevaPuntuacion, rival?.nombre);
          }, 2000);
        }
      }
    }, 1500);
  };

  const responder = (idx) => {
    if (estado !== 'usuario' || dueloTerminado || respuestaSeleccionada) return;
    
    setRespuestaSeleccionada(true);
    const pregunta = preguntas[preguntaIndex];
    if (!pregunta) return;
    const esCorrecta = idx === pregunta.correcta;
    setMensaje(esCorrecta ? '✅ ¡Correcto! +1 punto' : '❌ Incorrecto');
    procesarRespuestaUsuario(esCorrecta);
  };

  if (buscando) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-pulse mb-4"><span className="material-symbols-outlined text-6xl text-red-500">search</span></div>
          <p className="text-xl font-bold">Buscando rival...</p>
          <button onClick={onVolver} className="mt-6 bg-gray-500 text-white px-6 py-2 rounded-lg">Cancelar</button>
        </div>
      </div>
    );
  }

  if (dueloTerminado && !mostrarModalReingreso) return null;

  const pregunta = preguntas[preguntaIndex];
  if (!pregunta && !mostrarModalReingreso) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-red-500">Error: Pregunta no encontrada</p>
          <button onClick={onVolver} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg">Volver</button>
        </div>
      </div>
    );
  }

  const progresoMETA = (puntuacion / META_PUNTOS) * 100;

  // ✅ Modal de reingreso
  if (mostrarModalReingreso) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold mb-2">¡Has perdido!</h2>
          <p className="text-gray-600 mb-4">Tu oponente te ha superado en esta ronda.</p>
          
          {reingresosUsados < maxReingresos ? (
            <>
              <div className="bg-amber-50 rounded-xl p-4 mb-4">
                <p className="font-bold text-amber-800">🔄 ¿Quieres reingresar?</p>
                {reingresosGratis ? (
                  <p className="text-sm text-green-600 mt-1">✅ Reingreso GRATIS por tu suscripción</p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">Costo: ${PRECIO_REINGRESO} MXN</p>
                )}
                <p className="text-xs text-gray-500 mt-2">Te quedan {maxReingresos - reingresosUsados} reingresos</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => {
                  setMostrarModalReingreso(false);
                  onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
                }} className="flex-1 bg-gray-200 py-2 rounded-lg">Rendirme</button>
                <button onClick={procesarReingreso} className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-bold">
                  {reingresosGratis ? 'Reingresar gratis' : `Pagar $${PRECIO_REINGRESO} y reingresar`}
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => {
              setMostrarModalReingreso(false);
              onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
            }} className="w-full bg-red-500 text-white py-2 rounded-lg">Salir</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-white relative">
          <div className="text-center">
            <h2 className="text-lg font-bold">Fase {fase === 'clasificacion' ? 'Clasificación' : fase === 'grupos' ? 'Grupos' : fase === 'eliminatorias' ? 'Eliminatoria' : 'Final'}</h2>
            <p className="text-sm text-red-200">{torneo?.titulo}</p>
          </div>
          <button onClick={onVolver} className="absolute right-4 top-4 text-white/80 hover:text-white text-sm">Salir</button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-4xl text-white">person</span>
              </div>
              <h3 className="font-bold text-gray-800 mt-3">{participante?.nombre || 'Tú'}</h3>
              <div className="mt-2"><p className="text-2xl font-bold text-blue-600">{puntuacion}</p><p className="text-xs text-gray-500">puntos</p></div>
            </div>
            <div className="flex-shrink-0 mx-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-3xl text-red-600">swords</span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-1">VS</p>
            </div>
            <div className="text-center flex-1">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-4xl text-white">person</span>
              </div>
              <h3 className="font-bold text-gray-800 mt-3">{rival?.nombre || 'Oponente'}</h3>
              <div className="mt-2"><p className="text-2xl font-bold text-gray-500">{rivalPuntuacion}</p><p className="text-xs text-gray-500">puntos</p></div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-700">🎯 Meta: {META_PUNTOS} puntos</span>
              <span className="text-sm font-bold text-orange-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">timer</span> ⏱️ {tiempo}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progresoMETA}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{puntuacion} puntos obtenidos</span>
              <span>{META_PUNTOS - puntuacion} puntos restantes</span>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-100 rounded-lg p-2 text-center">
            <p className="text-sm text-gray-600">
              {estado === 'usuario' ? `🎤 Tu turno - Pregunta ${rondaActual}/${TOTAL_PREGUNTAS}` : 
               estado === 'rival' ? `🤔 ${rival?.nombre} está respondiendo...` : 
               `📊 Resultado de la ronda`}
            </p>
            {mensaje && <p className="text-xs font-medium mt-1">{mensaje}</p>}
          </div>
        </div>
        
        {estado === 'usuario' && (
          <div className="border-t p-6 bg-gray-50">
            <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
              <p className="text-lg font-medium text-gray-800">{pregunta.texto}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {pregunta.opciones.map((opt, idx) => (
                <button key={idx} onClick={() => responder(idx)} disabled={respuestaSeleccionada} className="p-3 rounded-lg text-left bg-white border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50">
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-3 text-center text-xs text-gray-400">
              ⏱️ Tienes {tiempo} segundos para responder
            </div>
          </div>
        )}
        
        <div className="bg-gray-100 px-6 py-3 text-xs text-gray-500 flex justify-between flex-wrap gap-2">
          <span>⏱️ 20 segundos por pregunta</span>
          <span>📋 15 preguntas</span>
          <span>🎯 10 puntos = Victoria</span>
          <span>⚔️ Eliminación directa</span>
          <span>🔄 Reingreso disponible</span>
          <span>📚 Nivel: {fase === 'clasificacion' ? 'Básico' : fase === 'grupos' ? 'Intermedio' : fase === 'eliminatorias' ? 'Avanzado' : 'Experto'}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaDuelo;