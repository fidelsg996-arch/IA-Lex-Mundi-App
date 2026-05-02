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
  where,
  getDoc
} from 'firebase/firestore';

const COLECCION = 'preguntas';

// Obtener preguntas para una fase específica
export const obtenerPreguntasPorFase = async (fase, cantidad = 15) => {
  try {
    const q = query(
      collection(db, COLECCION),
      where('fase', '==', fase),
      where('activa', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const preguntas = [];
    querySnapshot.forEach((doc) => {
      preguntas.push({ id: doc.id, ...doc.data() });
    });
    
    // Mezclar aleatoriamente
    const mezcladas = preguntas.sort(() => Math.random() - 0.5);
    return mezcladas.slice(0, cantidad);
  } catch (error) {
    console.error('Error cargando preguntas:', error);
    return [];
  }
};

// Obtener todas las preguntas (para admin)
export const obtenerTodasLasPreguntas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLECCION));
    const preguntas = [];
    querySnapshot.forEach((doc) => {
      preguntas.push({ id: doc.id, ...doc.data() });
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
      ...preguntaData,
      creada: new Date().toISOString(),
      activa: true
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
      ...preguntaData,
      actualizada: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar pregunta (desactivar)
export const eliminarPregunta = async (id) => {
  try {
    const preguntaRef = doc(db, COLECCION, id);
    await updateDoc(preguntaRef, { activa: false });
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
};

// Obtener preguntas por ID
export const obtenerPreguntaPorId = async (id) => {
  try {
    const preguntaRef = doc(db, COLECCION, id);
    const preguntaSnap = await getDoc(preguntaRef);
    if (preguntaSnap.exists()) {
      return { id: preguntaSnap.id, ...preguntaSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Función para inicializar preguntas por defecto (ejecutar una sola vez)
export const inicializarPreguntas = async () => {
  const preguntasExistentes = await obtenerTodasLasPreguntas();
  if (preguntasExistentes.length > 0) {
    console.log('Ya existen preguntas en la base de datos');
    return;
  }

  const preguntasPorDefecto = {
    clasificacion: [
      { texto: '¿Qué es el derecho civil?', opciones: ['Derecho público', 'Regula relaciones privadas', 'Derecho penal', 'Derecho laboral'], correcta: 1, nivel: 'Básico' },
      { texto: '¿Qué es una demanda?', opciones: ['Escrito inicial', 'Sentencia', 'Recurso', 'Prueba'], correcta: 0, nivel: 'Básico' },
      { texto: '¿Qué es un contrato?', opciones: ['Acuerdo de voluntades', 'Ley', 'Decreto', 'Reglamento'], correcta: 0, nivel: 'Básico' },
      { texto: '¿Qué es el derecho penal?', opciones: ['Regula delitos y penas', 'Regula contratos', 'Regula familia', 'Regula sucesiones'], correcta: 0, nivel: 'Básico' },
      { texto: '¿Qué es la usucapión?', opciones: ['Pérdida de un derecho', 'Adquisición por posesión', 'Tipo de contrato', 'Sentencia'], correcta: 1, nivel: 'Básico' }
    ],
    grupos: [
      { texto: '¿Qué es la prescripción?', opciones: ['Extinción de derechos por tiempo', 'Nuevo contrato', 'Demanda', 'Sentencia'], correcta: 0, nivel: 'Intermedio' },
      { texto: '¿Qué es la conciliación?', opciones: ['Acuerdo entre partes', 'Juicio', 'Apelación', 'Demanda'], correcta: 0, nivel: 'Intermedio' },
      { texto: '¿Qué es un recurso de apelación?', opciones: ['Impugnar sentencia', 'Iniciar demanda', 'Firmar contrato', 'Pagar multa'], correcta: 0, nivel: 'Intermedio' },
      { texto: '¿Qué es la jurisprudencia?', opciones: ['Interpretación reiterada de leyes', 'Ley nueva', 'Sentencia', 'Demanda'], correcta: 0, nivel: 'Intermedio' },
      { texto: '¿Qué es la doctrina?', opciones: ['Opiniones de juristas', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0, nivel: 'Intermedio' }
    ],
    eliminatorias: [
      { texto: '¿Qué es el amparo?', opciones: ['Juicio de garantías', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0, nivel: 'Avanzado' },
      { texto: '¿Qué es la equidad?', opciones: ['Justicia natural', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0, nivel: 'Avanzado' },
      { texto: '¿Qué es el derecho fiscal?', opciones: ['Regula impuestos', 'Derecho penal', 'Derecho civil', 'Derecho laboral'], correcta: 0, nivel: 'Avanzado' },
      { texto: '¿Qué es la plusvalía?', opciones: ['Ganancia por venta de bienes', 'Impuesto', 'Contrato', 'Sentencia'], correcta: 0, nivel: 'Avanzado' },
      { texto: '¿Qué es el IVA?', opciones: ['Impuesto al valor agregado', 'Impuesto a la renta', 'Impuesto predial', 'Impuesto vehicular'], correcta: 0, nivel: 'Avanzado' }
    ],
    final: [
      { texto: '¿Qué es el debido proceso?', opciones: ['Garantía constitucional', 'Ley', 'Sentencia', 'Demanda'], correcta: 0, nivel: 'Experto' },
      { texto: '¿Qué es la garantía de audiencia?', opciones: ['Derecho a ser escuchado', 'Ley', 'Sentencia', 'Demanda'], correcta: 0, nivel: 'Experto' },
      { texto: '¿Qué es el principio de legalidad?', opciones: ['Nadie está obligado a lo que la ley no manda', 'Ley', 'Sentencia', 'Demanda'], correcta: 0, nivel: 'Experto' },
      { texto: '¿Qué es la presunción de inocencia?', opciones: ['Derecho a ser considerado inocente hasta sentencia firme', 'Ley', 'Sentencia', 'Demanda'], correcta: 0, nivel: 'Experto' },
      { texto: '¿Qué es el principio de irretroactividad?', opciones: ['Las leyes no aplican al pasado', 'Ley', 'Sentencia', 'Demanda'], correcta: 0, nivel: 'Experto' }
    ]
  };

  for (const [fase, preguntas] of Object.entries(preguntasPorDefecto)) {
    for (const pregunta of preguntas) {
      await addDoc(collection(db, COLECCION), {
        ...pregunta,
        fase,
        activa: true,
        creada: new Date().toISOString()
      });
    }
  }
  console.log('✅ Preguntas inicializadas correctamente');
};