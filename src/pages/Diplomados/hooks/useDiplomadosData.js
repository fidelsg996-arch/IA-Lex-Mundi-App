import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export const useDiplomadosData = () => {
  const { user } = useAuth();
  const [diplomados, setDiplomados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progresoCache, setProgresoCache] = useState({});

  const getUserKey = () => {
    if (!user || !user.email) return null;
    return user.email.replace(/\./g, '_');
  };

  const cargarDiplomados = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "diplomados"));
      const diplomadosFirebase = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDiplomados(diplomadosFirebase);
      if (user) await cargarProgresoUsuario();
    } catch (error) {
      console.error("Error cargando diplomados:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProgresoUsuario = async () => {
    const userKey = getUserKey();
    if (!userKey) return {};
    
    try {
      const progresoRef = doc(db, 'progreso_diplomados', userKey);
      const progresoSnap = await getDoc(progresoRef);
      if (progresoSnap.exists()) {
        const data = progresoSnap.data();
        setProgresoCache(data.leccionesCompletadas || {});
        return data.leccionesCompletadas || {};
      }
      return {};
    } catch (error) {
      console.error('Error cargando progreso:', error);
      return {};
    }
  };

  const guardarProgreso = async (diplomadoId, moduloId, leccionId) => {
    const userKey = getUserKey();
    if (!userKey) return false;

    try {
      const key = `${diplomadoId}|${moduloId}|${leccionId}`;
      if (progresoCache[key]) return true;
      
      const nuevosCompletados = { ...progresoCache, [key]: true };
      const progresoRef = doc(db, 'progreso_diplomados', userKey);
      
      await setDoc(progresoRef, {
        userId: userKey,
        userEmail: user.email,
        lastUpdated: new Date().toISOString(),
        leccionesCompletadas: nuevosCompletados
      }, { merge: true });
      
      setProgresoCache(nuevosCompletados);
      return true;
    } catch (error) {
      console.error('Error guardando progreso:', error);
      return false;
    }
  };

  const estaCompletada = (diplomadoId, moduloId, leccionId) => {
    const key = `${diplomadoId}|${moduloId}|${leccionId}`;
    return !!progresoCache[key];
  };

  // ============================================================
  // FUNCIÓN CORREGIDA - Maneja arrays nulos o inexistentes
  // ============================================================
  const calcularProgresoDiplomado = (diplomado) => {
    // Verificar que el diplomado existe
    if (!diplomado) return 0;
    
    // Verificar que modulos existe y es un array
    if (!diplomado.modulos || !Array.isArray(diplomado.modulos)) return 0;
    
    let total = 0;
    let completadas = 0;
    
    diplomado.modulos.forEach(modulo => {
      // Verificar que el módulo y leccionesLista existen
      if (modulo && modulo.leccionesLista && Array.isArray(modulo.leccionesLista)) {
        modulo.leccionesLista.forEach(leccion => {
          total++;
          if (estaCompletada(diplomado.id, modulo.id, leccion.id)) {
            completadas++;
          }
        });
      }
    });
    
    return total > 0 ? Math.round((completadas / total) * 100) : 0;
  };

  const guardarDiplomado = async (diplomado, diplomadoId) => {
    const diplomadoRef = doc(db, 'diplomados', diplomadoId);
    await setDoc(diplomadoRef, { ...diplomado, id: diplomadoId });
    await cargarDiplomados();
  };

  const eliminarDiplomado = async (diplomadoId) => {
    const diplomadoRef = doc(db, 'diplomados', diplomadoId);
    await deleteDoc(diplomadoRef);
    await cargarDiplomados();
  };

  const actualizarPremioTorneo = async (diplomadoId, diplomadoActual) => {
    const diplomadoRef = doc(db, 'diplomados', diplomadoId);
    await setDoc(diplomadoRef, { ...diplomadoActual, id: diplomadoId }, { merge: true });
    await cargarDiplomados();
  };

  useEffect(() => {
    cargarDiplomados();
  }, [user]);

  return { 
    diplomados, 
    loading, 
    cargarDiplomados, 
    guardarDiplomado, 
    eliminarDiplomado, 
    actualizarPremioTorneo,
    guardarProgreso,
    estaCompletada,
    calcularProgresoDiplomado,
    progresoCache
  };
};