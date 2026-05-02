// core/services/authService.js
import { httpService } from './httpService';
import { API_CONFIG } from '../config/apiConfig';

class AuthService {
  async login(email, password) {
    const response = await httpService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async register(userData) {
    const response = await httpService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();