// src/services/torneoApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Obtener usuario actual del localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('lexmindi_current_user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Configuración de axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el email del usuario a los headers
apiClient.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    console.log('🔍 [API] Usuario obtenido:', user);
    if (user && user.email) {
      config.headers['X-User-Email'] = user.email;
      console.log('✅ [API] Email enviado:', user.email);
    } else {
      console.log('⚠️ [API] No se encontró usuario o email');
    }
    console.log('📨 [API] Headers finales:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== TORNEOS ==========
export const obtenerTorneoActivo = async () => {
  const response = await apiClient.get('/torneos');
  return response.data;
};

export const registrarParticipante = async (datos) => {
  const response = await apiClient.post('/torneos/registrar', datos);
  return response.data;
};

export const pagarInscripcion = async () => {
  const response = await apiClient.post('/torneos/pagar-inscripcion');
  return response.data;
};

export const obtenerMiParticipante = async () => {
  const response = await apiClient.get('/torneos/participante');
  return response.data;
};

export const recargarSaldo = async (monto, datosPago) => {
  const response = await apiClient.post('/torneos/recargar', { monto, datosPago });
  return response.data;
};

export const obtenerTransacciones = async () => {
  const response = await apiClient.get('/torneos/transacciones');
  return response.data;
};

// ========== DUELOS ==========
export const buscarRival = async () => {
  const response = await apiClient.get('/torneos/buscar-rival');
  return response.data;
};

export const iniciarDuelo = async (rivalId, tipo, grupoId = null) => {
  const response = await apiClient.post('/torneos/iniciar-duelo', { rivalId, tipo, grupoId });
  return response.data;
};

export const responderPregunta = async (dueloId, respuestaIndex) => {
  const response = await apiClient.post('/torneos/responder', { dueloId, respuestaIndex });
  return response.data;
};

export const obtenerDueloActivo = async () => {
  const response = await apiClient.get('/torneos/duelo-activo');
  return response.data;
};

// ========== GRUPOS ==========
export const generarFaseGrupos = async () => {
  const response = await apiClient.post('/torneos/generar-grupos');
  return response.data;
};

export const obtenerGrupos = async () => {
  const response = await apiClient.get('/torneos/grupos');
  return response.data;
};

export const obtenerMiGrupo = async () => {
  const response = await apiClient.get('/torneos/mi-grupo');
  return response.data;
};

// ========== ELIMINATORIA ==========
export const generarEliminatoria = async () => {
  const response = await apiClient.post('/torneos/generar-eliminatoria');
  return response.data;
};

export const obtenerEliminatoria = async () => {
  const response = await apiClient.get('/torneos/eliminatoria');
  return response.data;
};

export default {
  obtenerTorneoActivo,
  registrarParticipante,
  pagarInscripcion,
  obtenerMiParticipante,
  recargarSaldo,
  obtenerTransacciones,
  buscarRival,
  iniciarDuelo,
  responderPregunta,
  obtenerDueloActivo,
  generarFaseGrupos,
  obtenerGrupos,
  obtenerMiGrupo,
  generarEliminatoria,
  obtenerEliminatoria,
};