import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';

const PRECIOS_TORNEOS = {
  civil: 50,
  penal: 60,
  laboral: 70,
  amparo: 100,
  default: 50
};

const PagoTorneo = ({ torneo, participante, onPagoExitoso, onVolver }) => {
  const { user } = useAuth();
  const { saldo, pagarConBilletera } = useBilletera();
  const [procesando, setProcesando] = useState(false);

  const obtenerPrecio = () => {
    const tipoClave = torneo?.tipo?.toLowerCase() || 'default';
    return PRECIOS_TORNEOS[tipoClave] || PRECIOS_TORNEOS.default;
  };

  const precio = obtenerPrecio();
  const tieneSaldoSuficiente = saldo >= precio;

  const handlePago = async () => {
    if (!tieneSaldoSuficiente) {
      alert(`❌ Saldo insuficiente. Necesitas $${precio} MXN. Recarga desde Mi Billetera.`);
      return;
    }

    setProcesando(true);
    
    setTimeout(() => {
      const exito = pagarConBilletera(precio, `Inscripción torneo: ${torneo?.titulo}`);
      if (exito) {
        alert(`✅ Pago exitoso! Se descontaron $${precio} MXN de tu billetera`);
        onPagoExitoso();
      } else {
        alert('❌ Error en el pago');
      }
      setProcesando(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white">
          <h2 className="text-xl font-bold">Pago de inscripción</h2>
          <p className="text-green-100 text-sm">{torneo?.titulo}</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-green-600">${precio} MXN</p>
            <p className="text-sm text-gray-500 mt-1">Saldo disponible: ${saldo.toLocaleString()} MXN</p>
            <p className="text-xs text-amber-600 mt-2">💡 Gana puntos por cada recarga (10% de recompensa)</p>
          </div>

          {!tieneSaldoSuficiente && (
            <div className="bg-yellow-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-yellow-700">Saldo insuficiente.</p>
              <button onClick={onVolver} className="mt-2 text-blue-500 text-sm">Ir a recargar</button>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onVolver} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancelar</button>
            <button 
              onClick={handlePago} 
              disabled={!tieneSaldoSuficiente || procesando} 
              className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold disabled:opacity-50"
            >
              {procesando ? 'Procesando...' : `Pagar $${precio}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoTorneo;