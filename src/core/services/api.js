// src/services/api.js
const API_URL = 'http://localhost:3000/api';

console.log('🔧 API_URL:', API_URL);

// ======================
// AUTENTICACIÓN
// ======================
export const loginUser = async (credentials) => {
  console.log('📤 Login a:', `${API_URL}/auth/login`);
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }
  
  return data;
};

export const registerUser = async (userData) => {
  console.log('📝 Registro a:', `${API_URL}/auth/register`);
  
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error al registrar usuario');
  }
  
  return data;
};

// ======================
// EXPEDIENTES
// ======================

// Obtener todos los expedientes
export const getExpedientes = async () => {
  console.log('📁 Obteniendo expedientes...');
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expedientes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener expedientes');
  }
  const data = await response.json();
  console.log('📁 Expedientes recibidos:', data);
  return data;
};

// Obtener un expediente por ID
export const getExpedienteById = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expedientes/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener expediente');
  }
  return response.json();
};

// Crear nuevo expediente
export const createExpediente = async (expedienteData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expedientes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(expedienteData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear expediente');
  }
  return response.json();
};

// Actualizar expediente
export const updateExpediente = async (id, expedienteData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expedientes/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(expedienteData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar expediente');
  }
  return response.json();
};

// Eliminar expediente
export const deleteExpediente = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expedientes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar expediente');
  }
  return response.json();
};

// Agregar documento a expediente
export const addDocumento = async (expedienteId, documentoData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expedientes/${expedienteId}/documentos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(documentoData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al agregar documento');
  }
  return response.json();
};

// Actualizar estado del expediente
export const updateExpedienteEstado = async (id, estado) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/expedientes/${id}/estado`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ estado })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar estado');
  }
  return response.json();
};

// ======================
// CURSOS
// ======================
export const getCursos = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/education`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al obtener cursos');
  return response.json();
};

// ======================
// LIBROS
// ======================
export const getLibros = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/library`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al obtener libros');
  return response.json();
};

// Exportar todo como objeto para debug
const api = {
  loginUser,
  registerUser,
  getExpedientes,
  getExpedienteById,
  createExpediente,
  updateExpediente,
  deleteExpediente,
  addDocumento,
  updateExpedienteEstado,
  getCursos,
  getLibros
};

console.log('📦 API funciones disponibles:', Object.keys(api));
export default api;