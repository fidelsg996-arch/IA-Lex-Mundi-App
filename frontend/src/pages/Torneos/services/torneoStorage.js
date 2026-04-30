// src/modules/Torneos/services/torneoStorage.js
import { generarPreguntas } from '../../../utils/preguntasIA';

const STORAGE_KEYS = {
  TORNEOS: 'lexmindi_torneos',
  JUGADORES: 'lexmindi_jugadores',
  PARTIDAS: 'lexmindi_partidas',
};

// ==================== TORNEOS ====================
export const getTorneos = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TORNEOS);
  return data ? JSON.parse(data) : [];
};

export const saveTorneo = (torneo) => {
  const torneos = getTorneos();
  const index = torneos.findIndex(t => t.id === torneo.id);
  if (index >= 0) torneos[index] = torneo;
  else torneos.push(torneo);
  localStorage.setItem(STORAGE_KEYS.TORNEOS, JSON.stringify(torneos));
  return torneo;
};

export const getTorneoById = (id) => {
  const torneos = getTorneos();
  return torneos.find(t => t.id === id);
};

// ==================== JUGADORES ====================
export const getJugadores = () => {
  const data = localStorage.getItem(STORAGE_KEYS.JUGADORES);
  return data ? JSON.parse(data) : [];
};

export const saveJugador = (jugador) => {
  const jugadores = getJugadores();
  const index = jugadores.findIndex(j => j.id === jugador.id);
  if (index >= 0) jugadores[index] = jugador;
  else jugadores.push(jugador);
  localStorage.setItem(STORAGE_KEYS.JUGADORES, JSON.stringify(jugadores));
  return jugador;
};

// ==================== PARTIDAS ====================
export const getPartidas = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PARTIDAS);
  return data ? JSON.parse(data) : [];
};

export const savePartida = (partida) => {
  const partidas = getPartidas();
  const index = partidas.findIndex(p => p.id === partida.id);
  if (index >= 0) partidas[index] = partida;
  else partidas.push(partida);
  localStorage.setItem(STORAGE_KEYS.PARTIDAS, JSON.stringify(partidas));
  return partida;
};

export const getPartidasByTorneo = (torneoId) => {
  const partidas = getPartidas();
  return partidas.filter(p => p.torneo_id === torneoId);
};

export const getPartidasByRonda = (torneoId, ronda) => {
  const partidas = getPartidas();
  return partidas.filter(p => p.torneo_id === torneoId && p.ronda === ronda);
};

// ==================== UTILS ====================
const generarIA = (index) => {
  const nombres = [
    "Lic. Sofía Ramírez IA", "Dr. Carlos Mendoza IA", "Lic. Valeria Torres IA",
    "Dr. Alejandro Ruiz IA", "Lic. Fernanda López IA", "Dr. Miguel Herrera IA",
    "Lic. Daniela Cruz IA", "Dr. Pablo Guerrero IA", "Lic. Mariana Reyes IA"
  ];
  const nombre = nombres[index % nombres.length] + (Math.floor(index / nombres.length) + 1);
  return {
    id: `ia_${Date.now()}_${index}`,
    email: `ia_${Date.now()}_${index}@lexmundi.ia`,
    nombre: nombre,
  };
};

// ==================== LÓGICA PRINCIPAL ====================

export const crearTorneo = (nombre, materia, maxJugadores, premio, creadorEmail, creadorNombre) => {
  const nuevoTorneo = {
    id: `torneo_${Date.now()}`,
    nombre,
    materia,
    max_jugadores: maxJugadores,
    premio: premio || 'Sin premio',
    creado_por: creadorEmail,
    creado_por_nombre: creadorNombre,
    fecha_creacion: new Date().toISOString(),
    estado: 'abierto',
    ronda_actual: 1,
    meta_puntos: 10,
  };
  saveTorneo(nuevoTorneo);
  return nuevoTorneo;
};

export const inscribirUsuario = (torneoId, usuarioEmail, usuarioNombre) => {
  const torneo = getTorneoById(torneoId);
  if (!torneo) throw new Error('Torneo no encontrado');

  // Limpiar partidas anteriores del torneo
  const partidasAntiguas = getPartidasByTorneo(torneoId);
  partidasAntiguas.forEach(p => {
    const partidas = getPartidas();
    const nuevas = partidas.filter(p2 => p2.id !== p.id);
    localStorage.setItem(STORAGE_KEYS.PARTIDAS, JSON.stringify(nuevas));
  });

  // Crear lista de jugadores: usuario + IAs
  const jugadores = [{ email: usuarioEmail, nombre: usuarioNombre }];
  for (let i = 1; i < torneo.max_jugadores; i++) {
    const ia = generarIA(i);
    jugadores.push({ email: ia.email, nombre: ia.nombre });
    saveJugador({
      id: ia.id,
      torneo_id: torneoId,
      usuario_email: ia.email,
      usuario_nombre: ia.nombre,
      estado: 'activo',
      puntos_totales: 0,
      victorias: 0,
      derrotas: 0,
    });
  }

  // Mezclar
  for (let i = jugadores.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jugadores[i], jugadores[j]] = [jugadores[j], jugadores[i]];
  }

  // Crear partidas de primera ronda con preguntas
  const partidas = [];
  for (let i = 0; i < jugadores.length; i += 2) {
    if (i + 1 < jugadores.length) {
      const preguntas = generarPreguntas(torneo.materia, 15);
      partidas.push({
        id: `partida_${Date.now()}_${i}`,
        torneo_id: torneoId,
        ronda: 1,
        jugador1_email: jugadores[i].email,
        jugador1_nombre: jugadores[i].nombre,
        jugador2_email: jugadores[i + 1].email,
        jugador2_nombre: jugadores[i + 1].nombre,
        estado: 'esperando',
        puntos_j1: 0,
        puntos_j2: 0,
        pregunta_actual: 0,
        preguntas: preguntas,
        respuestas: [],
        materia: torneo.materia,
      });
    }
  }

  partidas.forEach(p => savePartida(p));
  return partidas;
};

