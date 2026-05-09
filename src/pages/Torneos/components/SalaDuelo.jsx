import { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';

const SalaDuelo = ({ torneo, participante, fase, rivalNombre, rivalAvatar, onCompetenciaFinalizada, onVolver }) => {
  const TOTAL_PREGUNTAS = 15;
  const META_PUNTOS = 10;
  const TIEMPO_POR_PREGUNTA = 20;
  const PRECIO_REINGRESO = 10;

  const { user } = useAuth();
  const { saldo, realizarPago } = useBilletera();
  
  const esSuscriptor = user?.plan === 'pro' || user?.plan === 'premium';
  const reingresosGratis = esSuscriptor;

  const [buscando, setBuscando] = useState(true);
  const [rival, setRival] = useState(null);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntasUsadas, setPreguntasUsadas] = useState(new Set()); // ✅ Para evitar repeticiones
  const [puntuacion, setPuntuacion] = useState(0);
  const [rivalPuntuacion, setRivalPuntuacion] = useState(0);
  const [estado, setEstado] = useState('usuario');
  const [mensaje, setMensaje] = useState('');
  const [rondaActual, setRondaActual] = useState(1);
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [tiempo, setTiempo] = useState(TIEMPO_POR_PREGUNTA);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(false);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(true);
  const [pagandoReingreso, setPagandoReingreso] = useState(false);
  const [todasLasPreguntas, setTodasLasPreguntas] = useState([]); // ✅ Almacena todas las preguntas de la fase
  
  const [mostrarModalReingreso, setMostrarModalReingreso] = useState(false);
  const [reingresosUsados, setReingresosUsados] = useState(0);
  const [maxReingresos] = useState(3);
  
  const timerRef = useRef(null);
  const timeoutRespuestaRivalRef = useRef(null);

  // Función para avatar del usuario
  const obtenerAvatarUsuario = () => {
    const nombre = participante?.nombre || user?.displayName || user?.email || 'Usuario';
    const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=3B82F6&color=fff&rounded=true&size=128`;
  };

  // Función para avatar del rival
  const obtenerAvatarRival = () => {
    const nombre = rival?.nombre || 'Rival';
    const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=6B7280&color=fff&rounded=true&size=128`;
  };

  // ✅ Función mejorada: obtiene el nombre de la colección según la fase
  const obtenerColeccionPreguntas = () => {
    const mapping = {
      'clasificacion': 'preguntas_clasificacion',
      'clasificatoria': 'preguntas_clasificacion',
      'grupos': 'preguntas_grupos',
      'eliminatorias': 'preguntas_eliminatorias',
      'final': 'preguntas_final'
    };
    return mapping[fase] || 'preguntas_clasificacion';
  };

  // ✅ Función para mezclar array de forma aleatoria
  const mezclarArray = (array) => {
    const nuevoArray = [...array];
    for (let i = nuevoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    return nuevoArray;
  };

  // ✅ Cargar preguntas SIN REPETICIÓN
  useEffect(() => {
    const cargarPreguntas = async () => {
      setCargandoPreguntas(true);
      const nombreColeccion = obtenerColeccionPreguntas();
      console.log(`📚 Cargando preguntas de CNPCyF desde: ${nombreColeccion}`);
      
      try {
        const querySnapshot = await getDocs(collection(db, nombreColeccion));
        const preguntasObtenidas = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          preguntasObtenidas.push({
            id: doc.id,
            texto: data.texto,
            opciones: data.opciones || [],
            correcta: data.correcta || 0,
            creada: data.creada || null
          });
        });
        
        if (preguntasObtenidas.length === 0) {
          console.warn(`No hay preguntas en ${nombreColeccion}`);
          alert(`Error: No hay preguntas para la fase ${fase} del CNPCyF. Contacta al administrador.`);
          onVolver();
          return;
        }
        
        // ✅ Mezclar todas las preguntas
        const mezcladas = mezclarArray(preguntasObtenidas);
        
        // ✅ Guardar todas las preguntas disponibles
        setTodasLasPreguntas(mezcladas);
        
        // ✅ Tomar las primeras TOTAL_PREGUNTAS (sin repetición porque vienen de Firestore)
        const preguntasSeleccionadas = mezcladas.slice(0, TOTAL_PREGUNTAS);
        setPreguntas(preguntasSeleccionadas);
        
        console.log(`✅ Cargadas ${preguntasSeleccionadas.length} preguntas únicas para ${fase}`);
        
      } catch (error) {
        console.error('Error cargando preguntas:', error);
        alert('Error al cargar preguntas del CNPCyF');
        onVolver();
      } finally {
        setCargandoPreguntas(false);
      }
    };
    
    cargarPreguntas();
  }, [fase, onVolver]);

  // Limpiar timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (timeoutRespuestaRivalRef.current) clearTimeout(timeoutRespuestaRivalRef.current);
    };
  }, []);

  // Usar rival recibido por props
  useEffect(() => {
    if (!cargandoPreguntas && buscando) {
      if (rivalNombre) {
        setRival({ nombre: rivalNombre, avatar: rivalAvatar });
        setTimeout(() => setBuscando(false), 500);
      } else if (fase === 'clasificacion') {
        import('../data/bancoParticipantes').then(({ obtenerParticipanteUnico }) => {
          const nuevoRival = obtenerParticipanteUnico(torneo?.id || 1, fase, participante?.nombre);
          if (typeof nuevoRival === 'string') {
            setRival({ nombre: nuevoRival, avatar: null });
          } else {
            setRival({ nombre: nuevoRival.nombre, avatar: nuevoRival.avatar });
          }
          setTimeout(() => setBuscando(false), 500);
        });
      } else {
        setRival({ nombre: 'Rival CNPCyF', avatar: null });
        setTimeout(() => setBuscando(false), 500);
      }
    }
  }, [cargandoPreguntas, buscando, rivalNombre, fase]);

  const reiniciarDuelo = () => {
    setPuntuacion(0);
    setRivalPuntuacion(0);
    setPreguntaIndex(0);
    setRondaActual(1);
    setEstado('usuario');
    setRespuestaSeleccionada(false);
    setTiempo(TIEMPO_POR_PREGUNTA);
    setDueloTerminado(false);
    setMensaje('🔄 Reingreso exitoso');
    
    // ✅ Reiniciar preguntas también (opcional)
    if (todasLasPreguntas.length > 0) {
      const nuevasPreguntas = mezclarArray(todasLasPreguntas).slice(0, TOTAL_PREGUNTAS);
      setPreguntas(nuevasPreguntas);
    }
  };

  const procesarReingreso = async () => {
    if (reingresosUsados >= maxReingresos) {
      alert('❌ No más reingresos');
      setMostrarModalReingreso(false);
      onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
      return;
    }

    if (reingresosGratis) {
      setReingresosUsados(reingresosUsados + 1);
      reiniciarDuelo();
      setMostrarModalReingreso(false);
      alert('✅ Reingreso gratis');
    } else if (saldo >= PRECIO_REINGRESO) {
      setPagandoReingreso(true);
      const exito = await realizarPago(PRECIO_REINGRESO, `Reingreso: ${torneo?.titulo}`);
      setPagandoReingreso(false);
      if (exito) {
        setReingresosUsados(reingresosUsados + 1);
        reiniciarDuelo();
        setMostrarModalReingreso(false);
        alert(`✅ Reingreso pagado $${PRECIO_REINGRESO}`);
      } else {
        alert('❌ Error en pago');
      }
    } else {
      alert(`❌ Saldo insuficiente`);
    }
  };

  const calcularAciertoRival = () => Math.random() < 0.7;

  const procesarRespuestaRival = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const acierta = calcularAciertoRival();
    const nuevaPuntuacion = rivalPuntuacion + (acierta ? 1 : 0);
    setRivalPuntuacion(nuevaPuntuacion);
    setMensaje(acierta ? `⚔️ ${rival?.nombre} acertó` : `⚔️ ${rival?.nombre} falló`);
    
    if (nuevaPuntuacion >= META_PUNTOS) {
      if (puntuacion >= META_PUNTOS) {
        setEstado('muerteSubita');
        setRespuestaSeleccionada(false);
        setMensaje(`⚔️ ¡MUERTE SÚBITA!`);
        return;
      } else {
        setDueloTerminado(true);
        setMensaje(`❌ ${rival?.nombre} alcanzó ${META_PUNTOS} puntos. Perdiste.`);
        setTimeout(() => onCompetenciaFinalizada(puntuacion, false, nuevaPuntuacion, rival?.nombre), 1500);
        return;
      }
    }
    
    setEstado('resultado');
    setTimeout(() => {
      if (preguntaIndex + 1 < preguntas.length) {
        setPreguntaIndex(preguntaIndex + 1);
        setRondaActual(rondaActual + 1);
        setEstado('usuario');
        setRespuestaSeleccionada(false);
        setTiempo(TIEMPO_POR_PREGUNTA);
        setMensaje(`Pregunta ${rondaActual + 1}/${TOTAL_PREGUNTAS}`);
        setTimeout(() => setMensaje(''), 1000);
      } else {
        const gano = puntuacion > nuevaPuntuacion;
        if (!gano && reingresosUsados < maxReingresos) {
          setMostrarModalReingreso(true);
        } else {
          setDueloTerminado(true);
          setMensaje(`🏆 FIN | ${gano ? 'VICTORIA' : 'DERROTA'} | ${puntuacion} - ${nuevaPuntuacion}`);
          setTimeout(() => onCompetenciaFinalizada(puntuacion, gano, nuevaPuntuacion, rival?.nombre), 2000);
        }
      }
    }, 1500);
  };

  const procesarRespuestaUsuario = (esCorrecta) => {
    const nuevaPuntuacion = puntuacion + (esCorrecta ? 1 : 0);
    setPuntuacion(nuevaPuntuacion);
    
    if (nuevaPuntuacion >= META_PUNTOS) {
      if (rivalPuntuacion >= META_PUNTOS) {
        setEstado('muerteSubita');
        setRespuestaSeleccionada(false);
        setMensaje(`⚔️ ¡MUERTE SÚBITA!`);
        return;
      }
      
      if (rivalPuntuacion === 9) {
        setEstado('esperando');
        setMensaje(`🏆 ¡Alcanzaste ${META_PUNTOS} puntos! Esperando rival...`);
        
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setEstado('resultado');
          setMensaje(`✅ Rival no respondió. ¡Ganaste!`);
          setTimeout(() => onCompetenciaFinalizada(nuevaPuntuacion, true, rivalPuntuacion, rival?.nombre), 1500);
        }, 15000);
        
        setTimeout(() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          const aciertaRival = calcularAciertoRival();
          const nuevaPuntuacionRival = rivalPuntuacion + (aciertaRival ? 1 : 0);
          setRivalPuntuacion(nuevaPuntuacionRival);
          
          if (aciertaRival && nuevaPuntuacionRival >= META_PUNTOS) {
            setEstado('muerteSubita');
            setRespuestaSeleccionada(false);
            setMensaje(`⚔️ ¡EMPATE! Muerte súbita`);
          } else {
            setEstado('resultado');
            setMensaje(`🎉 ¡VICTORIA! Rival falló`);
            setTimeout(() => onCompetenciaFinalizada(nuevaPuntuacion, true, nuevaPuntuacionRival, rival?.nombre), 1500);
          }
        }, 800);
        return;
      }
      
      setEstado('resultado');
      setMensaje(`🏆 ¡VICTORIA! Alcanzaste ${META_PUNTOS} puntos`);
      setTimeout(() => onCompetenciaFinalizada(nuevaPuntuacion, true, rivalPuntuacion, rival?.nombre), 1500);
      return;
    }
    
    setEstado('rival');
    const tiempoRespuesta = Math.floor(Math.random() * 8000 + 5000);
    setMensaje(`🤔 ${rival?.nombre} está pensando...`);
    timeoutRespuestaRivalRef.current = setTimeout(() => procesarRespuestaRival(), tiempoRespuesta);
  };

  const responderMuerteSubita = (idx) => {
    if (estado !== 'muerteSubita' || respuestaSeleccionada) return;
    setRespuestaSeleccionada(true);
    
    let preguntaActual = preguntas[preguntaIndex];
    if (!preguntaActual && preguntaIndex + 1 < preguntas.length) {
      setPreguntaIndex(preguntaIndex + 1);
      preguntaActual = preguntas[preguntaIndex + 1];
    }
    
    if (!preguntaActual) {
      setMensaje('❌ Error: No hay preguntas');
      onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
      return;
    }
    
    const esCorrecta = idx === preguntaActual.correcta;
    
    if (esCorrecta) {
      setMensaje(`✅ ¡Correcto! Ganas el duelo`);
      setTimeout(() => onCompetenciaFinalizada(puntuacion + 1, true, rivalPuntuacion, rival?.nombre), 1500);
    } else {
      setMensaje(`❌ Incorrecto. Pierdes el duelo`);
      setTimeout(() => onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre), 1500);
    }
    setDueloTerminado(true);
  };

  const responder = (idx) => {
    if (estado !== 'usuario' || dueloTerminado || respuestaSeleccionada || cargandoPreguntas) return;
    
    setRespuestaSeleccionada(true);
    const pregunta = preguntas[preguntaIndex];
    if (!pregunta) return;
    const esCorrecta = idx === pregunta.correcta;
    setMensaje(esCorrecta ? '✅ ¡Correcto! +1 punto' : '❌ Incorrecto');
    procesarRespuestaUsuario(esCorrecta);
  };

  useEffect(() => {
    let timer;
    if (!buscando && !dueloTerminado && estado === 'usuario' && tiempo > 0 && !respuestaSeleccionada && !cargandoPreguntas) {
      timer = setTimeout(() => setTiempo(tiempo - 1), 1000);
    } else if (tiempo === 0 && estado === 'usuario' && !dueloTerminado && !respuestaSeleccionada && !cargandoPreguntas) {
      setRespuestaSeleccionada(true);
      setMensaje('⏰ TIEMPO AGOTADO');
      procesarRespuestaUsuario(false);
    }
    return () => clearTimeout(timer);
  }, [tiempo, estado, dueloTerminado, respuestaSeleccionada, buscando, cargandoPreguntas]);

  if (buscando || cargandoPreguntas) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-pulse mb-4">
            <span className="material-symbols-outlined text-6xl text-red-500">search</span>
          </div>
          <p className="text-2xl font-bold">Buscando rival...</p>
          <p className="text-sm text-gray-500 mt-2">Fase: {fase === 'clasificacion' ? 'Fase de clasificación' : fase}</p>
          <p className="text-xs text-gray-400 mt-1">📚 Preguntas del CNPCyF</p>
          <button onClick={onVolver} className="mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg">Cancelar</button>
        </div>
      </div>
    );
  }

  if (dueloTerminado && !mostrarModalReingreso && estado !== 'muerteSubita') return null;

  const pregunta = preguntas[preguntaIndex];
  if (!pregunta && !mostrarModalReingreso && estado !== 'muerteSubita' && estado !== 'esperando') {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-xl text-red-500">Error: Pregunta no encontrada</p>
          <p className="text-sm text-gray-500 mt-2">Verifica que la colección '{obtenerColeccionPreguntas()}' tenga preguntas del CNPCyF</p>
          <button onClick={onVolver} className="mt-4 bg-gray-500 text-white px-6 py-3 rounded-lg">Volver</button>
        </div>
      </div>
    );
  }

  const progresoMETA = (puntuacion / META_PUNTOS) * 100;
  
  if (estado === 'muerteSubita') {
    let preguntaMuerte = preguntas[preguntaIndex];
    if (!preguntaMuerte && preguntaIndex + 1 < preguntas.length) {
      preguntaMuerte = preguntas[preguntaIndex + 1];
    }
    
    return (
      <div className="px-4 max-w-5xl mx-auto py-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-700 to-orange-700 p-5 text-white text-center">
            <h2 className="text-2xl font-bold">⚔️ MUERTE SÚBITA ⚔️</h2>
            <p className="text-red-200">{torneo?.titulo}</p>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-xl font-bold text-red-700">¡Empate a {META_PUNTOS} puntos!</p>
              <div className="flex justify-around mt-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center overflow-hidden">
                    <img src={obtenerAvatarUsuario()} alt="Tu avatar" className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold mt-2">{participante?.nombre || 'Tú'}</p>
                  <p className="text-xl font-bold text-blue-600">{puntuacion}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mt-6">VS</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-500 mx-auto flex items-center justify-center overflow-hidden">
                    <img src={obtenerAvatarRival()} alt="Avatar rival" className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold mt-2">{rival?.nombre}</p>
                  <p className="text-xl font-bold text-gray-500">{rivalPuntuacion}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
              <p className="text-xl font-medium">{preguntaMuerte?.texto}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {preguntaMuerte?.opciones.map((opt, idx) => (
                <button key={idx} onClick={() => responderMuerteSubita(idx)} disabled={respuestaSeleccionada} 
                  className="p-4 rounded-xl text-left bg-white border hover:bg-gray-100 transition disabled:opacity-50">
                  {opt}
                </button>
              ))}
            </div>
            {mensaje && <p className="mt-4 text-center font-medium">{mensaje}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (estado === 'esperando') {
    return (
      <div className="px-4 max-w-5xl mx-auto py-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="animate-pulse mb-4">
            <span className="material-symbols-outlined text-6xl text-gray-400">hourglass_empty</span>
          </div>
          <p className="text-2xl font-bold">Esperando al rival...</p>
          <p className="text-gray-500 mt-2">{mensaje}</p>
        </div>
      </div>
    );
  }

  if (mostrarModalReingreso) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold mb-2">¡Has perdido!</h2>
          <p className="text-gray-600 mb-4">Tu oponente {rival?.nombre} te ha superado.</p>
          <div className="flex gap-3">
            <button onClick={() => { setMostrarModalReingreso(false); onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre); }} 
              className="flex-1 bg-gray-200 py-3 rounded-lg">Rendirme</button>
            <button onClick={procesarReingreso} disabled={pagandoReingreso}
              className="flex-1 bg-amber-500 text-white py-3 rounded-lg font-bold">
              {pagandoReingreso ? 'Procesando...' : (reingresosGratis ? 'Reingresar gratis' : `Reingresar $${PRECIO_REINGRESO}`)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Determinar el texto correcto de la fase
  const getFaseTexto = () => {
    switch(fase) {
      case 'clasificacion':
        return 'Fase de clasificación';
      case 'grupos':
        return 'Fase de grupos';
      case 'eliminatorias':
        return 'Fase eliminatorias';
      default:
        return fase;
    }
  };

  return (
    <div className="px-4 max-w-5xl mx-auto py-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-5 text-white relative">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold">{getFaseTexto()}</h2>
            <p className="text-red-200 mt-1">{torneo?.titulo}</p>
            <p className="text-xs text-red-300 mt-1">📚 Preguntas del CNPCyF</p>
          </div>
          <button onClick={onVolver} className="absolute right-4 top-4 text-white/80 hover:text-white">Salir</button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg overflow-hidden">
                <img src={obtenerAvatarUsuario()} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mt-3">{participante?.nombre || user?.displayName || 'Tú'}</h3>
              <div className="mt-2">
                <p className="text-3xl font-bold text-blue-600">{puntuacion}</p>
                <p className="text-sm text-gray-500">puntos</p>
              </div>
            </div>
            
            <div className="flex-shrink-0 mx-6">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-4xl text-red-600">swords</span>
              </div>
              <p className="text-center text-sm text-gray-400 mt-1">VS</p>
            </div>
            
            <div className="text-center flex-1">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg overflow-hidden">
                <img src={obtenerAvatarRival()} alt="Avatar rival" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mt-3">{rival?.nombre || 'Oponente'}</h3>
              <div className="mt-2">
                <p className="text-3xl font-bold text-gray-500">{rivalPuntuacion}</p>
                <p className="text-sm text-gray-500">puntos</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-gray-700">🎯 Meta: {META_PUNTOS} puntos</span>
              <span className="text-lg font-bold text-orange-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">timer</span> ⏱️ {tiempo}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${Math.min(progresoMETA, 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{puntuacion} puntos obtenidos</span>
              <span>{Math.max(0, META_PUNTOS - puntuacion)} puntos restantes</span>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-base text-gray-600">
              {estado === 'usuario' ? `🎤 Tu turno - Pregunta ${rondaActual}/${TOTAL_PREGUNTAS}` : 
               estado === 'rival' ? `🤔 ${rival?.nombre} está respondiendo...` : 
               `📊 Resultado de la ronda`}
            </p>
            {mensaje && <p className="text-sm font-medium mt-1">{mensaje}</p>}
          </div>
        </div>
        
        {estado === 'usuario' && pregunta && (
          <div className="border-t p-6 bg-gray-50">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
              <p className="text-xl font-medium text-gray-800">{pregunta.texto}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {pregunta.opciones.map((opt, idx) => (
                <button key={idx} onClick={() => responder(idx)} disabled={respuestaSeleccionada}
                  className="p-4 rounded-xl text-left bg-white border hover:bg-gray-100 transition disabled:opacity-50">
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              ⏱️ Tienes {tiempo} segundos
            </div>
          </div>
        )}
        
        {(estado === 'rival' || estado === 'resultado') && (
          <div className="border-t p-6 bg-gray-50 text-center">
            <div className="animate-pulse">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                {estado === 'rival' ? 'psychology' : 'emoji_events'}
              </span>
            </div>
          </div>
        )}
        
        <div className="bg-gray-100 px-6 py-4 text-sm text-gray-500 flex flex-wrap gap-2 justify-center">
          <span>📚 {getFaseTexto()} - CNPCyF</span>
          <span>⏱️ {TIEMPO_POR_PREGUNTA} segundos</span>
          <span>📋 {TOTAL_PREGUNTAS} preguntas únicas</span>
          <span>🎯 {META_PUNTOS} puntos = Victoria</span>
          <span>⚔️ Eliminación directa</span>
        </div>
      </div>
    </div>
  );
};

export default SalaDuelo;