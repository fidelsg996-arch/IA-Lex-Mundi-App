import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';
import SalaDuelo from './SalaDuelo';
import { db } from '../../../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

const Grupos = ({ torneo, participante, onAvanzarEliminatorias, onVolver, setParticipante, onDueloFinalizado }) => {
  const { user } = useAuth();
  const { realizarPago } = useBilletera();
  const [duelos, setDuelos] = useState([]);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [victorias, setVictorias] = useState(0);
  const [mostrarDuelo, setMostrarDuelo] = useState(false);
  const [pagandoReingreso, setPagandoReingreso] = useState(false);
  const [todosParticipantes, setTodosParticipantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [rivalSeleccionado, setRivalSeleccionado] = useState(null);
  const [grupoCompletado, setGrupoCompletado] = useState(false);

  const TOTAL_DUELOS = 3;

  const NOMBRES_RIVALES = [
    'Ana Rodríguez', 'Carlos Méndez', 'Laura Fernández', 'Roberto Sánchez',
    'María González', 'Javier López', 'Patricia Gómez', 'Fernando Díaz'
  ];

  const generarAvatarUrl = (nombre, color = '3B82F6') => {
    const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=${color}&color=fff&rounded=true&size=128`;
  };

  const asignarGrupoAleatorio = () => {
    const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return grupos[Math.floor(Math.random() * grupos.length)];
  };

  const inicializarGrupo = async () => {
    try {
      const torneoId = torneo?.id || 'torneo_principal';
      let grupoActual = participante?.grupo;
      
      if (!grupoActual) {
        grupoActual = asignarGrupoAleatorio();
        
        const participanteRef = doc(db, 'participantes_torneo', user?.uid);
        await setDoc(participanteRef, {
          ...participante,
          grupo: grupoActual,
          torneoId: torneoId,
          fase: 'grupos',
          puntajeTotal: 0,
          victorias: 0,
          partidosJugados: 0
        }, { merge: true });
        
        if (setParticipante) {
          setParticipante({ ...participante, grupo: grupoActual });
        }
      }
      
      const participantesRef = collection(db, 'participantes_grupos');
      const q = query(participantesRef, where('torneoId', '==', torneoId), where('grupo', '==', grupoActual));
      const participantesSnap = await getDocs(q);
      
      let participantes = [];
      participantesSnap.forEach((doc) => {
        participantes.push({ id: doc.id, ...doc.data() });
      });
      
      if (participantes.length === 0) {
        console.log('🆕 Creando nuevo grupo:', grupoActual);
        
        const usuarioData = {
          id: user?.uid,
          nombre: participante?.nombre || user?.displayName,
          email: user?.email,
          avatar: participante?.avatar || generarAvatarUrl(participante?.nombre || user?.displayName),
          torneoId: torneoId,
          grupo: grupoActual,
          fase: 'grupos',
          puntajeTotal: 0,
          victorias: 0,
          partidosJugados: 0,
          creado: new Date().toISOString(),
          esUsuario: true
        };
        
        await setDoc(doc(db, 'participantes_grupos', user?.uid), usuarioData);
        participantes.push({ id: user?.uid, ...usuarioData });
        
        for (let i = 0; i < 3; i++) {
          const rivalNombre = NOMBRES_RIVALES[i % NOMBRES_RIVALES.length];
          const rivalId = `rival_${grupoActual}_${i}_${Date.now()}`;
          const rivalData = {
            id: rivalId,
            nombre: rivalNombre,
            avatar: generarAvatarUrl(rivalNombre, '6B7280'),
            torneoId: torneoId,
            grupo: grupoActual,
            fase: 'grupos',
            puntajeTotal: 0,
            victorias: 0,
            partidosJugados: 0,
            creado: new Date().toISOString(),
            esUsuario: false,
            esRival: true
          };
          
          await setDoc(doc(db, 'participantes_grupos', rivalId), rivalData);
          participantes.push({ id: rivalId, ...rivalData });
        }
        
        const rivales = participantes.filter(p => !p.esUsuario);
        const duelosData = rivales.map((rival, idx) => ({
          id: `duelo_${user?.uid}_${rival.id}`,
          torneoId: torneoId,
          grupo: grupoActual,
          usuarioId: user?.uid,
          usuarioNombre: participante?.nombre || user?.displayName,
          rivalId: rival.id,
          rivalNombre: rival.nombre,
          rivalAvatar: rival.avatar,
          orden: idx,
          completado: false,
          ganado: false,
          puntosUsuario: 0,
          puntosRival: 0,
          fecha: null
        }));
        
        for (const duelo of duelosData) {
          await setDoc(doc(db, 'duelos_grupos', duelo.id), duelo);
        }
        
        setDuelos(duelosData);
        setTodosParticipantes(participantes);
        setPuntajeTotal(0);
        setVictorias(0);
        setGrupoCompletado(false);
      } else {
        const duelosRef = collection(db, 'duelos_grupos');
        const duelosQ = query(duelosRef, where('usuarioId', '==', user?.uid), where('torneoId', '==', torneoId));
        const duelosSnap = await getDocs(duelosQ);
        
        let duelosData = [];
        duelosSnap.forEach((doc) => {
          duelosData.push({ id: doc.id, ...doc.data() });
        });
        
        duelosData.sort((a, b) => (a.orden || 0) - (b.orden || 0));
        
        const completados = duelosData.filter(d => d.completado).length;
        const puntosTotal = duelosData.reduce((sum, d) => sum + (d.puntosUsuario || 0), 0);
        const victoriasTotal = duelosData.filter(d => d.ganado).length;
        
        setDuelos(duelosData);
        setTodosParticipantes(participantes);
        setPuntajeTotal(puntosTotal);
        setVictorias(victoriasTotal);
        setGrupoCompletado(completados >= TOTAL_DUELOS);
      }
      
      setCargando(false);
      
    } catch (error) {
      console.error('Error inicializando grupo:', error);
      setCargando(false);
    }
  };

  const actualizarDuelo = async (nombreRival, puntosUsuario, gano, puntosRival) => {
    try {
      const torneoId = torneo?.id || 'torneo_principal';
      
      const dueloExistente = duelos.find(d => d.rivalNombre === nombreRival);
      if (!dueloExistente) return;
      
      const dueloRef = doc(db, 'duelos_grupos', dueloExistente.id);
      await updateDoc(dueloRef, {
        completado: true,
        ganado: gano,
        puntosUsuario: puntosUsuario,
        puntosRival: puntosRival,
        fecha: new Date().toISOString()
      });
      
      const usuarioRef = doc(db, 'participantes_grupos', user?.uid);
      const usuarioDoc = await getDoc(usuarioRef);
      const usuarioData = usuarioDoc.data();
      
      const nuevosPartidos = (usuarioData?.partidosJugados || 0) + 1;
      const nuevoPuntaje = (usuarioData?.puntajeTotal || 0) + puntosUsuario;
      const nuevasVictoriasUsuario = (usuarioData?.victorias || 0) + (gano ? 1 : 0);
      
      await updateDoc(usuarioRef, {
        partidosJugados: nuevosPartidos,
        puntajeTotal: nuevoPuntaje,
        victorias: nuevasVictoriasUsuario
      });
      
      const rivalRef = doc(db, 'participantes_grupos', dueloExistente.rivalId);
      const rivalDoc = await getDoc(rivalRef);
      const rivalData = rivalDoc.data();
      
      if (rivalData) {
        await updateDoc(rivalRef, {
          partidosJugados: (rivalData.partidosJugados || 0) + 1,
          puntajeTotal: (rivalData.puntajeTotal || 0) + puntosRival,
          victorias: (rivalData.victorias || 0) + (gano ? 0 : 1)
        });
      }
      
      const nuevosDuelos = duelos.map(d => 
        d.rivalNombre === nombreRival
          ? { ...d, completado: true, ganado: gano, puntosUsuario, puntosRival }
          : d
      );
      
      const nuevoPuntajeTotal = puntajeTotal + puntosUsuario;
      const nuevasVictorias = victorias + (gano ? 1 : 0);
      const completados = nuevosDuelos.filter(d => d.completado).length;
      
      setDuelos(nuevosDuelos);
      setPuntajeTotal(nuevoPuntajeTotal);
      setVictorias(nuevasVictorias);
      setGrupoCompletado(completados >= TOTAL_DUELOS);
      
      const participantesActualizados = todosParticipantes.map(p => {
        if (p.id === user?.uid) {
          return { ...p, partidosJugados: nuevosPartidos, puntajeTotal: nuevoPuntaje, victorias: nuevasVictoriasUsuario };
        }
        if (p.id === dueloExistente.rivalId && rivalData) {
          const nuevasVictoriasRival = (p.victorias || 0) + (gano ? 0 : 1);
          return { ...p, partidosJugados: (p.partidosJugados || 0) + 1, puntajeTotal: (p.puntajeTotal || 0) + puntosRival, victorias: nuevasVictoriasRival };
        }
        return p;
      });
      
      setTodosParticipantes(participantesActualizados);
      
    } catch (error) {
      console.error('Error actualizando duelo:', error);
    }
  };

  const iniciarDuelo = (duelo, index) => {
    if (duelo.completado) {
      alert(`⚠️ Ya completaste el duelo contra ${duelo.rivalNombre}`);
      return;
    }
    
    const siguienteIndex = duelos.findIndex(d => !d.completado);
    if (index !== siguienteIndex) {
      alert(`⚠️ Primero debes completar el duelo contra ${duelos[siguienteIndex]?.rivalNombre}`);
      return;
    }
    
    setRivalSeleccionado(duelo);
    setMostrarDuelo(true);
  };

  const finalizarDuelo = async (puntosUsuario, gano, puntosRival, nombreRival) => {
    setMostrarDuelo(false);
    
    if (!gano) {
      const confirmar = window.confirm(
        `💀 Has perdido el duelo.\n\n¿Quieres reingresar pagando 10 MXN?`
      );
      if (confirmar) {
        const exito = await realizarPago(10, `Reingreso grupo - ${torneo?.titulo}`);
        if (exito) {
          alert('✅ Reingreso exitoso. Puedes intentar de nuevo.');
          return;
        }
      }
    }
    
    await actualizarDuelo(nombreRival, puntosUsuario, gano, puntosRival);
    
    if (onDueloFinalizado) {
      onDueloFinalizado(gano, puntosUsuario);
    }
  };

  const avanzarAEliminatorias = async () => {
    const ordenados = [...todosParticipantes].sort((a, b) => (b.puntajeTotal || 0) - (a.puntajeTotal || 0));
    const ganador = ordenados[0];
    
    if (ganador.id === user?.uid) {
      alert(`✅ ¡FELICIDADES! Ganaste el grupo con ${puntajeTotal} puntos. ¡Avanzas a Eliminatorias!`);
      
      const participanteRef = doc(db, 'participantes_torneo', user?.uid);
      await updateDoc(participanteRef, {
        fase: 'eliminatorias',
        puntajeGrupo: puntajeTotal,
        victoriasGrupo: victorias
      });
      
      onAvanzarEliminatorias();
    } else {
      alert(`❌ El grupo lo ganó ${ganador.nombre} con ${ganador.puntajeTotal || 0} puntos.`);
      onVolver();
    }
  };

  useEffect(() => {
    if (user?.uid && participante) {
      inicializarGrupo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, participante?.nombre]);

  const completados = duelos.filter(d => d.completado).length;
  const duelosRestantes = TOTAL_DUELOS - completados;
  const siguienteIndex = duelos.findIndex(d => !d.completado);

  if (mostrarDuelo && rivalSeleccionado) {
    return (
      <SalaDuelo 
        torneo={torneo}
        participante={participante}
        fase="grupos"
        rivalNombre={rivalSeleccionado.rivalNombre}
        rivalAvatar={rivalSeleccionado.rivalAvatar}
        onCompetenciaFinalizada={(puntos, gano, puntosRival, nombreRival) => 
          finalizarDuelo(puntos, gano, puntosRival, nombreRival)
        }
        onVolver={() => setMostrarDuelo(false)}
      />
    );
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse">
            <span className="material-symbols-outlined text-6xl text-blue-500">groups</span>
          </div>
          <p className="text-xl font-semibold text-gray-700 mt-4">Inicializando grupo...</p>
        </div>
      </div>
    );
  }

  const tablaOrdenada = [...todosParticipantes].sort((a, b) => (b.puntajeTotal || 0) - (a.puntajeTotal || 0));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
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
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Tabla de posiciones - Grupo {participante?.grupo || 'A'}</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Participante</th>
                    <th className="p-3 text-center">PJ</th>
                    <th className="p-3 text-center">G</th>
                    <th className="p-3 text-center">P</th>
                    <th className="p-3 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaOrdenada.map((p, idx) => {
                    const partidosJugados = p.partidosJugados || 0;
                    const ganados = p.victorias || 0;
                    const perdidos = partidosJugados - ganados;
                    const esUsuario = p.id === user?.uid;
                    return (
                      <tr key={p.id} className={`border-t ${esUsuario ? 'bg-indigo-50' : ''}`}>
                        <td className="p-3 font-bold">{idx + 1}{idx === 0 && ' 👑'}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                              <img src={p.avatar || generarAvatarUrl(p.nombre, '6B7280')} alt={p.nombre} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium">{p.nombre}</span>
                            {esUsuario && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded ml-2">Tú</span>}
                          </div>
                        </td>
                        <td className="p-3 text-center">{partidosJugados}</td>
                        <td className="p-3 text-center text-green-600 font-bold">{ganados}</td>
                        <td className="p-3 text-center text-red-600 font-bold">{perdidos}</td>
                        <td className="p-3 text-center font-bold">{p.puntajeTotal || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {!grupoCompletado ? (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚔️ Tus Duelos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {duelos.map((duelo, idx) => {
                  const habilitado = idx === siguienteIndex && !duelo.completado;
                  
                  return (
                    <div key={idx} className={`border rounded-xl p-4 ${
                      duelo.completado ? 'bg-gray-100 opacity-75' : 
                      habilitado ? 'bg-white shadow-lg border-indigo-300' : 
                      'bg-gray-50 opacity-50'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          <img src={duelo.rivalAvatar || generarAvatarUrl(duelo.rivalNombre, '6B7280')} alt={duelo.rivalNombre} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{duelo.rivalNombre}</p>
                          <p className="text-xs text-gray-500">Duelo {idx + 1}/{TOTAL_DUELOS}</p>
                        </div>
                      </div>
                      
                      {duelo.completado ? (
                        <div className={`text-center p-2 rounded-lg ${duelo.ganado ? 'bg-green-100' : 'bg-red-100'}`}>
                          <p className={`font-bold ${duelo.ganado ? 'text-green-700' : 'text-red-700'}`}>
                            {duelo.ganado ? '✓ Victoria' : '✗ Derrota'}
                          </p>
                          <p className="text-sm text-gray-600">Puntos: {duelo.puntosUsuario} - {duelo.puntosRival}</p>
                        </div>
                      ) : habilitado ? (
                        <button
                          onClick={() => iniciarDuelo(duelo, idx)}
                          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2 rounded-lg font-bold hover:from-indigo-700 hover:to-indigo-800 transition shadow-md"
                        >
                          ⚔️ Iniciar Duelo
                        </button>
                      ) : (
                        <div className="text-center p-2 rounded-lg bg-gray-200">
                          <p className="text-gray-500 text-sm">🔒 Bloqueado</p>
                          <p className="text-xs text-gray-400">Completa el duelo anterior</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">🏆 Progreso</span>
                  <span className="font-bold text-indigo-600">{completados}/{TOTAL_DUELOS} duelos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-indigo-500 h-3 rounded-full transition-all" style={{ width: `${(completados / TOTAL_DUELOS) * 100}%` }} />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {completados < TOTAL_DUELOS 
                    ? `Te ${duelosRestantes === 1 ? 'falta' : 'faltan'} ${duelosRestantes} duelo${duelosRestantes !== 1 ? 's' : ''} por jugar`
                    : "✅ ¡Completaste todos los duelos!"}
                </p>
              </div>
              
              {completados === TOTAL_DUELOS && (
                <button
                  onClick={avanzarAEliminatorias}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
                >
                  🎯 Finalizar Grupo y ver resultados
                </button>
              )}
            </div>
          ) : (
            <div className="bg-green-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">¡Fase de Grupos Completada!</h3>
              <p className="text-lg text-gray-700 mb-4">
                {victorias >= 2 
                  ? `✅ Has obtenido ${victorias} victorias (${puntajeTotal} puntos). ¡Felicidades! Pasas a eliminación directa.` 
                  : `❌ Obtuviste ${victorias} victorias (${puntajeTotal} puntos). Necesitabas 2 victorias para clasificar.`}
              </p>
              <button 
                onClick={victorias >= 2 ? avanzarAEliminatorias : onVolver} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all"
              >
                {victorias >= 2 ? 'Continuar a Eliminatorias' : 'Volver a Torneos'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grupos;