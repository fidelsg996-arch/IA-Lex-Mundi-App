// src/hooks/usePersistencia.js
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const usePersistencia = (coleccion, datosIniciales = null) => {
  const { user } = useAuth();
  const [datos, setDatos] = useState(datosIniciales);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Obtener clave única del usuario (email)
  const getUserKey = () => {
    if (!user || !user.email) return 'anonimo';
    return user.email.replace(/\./g, '_');
  };

  // Cargar datos desde Firestore
  const cargarDatos = async () => {
    try {
      setCargando(true);
      const userKey = getUserKey();
      const docRef = doc(db, coleccion, userKey);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setDatos(docSnap.data().datos || datosIniciales);
      } else {
        setDatos(datosIniciales);
      }
      setError(null);
    } catch (err) {
      console.error(`Error cargando ${coleccion}:`, err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Guardar datos en Firestore
  const guardarDatos = async (nuevosDatos) => {
    try {
      const userKey = getUserKey();
      const docRef = doc(db, coleccion, userKey);
      await setDoc(docRef, {
        userId: userKey,
        userEmail: user.email,
        ultimaActualizacion: new Date().toISOString(),
        datos: nuevosDatos
      }, { merge: true });
      
      setDatos(nuevosDatos);
      return true;
    } catch (err) {
      console.error(`Error guardando ${coleccion}:`, err);
      setError(err.message);
      return false;
    }
  };

  // Actualizar una parte específica de los datos
  const actualizarDatos = async (nuevosValores) => {
    const nuevosDatos = { ...datos, ...nuevosValores };
    return await guardarDatos(nuevosDatos);
  };

  useEffect(() => {
    cargarDatos();
  }, [user?.email]);

  return {
    datos,
    cargando,
    error,
    guardarDatos,
    actualizarDatos,
    recargar: cargarDatos
  };
};