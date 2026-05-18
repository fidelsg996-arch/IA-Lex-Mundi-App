import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4242/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para añadir token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores de autenticación
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/acceso';
        }
        return Promise.reject(error);
      }
    );
  }

  async request(endpoint, options = {}) {
    try {
      const response = await this.api({
        url: endpoint,
        method: options.method || 'GET',
        data: options.body ? JSON.parse(options.body) : undefined,
        params: options.params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  }

  // ============================================
  // 🔐 USUARIOS Y AUTENTICACIÓN
  // ============================================

  async register(userData) {
    const response = await this.api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async login(email, password) {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  async getUserProfile() {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async updateUserProfile(data) {
    const response = await this.api.put('/users/me', data);
    return response.data;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      const token = localStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          this.logout();
          return null;
        }
      }
      return user;
    } catch {
      return null;
    }
  }

  // ============================================
  // 💳 STRIPE CONNECT
  // ============================================

  async getOnboardingLink() {
    const response = await this.api.get('/stripe/onboarding-link');
    return response.data;
  }

  async getStripeOnboardingStatus() {
    const response = await this.api.get('/stripe/onboarding-status');
    return response.data;
  }

  async checkPayoutsEligibility() {
    const response = await this.api.get('/stripe/payouts-eligibility');
    return response.data;
  }

  async getConnectedAccount() {
    const response = await this.api.get('/stripe/connected-account');
    return response.data;
  }

  // ============================================
  // 🏆 TORNEOS
  // ============================================

  async getTorneos() {
    const response = await this.api.get('/tournaments');
    return response.data;
  }

  async getTorneoById(id) {
    const response = await this.api.get(`/tournaments/${id}`);
    return response.data;
  }

  async getTorneosActivos() {
    const response = await this.api.get('/tournaments/active');
    return response.data;
  }

  async getTorneosFinalizados() {
    const response = await this.api.get('/tournaments/completed');
    return response.data;
  }

  async registrarEnTorneo(tournamentId, paymentMethodId) {
    const response = await this.api.post(`/tournaments/${tournamentId}/register`, {
      paymentMethodId,
    });
    return response.data;
  }

  async getParticipantes(tournamentId) {
    const response = await this.api.get(`/tournaments/${tournamentId}/participants`);
    return response.data;
  }

  async getResultados(tournamentId) {
    const response = await this.api.get(`/tournaments/${tournamentId}/results`);
    return response.data;
  }

  // ============================================
  // 🎁 PREMIOS
  // ============================================

  async getMisPremios() {
    const response = await this.api.get('/prizes/my-prizes');
    return response.data;
  }

  async getPremiosPendientes() {
    const response = await this.api.get('/prizes/pending');
    return response.data;
  }

  async getPremiosReclamados() {
    const response = await this.api.get('/prizes/claimed');
    return response.data;
  }

  async reclamarPremioEfectivo(data) {
    const response = await this.api.post('/prizes/claim-cash', data);
    return response.data;
  }

  async reclamarPremioEspecie(data) {
    const response = await this.api.post('/prizes/claim-item', data);
    return response.data;
  }

  async registrarReclamoPremio(data) {
    const response = await this.api.post('/prizes/claim', data);
    return response.data;
  }

  async validarCodigoPremio(codigo) {
    const response = await this.api.get(`/prizes/validate/${codigo}`);
    return response.data;
  }

  async getPremioById(premioId) {
    const response = await this.api.get(`/prizes/${premioId}`);
    return response.data;
  }

  // ============================================
  // 📚 CURSOS
  // ============================================

  async getCursos() {
    const response = await this.api.get('/courses');
    return response.data;
  }

  async getCursoById(cursoId) {
    const response = await this.api.get(`/courses/${cursoId}`);
    return response.data;
  }

  async getMisCursos() {
    const response = await this.api.get('/courses/my-courses');
    return response.data;
  }

  async comprarCurso(cursoId, paymentMethodId) {
    const response = await this.api.post('/courses/purchase', {
      courseId: cursoId,
      paymentMethodId,
    });
    return response.data;
  }

  async obtenerProgresoCurso(cursoId) {
    const response = await this.api.get(`/courses/${cursoId}/progress`);
    return response.data;
  }

  async actualizarProgresoCurso(cursoId, leccionId, progreso) {
    const response = await this.api.put(`/courses/${cursoId}/progress`, {
      leccionId,
      progreso,
    });
    return response.data;
  }

  // ============================================
  // 📖 LIBROS
  // ============================================

  async getLibros() {
    const response = await this.api.get('/books');
    return response.data;
  }

  async getLibroById(libroId) {
    const response = await this.api.get(`/books/${libroId}`);
    return response.data;
  }

  async getMisLibros() {
    const response = await this.api.get('/books/my-books');
    return response.data;
  }

  async comprarLibro(libroId, paymentMethodId) {
    const response = await this.api.post('/books/purchase', {
      bookId: libroId,
      paymentMethodId,
    });
    return response.data;
  }

  // ============================================
  // 🎓 DIPLOMADOS
  // ============================================

  async getDiplomados() {
    const response = await this.api.get('/diplomas');
    return response.data;
  }

  async getDiplomadoById(diplomaId) {
    const response = await this.api.get(`/diplomas/${diplomaId}`);
    return response.data;
  }

  async getMisDiplomados() {
    const response = await this.api.get('/diplomas/my-diplomas');
    return response.data;
  }

  async comprarDiplomado(diplomaId, paymentMethodId) {
    const response = await this.api.post('/diplomas/purchase', {
      diplomaId: diplomaId,
      paymentMethodId,
    });
    return response.data;
  }

  // ============================================
  // 💰 BILLETERA
  // ============================================

  async getBalance() {
    const response = await this.api.get('/wallet/balance');
    return response.data;
  }

  async getTransacciones(limit = 10, offset = 0) {
    const response = await this.api.get('/wallet/transactions', {
      params: { limit, offset },
    });
    return response.data;
  }

  async getIngresos() {
    const response = await this.api.get('/wallet/income');
    return response.data;
  }

  async getEgresos() {
    const response = await this.api.get('/wallet/expenses');
    return response.data;
  }

  // ============================================
  // 🔔 SUSCRIPCIONES
  // ============================================

  async getPlanesSuscripcion() {
    const response = await this.api.get('/subscriptions/plans');
    return response.data;
  }

  async crearSuscripcion(priceId, paymentMethodId) {
    const response = await this.api.post('/subscriptions/create', {
      priceId,
      paymentMethodId,
    });
    return response.data;
  }

  async getMiSuscripcion() {
    const response = await this.api.get('/subscriptions/my-subscription');
    return response.data;
  }

  async cancelarSuscripcion() {
    const response = await this.api.post('/subscriptions/cancel');
    return response.data;
  }

  async reactivarSuscripcion() {
    const response = await this.api.post('/subscriptions/reactivate');
    return response.data;
  }

  // ============================================
  // 🎟️ MÉTODOS DE PAGO
  // ============================================

  async getMetodosPago() {
    const response = await this.api.get('/payment-methods');
    return response.data;
  }

  async agregarMetodoPago(paymentMethodId) {
    const response = await this.api.post('/payment-methods', { paymentMethodId });
    return response.data;
  }

  async eliminarMetodoPago(paymentMethodId) {
    const response = await this.api.delete(`/payment-methods/${paymentMethodId}`);
    return response.data;
  }

  async setDefaultPaymentMethod(paymentMethodId) {
    const response = await this.api.put('/payment-methods/default', { paymentMethodId });
    return response.data;
  }

  // ============================================
  // 🧪 UTILIDADES
  // ============================================

  async healthCheck() {
    const response = await this.api.get('/health');
    return response.data;
  }

  async getConfiguracion() {
    const response = await this.api.get('/config');
    return response.data;
  }
}

export default new ApiService();