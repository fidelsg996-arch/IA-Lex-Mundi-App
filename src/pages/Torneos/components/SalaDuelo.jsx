import { useState, useEffect } from 'react';
import { obtenerPreguntasParaFase as obtenerPreguntasFirestore } from '../data/preguntasFirestore';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';

const SalaDuelo = ({ torneo, participante, fase, onCompetenciaFinalizada, onVolver }) => {
  const TOTAL_PREGUNTAS = 15;
  const META_PUNTOS = 10;
  const TIEMPO_POR_PREGUNTA = 20;
  const PRECIO_REINGRESO = 30;

  const { user, isAdmin } = useAuth();
  const { saldo, realizarPago } = useBilletera();
  
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
  const [cargandoPreguntas, setCargandoPreguntas] = useState(true);
  
  const [mostrarModalReingreso, setMostrarModalReingreso] = useState(false);
  const [reingresosUsados, setReingresosUsados] = useState(0);
  const [maxReingresos] = useState(3);

  // Cargar preguntas desde Firestore
  useEffect(() => {
    const cargarPreguntas = async () => {
      setCargandoPreguntas(true);
      
      let nombreFase = 'clasificacion';
      if (fase === 'grupos') nombreFase = 'grupos';
      else if (fase === 'eliminatorias') nombreFase = 'eliminatorias';
      else if (fase === 'final') nombreFase = 'final';
      
      console.log(`📚 Cargando preguntas para fase: ${nombreFase} desde Firestore`);
      
      try {
        let preguntasObtenidas = await obtenerPreguntasFirestore(nombreFase, TOTAL_PREGUNTAS);
        
        // Si no hay preguntas en Firestore, usar preguntas locales de respaldo
        if (!preguntasObtenidas || preguntasObtenidas.length === 0) {
          console.warn('⚠️ No hay preguntas en Firestore, usando preguntas locales');
          preguntasObtenidas = obtenerPreguntasLocales(nombreFase, TOTAL_PREGUNTAS);
        }
        
        // Validar que tengamos suficientes preguntas
        if (preguntasObtenidas.length < TOTAL_PREGUNTAS) {
          console.warn(`⚠️ Solo se obtuvieron ${preguntasObtenidas.length} preguntas. Completando con duplicados...`);
          const originales = [...preguntasObtenidas];
          while (preguntasObtenidas.length < TOTAL_PREGUNTAS) {
            preguntasObtenidas.push({ ...originales[preguntasObtenidas.length % originales.length] });
          }
        }
        
        setPreguntas(preguntasObtenidas);
      } catch (error) {
        console.error('Error cargando preguntas:', error);
        const preguntasLocales = obtenerPreguntasLocales(nombreFase, TOTAL_PREGUNTAS);
        setPreguntas(preguntasLocales);
      } finally {
        setCargandoPreguntas(false);
      }
    };
    
    cargarPreguntas();
    
    setTimeout(() => {
      setBuscando(false);
      setRival({ nombre: 'Carlos Méndez' });
      setMensaje('¡Rival encontrado! Responde la pregunta');
    }, 2000);
  }, [fase]);

  // Preguntas locales de respaldo (en caso de que Firestore esté vacío)
  const obtenerPreguntasLocales = (fase, cantidad) => {
    const preguntasLocales = {
      clasificacion: [
        { id: 1, texto: '¿Qué es el derecho civil?', opciones: ['Derecho público', 'Regula relaciones privadas', 'Derecho penal', 'Derecho laboral'], correcta: 1 },
        { id: 2, texto: '¿Qué es una demanda?', opciones: ['Escrito inicial', 'Sentencia', 'Recurso', 'Prueba'], correcta: 0 },
        { id: 3, texto: '¿Qué es un contrato?', opciones: ['Acuerdo de voluntades', 'Ley', 'Decreto', 'Reglamento'], correcta: 0 },
        { id: 4, texto: '¿Qué es el derecho penal?', opciones: ['Regula delitos y penas', 'Regula contratos', 'Regula familia', 'Regula sucesiones'], correcta: 0 },
        { id: 5, texto: '¿Qué es la usucapión?', opciones: ['Pérdida de un derecho', 'Adquisición por posesión', 'Tipo de contrato', 'Sentencia'], correcta: 1 },
        { id: 6, texto: '¿Qué es un juzgado?', opciones: ['Órgano jurisdiccional', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 7, texto: '¿Qué es un abogado?', opciones: ['Profesional del derecho', 'Juez', 'Fiscal', 'Notario'], correcta: 0 },
        { id: 8, texto: '¿Qué es un testigo?', opciones: ['Persona que declara sobre hechos', 'Juez', 'Abogado', 'Fiscal'], correcta: 0 },
        { id: 9, texto: '¿Qué es una ley?', opciones: ['Norma jurídica', 'Sentencia', 'Demanda', 'Contrato'], correcta: 0 },
        { id: 10, texto: '¿Qué es una sentencia?', opciones: ['Resolución judicial', 'Demanda', 'Contrato', 'Apelación'], correcta: 0 },
        { id: 11, texto: '¿Qué es un recurso?', opciones: ['Impugnar decisión', 'Demanda', 'Prueba', 'Sentencia'], correcta: 0 },
        { id: 12, texto: '¿Qué es una prueba?', opciones: ['Elemento para demostrar un hecho', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 13, texto: '¿Qué es la jurisdicción?', opciones: ['Facultad de juzgar', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 14, texto: '¿Qué es una audiencia?', opciones: ['Acto judicial público', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 15, texto: '¿Qué es el derecho laboral?', opciones: ['Relaciones trabajador-empresario', 'Derecho penal', 'Derecho civil', 'Derecho fiscal'], correcta: 0 }
      ],
      grupos: [
        { id: 101, texto: '¿Qué es la prescripción?', opciones: ['Extinción de derechos por tiempo', 'Nuevo contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 102, texto: '¿Qué es la conciliación?', opciones: ['Acuerdo entre partes', 'Juicio', 'Apelación', 'Demanda'], correcta: 0 },
        { id: 103, texto: '¿Qué es un recurso de apelación?', opciones: ['Impugnar sentencia', 'Iniciar demanda', 'Firmar contrato', 'Pagar multa'], correcta: 0 },
        { id: 104, texto: '¿Qué es la jurisprudencia?', opciones: ['Interpretación reiterada de leyes', 'Ley nueva', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 105, texto: '¿Qué es la doctrina?', opciones: ['Opiniones de juristas', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0 },
        { id: 106, texto: '¿Qué es un embargo?', opciones: ['Aseguramiento de bienes', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 107, texto: '¿Qué es una garantía?', opciones: ['Protección de un derecho', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 108, texto: '¿Qué es una hipoteca?', opciones: ['Garantía inmobiliaria', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 109, texto: '¿Qué es un usufructo?', opciones: ['Derecho de uso y disfrute', 'Propiedad', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 110, texto: '¿Qué es una servidumbre?', opciones: ['Limitación a la propiedad', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 111, texto: '¿Qué es una sucesión?', opciones: ['Transmisión de bienes por herencia', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 112, texto: '¿Qué es un testamento?', opciones: ['Voluntad de disposición de bienes', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 113, texto: '¿Qué es una denuncia?', opciones: ['Noticia de un delito', 'Demanda', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 114, texto: '¿Qué es una querella?', opciones: ['Acusación particular', 'Denuncia', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 115, texto: '¿Qué es la flagrancia?', opciones: ['Delito en el momento de cometerse', 'Prueba', 'Testimonio', 'Sentencia'], correcta: 0 }
      ],
      eliminatorias: [
        { id: 201, texto: '¿Qué es el amparo?', opciones: ['Juicio de garantías', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
        { id: 202, texto: '¿Qué es la equidad?', opciones: ['Justicia natural', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0 },
        { id: 203, texto: '¿Qué es el derecho fiscal?', opciones: ['Regula impuestos', 'Derecho penal', 'Derecho civil', 'Derecho laboral'], correcta: 0 },
        { id: 204, texto: '¿Qué es la plusvalía?', opciones: ['Ganancia por venta de bienes', 'Impuesto', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 205, texto: '¿Qué es el IVA?', opciones: ['Impuesto al valor agregado', 'Impuesto a la renta', 'Impuesto predial', 'Impuesto vehicular'], correcta: 0 },
        { id: 206, texto: '¿Qué es el ISR?', opciones: ['Impuesto sobre la renta', 'IVA', 'IEPS', 'ISAN'], correcta: 0 },
        { id: 207, texto: '¿Qué es un sindicato?', opciones: ['Asociación de trabajadores', 'Empresa', 'Gobierno', 'Juzgado'], correcta: 0 },
        { id: 208, texto: '¿Qué es una huelga?', opciones: ['Paro laboral', 'Demanda', 'Contrato', 'Sentencia'], correcta: 0 },
        { id: 209, texto: '¿Qué es la indemnización?', opciones: ['Compensación por daño', 'Multa', 'Impuesto', 'Contrato'], correcta: 0 },
        { id: 210, texto: '¿Qué es la liquidación?', opciones: ['Finiquito laboral', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 }
      ],
      final: [
        { id: 301, texto: '¿Qué es el debido proceso?', opciones: ['Garantía constitucional', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 302, texto: '¿Qué es la garantía de audiencia?', opciones: ['Derecho a ser escuchado', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 303, texto: '¿Qué es el principio de legalidad?', opciones: ['Nadie está obligado a lo que la ley no manda', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 304, texto: '¿Qué es la presunción de inocencia?', opciones: ['Derecho a ser considerado inocente hasta sentencia firme', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 305, texto: '¿Qué es el principio de irretroactividad?', opciones: ['Las leyes no aplican al pasado', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 306, texto: '¿Qué es la cosa juzgada?', opciones: ['Sentencia firme que no puede ser impugnada', 'Ley', 'Contrato', 'Demanda'], correcta: 0 },
        { id: 307, texto: '¿Qué es el principio de proporcionalidad?', opciones: ['Las sanciones deben ser proporcionales a la falta', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 308, texto: '¿Qué es el control difuso?', opciones: ['Jueces pueden inaplicar leyes inconstitucionales', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 309, texto: '¿Qué es la acción de inconstitucionalidad?', opciones: ['Medio para impugnar leyes', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 310, texto: '¿Qué es la controversia constitucional?', opciones: ['Conflicto entre entes públicos', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 311, texto: '¿Qué es el principio de supremacía constitucional?', opciones: ['La Constitución está por encima de cualquier otra norma', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 312, texto: '¿Qué es la interpretación conforme?', opciones: ['Interpretar leyes de acuerdo con la Constitución', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 313, texto: '¿Qué es el estado de excepción?', opciones: ['Situación extraordinaria que permite suspender garantías', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 314, texto: '¿Qué es el principio de división de poderes?', opciones: ['Separación de poderes ejecutivo, legislativo y judicial', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
        { id: 315, texto: '¿Qué es el juicio de amparo?', opciones: ['Medio de control constitucional', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 }
      ]
    };
    
    const banco = preguntasLocales[fase] || preguntasLocales.clasificacion;
    const mezcladas = [...banco].sort(() => Math.random() - 0.5);
    return mezcladas.slice(0, cantidad);
  };

  useEffect(() => {
    let timer;
    if (!buscando && !dueloTerminado && estado === 'usuario' && tiempo > 0 && !respuestaSeleccionada && !cargandoPreguntas) {
      timer = setTimeout(() => setTiempo(tiempo - 1), 1000);
    } else if (tiempo === 0 && estado === 'usuario' && !dueloTerminado && !respuestaSeleccionada && !cargandoPreguntas) {
      setRespuestaSeleccionada(true);
      setMensaje('⏰ TIEMPO AGOTADO - 0 puntos');
      procesarRespuestaUsuario(false);
    }
    return () => clearTimeout(timer);
  }, [tiempo, estado, dueloTerminado, respuestaSeleccionada, buscando, cargandoPreguntas]);

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

  const procesarReingreso = async () => {
    if (reingresosUsados >= maxReingresos) {
      alert('❌ Ya no puedes reingresar más veces en este torneo');
      setMostrarModalReingreso(false);
      onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
      return;
    }

    if (reingresosGratis) {
      setReingresosUsados(reingresosUsados + 1);
      reiniciarDuelo();
      setMostrarModalReingreso(false);
      alert('✅ Reingreso gratis por tu suscripción');
    } else if (saldo >= PRECIO_REINGRESO) {
      const exito = await realizarPago(PRECIO_REINGRESO, `Reingreso torneo: ${torneo?.titulo}`);
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
    if (estado !== 'usuario' || dueloTerminado || respuestaSeleccionada || cargandoPreguntas) return;
    
    setRespuestaSeleccionada(true);
    const pregunta = preguntas[preguntaIndex];
    if (!pregunta) return;
    const esCorrecta = idx === pregunta.correcta;
    setMensaje(esCorrecta ? '✅ ¡Correcto! +1 punto' : '❌ Incorrecto');
    procesarRespuestaUsuario(esCorrecta);
  };

  if (buscando || cargandoPreguntas) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-pulse mb-4">
            <span className="material-symbols-outlined text-6xl text-red-500">search</span>
          </div>
          <p className="text-2xl font-bold">{cargandoPreguntas ? 'Cargando preguntas...' : 'Buscando rival...'}</p>
          <button onClick={onVolver} className="mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg text-lg">Cancelar</button>
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
          <p className="text-xl text-red-500">Error: Pregunta no encontrada</p>
          <button onClick={onVolver} className="mt-4 bg-gray-500 text-white px-6 py-3 rounded-lg text-lg">Volver</button>
        </div>
      </div>
    );
  }

  const progresoMETA = (puntuacion / META_PUNTOS) * 100;

  // Modal de reingreso
  if (mostrarModalReingreso) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold mb-2">¡Has perdido!</h2>
          <p className="text-lg text-gray-600 mb-4">Tu oponente te ha superado en esta ronda.</p>
          
          {reingresosUsados < maxReingresos ? (
            <>
              <div className="bg-amber-50 rounded-xl p-4 mb-4">
                <p className="font-bold text-amber-800 text-lg">🔄 ¿Quieres reingresar?</p>
                {reingresosGratis ? (
                  <p className="text-base text-green-600 mt-1">✅ Reingreso GRATIS por tu suscripción</p>
                ) : (
                  <p className="text-base text-gray-600 mt-1">Costo: ${PRECIO_REINGRESO} MXN</p>
                )}
                <p className="text-sm text-gray-500 mt-2">Te quedan {maxReingresos - reingresosUsados} reingresos</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => {
                  setMostrarModalReingreso(false);
                  onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
                }} className="flex-1 bg-gray-200 py-3 rounded-lg text-lg">Rendirme</button>
                <button onClick={procesarReingreso} className="flex-1 bg-amber-500 text-white py-3 rounded-lg text-lg font-bold">
                  {reingresosGratis ? 'Reingresar gratis' : `Pagar $${PRECIO_REINGRESO} y reingresar`}
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => {
              setMostrarModalReingreso(false);
              onCompetenciaFinalizada(puntuacion, false, rivalPuntuacion, rival?.nombre);
            }} className="w-full bg-red-500 text-white py-3 rounded-lg text-lg">Salir</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-5xl mx-auto py-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-5 text-white relative">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Fase {fase === 'clasificacion' ? 'Clasificación' : fase === 'grupos' ? 'Grupos' : fase === 'eliminatorias' ? 'Eliminatoria' : 'Final'}
            </h2>
            <p className="text-lg text-red-200 mt-1">{torneo?.titulo}</p>
          </div>
          <button onClick={onVolver} className="absolute right-4 top-4 text-white/80 hover:text-white text-base">Salir</button>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          {/* Marcador - Tú vs Rival */}
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-5xl text-white">person</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mt-3">{participante?.nombre || 'Tú'}</h3>
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
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-5xl text-white">person</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mt-3">{rival?.nombre || 'Oponente'}</h3>
              <div className="mt-2">
                <p className="text-3xl font-bold text-gray-500">{rivalPuntuacion}</p>
                <p className="text-sm text-gray-500">puntos</p>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso hacia la meta */}
          <div className="mt-6 bg-gray-50 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-gray-700">🎯 Meta: {META_PUNTOS} puntos</span>
              <span className="text-lg font-bold text-orange-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">timer</span> ⏱️ {tiempo}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full transition-all duration-300" style={{ width: `${Math.min(progresoMETA, 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{puntuacion} puntos obtenidos</span>
              <span>{Math.max(0, META_PUNTOS - puntuacion)} puntos restantes</span>
            </div>
          </div>
          
          {/* Estado del turno */}
          <div className="mt-4 bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-base text-gray-600">
              {estado === 'usuario' ? `🎤 Tu turno - Pregunta ${rondaActual}/${TOTAL_PREGUNTAS}` : 
               estado === 'rival' ? `🤔 ${rival?.nombre} está respondiendo...` : 
               `📊 Resultado de la ronda`}
            </p>
            {mensaje && <p className="text-sm font-medium mt-1">{mensaje}</p>}
          </div>
        </div>
        
        {/* Área de preguntas (solo visible en turno del usuario) */}
        {estado === 'usuario' && (
          <div className="border-t p-6 bg-gray-50">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
              <p className="text-xl font-medium text-gray-800">{pregunta.texto}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {pregunta.opciones.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => responder(idx)}
                  disabled={respuestaSeleccionada}
                  className="p-4 rounded-xl text-left bg-white border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50 text-base"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              ⏱️ Tienes {tiempo} segundos para responder
            </div>
          </div>
        )}
        
        {/* Footer con información */}
        <div className="bg-gray-100 px-6 py-4 text-sm text-gray-500 flex justify-between flex-wrap gap-2">
          <span className="flex items-center gap-1">⏱️ {TIEMPO_POR_PREGUNTA} segundos por pregunta</span>
          <span className="flex items-center gap-1">📋 {TOTAL_PREGUNTAS} preguntas</span>
          <span className="flex items-center gap-1">🎯 {META_PUNTOS} puntos = Victoria</span>
          <span className="flex items-center gap-1">⚔️ Eliminación directa</span>
          <span className="flex items-center gap-1">🔄 Reingreso disponible</span>
          <span className="flex items-center gap-1">📚 Nivel: {fase === 'clasificacion' ? 'Básico' : fase === 'grupos' ? 'Intermedio' : fase === 'eliminatorias' ? 'Avanzado' : 'Experto'}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaDuelo;