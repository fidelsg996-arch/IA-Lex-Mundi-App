import { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
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
  const [puntajeParcial, setPuntajeParcial] = useState(0);
  const [puntosRival, setPuntosRival] = useState(0);
  const [estado, setEstado] = useState('usuario');
  const [mensaje, setMensaje] = useState('');
  const [rondaActual, setRondaActual] = useState(1);
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [tiempo, setTiempo] = useState(TIEMPO_POR_PREGUNTA);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(false);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(true);
  const [pagandoReingreso, setPagandoReingreso] = useState(false);
  const [todasLasPreguntas, setTodasLasPreguntas] = useState([]);
  
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

  // Obtiene el nombre de la colección según la fase
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

  // Mezcla un array de forma aleatoria
  const mezclarArray = (array) => {
    const nuevoArray = [...array];
    for (let i = nuevoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    return nuevoArray;
  };

  // Cargar preguntas desde Firebase
  useEffect(() => {
    const cargarPreguntas = async () => {
      setCargandoPreguntas(true);
      const nombreColeccion = obtenerColeccionPreguntas();
      console.log(`📚 Cargando preguntas desde: ${nombreColeccion} para fase: ${fase}`);
      
      try {
        const querySnapshot = await getDocs(collection(db, nombreColeccion));
        const preguntasObtenidas = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          preguntasObtenidas.push({
            id: doc.id,
            texto: data.texto,
            opciones: data.opciones || [],
            correcta: data.correcta || 0
          });
        });
        
        if (preguntasObtenidas.length === 0) {
          console.warn(`No hay preguntas en ${nombreColeccion}`);
          alert(`Error: No hay preguntas para la fase ${fase}. Contacta al administrador.`);
          onVolver();
          return;
        }
        
        // Mezclar y seleccionar preguntas únicas
        const mezcladas = mezclarArray(preguntasObtenidas);
        setTodasLasPreguntas(mezcladas);
        
        // Tomar las primeras TOTAL_PREGUNTAS
        const preguntasSeleccionadas = mezcladas.slice(0, TOTAL_PREGUNTAS);
        setPreguntas(preguntasSeleccionadas);
        
        console.log(`✅ Cargadas ${preguntasSeleccionadas.length} preguntas para ${fase}`);
        
      } catch (error) {
        console.error('Error cargando preguntas:', error);
        alert('Error al cargar preguntas');
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
      } else {
        setRival({ nombre: 'Rival', avatar: null });
        setTimeout(() => setBuscando(false), 500);
      }
    }
  }, [cargandoPreguntas, buscando, rivalNombre, fase]);

  const calcularAciertoRival = () => Math.random() < 0.7;

  // Procesar respuesta del rival
  const procesarRespuestaRival = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const acierta = calcularAciertoRival();
    const nuevaPuntuacion = puntosRival + (acierta ? 1 : 0);
    setPuntosRival(nuevaPuntuacion);
    setMensaje(acierta ? `⚔️ ${rival?.nombre} acertó` : `⚔️ ${rival?.nombre} falló`);
    
    // Verificar si el rival alcanzó la meta
    if (nuevaPuntuacion >= META_PUNTOS) {
      setDueloTerminado(true);
      setMensaje(`❌ ${rival?.nombre} alcanzó ${META_PUNTOS} puntos. Perdiste el duelo.`);
      setTimeout(() => onCompetenciaFinalizada(puntajeParcial, false, nuevaPuntuacion, rival?.nombre), 1500);
      return;
    }
    
    // Siguiente pregunta o fin de ronda
    if (preguntaIndex + 1 < preguntas.length) {
      setPreguntaIndex(preguntaIndex + 1);
      setRondaActual(rondaActual + 1);
      setEstado('usuario');
      setRespuestaSeleccionada(false);
      setTiempo(TIEMPO_POR_PREGUNTA);
      setMensaje(`🎤 Tu turno - Pregunta ${rondaActual + 1}/${TOTAL_PREGUNTAS}`);
      setTimeout(() => setMensaje(''), 1500);
    } else {
      // Fin del duelo, comparar puntuaciones
      const gano = puntajeParcial > nuevaPuntuacion;
      setDueloTerminado(true);
      setMensaje(`🏆 FIN | ${gano ? '¡VICTORIA!' : 'DERROTA'} | ${puntajeParcial} - ${nuevaPuntuacion}`);
      setTimeout(() => onCompetenciaFinalizada(puntajeParcial, gano, nuevaPuntuacion, rival?.nombre), 2000);
    }
  };

  // Procesar respuesta del usuario
  const procesarRespuestaUsuario = (esCorrecta) => {
    const nuevaPuntuacion = puntajeParcial + (esCorrecta ? 1 : 0);
    setPuntajeParcial(nuevaPuntuacion);
    
    // Verificar si el usuario alcanzó la meta
    if (nuevaPuntuacion >= META_PUNTOS) {
      setDueloTerminado(true);
      setMensaje(`🏆 ¡VICTORIA! Alcanzaste ${META_PUNTOS} puntos`);
      setTimeout(() => onCompetenciaFinalizada(nuevaPuntuacion, true, puntosRival, rival?.nombre), 1500);
      return;
    }
    
    // Turno del rival
    setEstado('rival');
    const tiempoRespuesta = Math.floor(Math.random() * 5000 + 3000);
    setMensaje(`🤔 ${rival?.nombre} está pensando...`);
    timeoutRespuestaRivalRef.current = setTimeout(() => procesarRespuestaRival(), tiempoRespuesta);
  };

  // Responder pregunta
  const responder = (idx) => {
    if (estado !== 'usuario' || dueloTerminado || respuestaSeleccionada || cargandoPreguntas) return;
    
    setRespuestaSeleccionada(true);
    const pregunta = preguntas[preguntaIndex];
    if (!pregunta) return;
    
    const esCorrecta = idx === pregunta.correcta;
    setMensaje(esCorrecta ? '✅ ¡Correcto! +1 punto' : '❌ Incorrecto');
    procesarRespuestaUsuario(esCorrecta);
  };

  // Timer
  useEffect(() => {
    let timer;
    if (!buscando && !dueloTerminado && estado === 'usuario' && tiempo > 0 && !respuestaSeleccionada && !cargandoPreguntas && preguntas.length > 0) {
      timer = setTimeout(() => setTiempo(tiempo - 1), 1000);
    } else if (tiempo === 0 && estado === 'usuario' && !dueloTerminado && !respuestaSeleccionada && !cargandoPreguntas) {
      setRespuestaSeleccionada(true);
      setMensaje('⏰ TIEMPO AGOTADO');
      procesarRespuestaUsuario(false);
    }
    return () => clearTimeout(timer);
  }, [tiempo, estado, dueloTerminado, respuestaSeleccionada, buscando, cargandoPreguntas, preguntas.length]);

  // Pantalla de carga
  if (buscando || cargandoPreguntas) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-pulse mb-4">
            <span className="material-symbols-outlined text-6xl text-red-500">search</span>
          </div>
          <p className="text-2xl font-bold">Buscando rival...</p>
          <p className="text-sm text-gray-500 mt-2">Fase: {fase === 'clasificacion' ? 'Fase de clasificación' : fase === 'grupos' ? 'Fase de grupos' : fase}</p>
          <p className="text-xs text-gray-400 mt-1">📚 Preguntas del CNPCyF</p>
          <button onClick={onVolver} className="mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg">Cancelar</button>
        </div>
      </div>
    );
  }

  if (dueloTerminado) return null;

  const pregunta = preguntas[preguntaIndex];
  if (!pregunta && !dueloTerminado) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-xl text-red-500">Error: Pregunta no encontrada</p>
          <button onClick={onVolver} className="mt-4 bg-gray-500 text-white px-6 py-3 rounded-lg">Volver</button>
        </div>
      </div>
    );
  }

  const progresoMETA = (puntajeParcial / META_PUNTOS) * 100;

  // Determinar el texto de la fase
  const getFaseTexto = () => {
    switch(fase) {
      case 'clasificacion': return 'Fase de clasificación';
      case 'grupos': return 'Fase de grupos';
      case 'eliminatorias': return 'Fase eliminatorias';
      case 'final': return 'Final';
      default: return fase;
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
                <p className="text-3xl font-bold text-blue-600">{puntajeParcial}</p>
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
                <p className="text-3xl font-bold text-gray-500">{puntosRival}</p>
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
              <span>{puntajeParcial} puntos obtenidos</span>
              <span>{Math.max(0, META_PUNTOS - puntajeParcial)} puntos restantes</span>
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