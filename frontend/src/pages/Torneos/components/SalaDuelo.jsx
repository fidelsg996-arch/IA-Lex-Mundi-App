import { useState, useEffect } from 'react';
import { finalizarPartida, verificarYAvanzarRonda } from '../services/torneoStorage';
import { generarPreguntas } from '../../../utils/preguntasIA';
import { toast } from './Toast';

const PUNTOS_PARA_GANAR = 10;

export default function SalaDuelo({ partida: partidaInicial, currentUser, onFinish }) {
  const [partida, setPartida] = useState(partidaInicial);
  const [indice, setIndice] = useState(partida.pregunta_actual || 0);
  const [misPuntos, setMisPuntos] = useState(
    partida.jugador1_email === currentUser.email ? partida.puntos_j1 : partida.puntos_j2
  );
  const [respondido, setRespondido] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [preguntasCargadas, setPreguntasCargadas] = useState(false);

  const soyJ1 = partida.jugador1_email === currentUser.email;
  const miNombre = soyJ1 ? partida.jugador1_nombre : partida.jugador2_nombre;
  const rivalNombre = soyJ1 ? partida.jugador2_nombre : partida.jugador1_nombre;

  useEffect(() => {
    if (!partida.preguntas || partida.preguntas.length === 0) {
      const nuevas = generarPreguntas(partida.materia, 15);
      const nuevaPartida = { ...partida, preguntas: nuevas };
      const { savePartida } = require('../services/torneoStorage');
      savePartida(nuevaPartida);
      setPartida(nuevaPartida);
    } else {
      setPreguntasCargadas(true);
    }
  }, [partida]);

  const preguntas = partida.preguntas || [];
  const pregunta = preguntas[indice];

  const avanzarPregunta = (sumarPunto) => {
    let nuevosPuntos = misPuntos + (sumarPunto ? 1 : 0);
    setMisPuntos(nuevosPuntos);

    if (nuevosPuntos >= PUNTOS_PARA_GANAR) {
      finalizarDuelo(true);
      return;
    }
    const siguiente = indice + 1;
    if (siguiente >= preguntas.length) {
      finalizarDuelo(true);
      return;
    }
    setIndice(siguiente);
    setRespondido(false);
    setResultado(null);
  };

  const finalizarDuelo = (ganoUsuario) => {
    setDueloTerminado(true);
    const preguntasRespondidas = indice + 1;
    const puntosRival = Math.floor(preguntasRespondidas * 0.7);
    const ganadorEmail = ganoUsuario ? currentUser.email : partida.jugador2_email;
    const ganadorNombre = ganoUsuario ? miNombre : rivalNombre;

    finalizarPartida(
      partida.id,
      ganadorEmail,
      ganadorNombre,
      soyJ1 ? misPuntos : puntosRival,
      soyJ1 ? puntosRival : misPuntos
    );

    if (ganoUsuario) toast.success('🎉 ¡Ganaste el duelo!');
    else toast.error('💀 Perdiste el duelo.');

    setTimeout(() => {
      verificarYAvanzarRonda(partida.torneo_id);
      setTimeout(() => onFinish(), 500);
    }, 2000);
  };

  const manejarRespuesta = (opcionIdx) => {
    if (respondido || dueloTerminado || !pregunta) return;
    const esCorrecta = (opcionIdx === pregunta.correcta);
    setRespondido(true);
    setResultado(esCorrecta ? 'correcto' : 'incorrecto');
    setTimeout(() => avanzarPregunta(esCorrecta), 1000);
  };

  if (dueloTerminado) {
    return <div className="text-center py-8">Finalizando duelo...</div>;
  }

  if (!preguntasCargadas || !pregunta) {
    return <div className="text-center py-8">Cargando preguntas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>Ronda {partida.ronda}</span>
        <span>Tu puntaje: {misPuntos}</span>
        <span>Rival: {partida.puntos_j2}</span>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="font-bold">{pregunta.pregunta}</p>
        <div className="grid gap-2 mt-3">
          {pregunta.opciones.map((op, idx) => (
            <button key={idx} disabled={respondido} onClick={() => manejarRespuesta(idx)} className="border p-2 rounded hover:bg-gray-100 text-left">
              {String.fromCharCode(65+idx)}. {op}
            </button>
          ))}
        </div>
      </div>
      {resultado === 'correcto' && <div className="text-green-600">✓ Correcto +1 punto</div>}
      {resultado === 'incorrecto' && <div className="text-red-600">✗ Incorrecto</div>}
      <button onClick={onFinish} className="text-gray-500">← Volver</button>
    </div>
  );
}