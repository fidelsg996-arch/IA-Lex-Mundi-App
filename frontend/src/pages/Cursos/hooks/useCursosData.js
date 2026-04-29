// src/pages/Cursos/hooks/useCursosData.js
import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export const useCursosData = () => {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progresoCache, setProgresoCache] = useState({});

  const getUserKey = () => {
    if (!user || !user.email) return null;
    return user.email.replace(/\./g, '_');
  };

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "cursos"));
      const cursosFirebase = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCursos(cursosFirebase);
      await cargarProgresoUsuario();
    } catch (error) {
      console.error("Error cargando cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProgresoUsuario = async () => {
    const userKey = getUserKey();
    if (!userKey) return {};
    
    try {
      const progresoRef = doc(db, 'progreso_usuarios', userKey);
      const progresoSnap = await getDoc(progresoRef);
      if (progresoSnap.exists()) {
        const data = progresoSnap.data();
        setProgresoCache(data.leccionesCompletadas || {});
      } else {
        setProgresoCache({});
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
    }
  };

  const guardarProgreso = async (cursoId, moduloId, leccionId) => {
    const userKey = getUserKey();
    if (!userKey) return false;

    try {
      const key = `${cursoId}|${moduloId}|${leccionId}`;
      if (progresoCache[key]) return true;
      
      const nuevosCompletados = { ...progresoCache, [key]: true };
      const progresoRef = doc(db, 'progreso_usuarios', userKey);
      
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

  const estaCompletada = (cursoId, moduloId, leccionId) => {
    const key = `${cursoId}|${moduloId}|${leccionId}`;
    return !!progresoCache[key];
  };

  const calcularProgresoCurso = (curso) => {
    if (!curso || !curso.modulos) return 0;
    let total = 0, completadas = 0;
    curso.modulos.forEach(modulo => {
      const lecciones = modulo.leccionesLista || [];
      total += lecciones.length;
      lecciones.forEach(leccion => {
        if (estaCompletada(curso.id, modulo.id, leccion.id)) completadas++;
      });
    });
    return total > 0 ? Math.round((completadas / total) * 100) : 0;
  };

  const guardarCurso = async (curso, cursoId) => {
    try {
      const cursoRef = doc(db, 'cursos', cursoId);
      await setDoc(cursoRef, { ...curso, id: cursoId });
      await cargarCursos();
      return true;
    } catch (error) {
      console.error('Error guardando curso:', error);
      throw error;
    }
  };

  const eliminarCurso = async (cursoId) => {
    const cursoRef = doc(db, 'cursos', cursoId);
    await deleteDoc(cursoRef);
    await cargarCursos();
  };

  const actualizarPremioTorneo = async (cursoId, cursoActual) => {
    const cursoRef = doc(db, 'cursos', cursoId);
    await setDoc(cursoRef, { ...cursoActual, id: cursoId }, { merge: true });
    await cargarCursos();
  };

  useEffect(() => {
    cargarCursos();
  }, [user?.email]);

  return { 
    cursos, 
    loading, 
    cargarCursos, 
    guardarCurso, 
    eliminarCurso, 
    actualizarPremioTorneo,
    guardarProgreso,
    estaCompletada,
    calcularProgresoCurso,
    progresoCache
  };
};