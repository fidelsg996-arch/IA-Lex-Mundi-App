// src/services/expedienteService.js
import { db } from '../firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const COLECCION = 'expedientes';

// Obtener todos los expedientes de un usuario
export const obtenerExpedientes = async (usuarioId) => {
  try {
    const q = query(collection(db, COLECCION), where('usuarioId', '==', usuarioId));
    const querySnapshot = await getDocs(q);
    const expedientes = [];
    querySnapshot.forEach((doc) => {
      expedientes.push({ id: doc.id, ...doc.data() });
    });
    return expedientes;
  } catch (error) {
    console.error('Error obteniendo expedientes:', error);
    return [];
  }
};

// Obtener un expediente por ID
export const obtenerExpedientePorId = async (expedienteId) => {
  try {
    const docRef = doc(db, COLECCION, expedienteId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo expediente:', error);
    return null;
  }
};

// Crear un nuevo expediente
export const crearExpediente = async (expedienteData) => {
  try {
    const docRef = doc(collection(db, COLECCION));
    const nuevoExpediente = {
      ...expedienteData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, nuevoExpediente);
    return nuevoExpediente;
  } catch (error) {
    console.error('Error creando expediente:', error);
    throw error;
  }
};

// Actualizar un expediente
export const actualizarExpediente = async (expedienteId, expedienteData) => {
  try {
    const docRef = doc(db, COLECCION, expedienteId);
    const data = {
      ...expedienteData,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(docRef, data);
    return { id: expedienteId, ...data };
  } catch (error) {
    console.error('Error actualizando expediente:', error);
    throw error;
  }
};

// Eliminar un expediente
export const eliminarExpedienteFirestore = async (expedienteId) => {
  try {
    const docRef = doc(db, COLECCION, expedienteId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error eliminando expediente:', error);
    throw error;
  }
};