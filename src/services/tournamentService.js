import api from './api';

class TournamentService {
  constructor() {
    this.storageKey = 'campeon_actual';
  }

  // Generar código único para el campeón
  generarCodigoCampeon(torneoId, userId) {
    const prefix = 'LX';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const torneoHash = torneoId.toString().slice(-3);
    return `${prefix}-${torneoHash}-${random}-${timestamp}`;
  }

  // Guardar datos del campeón en localStorage (fallback)
  guardarCampeonLocal(campeonData) {
    localStorage.setItem(this.storageKey, JSON.stringify(campeonData));
  }

  // Obtener campeón de localStorage
  obtenerCampeonLocal() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  // Limpiar datos del campeón
  limpiarCampeonLocal() {
    localStorage.removeItem(this.storageKey);
  }

  // Registrar ganador del torneo (backend + local)
  async registrarGanador(torneoId, ganador, premio) {
    const codigo = this.generarCodigoCampeon(torneoId, ganador.id);
    
    const campeonData = {
      id: Date.now(),
      torneo: {
        id: torneoId,
        titulo: ganador.torneoTitulo || 'Torneo Jurídico'
      },
      premio: premio, // Puede ser número (efectivo) o string (libro)
      codigo: codigo,
      fecha: new Date().toISOString(),
      ganador_id: ganador.id,
      ganador_nombre: ganador.nombre,
      reclamado: false
    };
    
    // Guardar en localStorage como fallback
    this.guardarCampeonLocal(campeonData);
    
    // Guardar en el backend
    try {
      const response = await api.request('/tournaments/winner', {
        method: 'POST',
        body: JSON.stringify({
          tournamentId: torneoId,
          winnerId: ganador.id,
          winnerName: ganador.nombre,
          prize: premio,
          code: codigo
        })
      });
      
      return { success: true, data: response, localData: campeonData };
    } catch (error) {
      console.error('Error guardando en backend:', error);
      // Si falla el backend, al menos tenemos el localStorage
      return { success: false, error: error.message, localData: campeonData };
    }
  }

  // Verificar si un premio es en efectivo
  esPremioEnEfectivo(premio) {
    if (typeof premio === 'number') return true;
    if (typeof premio === 'string') {
      return premio.startsWith('$') || 
             premio.includes('USD') || 
             premio.includes('MXN') ||
             /^\$?\d+(?:,\d+)*(?:\.\d+)?/.test(premio);
    }
    return false;
  }

  // Obtener monto de un premio en efectivo
  obtenerMontoPremio(premio) {
    if (typeof premio === 'number') return premio;
    if (typeof premio === 'string') {
      const match = premio.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
      if (match) return parseFloat(match[1].replace(/,/g, ''));
    }
    return 0;
  }

  // Verificar premios pendientes del usuario
  async verificarPremiosPendientes() {
    try {
      const premios = await api.getPremiosPendientes();
      return premios.filter(p => p.status === 'pending' || p.status === 'pending_onboarding');
    } catch (error) {
      // Fallback a localStorage
      const localCampeon = this.obtenerCampeonLocal();
      if (localCampeon && !localCampeon.reclamado) {
        return [{
          id: 'local_' + localCampeon.id,
          tournament_name: localCampeon.torneo?.titulo,
          amount: this.obtenerMontoPremio(localCampeon.premio),
          prize: localCampeon.premio,
          code: localCampeon.codigo,
          status: 'pending',
          isLocal: true
        }];
      }
      return [];
    }
  }

  // Procesar reclamo de premio
  async procesarReclamo(torneoId, codigo, monto) {
    try {
      const response = await api.reclamarPremioEfectivo({
        tournamentId: torneoId,
        codigo: codigo,
        monto: monto
      });
      
      if (response.success) {
        this.limpiarCampeonLocal();
      }
      
      return response;
    } catch (error) {
      console.error('Error procesando reclamo:', error);
      throw error;
    }
  }

  // Verificar si el usuario puede recibir pagos (onboarding completado)
  async puedeRecibirPagos() {
    try {
      const status = await api.getStripeOnboardingStatus();
      return status.onboardingCompleted && status.payoutsEnabled;
    } catch (error) {
      return false;
    }
  }
}

export default new TournamentService();