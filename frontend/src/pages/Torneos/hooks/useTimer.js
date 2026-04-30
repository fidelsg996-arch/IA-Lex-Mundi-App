// src/modules/Torneos/hooks/useTimer.js
import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime = 20, onTimeout) => {
  const [tiempoRestante, setTiempoRestante] = useState(initialTime);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let interval;
    if (activo && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante(prev => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0 && activo) {
      setActivo(false);
      if (onTimeout) onTimeout();
    }
    return () => clearInterval(interval);
  }, [activo, tiempoRestante, onTimeout]);

  const iniciar = useCallback((newTime = initialTime) => {
    setTiempoRestante(newTime);
    setActivo(true);
  }, [initialTime]);

  const detener = useCallback(() => {
    setActivo(false);
  }, []);

  const reiniciar = useCallback((newTime = initialTime) => {
    setTiempoRestante(newTime);
    setActivo(true);
  }, [initialTime]);

  const reset = useCallback(() => {
    setTiempoRestante(initialTime);
    setActivo(false);
  }, [initialTime]);

  return { 
    tiempoRestante, 
    activo, 
    iniciar, 
    detener, 
    reiniciar,
    reset
  };
};