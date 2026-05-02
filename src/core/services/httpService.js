// core/services/httpService.js
import { API_CONFIG } from '../config/apiConfig';

class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error en la petición');
    }
    
    return data;
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(body) 
    });
  }
}

export const httpService = new HttpService();