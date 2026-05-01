import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

export const useCursosData = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'cursos'));
      const cursosData = [];
      querySnapshot.forEach((doc) => {
        cursosData.push({ id: doc.id, ...doc.data() });
      });
      setCursos(cursosData);
    } catch (error) {
      console.error('Error cargando cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarCurso = async (cursoData, cursoId) => {
    try {
      const cursoParaGuardar = {
        titulo: cursoData.titulo || '',
        descripcion: cursoData.descripcion || '',
        imagen: cursoData.imagen || '',
        nivel: cursoData.nivel || 'Intermedio',
        duracion: cursoData.duracion || '',
        precio: cursoData.precio || 0,
        esPremioTorneo: cursoData.esPremioTorneo || false,
        estructura: cursoData.estructura || []
      };

      if (cursoId) {
        await updateDoc(doc(db, 'cursos', cursoId), cursoParaGuardar);
      } else {
        await addDoc(collection(db, 'cursos'), cursoParaGuardar);
      }
      await cargarCursos();
    } catch (error) {
      console.error('Error guardando curso:', error);
      throw error;
    }
  };

  const eliminarCurso = async (cursoId) => {
    try {
      await deleteDoc(doc(db, 'cursos', cursoId));
      await cargarCursos();
    } catch (error) {
      console.error('Error eliminando curso:', error);
    }
  };

  const actualizarPremioTorneo = async (cursoId, valorActual) => {
    try {
      await updateDoc(doc(db, 'cursos', cursoId), {
        esPremioTorneo: !valorActual
      });
      await cargarCursos();
    } catch (error) {
      console.error('Error actualizando premio:', error);
    }
  };

  const guardarProgreso = async (cursoId, moduloId, leccionId) => {
    const key = `progreso_${cursoId}`;
    const progresoActual = JSON.parse(localStorage.getItem(key) || '[]');
    if (!progresoActual.includes(`${moduloId}_${leccionId}`)) {
      progresoActual.push(`${moduloId}_${leccionId}`);
      localStorage.setItem(key, JSON.stringify(progresoActual));
    }
  };

  const estaCompletada = (cursoId, moduloId, leccionId) => {
    const key = `progreso_${cursoId}`;
    const progreso = JSON.parse(localStorage.getItem(key) || '[]');
    return progreso.includes(`${moduloId}_${leccionId}`);
  };

  const calcularProgresoCurso = (cursoId) => {
    const curso = cursos.find(c => c.id === cursoId);
    if (!curso || !curso.estructura) return 0;
    
    let totalLecciones = 0;
    let leccionesCompletadas = 0;
    const key = `progreso_${cursoId}`;
    const progreso = JSON.parse(localStorage.getItem(key) || '[]');
    
    const contar = (items) => {
      items.forEach(item => {
        if (item.lecciones) {
          item.lecciones.forEach(leccion => {
            totalLecciones++;
            if (progreso.includes(`${item.id}_${leccion.id}`)) leccionesCompletadas++;
          });
        }
        if (item.subcapitulos) contar(item.subcapitulos);
        if (item.capitulos) contar(item.capitulos);
      });
    };
    
    curso.estructura.forEach(modulo => {
      if (modulo.capitulos) contar(modulo.capitulos);
      if (modulo.lecciones) contar(modulo.lecciones);
    });
    
    return totalLecciones === 0 ? 0 : Math.round((leccionesCompletadas / totalLecciones) * 100);
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  return {
    cursos,
    loading,
    guardarCurso,
    eliminarCurso,
    actualizarPremioTorneo,
    cargarCursos,
    guardarProgreso,
    estaCompletada,
    calcularProgresoCurso
  };
};