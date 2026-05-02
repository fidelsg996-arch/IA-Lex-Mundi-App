import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';

export const useTorneoData = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantes, setParticipantes] = useState([]);

  const cargarTorneos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "torneos"));
      const torneosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTorneos(torneosList);
      
      const activo = torneosList.find(t => t.activo === true);
      setTorneoActivo(activo || null);
      if (activo) await cargarParticipantes(activo.id);
    } catch (error) {
      console.error("Error cargando torneos:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarParticipantes = async (torneoId) => {
    try {
      const q = query(collection(db, "participantes_torneo"), where("torneoId", "==", torneoId));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipantes(lista);
      return lista;
    } catch (error) {
      console.error("Error cargando participantes:", error);
      return [];
    }
  };

  const cargarPreguntas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "preguntas_torneo"));
      setPreguntas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error cargando preguntas:", error);
    }
  };

  const registrarParticipante = async (usuarioId, usuarioNombre, torneoId, especialidad, avatar) => {
    try {
      const participanteRef = doc(db, 'participantes_torneo', `${torneoId}_${usuarioId}`);
      await setDoc(participanteRef, {
        torneoId, usuarioId, usuarioNombre, especialidad, avatar,
        puntaje: 0, litigiosRealizados: 0, fallosFavor: 0, fallosContra: 0,
        fechaRegistro: new Date().toISOString()
      });
      await cargarParticipantes(torneoId);
      return true;
    } catch (error) {
      console.error("Error registrando participante:", error);
      return false;
    }
  };

  const guardarResultadoDuelo = async (torneoId, ganadorId, perdedorId, puntajeGanador, puntajePerdedor) => {
    try {
      const ganadorRef = doc(db, 'participantes_torneo', `${torneoId}_${ganadorId}`);
      const ganadorDoc = await getDoc(ganadorRef);
      if (ganadorDoc.exists()) {
        const ganadorData = ganadorDoc.data();
        await updateDoc(ganadorRef, {
          puntaje: (ganadorData.puntaje || 0) + puntajeGanador,
          litigiosRealizados: (ganadorData.litigiosRealizados || 0) + 1,
          fallosFavor: (ganadorData.fallosFavor || 0) + 1
        });
      }

      const perdedorRef = doc(db, 'participantes_torneo', `${torneoId}_${perdedorId}`);
      const perdedorDoc = await getDoc(perdedorRef);
      if (perdedorDoc.exists()) {
        const perdedorData = perdedorDoc.data();
        await updateDoc(perdedorRef, {
          puntaje: (perdedorData.puntaje || 0) + puntajePerdedor,
          litigiosRealizados: (perdedorData.litigiosRealizados || 0) + 1,
          fallosContra: (perdedorData.fallosContra || 0) + 1
        });
      }

      await cargarParticipantes(torneoId);
      return true;
    } catch (error) {
      console.error("Error guardando resultado:", error);
      return false;
    }
  };

  const guardarPerfilParticipante = async (usuarioId, perfilData) => {
    try {
      const perfilRef = doc(db, 'perfiles_participantes', usuarioId);
      await setDoc(perfilRef, { ...perfilData, usuarioId, ultimaActualizacion: new Date().toISOString() }, { merge: true });
      return true;
    } catch (error) {
      console.error("Error guardando perfil:", error);
      return false;
    }
  };

  const cargarPerfilParticipante = async (usuarioId) => {
    try {
      const perfilRef = doc(db, 'perfiles_participantes', usuarioId);
      const perfilDoc = await getDoc(perfilRef);
      return perfilDoc.exists() ? perfilDoc.data() : null;
    } catch (error) {
      console.error("Error cargando perfil:", error);
      return null;
    }
  };

  const guardarTorneo = async (torneoData, editando) => {
    const torneoId = editando ? editando.id : Date.now().toString();
    await setDoc(doc(db, 'torneos', torneoId), { ...torneoData, id: torneoId });
    await cargarTorneos();
    return true;
  };

  const eliminarTorneo = async (torneoId) => {
    await deleteDoc(doc(db, 'torneos', torneoId));
    await cargarTorneos();
    return true;
  };

  const activarTorneo = async (torneo) => {
    for (const t of torneos) {
      await updateDoc(doc(db, 'torneos', t.id), { activo: false });
    }
    await updateDoc(doc(db, 'torneos', torneo.id), { activo: true });
    await cargarTorneos();
    return true;
  };

  useEffect(() => {
    cargarTorneos();
    cargarPreguntas();
  }, []);

  return {
    torneos, torneoActivo, preguntas, participantes, loading,
    cargarTorneos, guardarTorneo, eliminarTorneo, activarTorneo,
    registrarParticipante, guardarResultadoDuelo, cargarParticipantes,
    guardarPerfilParticipante, cargarPerfilParticipante
  };
};