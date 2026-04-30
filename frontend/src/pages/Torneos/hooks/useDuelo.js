// src/modules/Torneos/hooks/useDuelo.js
import { useState, useCallback } from 'react';
import { seleccionarPreguntaAleatoria, respuestaRivalInteligente } from '../utils/preguntasBanco';

export const useDuelo = (onTerminarDuelo) => {
  const [dueloActivo, setDueloActivo] = useState(null);
  const [turnoActual, setTurnoActual] = useState('usuario');
  const [puntajeUsuario, setPuntajeUsuario] = useState(0);
  const [puntajeRival, setPuntajeRival] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mensajeDuelo, setMensajeDuelo] = useState('');
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [ganadorDuelo, setGanadorDuelo] = useState(null);
  const [esperandoCambioTurno, setEsperandoCambioTurno] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(null);

  const seleccionarPregunta = useCallback(() => {
    const nuevaPregunta = seleccionarPreguntaAleatoria();
    setPreguntaActual(nuevaPregunta);
    setRespuestaSeleccionada(null);
  }, []);

  const cambiarTurno = useCallback(() => {
    setEsperandoCambioTurno(true);
    setTimeout(() => {
      setTurnoActual(prev => prev === "usuario" ? "rival" : "usuario");
      setRespuestaSeleccionada(null);
      setMensajeDuelo("");
      setEsperandoCambioTurno(false);
      seleccionarPregunta();
    }, 1500);
  }, [seleccionarPregunta]);

  const terminarDuelo = useCallback((ganador) => {
    setDueloTerminado(true);
    setGanadorDuelo(ganador);
    if (onTerminarDuelo) {
      onTerminarDuelo(ganador, puntajeUsuario, puntajeRival);
    }
  }, [puntajeUsuario, puntajeRival, onTerminarDuelo]);

  const responderPregunta = useCallback((indice) => {
    if (respuestaSeleccionada !== null || dueloTerminado || esperandoCambioTurno || !preguntaActual) return;
    
    setRespuestaSeleccionada(indice);
    const esCorrecta = indice === preguntaActual.correcta;
    
    if (turnoActual === "usuario") {
      if (esCorrecta) {
        const nuevoPuntaje = puntajeUsuario + 10;
        setPuntajeUsuario(nuevoPuntaje);
        setMensajeDuelo(`✅ Correcto! +10 puntos (${nuevoPuntaje}/100) - ${preguntaActual.area}`);
        if (nuevoPuntaje >= 100) {
          terminarDuelo("usuario");
        } else {
          cambiarTurno();
        }
      } else {
        setMensajeDuelo(`❌ Incorrecto. Respuesta correcta: ${preguntaActual.opciones[preguntaActual.correcta]}`);
        cambiarTurno();
      }
    }
  }, [respuestaSeleccionada, dueloTerminado, turnoActual, puntajeUsuario, preguntaActual, terminarDuelo, cambiarTurno, esperandoCambioTurno]);

  const respuestaRival = useCallback(() => {
    if (turnoActual !== "rival" || dueloTerminado || respuestaSeleccionada !== null || esperandoCambioTurno || !preguntaActual) return;
    
    const indiceRespuesta = respuestaRivalInteligente(preguntaActual);
    setRespuestaSeleccionada(indiceRespuesta);
    
    const acierta = indiceRespuesta === preguntaActual.correcta;
    if (acierta) {
      const nuevoPuntaje = puntajeRival + 10;
      setPuntajeRival(nuevoPuntaje);
      setMensajeDuelo(`⚖️ Rival acertó! +10 puntos (${nuevoPuntaje}/100) - ${preguntaActual.area}`);
      if (nuevoPuntaje >= 100) {
        terminarDuelo("rival");
      } else {
        cambiarTurno();
      }
    } else {
      setMensajeDuelo(`📜 Rival falló. Respuesta correcta: ${preguntaActual.opciones[preguntaActual.correcta]}`);
      cambiarTurno();
    }
  }, [turnoActual, dueloTerminado, respuestaSeleccionada, esperandoCambioTurno, puntajeRival, preguntaActual, terminarDuelo, cambiarTurno]);

  const iniciarDuelo = useCallback((rival) => {
    setDueloActivo(rival);
    setPuntajeUsuario(0);
    setPuntajeRival(0);
    setTurnoActual("usuario");
    setDueloTerminado(false);
    setGanadorDuelo(null);
    setRespuestaSeleccionada(null);
    setMensajeDuelo("");
    setEsperandoCambioTurno(false);
    seleccionarPregunta();
  }, [seleccionarPregunta]);

  const resetearDuelo = useCallback(() => {
    setDueloActivo(null);
    setPuntajeUsuario(0);
    setPuntajeRival(0);
    setTurnoActual("usuario");
    setDueloTerminado(false);
    setGanadorDuelo(null);
    setRespuestaSeleccionada(null);
    setMensajeDuelo("");
    setEsperandoCambioTurno(false);
    setPreguntaActual(null);
  }, []);

  return {
    dueloActivo,
    turnoActual,
    puntajeUsuario,
    puntajeRival,
    respuestaSeleccionada,
    mensajeDuelo,
    dueloTerminado,
    ganadorDuelo,
    esperandoCambioTurno,
    preguntaActual,
    iniciarDuelo,
    responderPregunta,
    respuestaRival,
    terminarDuelo,
    resetearDuelo,
    seleccionarPregunta
  };
};