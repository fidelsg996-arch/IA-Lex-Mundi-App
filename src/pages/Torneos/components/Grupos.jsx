import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SalaDuelo from './SalaDuelo';
import { db } from '../../../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

const Grupos = ({ torneo, participante, onAvanzarEliminatorias, onVolver, setParticipante }) => {
  const { user } = useAuth();
  const [duelos, setDuelos] = useState([]);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [victorias, setVictorias] = useState(0);
  const [mostrarDuelo, setMostrarDuelo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [rivalSeleccionado, setRivalSeleccionado] = useState(null);
  const [dueloEnProgreso, setDueloEnProgreso] = useState(null);

  const TOTAL_DUELOS = 3;

  const NOMBRES_RIVALES = [
    'Ana Rodríguez', 'Carlos Méndez', 'Laura Fernández', 'Roberto Sánchez',
    'María González', 'Javier López', 'Patricia Gómez', 'Fernando Díaz'
  ];

  const generarAvatarUrl = (nombre, color = '3B82F6') => {
    if (!nombre) return `https://ui-avatars.com/api/?name=US&background=${color}&color=fff&rounded=true&size=128`;
    const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=${color}&color=fff&rounded=true&size=128`;
  };

  const asignarGrupoAleatorio = () => {
    const grupos = ['A', 'B', 'C', 'D'];
    return grupos[Math.floor(Math.random() * grupos.length)];
  };

  const cargarDuelos = async () => {
    try {
      const torneoId = torneo?.id || 'torneo_principal';
      const grupoActual = participante?.grupo;
      
      if (!grupoActual) return;
      
      const duelosRef = collection(db, 'duelos_grupos');
      const duelosQ = query(duelosRef, where('usuarioId', '==', user?.uid), where('torneoId', '==', torneoId));
      const duelosSnap = await getDocs(duelosQ);
      
      let duelosData = [];
      duelosSnap.forEach((doc) => {
        duelosData.push({ id: doc.id, ...doc.data() });
      });
      
      if (duelosData.length === 0) {
        const rivales = NOMBRES_RIVALES.slice(0, TOTAL_DUELOS);
        const nuevosDuelos = [];
        
        for (let i = 0; i < rivales.length; i++) {
          const dueloId = `duelo_${user?.uid}_${Date.now()}_${i}`;
          const dueloData = {
            id: dueloId,
            torneoId: torneoId,
            grupo: grupoActual,
            usuarioId: user?.uid,
            usuarioNombre: participante?.nombre || user?.displayName,
            rivalNombre: rivales[i],
            rivalAvatar: generarAvatarUrl(rivales[i], '6B7280'),
            orden: i,
            completado: false,
            ganado: false,
            puntosUsuario: 0,
            puntosRival: 0,
            fecha: null
          };
          await setDoc(doc(db, 'duelos_grupos', dueloId), dueloData);
          nuevosDuelos.push(dueloData);
        }
        duelosData = nuevosDuelos;
      }
      
      duelosData.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      
      const completados = duelosData.filter(d => d.completado).length;
      const puntosTotal = duelosData.reduce((sum, d) => sum + (d.puntosUsuario || 0), 0);
      const victoriasTotal = duelosData.filter(d => d.ganado).length;
      
      setDuelos(duelosData);
      setPuntajeTotal(puntosTotal);
      setVictorias(victoriasTotal);
      
    } catch (error) {
      console.error('Error cargando duelos:', error);
    }
  };

  const actualizarDuelo = async (nombreRival, puntosUsuario, gano, puntosRival) => {
    try {
      const duelo = duelos.find(d => d.rivalNombre === nombreRival);
      if (!duelo) return;
      
      const dueloRef = doc(db, 'duelos_grupos', duelo.id);
      await updateDoc(dueloRef, {
        completado: true,
        ganado: gano,
        puntosUsuario: puntosUsuario,
        puntosRival: puntosRival,
        fecha: new Date().toISOString()
      });
      
      const nuevosDuelos = duelos.map(d => 
        d.rivalNombre === nombreRival
          ? { ...d, completado: true, ganado: gano, puntosUsuario, puntosRival }
          : d
      );
      
      const nuevoPuntajeTotal = puntajeTotal + puntosUsuario;
      const nuevasVictorias = victorias + (gano ? 1 : 0);
      
      setDuelos(nuevosDuelos);
      setPuntajeTotal(nuevoPuntajeTotal);
      setVictorias(nuevasVictorias);
      setDueloEnProgreso(null);
      
    } catch (error) {
      console.error('Error actualizando duelo:', error);
    }
  };

  const iniciarDuelo = (duelo) => {
    if (!duelo) {
      console.error('Duelo no válido');
      return;
    }
    
    if (duelo.completado) {
      alert('⚠️ Este duelo ya fue completado');
      return;
    }
    
    // ✅ CORREGIDO: Verificar si es el siguiente duelo sin usar indexOf problemático
    const siguienteIndex = duelos.findIndex(d => !d.completado);
    const dueloIndex = duelos.findIndex(d => d.id === duelo.id);
    
    if (dueloIndex !== siguienteIndex) {
      const siguienteDuelo = duelos[siguienteIndex];
      if (siguienteDuelo) {
        alert(`⚠️ Primero debes completar el duelo contra ${siguienteDuelo.rivalNombre}`);
      }
      return;
    }
    
    setRivalSeleccionado(duelo);
    setDueloEnProgreso(duelo);
    setMostrarDuelo(true);
  };

  const finalizarDuelo = (puntosUsuario, gano, puntosRival, nombreRival) => {
    setMostrarDuelo(false);
    
    if (!gano) {
      alert(`💀 Perdiste el duelo contra ${nombreRival}. Pasarás al siguiente duelo.`);
    } else {
      alert(`🎉 ¡Ganaste el duelo contra ${nombreRival}! +${puntosUsuario} puntos`);
    }
    
    actualizarDuelo(nombreRival, puntosUsuario, gano, puntosRival);
  };

  const completarFaseGrupos = async () => {
    if (victorias >= 2) {
      alert(`✅ ¡Felicidades! Clasificaste a Eliminatorias con ${victorias} victorias y ${puntajeTotal} puntos`);
      
      const participanteRef = doc(db, 'participantes_torneo', user?.uid);
      await updateDoc(participanteRef, {
        fase: 'eliminatorias',
        puntajeGrupo: puntajeTotal,
        victoriasGrupo: victorias
      });
      
      if (setParticipante) {
        setParticipante({ ...participante, fase: 'eliminatorias' });
      }
      
      onAvanzarEliminatorias();
    } else {
      alert(`❌ No lograste clasificar. Necesitabas 2 victorias y obtuviste ${victorias}.`);
      onVolver();
    }
  };

  const inicializarGrupo = async () => {
    setCargando(true);
    
    try {
      let grupoActual = participante?.grupo;
      
      if (!grupoActual) {
        grupoActual = asignarGrupoAleatorio();
        
        const participanteRef = doc(db, 'participantes_torneo', user?.uid);
        await setDoc(participanteRef, {
          ...participante,
          grupo: grupoActual,
          fase: 'grupos',
          puntajeTotal: 0,
          victorias: 0,
          partidosJugados: 0
        }, { merge: true });
        
        if (setParticipante) {
          setParticipante({ ...participante, grupo: grupoActual });
        }
        
        const grupoRef = doc(db, 'participantes_grupos', user?.uid);
        await setDoc(grupoRef, {
          id: user?.uid,
          nombre: participante?.nombre || user?.displayName,
          avatar: participante?.avatar || generarAvatarUrl(participante?.nombre || user?.displayName),
          torneoId: torneo?.id,
          grupo: grupoActual,
          esUsuario: true,
          puntajeTotal: 0,
          victorias: 0,
          partidosJugados: 0
        }, { merge: true });
      }
      
      await cargarDuelos();
    } catch (error) {
      console.error('Error inicializando grupo:', error);
    } finally {
      setCargando(false);
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
  const todosCompletados = completados >= TOTAL_DUELOS;

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
        onVolver={() => {
          setMostrarDuelo(false);
          setDueloEnProgreso(null);
        }}
      />
    );
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse">
            <span className="material-symbols-outlined text-6xl">groups</span>
          </div>
          <p className="text-xl font-semibold mt-4">Inicializando fase de grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 text-white text-center">
          <h2 className="text-3xl font-black">🏆 Fase de Grupos</h2>
          <p className="text-indigo-200 mt-1">{torneo?.titulo}</p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{puntajeTotal}</p>
              <p className="text-sm text-indigo-200">Puntos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-300">{victorias}</p>
              <p className="text-sm text-indigo-200">Victorias</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{duelosRestantes}</p>
              <p className="text-sm text-indigo-200">Duelos restantes</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {duelos.map((duelo, idx) => {
              const esSiguiente = idx === siguienteIndex && !duelo.completado;
              const completado = duelo.completado;
              
              return (
                <div key={duelo.id || idx} className={`border rounded-xl p-4 ${
                  completado ? 'bg-gray-100' : esSiguiente ? 'bg-white shadow-lg border-indigo-300' : 'bg-gray-50 opacity-60'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                      <img src={duelo.rivalAvatar || generarAvatarUrl(duelo.rivalNombre, '6B7280')} alt={duelo.rivalNombre} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{duelo.rivalNombre}</p>
                      <p className="text-xs text-gray-500">Duelo {idx + 1}/{TOTAL_DUELOS}</p>
                    </div>
                  </div>
                  
                  {completado ? (
                    <div className={`text-center p-2 rounded-lg ${duelo.ganado ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p className={`font-bold ${duelo.ganado ? 'text-green-700' : 'text-red-700'}`}>
                        {duelo.ganado ? '✓ Victoria' : '✗ Derrota'}
                      </p>
                      <p className="text-sm text-gray-600">Puntos: {duelo.puntosUsuario} - {duelo.puntosRival}</p>
                    </div>
                  ) : esSiguiente ? (
                    <button
                      onClick={() => iniciarDuelo(duelo)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2 rounded-lg font-bold hover:from-indigo-700 transition"
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

          <div className="bg-gray-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700">📊 Progreso</span>
              <span className="font-bold text-indigo-600">{completados}/{TOTAL_DUELOS} duelos</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${(completados / TOTAL_DUELOS) * 100}%` }} />
            </div>
          </div>

          {todosCompletados && (
            <button
              onClick={completarFaseGrupos}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg transition"
            >
              🎯 Finalizar Fase de Grupos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grupos;