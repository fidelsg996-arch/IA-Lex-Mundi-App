// src/modules/Torneos/hooks/useTorneoData.js (versión actualizada con admin)
import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEY_TORNEOS, STORAGE_KEY_TORNEO_ACTIVO, torneosPredeterminados } from '../utils/constantes';

export const useTorneoData = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [librosDisponibles, setLibrosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarTorneos = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY_TORNEOS);
    if (stored) {
      const torneosGuardados = JSON.parse(stored);
      if (torneosGuardados && torneosGuardados.length > 0) {
        setTorneos(torneosGuardados);
      } else {
        setTorneos(torneosPredeterminados);
        localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(torneosPredeterminados));
      }
    } else {
      setTorneos(torneosPredeterminados);
      localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(torneosPredeterminados));
    }
    setCargando(false);
  }, []);

  const cargarTorneoActivo = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY_TORNEO_ACTIVO);
    if (stored) {
      const torneoActivoGuardado = JSON.parse(stored);
      // Verificar que el torneo aún existe en la lista actual
      const existe = torneos.some(t => t.id === torneoActivoGuardado.id);
      if (existe) {
        setTorneoActivo(torneoActivoGuardado);
      } else if (torneos.length > 0) {
        setTorneoActivo(torneos[0]);
        localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(torneos[0]));
      }
    } else if (torneos.length > 0) {
      setTorneoActivo(torneos[0]);
      localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(torneos[0]));
    }
  }, [torneos]);

  const guardarTorneo = useCallback((formData, editandoTorneo = null) => {
    let torneoGuardado;
    
    if (editandoTorneo) {
      torneoGuardado = { ...formData, id: editandoTorneo.id };
      const nuevosTorneos = torneos.map(t => t.id === editandoTorneo.id ? torneoGuardado : t);
      setTorneos(nuevosTorneos);
      localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(nuevosTorneos));
      
      if (torneoActivo?.id === editandoTorneo.id) {
        setTorneoActivo(torneoGuardado);
        localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(torneoGuardado));
      }
    } else {
      torneoGuardado = { ...formData, id: Date.now() };
      const nuevosTorneos = [...torneos, torneoGuardado];
      setTorneos(nuevosTorneos);
      localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(nuevosTorneos));
    }
    
    return torneoGuardado;
  }, [torneos, torneoActivo]);

  const eliminarTorneo = useCallback((id) => {
    const torneoAEliminar = torneos.find(t => t.id === id);
    if (!torneoAEliminar) return false;
    
    const nuevosTorneos = torneos.filter(t => t.id !== id);
    setTorneos(nuevosTorneos);
    localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(nuevosTorneos));
    
    if (torneoActivo?.id === id) {
      const otroTorneo = nuevosTorneos.find(t => t.estado === 'activo') || nuevosTorneos[0];
      if (otroTorneo) {
        setTorneoActivo(otroTorneo);
        localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(otroTorneo));
      } else {
        setTorneoActivo(null);
        localStorage.removeItem(STORAGE_KEY_TORNEO_ACTIVO);
      }
    }
    return true;
  }, [torneos, torneoActivo]);

  const activarTorneo = useCallback((torneo) => {
    setTorneoActivo(torneo);
    localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(torneo));
  }, []);

  const cargarLibros = useCallback(() => {
    const stored = localStorage.getItem('lexmindi_libros');
    if (stored) {
      try {
        const libros = JSON.parse(stored);
        setLibrosDisponibles(libros.map(libro => ({
          id: libro.id,
          titulo: libro.titulo,
          imagen: libro.imagen,
          precio: libro.precio
        })));
      } catch (e) {
        setLibrosDisponibles([]);
      }
    } else {
      setLibrosDisponibles([]);
    }
  }, []);

  useEffect(() => {
    cargarTorneos();
    cargarLibros();
  }, [cargarTorneos, cargarLibros]);

  useEffect(() => {
    if (torneos.length > 0 && !cargando) {
      cargarTorneoActivo();
    }
  }, [torneos, cargarTorneoActivo, cargando]);

  return {
    torneos,
    torneoActivo,
    librosDisponibles,
    cargando,
    guardarTorneo,
    eliminarTorneo,
    activarTorneo,
    recargarTorneos: cargarTorneos
  };
};