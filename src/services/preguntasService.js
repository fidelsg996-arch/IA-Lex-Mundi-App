// src/services/preguntasService.js
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where
} from 'firebase/firestore';

const COLECCION = 'preguntas_torneo';

// Obtener preguntas por fase
export const obtenerPreguntasPorFase = async (fase, cantidad = 15) => {
  try {
    const q = query(
      collection(db, COLECCION),
      where('fase', '==', fase)
    );
    const querySnapshot = await getDocs(q);
    const preguntas = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      preguntas.push({
        id: doc.id,
        texto: data.texto,
        opciones: data.opciones || [],
        correcta: data.correcta,
        materia: data.materia,
        dificultad: data.dificultad
      });
    });
    
    // Mezclar aleatoriamente
    const mezcladas = preguntas.sort(() => Math.random() - 0.5);
    
    // Si no hay suficientes, duplicar las existentes
    if (mezcladas.length < cantidad && mezcladas.length > 0) {
      const resultado = [...mezcladas];
      while (resultado.length < cantidad) {
        resultado.push({ ...mezcladas[resultado.length % mezcladas.length] });
      }
      return resultado;
    }
    
    return mezcladas.slice(0, cantidad);
  } catch (error) {
    console.error('Error cargando preguntas:', error);
    return [];
  }
};

// Obtener preguntas por materia
export const obtenerPreguntasPorMateria = async (materia, cantidad = 15) => {
  try {
    const q = query(
      collection(db, COLECCION),
      where('materia', '==', materia)
    );
    const querySnapshot = await getDocs(q);
    const preguntas = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      preguntas.push({
        id: doc.id,
        texto: data.texto,
        opciones: data.opciones || [],
        correcta: data.correcta,
        materia: data.materia,
        dificultad: data.dificultad
      });
    });
    
    const mezcladas = preguntas.sort(() => Math.random() - 0.5);
    return mezcladas.slice(0, cantidad);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Obtener todas las preguntas (para admin)
export const obtenerTodasLasPreguntas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLECCION));
    const preguntas = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      preguntas.push({
        id: doc.id,
        texto: data.texto,
        opciones: data.opciones || [],
        correcta: data.correcta,
        materia: data.materia,
        dificultad: data.dificultad,
        fase: data.fase || 'sin_fase'
      });
    });
    return preguntas;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Agregar nueva pregunta
export const agregarPregunta = async (preguntaData) => {
  try {
    const docRef = await addDoc(collection(db, COLECCION), {
      texto: preguntaData.texto,
      opciones: preguntaData.opciones,
      correcta: preguntaData.correcta,
      materia: preguntaData.materia,
      dificultad: preguntaData.dificultad,
      fase: preguntaData.fase,
      creada: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar pregunta
export const actualizarPregunta = async (id, preguntaData) => {
  try {
    const preguntaRef = doc(db, COLECCION, id);
    await updateDoc(preguntaRef, {
      texto: preguntaData.texto,
      opciones: preguntaData.opciones,
      correcta: preguntaData.correcta,
      materia: preguntaData.materia,
      dificultad: preguntaData.dificultad,
      fase: preguntaData.fase,
      actualizada: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar pregunta
export const eliminarPregunta = async (id) => {
  try {
    await deleteDoc(doc(db, COLECCION, id));
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
};

// Materias disponibles
export const materiasDisponibles = [
  { id: 'Civil', nombre: 'Derecho Civil' },
  { id: 'Penal', nombre: 'Derecho Penal' },
  { id: 'Laboral', nombre: 'Derecho Laboral' },
  { id: 'Fiscal', nombre: 'Derecho Fiscal' },
  { id: 'Constitucional', nombre: 'Derecho Constitucional' },
  { id: 'Amparo', nombre: 'Juicio de Amparo' },
  { id: 'Mercantil', nombre: 'Derecho Mercantil' },
  { id: 'Familia', nombre: 'Derecho Familiar' }
];

// Fases disponibles
export const fasesDisponibles = [
  { id: 'clasificacion', nombre: 'Clasificación' },
  { id: 'grupos', nombre: 'Grupos' },
  { id: 'eliminatorias', nombre: 'Eliminatorias' },
  { id: 'final', nombre: 'Final' }
];