// modules/expedientes/services/expedienteService.js
import { httpService } from '../../../core/services/httpService';
import { API_CONFIG } from '../../../core/config/apiConfig';

class ExpedienteService {
  async getAll() {
    return httpService.get(API_CONFIG.ENDPOINTS.EXPEDIENTES.BASE);
  }

  async getById(id) {
    return httpService.get(API_CONFIG.ENDPOINTS.EXPEDIENTES.BY_ID(id));
  }

  async create(data) {
    return httpService.post(API_CONFIG.ENDPOINTS.EXPEDIENTES.BASE, data);
  }

  async update(id, data) {
    return httpService.put(API_CONFIG.ENDPOINTS.EXPEDIENTES.BY_ID(id), data);
  }

  async delete(id) {
    return httpService.delete(API_CONFIG.ENDPOINTS.EXPEDIENTES.BY_ID(id));
  }

  async addDocumento(expedienteId, documento) {
    return httpService.post(API_CONFIG.ENDPOINTS.EXPEDIENTES.DOCUMENTOS(expedienteId), documento);
  }

  async updateEstado(id, estado) {
    return httpService.patch(API_CONFIG.ENDPOINTS.EXPEDIENTES.ESTADO(id), { estado });
  }

  async getEstadisticas() {
    return httpService.get(API_CONFIG.ENDPOINTS.EXPEDIENTES.ESTADISTICAS);
  }
}

export const expedienteService = new ExpedienteService();