export const obtenerMiPartida = (torneoId, usuarioEmail, ronda) => {
  const partidas = getPartidasByRonda(torneoId, ronda);
  return partidas.find(p => p.jugador1_email === usuarioEmail || p.jugador2_email === usuarioEmail);
};

export const finalizarPartida = (partidaId, ganadorEmail, ganadorNombre, puntosJ1, puntosJ2) => {
  const partida = getPartidas().find(p => p.id === partidaId);
  if (!partida) throw new Error('Partida no encontrada');
  const partidaFinalizada = {
    ...partida,
    estado: 'finalizada',
    ganador_email: ganadorEmail,
    ganador_nombre: ganadorNombre,
    puntos_j1: puntosJ1,
    puntos_j2: puntosJ2,
  };
  savePartida(partidaFinalizada);
  return partidaFinalizada;
};

const resolverDueloIA = (partida) => {
  if (partida.estado === 'finalizada') return partida;
  const ganaJugador1 = Math.random() < 0.5;
  const ganadorEmail = ganaJugador1 ? partida.jugador1_email : partida.jugador2_email;
  const ganadorNombre = ganaJugador1 ? partida.jugador1_nombre : partida.jugador2_nombre;
  const puntosJ1 = ganaJugador1 ? 10 : Math.floor(Math.random() * 6);
  const puntosJ2 = ganaJugador1 ? Math.floor(Math.random() * 6) : 10;
  return finalizarPartida(partida.id, ganadorEmail, ganadorNombre, puntosJ1, puntosJ2);
};

export const verificarYAvanzarRonda = (torneoId) => {
  const torneo = getTorneoById(torneoId);
  if (!torneo) return false;
  if (torneo.estado === 'finalizado') return false;

  const rondaActual = torneo.ronda_actual;
  let partidasRonda = getPartidasByRonda(torneoId, rondaActual);
  if (partidasRonda.length === 0) return false;

  // Resolver duelos entre IAs
  let algunaCambio = false;
  partidasRonda = partidasRonda.map(p => {
    const esIA1 = p.jugador1_email?.includes('@lexmundi.ia');
    const esIA2 = p.jugador2_email?.includes('@lexmundi.ia');
    if (p.estado !== 'finalizada' && esIA1 && esIA2) {
      algunaCambio = true;
      return resolverDueloIA(p);
    }
    return p;
  });
  if (algunaCambio) {
    partidasRonda = getPartidasByRonda(torneoId, rondaActual);
  }

  const todasFinalizadas = partidasRonda.every(p => p.estado === 'finalizada');
  if (!todasFinalizadas) return false;

  const ganadores = partidasRonda.map(p => ({
    email: p.ganador_email,
    nombre: p.ganador_nombre,
  })).filter(g => g.email);

  if (ganadores.length === 1) {
    torneo.estado = 'finalizado';
    torneo.ganador_email = ganadores[0].email;
    torneo.ganador_nombre = ganadores[0].nombre;
    torneo.ronda_actual = rondaActual + 1;
    saveTorneo(torneo);
    return true;
  }

  const nuevaRonda = rondaActual + 1;
  const nuevasPartidas = [];
  for (let i = 0; i < ganadores.length; i += 2) {
    if (i + 1 < ganadores.length) {
      nuevasPartidas.push({
        id: `partida_${Date.now()}_${nuevaRonda}_${i}`,
        torneo_id: torneoId,
        ronda: nuevaRonda,
        jugador1_email: ganadores[i].email,
        jugador1_nombre: ganadores[i].nombre,
        jugador2_email: ganadores[i + 1].email,
        jugador2_nombre: ganadores[i + 1].nombre,
        estado: 'esperando',
        puntos_j1: 0,
        puntos_j2: 0,
        pregunta_actual: 0,
        preguntas: null,
        respuestas: [],
        materia: torneo.materia,
      });
    }
  }

  nuevasPartidas.forEach(p => savePartida(p));
  torneo.ronda_actual = nuevaRonda;
  torneo.estado = 'en_curso';
  saveTorneo(torneo);
  return true;
};

export const eliminarTorneoCompleto = (torneoId) => {
  try {
    const torneos = getTorneos();
    const partidas = getPartidas();
    const jugadores = getJugadores();
    const nuevosTorneos = torneos.filter(t => t.id !== torneoId);
    const nuevasPartidas = partidas.filter(p => p.torneo_id !== torneoId);
    const nuevosJugadores = jugadores.filter(j => j.torneo_id !== torneoId);
    localStorage.setItem(STORAGE_KEYS.TORNEOS, JSON.stringify(nuevosTorneos));
    localStorage.setItem(STORAGE_KEYS.PARTIDAS, JSON.stringify(nuevasPartidas));
    localStorage.setItem(STORAGE_KEYS.JUGADORES, JSON.stringify(nuevosJugadores));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};