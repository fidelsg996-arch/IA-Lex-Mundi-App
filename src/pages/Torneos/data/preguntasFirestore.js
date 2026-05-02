// src/pages/Torneos/data/preguntasFirestore.js
import { obtenerPreguntasPorFase } from '../../../services/preguntasService';

let cachePreguntas = {
  clasificacion: null,
  grupos: null,
  eliminatorias: null,
  final: null
};

export const obtenerPreguntasParaFase = async (fase, cantidad = 15) => {
  // Usar caché para evitar múltiples llamadas
  if (cachePreguntas[fase] && cachePreguntas[fase].length >= cantidad) {
    const mezcladas = [...cachePreguntas[fase]].sort(() => Math.random() - 0.5);
    return mezcladas.slice(0, cantidad);
  }
  
  const preguntas = await obtenerPreguntasPorFase(fase, cantidad * 2);
  cachePreguntas[fase] = preguntas;
  
  const mezcladas = [...preguntas].sort(() => Math.random() - 0.5);
  return mezcladas.slice(0, cantidad);
};

export const limpiarCachePreguntas = () => {
  cachePreguntas = {
    clasificacion: null,
    grupos: null,
    eliminatorias: null,
    final: null
  };
};