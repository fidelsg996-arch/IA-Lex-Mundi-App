import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import stripeService from '../../services/stripeService';
import { showSuccess, showError, showLoading, dismissToast } from '../../components/Toast';

const ReclamarPremio = () => {
  const { user, checkStripeOnboarding } = useAuth();
  const [campeonData, setCampeonData] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [reclamado, setReclamado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [premiosPendientes, setPremiosPendientes] = useState([]);

  useEffect(() => {
    // Cargar datos del campeón desde localStorage (sistema existente para libros)
    const stored = localStorage.getItem('campeon_actual');
    if (stored) {
      setCampeonData(JSON.parse(stored));
    }
    
    // Cargar premios pendientes desde Stripe
    cargarPremiosPendientes();
  }, [user]);

  const cargarPremiosPendientes = async () => {
    if (!user) return;
    
    try {
      const response = await stripeService.getMyPrizes();
      const pendientes = (response.prizes || []).filter(p => p.status !== 'paid');
      setPremiosPendientes(pendientes);
    } catch (error) {
      console.error('Error cargando premios:', error);
    }
  };

  const esPremioEnEfectivo = (premio) => {
    if (typeof premio === 'number') return true;
    if (typeof premio === 'string') {
      return premio.startsWith('$') || premio.includes('USD') || premio.includes('MXN');
    }
    return false;
  };

  const obtenerMonto = (premio) => {
    if (typeof premio === 'number') return premio;
    if (typeof premio === 'string') {
      const match = premio.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
      if (match) return parseFloat(match[1].replace(/,/g, ''));
    }
    return 0;
  };

  const handleReclamarCodigo = async () => {
    if (!campeonData) {
      showError('No hay información de campeón');
      return;
    }

    if (codigoIngresado !== campeonData.codigo) {
      showError('Código incorrecto');
      return;
    }

    const premio = campeonData.premio;
    
    if (esPremioEnEfectivo(premio)) {
      await handleReclamarEfectivo(campeonData.codigo, obtenerMonto(premio));
    } else {
      await handleReclamarEspecie(campeonData.codigo, premio);
    }
  };

  const handleReclamarEfectivo = async (codigo, monto) => {
    let toastId = showLoading('Verificando...');
    
    try {
      const onboardingComplete = await checkStripeOnboarding();
      
      if (!onboardingComplete) {
        dismissToast(toastId);
        showError('Necesitas verificar tu identidad primero. Ve a "Mi Perfil" para completar la verificación de Stripe.');
        return;
      }
      
      dismissToast(toastId);
      toastId = showLoading('Procesando tu premio...');
      
      const response = await stripeService.claimPrize(codigo);
      
      dismissToast(toastId);
      
      if (response.success) {
        showSuccess(`¡Premio de $${monto} USD reclamado! Llegará en <30 minutos`);
        setReclamado(true);
        localStorage.removeItem('campeon_actual');
        setCampeonData(null);
        await cargarPremiosPendientes();
      } else if (response.requiresOnboarding) {
        showError('Debes completar la verificación de identidad primero');
      } else {
        showError(response.message || 'Error al procesar el pago');
      }
      
    } catch (error) {
      dismissToast(toastId);
      showError(error.message || 'Error al reclamar premio');
    }
  };

  const handleReclamarEspecie = async (codigo, premio) => {
    let toastId = showLoading('Reclamando premio...');
    
    try {
      // Para premios en especie (libros, cursos)
      // Aquí iría la lógica de reclamar libro/curso
      setTimeout(() => {
        dismissToast(toastId);
        showSuccess(`¡${premio} reclamado con éxito! Revisa tu correo`);
        setReclamado(true);
        localStorage.removeItem('campeon_actual');
        setCampeonData(null);
      }, 1500);
      
    } catch (error) {
      dismissToast(toastId);
      showError(error.message);
    }
  };

  // Reclamar premio desde la lista de pendientes
  const handleReclamarPendiente = async (prize) => {
    let toastId = showLoading('Verificando...');
    
    try {
      const onboardingComplete = await checkStripeOnboarding();
      
      if (!onboardingComplete) {
        dismissToast(toastId);
        showError('Necesitas verificar tu identidad primero');
        return;
      }
      
      dismissToast(toastId);
      toastId = showLoading('Procesando tu premio...');
      
      const response = await stripeService.claimPrize(prize.code);
      
      dismissToast(toastId);
      
      if (response.success) {
        showSuccess(`¡Premio de $${prize.amount} USD reclamado! Llegará en <30 minutos`);
        await cargarPremiosPendientes();
      } else {
        showError(response.message || 'Error al procesar el pago');
      }
      
    } catch (error) {
      dismissToast(toastId);
      showError(error.message);
    }
  };

  // Si no hay datos
  if (!campeonData && premiosPendientes.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-xl font-bold mb-2">No hay premio pendiente</h2>
          <p className="text-gray-600">Participa en torneos para ganar premios.</p>
          <a href="/torneos" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Ver torneos
          </a>
        </div>
      </div>
    );
  }

  // Usar datos del campeón local o del backend
  const datosPremio = campeonData || (premiosPendientes[0] || {});
  const premio = datosPremio.premio || datosPremio.amount || 'Premio';
  const tituloTorneo = datosPremio.torneo?.titulo || datosPremio.tournament_id || 'Torneo';
  const codigoGenerado = datosPremio.codigo || '';
  const montoPremio = esPremioEnEfectivo(premio) ? obtenerMonto(premio) : null;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-6 text-white text-center">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold">¡FELICIDADES CAMPEÓN!</h1>
          <p className="text-amber-100">Has ganado el torneo</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{tituloTorneo}</h2>
            <div className={`rounded-xl p-4 mt-4 ${esPremioEnEfectivo(premio) ? 'bg-green-50' : 'bg-blue-50'}`}>
              <p className="text-sm text-gray-500">
                {esPremioEnEfectivo(premio) ? '💰 Premio en efectivo' : '🎁 Premio'}
              </p>
              <p className={`font-bold text-2xl ${esPremioEnEfectivo(premio) ? 'text-green-700' : 'text-blue-700'}`}>
                {esPremioEnEfectivo(premio) ? `$${montoPremio?.toLocaleString()} USD` : premio}
              </p>
              {esPremioEnEfectivo(premio) && (
                <p className="text-xs text-green-600 mt-1">
                  Transferencia directa a tu tarjeta de débito en menos de 30 minutos
                </p>
              )}
            </div>
          </div>

          {!reclamado && campeonData ? (
            <>
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-amber-800 mb-2">🎫 Tu código de campeón</p>
                <div className="bg-white rounded-lg p-3 text-center border border-amber-200">
                  <p className="font-mono text-lg font-bold text-amber-600 tracking-wider">
                    {codigoGenerado}
                  </p>
                </div>
                <p className="text-xs text-amber-700 mt-2">
                  ⚠️ Guarda este código para reclamar tu premio
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Confirma tu código</label>
                <input
                  type="text"
                  placeholder="Ingresa tu código de campeón"
                  value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value.toUpperCase())}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleReclamarCodigo}
                disabled={!codigoIngresado || loading}
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  esPremioEnEfectivo(premio)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                } disabled:opacity-50`}
              >
                {loading ? 'Procesando...' : '🎁 Reclamar Premio'}
              </button>
            </>
          ) : reclamado ? (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-green-600 font-bold mb-4">¡Premio reclamado con éxito!</p>
              {esPremioEnEfectivo(premio) && (
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-700">Llegará a tu tarjeta en:</p>
                  <p className="text-2xl font-bold text-green-600">menos de 30 minutos</p>
                </div>
              )}
              <a href="/panel-principal" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
                Ir al inicio
              </a>
            </div>
          ) : premiosPendientes.length > 0 && !campeonData ? (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-2">Premios pendientes:</h3>
              {premiosPendientes.map((prize) => (
                <div key={prize.id} className="border rounded-lg p-4">
                  <p><strong>Torneo:</strong> {prize.tournament_id}</p>
                  <p><strong>Premio:</strong> ${prize.amount} USD</p>
                  <p className="text-sm text-gray-500">Código: {prize.code}</p>
                  <button
                    onClick={() => handleReclamarPendiente(prize)}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg w-full"
                  >
                    Reclamar premio
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReclamarPremio;