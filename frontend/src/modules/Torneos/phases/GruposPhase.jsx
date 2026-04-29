// src/modules/Torneos/phases/GruposPhase.jsx
import React, { useState, useEffect } from 'react';
import { litigantesInicialesGrupo } from '../utils/constantes';
import { seleccionarPreguntaAleatoria, respuestaRivalInteligente } from '../utils/preguntasBanco';
import { useTimer } from '../hooks/useTimer';

const GruposPhase = ({ torneoActivo, usuario, onFinalizarGrupos }) => {
  const [grupoActual, setGrupoActual] = useState(null);
  const [partidosGrupo, setPartidosGrupo] = useState([]);
  const [partidoActual, setPartidoActual] = useState(null);
  const [puntosGrupo, setPuntosGrupo] = useState(0);
  const [argumentosFavor, setArgumentosFavor] = useState(0);
  const [argumentosContra, setArgumentosContra] = useState(0);
  const [faseGrupoTerminada, setFaseGrupoTerminada] = useState(false);
  const [clasificados, setClasificados] = useState([]);
  const [vista, setVista] = useState('tabla');
  
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

  // Inicializar grupo
  useEffect(() => {
    const especialidadAleatoria = "Derecho Civil";
    
    const litigantes = [
      { ...usuario, especialidad: usuario?.especialidad || "General", fuerza: 90, esUsuario: true, puntosTabla: 0, ganados: 0, perdidos: 0, realizados: 0, argumentosFavor: 0, argumentosContra: 0, diferenciaArgumentos: 0 },
      ...litigantesInicialesGrupo.map(l => ({ ...l, esUsuario: false, puntosTabla: 0, ganados: 0, perdidos: 0, realizados: 0, argumentosFavor: 0, argumentosContra: 0, diferenciaArgumentos: 0 }))
    ];
    
    const grupo = {
      id: 1,
      nombre: "Grupo A",
      especialidad: especialidadAleatoria,
      litigantes
    };
    
    setGrupoActual(grupo);
    generarLitigiosGrupo(grupo);
  }, [usuario]);

  const generarLitigiosGrupo = (grupo) => {
    const litigios = [];
    const litigantes = grupo.litigantes;
    for (let i = 0; i < litigantes.length; i++) {
      for (let j = i + 1; j < litigantes.length; j++) {
        litigios.push({
          id: `${i}-${j}`,
          litigante1: litigantes[i],
          litigante2: litigantes[j],
          realizado: false,
          resultado: null,
          ganador: null,
          puntos1: 0,
          puntos2: 0
        });
      }
    }
    setPartidosGrupo(litigios);
    const primerPartido = litigios.find(p => p.litigante1.esUsuario || p.litigante2.esUsuario);
    setPartidoActual(primerPartido);
  };

  const seleccionarPregunta = () => {
    const nuevaPregunta = seleccionarPreguntaAleatoria(grupoActual?.especialidad);
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

  const terminarDuelo = (ganador, puntosUser, puntosRiv) => {
    setDueloTerminado(true);
    setGanadorDuelo(ganador);
    detener();
    
    const litigioActual = partidoActual;
    if (litigioActual.litigante1.esUsuario) {
      actualizarResultadoGrupo(litigioActual, puntosUser, puntosRiv);
    } else if (litigioActual.litigante2.esUsuario) {
      actualizarResultadoGrupo(litigioActual, puntosRiv, puntosUser);
    } else {
      actualizarResultadoGrupo(litigioActual, puntosUser, puntosRiv);
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
          terminarDuelo("usuario", nuevoPuntaje, puntajeRival);
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
        terminarDuelo("rival", puntajeUsuario, nuevoPuntaje);
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

  const iniciarDuelo = (partido) => {
    const esUsuario = partido.litigante1.esUsuario || partido.litigante2.esUsuario;
    if (esUsuario) {
      const rival = partido.litigante1.esUsuario ? partido.litigante2 : partido.litigante1;
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
      simularLitigioIA(partido);
    }
  };

  const simularLitigioIA = (partido) => {
    const fuerza1 = partido.litigante1.fuerza || 50;
    const fuerza2 = partido.litigante2.fuerza || 50;
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
    
    actualizarResultadoGrupo(partido, puntos1, puntos2);
  };

  const actualizarResultadoGrupo = (litigio, puntos1, puntos2) => {
    const litigiosActualizados = partidosGrupo.map(p => {
      if (p.id === litigio.id) {
        const ganadorObj = puntos1 > puntos2 ? p.litigante1 : p.litigante2;
        return { 
          ...p, 
          realizado: true, 
          resultado: `${ganadorObj.nombre} gana`,
          ganador: ganadorObj.nombre,
          puntos1, 
          puntos2 
        };
      }
      return p;
    });
    setPartidosGrupo(litigiosActualizados);
    
    const litigantesActualizados = grupoActual.litigantes.map(litigante => {
      const litigiosDelLitigante = litigiosActualizados.filter(p => 
        p.litigante1.nombre === litigante.nombre || p.litigante2.nombre === litigante.nombre
      );
      
      let puntos = 0;
      let argumentosFavorLit = 0;
      let argumentosContraLit = 0;
      let ganados = 0, perdidos = 0;
      let duelosJugados = 0;
      
      litigiosDelLitigante.forEach(p => {
        if (p.realizado) {
          duelosJugados++;
          const esLitigante1 = p.litigante1.nombre === litigante.nombre;
          const puntosLit = esLitigante1 ? p.puntos1 : p.puntos2;
          const puntosRival = esLitigante1 ? p.puntos2 : p.puntos1;
          
          argumentosFavorLit += puntosLit;
          argumentosContraLit += puntosRival;
          
          if (puntosLit > puntosRival) {
            puntos += 3;
            ganados++;
          } else {
            perdidos++;
          }
        }
      });
      
      return {
        ...litigante,
        puntosTabla: puntos,
        ganados,
        perdidos,
        realizados: duelosJugados,
        argumentosFavor: argumentosFavorLit,
        argumentosContra: argumentosContraLit,
        diferenciaArgumentos: argumentosFavorLit - argumentosContraLit
      };
    });
    
    setGrupoActual({ ...grupoActual, litigantes: litigantesActualizados });
    
    const puntosUser = litigantesActualizados.find(l => l.esUsuario)?.puntosTabla || 0;
    setPuntosGrupo(puntosUser);
    
    const argsUser = litigantesActualizados.find(l => l.esUsuario)?.argumentosFavor || 0;
    const argsContraUser = litigantesActualizados.find(l => l.esUsuario)?.argumentosContra || 0;
    setArgumentosFavor(argsUser);
    setArgumentosContra(argsContraUser);
    
    const todosRealizados = litigiosActualizados.every(p => p.realizado === true);
    
    if (todosRealizados) {
      finalizarFaseGrupos(litigantesActualizados);
    } else {
      const siguiente = litigiosActualizados.find(p => !p.realizado);
      if (siguiente) {
        setPartidoActual(siguiente);
      }
      setVista('tabla');
      setDueloActivo(null);
    }
  };

  const finalizarFaseGrupos = (litigantesActualizados) => {
    const litigantesConPuntos = [...litigantesActualizados];
    litigantesConPuntos.sort((a, b) => {
      if (a.puntosTabla !== b.puntosTabla) return b.puntosTabla - a.puntosTabla;
      return b.diferenciaArgumentos - a.diferenciaArgumentos;
    });
    
    const clasificadosLitigio = litigantesConPuntos.slice(0, 2);
    setClasificados(clasificadosLitigio);
    setFaseGrupoTerminada(true);
    
    const usuarioClasificado = clasificadosLitigio.some(l => l.esUsuario);
    if (usuarioClasificado) {
      setTimeout(() => onFinalizarGrupos(clasificadosLitigio, puntosGrupo, argumentosFavor, argumentosContra), 2000);
    } else {
      setTimeout(() => setVista('eliminado'), 2000);
    }
  };

  const litigantesConPuntos = grupoActual?.litigantes.map(litigante => {
    const litigiosLitigante = partidosGrupo.filter(p => 
      p.litigante1.nombre === litigante.nombre || p.litigante2.nombre === litigante.nombre
    );
    
    let puntos = 0;
    let argumentosFavorLit = 0;
    let argumentosContraLit = 0;
    let ganados = 0, perdidos = 0;
    let duelosJugados = 0;
    
    litigiosLitigante.forEach(p => {
      if (p.realizado) {
        duelosJugados++;
        const esLitigante1 = p.litigante1.nombre === litigante.nombre;
        const puntosLit = esLitigante1 ? p.puntos1 : p.puntos2;
        const puntosRival = esLitigante1 ? p.puntos2 : p.puntos1;
        
        argumentosFavorLit += puntosLit;
        argumentosContraLit += puntosRival;
        
        if (puntosLit > puntosRival) {
          puntos += 3;
          ganados++;
        } else {
          perdidos++;
        }
      }
    });
    
    return {
      ...litigante,
      puntosTabla: puntos,
      ganados,
      perdidos,
      realizados: duelosJugados,
      argumentosFavor: argumentosFavorLit,
      argumentosContra: argumentosContraLit,
      diferenciaArgumentos: argumentosFavorLit - argumentosContraLit
    };
  }) || [];

  litigantesConPuntos.sort((a, b) => {
    if (a.puntosTabla !== b.puntosTabla) return b.puntosTabla - a.puntosTabla;
    return b.diferenciaArgumentos - a.diferenciaArgumentos;
  });

  const litigiosRealizados = partidosGrupo.filter(p => p.realizado);
  const totalDuelosGrupo = partidosGrupo.length;
  const duelosPorLitigante = 3;

  if (vista === 'eliminado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <span className="text-6xl">⚖️💀</span>
          <h1 className="text-3xl font-bold text-red-600 mt-4">ELIMINADO EN FASE DE GRUPOS</h1>
          <p className="text-gray-600 mt-2">{usuario?.nombre || "Litigante"}, no lograste clasificar a las eliminatorias</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-bold">📊 Tus estadísticas finales:</p>
            <p>Puntos: {puntosGrupo} | AF: {argumentosFavor} | EC: {argumentosContra}</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full">
            Salir
          </button>
        </div>
      </div>
    );
  }

  if (vista === 'duelo' && dueloActivo && preguntaActual && !dueloTerminado) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-600 text-white p-4 rounded-t-xl text-center">
            <h2 className="text-xl font-bold">Fase de Grupos - {grupoActual?.nombre}</h2>
            <p className="text-sm">Especialidad: {grupoActual?.especialidad}</p>
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
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-12 text-center max-w-md">
          <h2 className="text-3xl font-bold text-white">{ganadorDuelo === "usuario" ? usuario?.nombre : dueloActivo?.nombre}</h2>
          <p className="text-white text-xl mt-2">¡GANADOR DEL LITIGIO!</p>
          <button onClick={() => setVista('tabla')} className="mt-6 bg-white text-gray-800 px-8 py-3 rounded-full font-bold">
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Fase de Grupos: {grupoActual?.nombre}</h1>
            <p className="text-sm mt-2">Especialidad del grupo: {grupoActual?.especialidad}</p>
            <p className="text-sm">Duelos realizados: {litigiosRealizados.length} de {totalDuelosGrupo} | Cada litigante afronta {duelosPorLitigante} duelos</p>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold mb-4">📋 Tabla de Litigantes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Litigante</th>
                        <th className="p-2 text-center">DJ</th>
                        <th className="p-2 text-center">G</th>
                        <th className="p-2 text-center">P</th>
                        <th className="p-2 text-center">AF</th>
                        <th className="p-2 text-center">EC</th>
                        <th className="p-2 text-center">DIF</th>
                        <th className="p-2 text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {litigantesConPuntos.map((litigante, idx) => (
                        <tr key={idx} className={litigante.esUsuario ? "bg-yellow-50 font-bold" : "border-b"}>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <img src={litigante.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                              <span>{litigante.nombre}</span>
                              {litigante.esUsuario && <span className="text-xs bg-yellow-500 text-white px-1 rounded">Tú</span>}
                            </div>
                           </td>
                          <td className="p-2 text-center">{litigante.realizados}/{duelosPorLitigante}</td>
                          <td className="p-2 text-center text-green-600">{litigante.ganados}</td>
                          <td className="p-2 text-center text-red-600">{litigante.perdidos}</td>
                          <td className="p-2 text-center">{litigante.argumentosFavor}</td>
                          <td className="p-2 text-center">{litigante.argumentosContra}</td>
                          <td className="p-2 text-center">{litigante.diferenciaArgumentos}</td>
                          <td className="p-2 text-center font-bold">{litigante.puntosTabla}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-bold mb-2 text-gray-700">📊 Resultados de duelos realizados</h3>
                  {litigiosRealizados.length === 0 ? (
                    <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500 text-sm">
                      Aún no hay duelos realizados. ¡Inicia el primer duelo!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {litigiosRealizados.map((p, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm border-l-4 border-green-500">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{p.litigante1.nombre}</span>
                            <span className="font-bold text-blue-600">{p.puntos1} - {p.puntos2}</span>
                            <span className="font-medium">{p.litigante2.nombre}</span>
                          </div>
                          <div className="text-xs text-green-600 text-center mt-1 font-semibold">🏆 {p.resultado}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">⚖️ Próximo Duelo</h2>
                {partidoActual && !partidoActual.realizado ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <img src={partidoActual.litigante1.avatar} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-blue-400" alt="" />
                        <p className="font-bold">{partidoActual.litigante1.nombre}</p>
                        {partidoActual.litigante1.esUsuario && <span className="text-xs bg-yellow-500 text-white px-2 rounded inline-block mt-1">Tú</span>}
                      </div>
                      <div className="text-3xl font-bold text-gray-400">VS</div>
                      <div className="flex-1">
                        <img src={partidoActual.litigante2.avatar} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-red-400" alt="" />
                        <p className="font-bold">{partidoActual.litigante2.nombre}</p>
                        {partidoActual.litigante2.esUsuario && <span className="text-xs bg-yellow-500 text-white px-2 rounded inline-block mt-1">Tú</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => iniciarDuelo(partidoActual)}
                      className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition"
                    >
                      INICIAR DUELO
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-6 text-center">
                    <p className="text-gray-600">Cargando próximo duelo...</p>
                  </div>
                )}
                
                <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
                  <p className="font-bold text-blue-700">📖 ¿Cómo se obtienen los puntos?</p>
                  <p>✓ Cada respuesta correcta = <strong>10 puntos</strong></p>
                  <p>✓ El primer litigante en llegar a 100 puntos GANA el duelo</p>
                  <p>✓ El ganador recibe <strong>3 puntos</strong> en la tabla</p>
                  <p>✓ Los puntos AF/EC son el total acumulado de todos sus duelos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GruposPhase;