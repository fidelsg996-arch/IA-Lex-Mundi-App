// src/pages/Torneos/Torneos.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBilletera } from '../../context/BilleteraContext';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import Duelo from './components/Duelo';
import AdminTorneoPanel from './components/AdminTorneoPanel';

const Torneos = () => {
  const { user } = useAuth();
  const { realizarPago } = useBilletera();
  
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paso, setPaso] = useState('registro');
  const [participante, setParticipante] = useState({ nombre: '', especialidad: '', avatar: '', inscrito: false });
  const [estadisticas, setEstadisticas] = useState({ puntaje: 0, victorias: 0, derrotas: 0 });
  const [participantesList, setParticipantesList] = useState([]);
  const [mostrandoDuelo, setMostrandoDuelo] = useState(false);
  const [contraparte, setContraparte] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [faseActual, setFaseActual] = useState('clasificacion');
  const [rondaEliminatoria, setRondaEliminatoria] = useState('octavos');
  
  const avatares = ["https://randomuser.me/api/portraits/men/1.jpg", "https://randomuser.me/api/portraits/women/2.jpg"];
  const especialidades = ["Derecho Penal", "Derecho Civil", "Derecho Laboral", "Derecho Agrario"];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const torneosSnap = await getDocs(collection(db, "torneos"));
        const activo = torneosSnap.docs.find(d => d.data().activo === true);
        setTorneoActivo(activo ? { id: activo.id, ...activo.data() } : null);
        
        const pregSnap = await getDocs(collection(db, "preguntas_torneo"));
        setPreguntas(pregSnap.docs.map(d => d.data()));
        
        if (user && activo) {
          const perfilSnap = await getDoc(doc(db, "perfiles_participantes", user.uid));
          if (perfilSnap.exists()) {
            const data = perfilSnap.data();
            setParticipante(data);
            if (data.inscrito && activo) {
              setPaso('torneo');
              await cargarParticipantes(activo.id);
              await cargarEstadisticas(activo.id, user.uid);
            } else if (data.inscrito === false) {
              setPaso('inscripcion');
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [user]);

  const cargarParticipantes = async (torneoId) => {
    const q = query(collection(db, "participantes_torneo"), where("torneoId", "==", torneoId));
    const snap = await getDocs(q);
    setParticipantesList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const cargarEstadisticas = async (torneoId, userId) => {
    const docRef = doc(db, "participantes_torneo", `${torneoId}_${userId}`);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      setEstadisticas({
        puntaje: data.puntaje || 0,
        victorias: data.fallosFavor || 0,
        derrotas: data.fallosContra || 0
      });
    }
  };

  const registrarParticipante = async () => {
    if (!participante.nombre || !participante.especialidad) {
      alert("Completa todos los campos");
      return;
    }
    await setDoc(doc(db, "perfiles_participantes", user.uid), {
      ...participante,
      email: user.email,
      inscrito: false
    });
    setPaso('inscripcion');
    alert("✅ Registro completo");
  };

  const pagarInscripcion = async () => {
    const exito = await realizarPago(torneoActivo?.costoInscripcion || 50, "Inscripción Torneo Agrario");
    if (exito) {
      await setDoc(doc(db, "participantes_torneo", `${torneoActivo.id}_${user.uid}`), {
        torneoId: torneoActivo.id,
        usuarioId: user.uid,
        usuarioNombre: participante.nombre,
        especialidad: participante.especialidad,
        avatar: participante.avatar,
        puntaje: 0,
        fallosFavor: 0,
        fallosContra: 0,
        victoriasClasificacion: 0,
        victoriasGrupos: 0,
        esCampeon: false,
        fechaRegistro: new Date().toISOString()
      });
      await updateDoc(doc(db, "perfiles_participantes", user.uid), { inscrito: true });
      setParticipante({ ...participante, inscrito: true });
      setPaso('torneo');
      await cargarParticipantes(torneoActivo.id);
      alert("✅ Inscripción exitosa");
    }
  };

  const buscarContraparte = async () => {
    const otros = participantesList.filter(p => p.usuarioId !== user?.uid);
    if (otros.length > 0) {
      setContraparte(otros[Math.floor(Math.random() * otros.length)]);
    } else {
      setContraparte({ usuarioNombre: "Sistema IA", usuarioId: "ia" });
    }
    setMostrandoDuelo(true);
  };

  const finalizarDuelo = async (gano, puntaje) => {
    const nuevasVictorias = estadisticas.victorias + (gano ? 1 : 0);
    const victoriasNecesarias = torneoActivo?.victoriasNecesarias || 3;
    
    const participanteRef = doc(db, "participantes_torneo", `${torneoActivo.id}_${user.uid}`);
    await updateDoc(participanteRef, {
      puntaje: estadisticas.puntaje + puntaje,
      fallosFavor: nuevasVictorias,
      fallosContra: estadisticas.derrotas + (gano ? 0 : 1)
    });
    
    setEstadisticas({
      puntaje: estadisticas.puntaje + puntaje,
      victorias: nuevasVictorias,
      derrotas: estadisticas.derrotas + (gano ? 0 : 1)
    });
    
    setMostrandoDuelo(false);
    setContraparte(null);
    await cargarParticipantes(torneoActivo.id);
    
    if (nuevasVictorias >= victoriasNecesarias && faseActual === 'clasificacion') {
      alert("🎉 ¡Felicidades! Has clasificado a la fase de grupos!");
      setFaseActual('grupos');
      setEstadisticas(prev => ({ ...prev, victorias: 0 }));
    } else if (faseActual === 'grupos' && nuevasVictorias >= 3) {
      alert("🎉 ¡Felicidades! Has clasificado a octavos de final!");
      setFaseActual('eliminatorias');
      setRondaEliminatoria('octavos');
    } else if (faseActual === 'eliminatorias' && gano) {
      if (rondaEliminatoria === 'octavos') {
        alert("🏆 ¡Avanzas a cuartos de final!");
        setRondaEliminatoria('cuartos');
      } else if (rondaEliminatoria === 'cuartos') {
        alert("🏆 ¡Avanzas a semifinal!");
        setRondaEliminatoria('semis');
      } else if (rondaEliminatoria === 'semis') {
        alert("🏆 ¡Avanzas a la FINAL!");
        setRondaEliminatoria('final');
      } else if (rondaEliminatoria === 'final') {
        await updateDoc(participanteRef, { esCampeon: true });
        alert("🏆 ¡FELICIDADES! ERES EL GRAN CAMPEÓN DEL TORNEO AGRARIO 🏆");
        alert("📖 Ve a /reclamar-premio para obtener tu libro 'Guía y Modelos en Materia Agraria'");
        setPaso('campeon');
      }
    }
  };

  const actualizarDatosTorneo = async () => {
    const torneosSnap = await getDocs(collection(db, "torneos"));
    const activo = torneosSnap.docs.find(d => d.data().activo === true);
    setTorneoActivo(activo ? { id: activo.id, ...activo.data() } : null);
    if (activo && paso === 'torneo' && user) {
      await cargarParticipantes(activo.id);
      await cargarEstadisticas(activo.id, user.uid);
    }
  };

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  
  if (showAdminPanel) {
    return <AdminTorneoPanel onCerrar={() => setShowAdminPanel(false)} onTorneoActualizado={actualizarDatosTorneo} />;
  }
  
  if (!torneoActivo) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No hay torneos activos en este momento.</p>
        <button onClick={() => setShowAdminPanel(true)} className="bg-amber-500 text-white px-6 py-2 rounded-lg font-bold">👑 Administrar Torneos</button>
      </div>
    );
  }
  
  if (paso === 'campeon') {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="text-6xl mb-4">🏆⚖️🏆</div>
          <h1 className="text-3xl font-bold">¡ERES EL GRAN CAMPEÓN!</h1>
          <p className="mt-4 text-lg">Has demostrado tu excelencia en el derecho agrario</p>
          <div className="bg-white/20 rounded-lg p-4 mt-6">
            <p className="font-bold">📖 Premio: Guía y Modelos en Materia Agraria</p>
            <p className="text-sm mt-2">Usa tu código exclusivo para reclamar tu libro</p>
            <p className="text-xl font-mono mt-2 bg-black/30 inline-block px-4 py-2 rounded">AGRARIA2026</p>
          </div>
          <a href="/reclamar-premio" className="inline-block mt-6 bg-white text-amber-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100">
            🎁 Reclamar mi premio
          </a>
        </div>
      </div>
    );
  }
  
  if (mostrandoDuelo && contraparte) {
    const preguntasPorDuelo = torneoActivo?.preguntasPorDuelo || 10;
    return <Duelo preguntas={preguntas} onFinalizar={finalizarDuelo} rival={contraparte} usuario={participante} preguntasPorDuelo={preguntasPorDuelo} />;
  }
  
  if (paso === 'registro') {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Registro - Torneo Agrario</h1>
          <div className="bg-amber-50 p-3 rounded-lg mb-4 text-sm">
            <p className="font-bold">📖 Premio: Guía y Modelos en Materia Agraria</p>
            <p className="text-xs mt-1">Costo inscripción: ${torneoActivo.costoInscripcion || 50} MXN</p>
          </div>
          <input type="text" placeholder="Nombre completo" className="w-full p-2 border rounded mb-2" value={participante.nombre} onChange={e => setParticipante({...participante, nombre: e.target.value})} />
          <select className="w-full p-2 border rounded mb-2" value={participante.especialidad} onChange={e => setParticipante({...participante, especialidad: e.target.value})}>
            <option value="">Selecciona tu especialidad</option>
            {especialidades.map(e => <option key={e}>{e}</option>)}
          </select>
          <div className="flex gap-2 mb-4">
            {avatares.map((img, i) => (
              <img key={i} src={img} onClick={() => setParticipante({...participante, avatar: img})} className={`w-16 h-16 rounded-full cursor-pointer border-2 ${participante.avatar === img ? 'border-blue-500' : 'border-gray-300'}`} alt="avatar" />
            ))}
          </div>
          <button onClick={registrarParticipante} className="w-full bg-blue-600 text-white py-2 rounded-lg">Registrarse</button>
        </div>
      </div>
    );
  }
  
  if (paso === 'inscripcion') {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Inscripción al Torneo</h1>
          <div className="bg-amber-50 p-3 rounded-lg mb-4">
            <p className="font-bold">📖 Guía y Modelos en Materia Agraria</p>
            <p className="text-sm">Premio para el campeón</p>
          </div>
          <p className="mb-2">Costo: ${torneoActivo.costoInscripcion || 50} MXN</p>
          <button onClick={pagarInscripcion} className="w-full bg-green-600 text-white py-2 rounded-lg">Pagar e Inscribirme</button>
          <button onClick={() => setPaso('registro')} className="w-full mt-2 bg-gray-300 py-2 rounded-lg">Regresar</button>
        </div>
      </div>
    );
  }

  const mostrarFase = () => {
    if (faseActual === 'clasificacion') return `🏆 Clasificación (${estadisticas.victorias}/3 victorias)`;
    if (faseActual === 'grupos') return `📊 Fase de Grupos (${estadisticas.victorias}/3 victorias)`;
    return `⚔️ Eliminatorias - ${rondaEliminatoria.toUpperCase()}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">{torneoActivo.nombre}</h1>
          <button onClick={() => setShowAdminPanel(true)} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30">Admin</button>
        </div>
        <p className="mt-2">{torneoActivo.descripcion}</p>
        <div className="flex gap-4 mt-4 flex-wrap">
          <span>📖 Premio: {torneoActivo.premio?.nombre}</span>
          <span>🎫 Inscripción: ${torneoActivo.costoInscripcion || 50}</span>
          <span>✅ {mostrarFase()}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 mb-6 flex items-center gap-4 shadow">
        <img src={participante.avatar} className="w-16 h-16 rounded-full" alt="" />
        <div>
          <p className="font-bold text-lg">{participante.nombre}</p>
          <p className="text-gray-600">{participante.especialidad}</p>
          <div className="flex gap-4 text-sm mt-1">
            <span>🏆 Puntos: {estadisticas.puntaje}</span>
            <span>✅ Victorias: {estadisticas.victorias}</span>
            <span>❌ Derrotas: {estadisticas.derrotas}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📊 Ranking del Torneo</h2>
          {faseActual !== 'eliminatorias' && (
            <button onClick={buscarContraparte} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">🔍 Buscar Contraparte</button>
          )}
        </div>
        {participantesList.map((p, idx) => (
          <div key={p.id} className="flex justify-between p-2 border-b">
            <span>{idx + 1}. {p.usuarioNombre} {p.usuarioId === user?.uid && "(Tú)"}</span>
            <span>{p.puntaje || 0} pts | ✅ {p.fallosFavor || 0}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm">
        <h3 className="font-bold mb-2">⚖️ Reglas del Torneo</h3>
        <ul className="space-y-1 text-gray-600">
          <li>• Clasificación: 3 victorias para avanzar a grupos</li>
          <li>• Grupos: 3 duelos, los mejores avanzan a eliminatorias</li>
          <li>• Eliminatorias: Octavos → Cuartos → Semis → Final</li>
          <li>• 10 preguntas por duelo | 30 segundos por pregunta</li>
          <li>• Empate → Muerte súbita (el primero que falla pierde)</li>
          <li>• Premio: Libro "Guía y Modelos en Materia Agraria"</li>
        </ul>
      </div>
    </div>
  );
};

export default Torneos;