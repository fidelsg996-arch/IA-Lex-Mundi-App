// core/config/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout'
    },
    EXPEDIENTES: {
      BASE: '/expedientes',
      BY_ID: (id) => `/expedientes/${id}`,
      DOCUMENTOS: (id) => `/expedientes/${id}/documentos`,
      ESTADO: (id) => `/expedientes/${id}/estado`,
      ESTADISTICAS: '/expedientes/estadisticas/resumen'
    },
    CURSOS: {
      BASE: '/education'
    },
    LIBROS: {
      BASE: '/library'
    }
  }
};