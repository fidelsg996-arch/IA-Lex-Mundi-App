// src/modules/Torneos/phases/EliminatoriasPhase.jsx
import React, { useState, useEffect } from 'react';
import { rivalesDisponibles } from '../utils/constantes';
import { seleccionarPreguntaPorDificultad, respuestaRivalInteligente } from '../utils/preguntasBanco';
import { useTimer } from '../hooks/useTimer';

const EliminatoriasPhase = ({ torneoActivo, usuario, clasificados, puntosGrupo, argumentosFavor, argumentosContra, onFinalizarTorneo }) => {
  const [faseActual, setFaseActual] = useState('octavos');
  const [partidosEliminatoria, setPartidosEliminatoria] = useState([]);
  const [partidoActual, setPartidoActual] = useState(null);
  const [vista, setVista] = useState('tabla');
  const [campeon, setCampeon] = useState(null);
  
  // Estado para el duelo
  const [dueloActivo, setDueloActivo] = useState(null);
  const [turnoActual, setTurnoActual] = useState('usuario');
  const [puntajeUsuario, setPuntajeUsuario] = useState(0);
  const [puntajeRival, setPuntajeRival] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mensajeDuelo, setMensajeDuelo] = useState('');
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [ganadorDuelo, setGanadorDuelo] = useState(null);
  const [esperandoCambioTurno, setEsperandoCambioTurno] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(null);
  
  const { tiempoRestante, iniciar, detener, reiniciar } = useTimer(20, () => {
    if (!dueloTerminado && !esperandoCambioTurno) {
      setMensajeDuelo(`⏰ Tiempo agotado! ${turnoActual === "usuario" ? "Pierdes turno" : "Rival pierde turno"}`);
      cambiarTurno();
    }
  });

  useEffect(() => {
    if (clasificados && clasificados.length >= 2) {
      inicializarEliminatorias();
    }
  }, [clasificados]);

  const inicializarEliminatorias = () => {
    const primero = clasificados[0];
    const segundo = clasificados[1];
    
    const oponentesExtra = rivalesDisponibles.slice(2, 8);
    
    const octavosPartidos = [
      { id: 1, ronda: "octavos", participante1: primero, participante2: oponentesExtra[0], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
      { id: 2, ronda: "octavos", participante1: oponentesExtra[1], participante2: oponentesExtra[2], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
      { id: 3, ronda: "octavos", participante1: oponentesExtra[3], participante2: oponentesExtra[4], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
      { id: 4, ronda: "octavos", participante1: segundo, participante2: oponentesExtra[5], realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
    ];
    
    setPartidosEliminatoria(octavosPartidos);
    setFaseActual("octavos");
    
    const partidoUsuario = octavosPartidos.find(p => 
      p.participante1?.esUsuario || p.participante2?.esUsuario
    );
    setPartidoActual(partidoUsuario);
  };

  const seleccionarPregunta = () => {
    const nuevaPregunta = seleccionarPreguntaPorDificultad();
    setPreguntaActual(nuevaPregunta);
    setRespuestaSeleccionada(null);
  };

  const cambiarTurno = () => {
    setEsperandoCambioTurno(true);
    detener();
    setTimeout(() => {
      setTurnoActual(prev => prev === "usuario" ? "rival" : "usuario");
      setRespuestaSeleccionada(null);
      setMensajeDuelo("");
      setEsperandoCambioTurno(false);
      seleccionarPregunta();
      reiniciar();
    }, 1500);
  };

  const terminarDuelo = (ganador) => {
    setDueloTerminado(true);
    setGanadorDuelo(ganador);
    detener();
    
    const puntosUsuarioFinal = puntajeUsuario;
    const puntosRivalFinal = puntajeRival;
    
    const partidosActualizados = partidosEliminatoria.map(p => {
      if (p.id === partidoActual.id) {
        const ganadorObjeto = ganador === "usuario" ? 
          (p.participante1?.esUsuario ? p.participante1 : p.participante2) : 
          (p.participante1?.esUsuario ? p.participante2 : p.participante1);
        return { 
          ...p, 
          realizado: true, 
          ganador: ganadorObjeto,
          puntos1: p.participante1?.esUsuario ? puntosUsuarioFinal : puntosRivalFinal,
          puntos2: p.participante1?.esUsuario ? puntosRivalFinal : puntosUsuarioFinal
        };
      }
      return p;
    });
    setPartidosEliminatoria(partidosActualizados);
    
    const partidosRondaActual = partidosActualizados.filter(p => p.ronda === faseActual);
    const todosRealizados = partidosRondaActual.every(p => p.realizado);
    
    if (todosRealizados) {
      avanzarASiguienteRonda(partidosActualizados);
    } else {
      const siguientePartido = partidosActualizados.find(p => p.ronda === faseActual && !p.realizado);
      if (siguientePartido) {
        setPartidoActual(siguientePartido);
        setVista('tabla');
        setDueloActivo(null);
      }
    }
  };

  const responderPregunta = (indice) => {
    if (respuestaSeleccionada !== null || dueloTerminado || esperandoCambioTurno || !preguntaActual) return;
    
    setRespuestaSeleccionada(indice);
    const esCorrecta = indice === preguntaActual.correcta;
    
    if (turnoActual === "usuario") {
      if (esCorrecta) {
        const nuevoPuntaje = puntajeUsuario + 10;
        setPuntajeUsuario(nuevoPuntaje);
        setMensajeDuelo(`✅ Correcto! +10 puntos (${nuevoPuntaje}/100) - ${preguntaActual.area}`);
        if (nuevoPuntaje >= 100) {
          terminarDuelo("usuario");
        } else {
          cambiarTurno();
        }
      } else {
        setMensajeDuelo(`❌ Incorrecto. Respuesta correcta: ${preguntaActual.opciones[preguntaActual.correcta]}`);
        cambiarTurno();
      }
    }
  };

  const respuestaRival = () => {
    if (turnoActual !== "rival" || dueloTerminado || respuestaSeleccionada !== null || esperandoCambioTurno || !preguntaActual) return;
    
    const indiceRespuesta = respuestaRivalInteligente(preguntaActual);
    setRespuestaSeleccionada(indiceRespuesta);
    
    const acierta = indiceRespuesta === preguntaActual.correcta;
    if (acierta) {
      const nuevoPuntaje = puntajeRival + 10;
      setPuntajeRival(nuevoPuntaje);
      setMensajeDuelo(`⚖️ Rival acertó! +10 puntos (${nuevoPuntaje}/100) - ${preguntaActual.area}`);
      if (nuevoPuntaje >= 100) {
        terminarDuelo("rival");
      } else {
        cambiarTurno();
      }
    } else {
      setMensajeDuelo(`📜 Rival falló. Respuesta correcta: ${preguntaActual.opciones[preguntaActual.correcta]}`);
      cambiarTurno();
    }
  };

  useEffect(() => {
    if (turnoActual === "rival" && !dueloTerminado && !respuestaSeleccionada && !esperandoCambioTurno && preguntaActual) {
      const delay = Math.random() * 15000 + 4000;
      const timeout = setTimeout(respuestaRival, delay);
      return () => clearTimeout(timeout);
    }
  }, [turnoActual, dueloTerminado, respuestaSeleccionada, preguntaActual]);

  const iniciarDueloEliminatoria = (partido) => {
    const esUsuario = partido.participante1?.esUsuario || partido.participante2?.esUsuario;
    if (esUsuario) {
      const rival = partido.participante1?.esUsuario ? partido.participante2 : partido.participante1;
      setDueloActivo(rival);
      setPuntajeUsuario(0);
      setPuntajeRival(0);
      setTurnoActual("usuario");
      setDueloTerminado(false);
      setGanadorDuelo(null);
      setRespuestaSeleccionada(null);
      setMensajeDuelo("");
      setEsperandoCambioTurno(false);
      seleccionarPregunta();
      reiniciar();
      setVista('duelo');
    } else {
      simularDueloEliminatoria(partido);
    }
  };

  const simularDueloEliminatoria = (partido) => {
    const fuerza1 = partido.participante1?.fuerza || 50;
    const fuerza2 = partido.participante2?.fuerza || 50;
    const total = fuerza1 + fuerza2;
    const probabilidadGana1 = fuerza1 / total;
    const random = Math.random();
    
    let puntos1, puntos2;
    if (random < probabilidadGana1) {
      puntos1 = Math.floor(Math.random() * 90) + 10;
      puntos2 = Math.floor(Math.random() * puntos1);
    } else {
      puntos2 = Math.floor(Math.random() * 90) + 10;
      puntos1 = Math.floor(Math.random() * puntos2);
    }
    
    const partidosActualizados = partidosEliminatoria.map(p => {
      if (p.id === partido.id) {
        const ganador = puntos1 > puntos2 ? p.participante1 : p.participante2;
        return { ...p, realizado: true, ganador, puntos1, puntos2 };
      }
      return p;
    });
    setPartidosEliminatoria(partidosActualizados);
    
    const partidosRondaActual = partidosActualizados.filter(p => p.ronda === faseActual);
    const todosRealizados = partidosRondaActual.every(p => p.realizado);
    
    if (todosRealizados) {
      avanzarASiguienteRonda(partidosActualizados);
    } else {
      const siguientePartido = partidosActualizados.find(p => p.ronda === faseActual && !p.realizado);
      if (siguientePartido) setPartidoActual(siguientePartido);
    }
  };

  const avanzarASiguienteRonda = (partidosActualizados) => {
    const ganadores = partidosActualizados
      .filter(p => p.ronda === faseActual && p.realizado)
      .map(p => p.ganador);
    
    let siguienteRonda = "";
    let siguientesPartidos = [];
    
    switch(faseActual) {
      case "octavos":
        siguienteRonda = "cuartos";
        if (ganadores.length >= 4) {
          siguientesPartidos = [
            { id: Date.now() + 1, ronda: "cuartos", participante1: ganadores[0], participante2: ganadores[1], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
            { id: Date.now() + 2, ronda: "cuartos", participante1: ganadores[2], participante2: ganadores[3], realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
          ];
        }
        break;
      case "cuartos":
        siguienteRonda = "semifinal";
        if (ganadores.length >= 2) {
          siguientesPartidos = [
            { id: Date.now() + 1, ronda: "semifinal", participante1: ganadores[0], participante2: ganadores[1], realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
          ];
        }
        break;
      case "semifinal":
        siguienteRonda = "final";
        if (ganadores.length >= 1) {
          siguientesPartidos = [
            { id: Date.now() + 1, ronda: "final", participante1: ganadores[0], participante2: null, realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
          ];
        }
        break;
      case "final":
        if (ganadores.length >= 1) {
          setCampeon(ganadores[0]);
          onFinalizarTorneo(ganadores[0]);
          setVista('campeon');
        }
        return;
      default:
        break;
    }
    
    if (siguientesPartidos.length > 0) {
      const nuevosPartidos = [...partidosActualizados, ...siguientesPartidos];
      setPartidosEliminatoria(nuevosPartidos);
      setFaseActual(siguienteRonda);
      
      const partidoUsuario = nuevosPartidos.find(p => 
        p.participante1?.esUsuario || p.participante2?.esUsuario
      );
      setPartidoActual(partidoUsuario || siguientesPartidos[0]);
      setVista('tabla');
    }
  };

  const obtenerTituloRonda = () => {
    switch(faseActual) {
      case "octavos": return "OCTAVOS DE FINAL";
      case "cuartos": return "CUARTOS DE FINAL";
      case "semifinal": return "SEMIFINAL";
      case "final": return "FINAL";
      default: return "ELIMINATORIAS";
    }
  };

  if (vista === 'campeon' && campeon) {
    const premioMonto = torneoActivo?.premio?.monto || 0;
    const premioDescripcion = torneoActivo?.premio?.descripcion || "";
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-12 text-center max-w-2xl">
          <div className="text-8xl mb-4">🏆⚖️🏆</div>
          <h1 className="text-4xl font-bold text-amber-600 mt-2">¡CAMPEÓN DEL TORNEO!</h1>
          <div className="my-6">
            <img src={campeon.avatar} className="w-40 h-40 rounded-full mx-auto object-cover border-8 border-amber-400" alt="" />
            <h2 className="text-3xl font-bold mt-4">{campeon.nombre}</h2>
            <p className="text-lg text-gray-600">{campeon.especialidad || "General"}</p>
          </div>
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 my-4">
            <p className="text-xl font-bold text-amber-700">¡FELICIDADES!</p>
            <p className="text-gray-700 mt-2">Has demostrado tu excelencia en el litigio jurídico y te coronas como el gran campeón del torneo.</p>
          </div>
          {premioMonto > 0 && (
            <div className="bg-green-100 rounded-xl p-4 my-4">
              <p className="text-2xl font-bold text-green-700">💰 ${premioMonto.toLocaleString()} MXN</p>
              <p className="text-sm text-green-600">Premio en efectivo</p>
            </div>
          )}
          {premioDescripcion && (
            <div className="bg-blue-100 rounded-xl p-4 my-4">
              <p className="text-xl font-bold text-blue-700">📚 {premioDescripcion}</p>
              <p className="text-sm text-blue-600">Premio académico</p>
            </div>
          )}
          <button onClick={() => window.location.reload()} className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition">
            Salir
          </button>
        </div>
      </div>
    );
  }

  if (vista === 'duelo' && dueloActivo && preguntaActual && !dueloTerminado) {
    const nombreRonda = obtenerTituloRonda();
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-600 text-white p-4 rounded-t-xl text-center">
            <h2 className="text-xl font-bold">🏆 {nombreRonda} 🏆</h2>
            <p className="text-sm">Torneo: {torneoActivo?.nombre}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 items-center mt-6">
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={usuario?.avatar} className="w-24 h-24 rounded-full mx-auto object-cover" />
              <h3 className="font-bold mt-2">{usuario?.nombre}</h3>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${puntajeUsuario}%` }}></div>
                </div>
                <p className="font-bold mt-1">{puntajeUsuario}/100</p>
              </div>
              {turnoActual === "usuario" && <div className="mt-2 text-yellow-600 animate-pulse">Tu turno ⏱️ {tiempoRestante}s</div>}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">VS</div>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={dueloActivo.avatar} className="w-24 h-24 rounded-full mx-auto object-cover" />
              <h3 className="font-bold mt-2">{dueloActivo.nombre}</h3>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${puntajeRival}%` }}></div>
                </div>
                <p className="font-bold mt-1">{puntajeRival}/100</p>
              </div>
              {turnoActual === "rival" && <div className="mt-2 text-gray-600">Turno del opositor</div>}
            </div>
          </div>
          <div className="bg-white mt-6 p-6 rounded-xl shadow">
            <div className="mb-2 text-sm text-gray-500">Área: {preguntaActual.area}</div>
            <h3 className="font-semibold mb-4">{preguntaActual.pregunta}</h3>
            <div className="grid gap-2">
              {preguntaActual.opciones.map((op, idx) => (
                <button
                  key={idx}
                  onClick={() => responderPregunta(idx)}
                  disabled={respuestaSeleccionada !== null || turnoActual !== "usuario"}
                  className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {String.fromCharCode(65 + idx)}. {op}
                </button>
              ))}
            </div>
            {mensajeDuelo && (
              <div className={`mt-4 p-2 rounded text-center ${mensajeDuelo.includes("Correcto") ? "bg-green-100" : "bg-red-100"}`}>
                {mensajeDuelo}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'duelo' && dueloTerminado) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-12 text-center max-w-md">
          <h2 className="text-3xl font-bold text-white">{ganadorDuelo === "usuario" ? usuario?.nombre : dueloActivo?.nombre}</h2>
          <p className="text-white text-xl mt-2">¡GANADOR Y AVANZA A LA SIGUIENTE RONDA!</p>
          <button onClick={() => setVista('tabla')} className="mt-6 bg-white text-gray-800 px-8 py-3 rounded-full font-bold">
            Continuar
          </button>
        </div>
      </div>
    );
  }

  const octavos = partidosEliminatoria.filter(p => p.ronda === "octavos");
  const cuartos = partidosEliminatoria.filter(p => p.ronda === "cuartos");
  const semifinal = partidosEliminatoria.filter(p => p.ronda === "semifinal");
  const final = partidosEliminatoria.filter(p => p.ronda === "final")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white text-center">
            <h1 className="text-3xl font-bold">🏆 {obtenerTituloRonda()} 🏆</h1>
            <p className="text-sm mt-2">Torneo: {torneoActivo?.nombre}</p>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-[250px] bg-gray-50 rounded-xl p-4">
                <h2 className="text-xl font-bold text-center mb-4 text-blue-600">🏛️ LLAVE A</h2>
                <div className="space-y-4">
                  {octavos.slice(0, 2).map((partido, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <img src={partido.participante1?.avatar} className="w-6 h-6 rounded-full object-cover" />
                          <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante1?.nombre?.substring(0, 12)}
                          </span>
                        </div>
                        <span className="font-bold text-xs">{partido.realizado ? `${partido.puntos1}-${partido.puntos2}` : "vs"}</span>
                        <div className="flex items-center gap-1">
                          <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante2?.nombre?.substring(0, 12)}
                          </span>
                          <img src={partido.participante2?.avatar} className="w-6 h-6 rounded-full object-cover" />
                        </div>
                      </div>
                      {!partido.realizado && partidoActual?.id === partido.id && (
                        <button onClick={() => iniciarDueloEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">
                          Jugar Duelo
                        </button>
                      )}
                      {partido.realizado && partido.ganador && (
                        <div className="text-xs text-green-600 text-center mt-1">Ganador: {partido.ganador.nombre?.substring(0, 15)}</div>
                      )}
                    </div>
                  ))}
                  {cuartos.slice(0, 1).map((partido, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-2 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <img src={partido.participante1?.avatar} className="w-6 h-6 rounded-full object-cover" />
                          <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante1?.nombre?.substring(0, 12) || "---"}
                          </span>
                        </div>
                        <span className="font-bold text-xs">{partido.realizado ? `${partido.puntos1}-${partido.puntos2}` : "vs"}</span>
                        <div className="flex items-center gap-1">
                          <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante2?.nombre?.substring(0, 12) || "---"}
                          </span>
                          <img src={partido.participante2?.avatar} className="w-6 h-6 rounded-full object-cover" />
                        </div>
                      </div>
                      {!partido.realizado && partidoActual?.id === partido.id && (
                        <button onClick={() => iniciarDueloEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">
                          Jugar Duelo
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center px-2">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-center text-xs text-gray-500 font-bold">FINAL</div>
                <div className="w-px h-16 bg-gradient-to-b from-amber-500 to-transparent mx-auto my-2"></div>
                {final && final.realizado && final.ganador && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">CAMPEÓN</p>
                    <p className="font-bold text-amber-600 text-sm">{final.ganador.nombre?.substring(0, 15)}</p>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-[250px] bg-gray-50 rounded-xl p-4">
                <h2 className="text-xl font-bold text-center mb-4 text-red-600">🏛️ LLAVE B</h2>
                <div className="space-y-4">
                  {octavos.slice(2, 4).map((partido, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <img src={partido.participante1?.avatar} className="w-6 h-6 rounded-full object-cover" />
                          <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante1?.nombre?.substring(0, 12)}
                          </span>
                        </div>
                        <span className="font-bold text-xs">{partido.realizado ? `${partido.puntos1}-${partido.puntos2}` : "vs"}</span>
                        <div className="flex items-center gap-1">
                          <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante2?.nombre?.substring(0, 12)}
                          </span>
                          <img src={partido.participante2?.avatar} className="w-6 h-6 rounded-full object-cover" />
                        </div>
                      </div>
                      {!partido.realizado && partidoActual?.id === partido.id && (
                        <button onClick={() => iniciarDueloEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">
                          Jugar Duelo
                        </button>
                      )}
                    </div>
                  ))}
                  {cuartos.slice(1, 2).map((partido, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-2 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <img src={partido.participante1?.avatar} className="w-6 h-6 rounded-full object-cover" />
                          <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante1?.nombre?.substring(0, 12) || "---"}
                          </span>
                        </div>
                        <span className="font-bold text-xs">{partido.realizado ? `${partido.puntos1}-${partido.puntos2}` : "vs"}</span>
                        <div className="flex items-center gap-1">
                          <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>
                            {partido.participante2?.nombre?.substring(0, 12) || "---"}
                          </span>
                          <img src={partido.participante2?.avatar} className="w-6 h-6 rounded-full object-cover" />
                        </div>
                      </div>
                      {!partido.realizado && partidoActual?.id === partido.id && (
                        <button onClick={() => iniciarDueloEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">
                          Jugar Duelo
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {(semifinal.length > 0 || final) && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-center gap-8 flex-wrap">
                  {semifinal.map((partido, idx) => (
                    <div key={idx} className="flex-1 max-w-xs">
                      <h3 className="text-sm font-semibold text-gray-500 text-center mb-2">SEMIFINAL</h3>
                      <div className="bg-white border rounded-lg p-2">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <img src={partido.participante1?.avatar} className="w-6 h-6 rounded-full object-cover" />
                            <span>{partido.participante1?.nombre?.substring(0, 12)}</span>
                          </div>
                          <span className="font-bold text-xs">{partido.realizado ? `${partido.puntos1}-${partido.puntos2}` : "vs"}</span>
                          <div className="flex items-center gap-1">
                            <span>{partido.participante2?.nombre?.substring(0, 12)}</span>
                            <img src={partido.participante2?.avatar} className="w-6 h-6 rounded-full object-cover" />
                          </div>
                        </div>
                        {!partido.realizado && partidoActual?.id === partido.id && (
                          <button onClick={() => iniciarDueloEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded">
                            Jugar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {final && (
                    <div className="flex-1 max-w-xs">
                      <h3 className="text-sm font-semibold text-amber-600 text-center mb-2">🏆 GRAN FINAL 🏆</h3>
                      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <img src={final.participante1?.avatar} className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-bold">{final.participante1?.nombre?.substring(0, 15)}</span>
                          </div>
                          <span className="font-bold text-lg">{final.realizado ? `${final.puntos1}-${final.puntos2}` : "VS"}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{final.participante2?.nombre?.substring(0, 15) || "---"}</span>
                            <img src={final.participante2?.avatar} className="w-8 h-8 rounded-full object-cover" />
                          </div>
                        </div>
                        {!final.realizado && partidoActual?.id === final.id && (
                          <button onClick={() => iniciarDueloEliminatoria(final)} className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-bold hover:from-amber-600 hover:to-orange-600 transition">
                            JUGAR FINAL
                          </button>
                        )}
                        {final.realizado && final.ganador && (
                          <div className="text-center mt-2">
                            <div className="text-xs text-green-600 font-bold">¡CAMPEÓN!</div>
                            <div className="font-bold text-amber-700 text-lg">{final.ganador.nombre}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>🔹 Los partidos en color son tus próximos duelos</p>
              <p>✅ Gana todos los duelos para avanzar a la siguiente ronda y convertirte en CAMPEÓN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminatoriasPhase;