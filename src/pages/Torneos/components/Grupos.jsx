import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';
import SalaDuelo from './SalaDuelo';

const Grupos = ({ torneo, participante, onAvanzarEliminatorias, onVolver, setParticipante, onDueloFinalizado }) => {
  const { user } = useAuth();
  const { realizarPago } = useBilletera();
  const [duelos, setDuelos] = useState([]);
  const [dueloActual, setDueloActual] = useState(0);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [victorias, setVictorias] = useState(0);
  const [mostrarDuelo, setMostrarDuelo] = useState(false);
  const [dueloEnCurso, setDueloEnCurso] = useState(null);
  const [dueloCompletado, setDueloCompletado] = useState(false);
  const [pagandoReingreso, setPagandoReingreso] = useState(false);
  const [rivalesGrupo, setRivalesGrupo] = useState([]);

  const TOTAL_DUELOS = 3;
  const VICTORIAS_NECESARIAS = 2;

  useEffect(() => {
    cargarDatos();
    cargarRivalesGrupo();
  }, []);

  const obtenerParticipantesGrupo = () => {
    const participantes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(`torneo_${torneo.id}_`)) {
        const p = JSON.parse(localStorage.getItem(key));
        if (p.grupo === participante.grupo && p.usuarioId !== user?.uid) {
          participantes.push(p);
        }
      }
    }
    return participantes;
  };

  const cargarRivalesGrupo = () => {
    const rivales = obtenerParticipantesGrupo();
    setRivalesGrupo(rivales);
    
    const stored = localStorage.getItem(`grupos_${torneo.id}_${participante.usuarioId}`);
    if (!stored && rivales.length > 0) {
      const duelosIniciales = rivales.map(rival => ({
        id: rival.id,
        rival: rival.nombre,
        avatar: rival.avatar || null,
        completado: false,
        ganado: false,
        puntos: 0
      }));
      setDuelos(duelosIniciales);
      guardarProgreso(duelosIniciales, 0, 0, 0);
    }
  };

  const cargarDatos = () => {
    const stored = localStorage.getItem(`grupos_${torneo.id}_${participante.usuarioId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setDuelos(data.duelos || []);
      setPuntajeTotal(data.puntajeTotal || 0);
      setVictorias(data.victorias || 0);
      setDueloActual(data.dueloActual || 0);
    }
  };

  const guardarProgreso = (nuevosDuelos, nuevoPuntaje, nuevasVictorias, nuevoDueloActual) => {
    const data = {
      duelos: nuevosDuelos,
      puntajeTotal: nuevoPuntaje,
      victorias: nuevasVictorias,
      dueloActual: nuevoDueloActual
    };
    localStorage.setItem(`grupos_${torneo.id}_${participante.usuarioId}`, JSON.stringify(data));
    
    const updated = { ...participante, duelosGrupo: nuevoDueloActual, puntajeGrupo: nuevoPuntaje, victoriasGrupo: nuevasVictorias };
    localStorage.setItem(participante.id, JSON.stringify(updated));
    setParticipante(updated);
  };

  const iniciarDuelo = () => {
    if (dueloActual >= TOTAL_DUELOS) return;
    const duelo = duelos[dueloActual];
    setDueloEnCurso(duelo);
    setMostrarDuelo(true);
    setDueloCompletado(false);
  };

  const finalizarDuelo = async (puntos, gano, puntosRival, nombreRival) => {
    setMostrarDuelo(false);
    
    if (!gano && !dueloCompletado) {
      const reingreso = await ofrecerReingreso();
      if (reingreso) return;
    }
    
    const puntosObtenidos = gano ? 10 : puntos;
    const nuevosDuelos = [...duelos];
    nuevosDuelos[dueloActual] = {
      ...duelos[dueloActual],
      completado: true,
      ganado: gano,
      puntos: puntosObtenidos,
      puntajeRival: puntosRival,
      nombreRival: nombreRival
    };
    
    const nuevoPuntajeTotal = puntajeTotal + puntosObtenidos;
    const nuevasVictorias = victorias + (gano ? 1 : 0);
    const nuevoDueloActual = dueloActual + 1;
    
    setDuelos(nuevosDuelos);
    setPuntajeTotal(nuevoPuntajeTotal);
    setVictorias(nuevasVictorias);
    setDueloActual(nuevoDueloActual);
    setDueloCompletado(true);
    
    guardarProgreso(nuevosDuelos, nuevoPuntajeTotal, nuevasVictorias, nuevoDueloActual);
    
    if (nuevasVictorias >= VICTORIAS_NECESARIAS && nuevoDueloActual <= TOTAL_DUELOS) {
      alert(`✅ ¡FELICIDADES! Alcanzaste ${VICTORIAS_NECESARIAS} victorias. ¡Clasificas a eliminatorias!`);
      const updatedParticipante = { ...participante, fase: 'grupos_completado', gruposPuntaje: nuevoPuntajeTotal, gruposVictorias: nuevasVictorias };
      localStorage.setItem(participante.id, JSON.stringify(updatedParticipante));
      setParticipante(updatedParticipante);
      onAvanzarEliminatorias();
    } else if (nuevoDueloActual >= TOTAL_DUELOS) {
      if (nuevasVictorias >= VICTORIAS_NECESARIAS) {
        alert(`✅ ¡Felicidades! Clasificaste con ${nuevasVictorias} victorias.`);
        const updatedParticipante = { ...participante, fase: 'grupos_completado', gruposPuntaje: nuevoPuntajeTotal, gruposVictorias: nuevasVictorias };
        localStorage.setItem(participante.id, JSON.stringify(updatedParticipante));
        setParticipante(updatedParticipante);
        onAvanzarEliminatorias();
      } else {
        alert(`❌ No lograste las ${VICTORIAS_NECESARIAS} victorias necesarias. Solo obtuviste ${nuevasVictorias}.`);
        onVolver();
      }
    }
  };

  const ofrecerReingreso = async () => {
    const precioReingreso = 30;
    return new Promise((resolve) => {
      const confirmar = window.confirm(
        `💀 Has perdido el duelo.\n\n` +
        `¿Quieres reingresar pagando $${precioReingreso} MXN?\n` +
        `(Los reingresos te permiten seguir compitiendo en la fase de grupos)`
      );
      if (confirmar) {
        setPagandoReingreso(true);
        realizarPago(precioReingreso, `Reingreso grupos torneo: ${torneo.titulo}`)
          .then((exito) => {
            setPagandoReingreso(false);
            if (exito) {
              alert(`✅ Reingreso exitoso. Puedes intentar de nuevo el duelo.`);
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

  const duelosRestantes = TOTAL_DUELOS - dueloActual;
  const victoriasNecesarias = Math.max(0, VICTORIAS_NECESARIAS - victorias);

  if (mostrarDuelo) {
    return <SalaDuelo 
      torneo={torneo}
      participante={participante}
      fase="grupos"
      onCompetenciaFinalizada={finalizarDuelo}
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">🏆 Fase de Grupos</h2>
          <p className="text-xl md:text-2xl font-semibold text-indigo-200">Grupo: {participante?.grupo || 'A'}</p>
          <div className="mt-4 flex justify-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{duelosRestantes}</p>
              <p className="text-sm">Duelos restantes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{puntajeTotal}</p>
              <p className="text-sm">Puntaje acumulado</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-300">{victorias}</p>
              <p className="text-sm">Victorias</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Reglas */}
          <div className="bg-indigo-50 rounded-2xl p-5 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">⏱️</span>
                <span className="text-base font-bold">20 segundos</span>
                <span className="text-xs text-gray-500">por pregunta</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">📋</span>
                <span className="text-base font-bold">15 preguntas</span>
                <span className="text-xs text-gray-500">por duelo</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🎯</span>
                <span className="text-base font-bold">10 puntos</span>
                <span className="text-xs text-gray-500">= victoria automática</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">⚔️</span>
                <span className="text-base font-bold">Duelos</span>
                <span className="text-xs text-gray-500">todos contra todos</span>
              </div>
            </div>
          </div>

          {/* Tabla de posiciones del grupo CON AVATARES */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Tabla de posiciones - Grupo {participante?.grupo || 'A'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Participante</th>
                    <th className="p-3 text-center">Victorias</th>
                    <th className="p-3 text-center">Puntos</th>
                    <th className="p-3 text-center">Duelos</th>
                  </tr>
                </thead>
                <tbody>
                  {rivalesGrupo.map((rival, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {rival.avatar ? (
                              <img src={rival.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-gray-500 text-sm">person</span>
                            )}
                          </div>
                          {rival.nombre}
                        </div>
                       </td>
                      <td className="p-3 text-center">{rival.victoriasGrupo || 0}</td>
                      <td className="p-3 text-center">{rival.puntajeGrupo || 0}</td>
                      <td className="p-3 text-center">{rival.duelosGrupo || 0}</td>
                     </tr>
                  ))}
                  <tr className="border-t bg-indigo-50">
                    <td className="p-3 font-bold">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden flex items-center justify-center">
                          {participante?.avatar ? (
                            <img src={participante.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-white text-sm">person</span>
                          )}
                        </div>
                        {participante?.nombre} (Tú)
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold">{victorias}</td>
                    <td className="p-3 text-center font-bold">{puntajeTotal}</td>
                    <td className="p-3 text-center font-bold">{dueloActual}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Estado actual */}
          {dueloActual < TOTAL_DUELOS ? (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 text-center border-2 border-indigo-300">
              <div className="mb-4">
                <span className="text-5xl md:text-6xl">⚔️</span>
              </div>
              <h3 className="text-2xl font-bold text-indigo-700 mb-3">Realizar Duelo</h3>
              <p className="text-xl font-semibold text-gray-700 mb-2">{dueloActual + 1}/{TOTAL_DUELOS}</p>
              <p className="text-lg text-gray-600 mb-1">Victorias necesarias: <span className="font-bold text-indigo-600">{victoriasNecesarias}</span></p>
              <p className="text-md text-gray-500 mb-6">Te quedan {duelosRestantes} duelos para alcanzar la meta</p>
              
              {duelos[dueloActual] && (
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                  <p className="text-lg font-semibold text-gray-700">⚔️ Rival:</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {duelos[dueloActual].avatar ? (
                        <img src={duelos[dueloActual].avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-gray-500">person</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{duelos[dueloActual].rival}</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={iniciarDuelo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg"
              >
                🎮 Iniciar Duelo {dueloActual + 1}/{TOTAL_DUELOS}
              </button>
            </div>
          ) : (
            <div className="bg-green-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">¡Fase de Grupos Completada!</h3>
              <p className="text-lg text-gray-700 mb-4">
                {victorias >= VICTORIAS_NECESARIAS 
                  ? `✅ Has obtenido ${victorias} victorias. ¡Felicidades! Pasas a eliminación directa.` 
                  : `❌ Obtuviste ${victorias} victorias. Necesitabas ${VICTORIAS_NECESARIAS} victorias para clasificar.`}
              </p>
              <button
                onClick={() => victorias >= VICTORIAS_NECESARIAS ? onAvanzarEliminatorias() : onVolver()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all"
              >
                {victorias >= VICTORIAS_NECESARIAS ? 'Continuar a Eliminatorias' : 'Volver a Torneos'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grupos;