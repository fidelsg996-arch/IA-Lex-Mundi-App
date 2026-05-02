import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';

const PagoTorneo = ({ torneo, participante, onPagoExitoso, onVolver }) => {
  const { user } = useAuth();
  const { saldo, realizarPago } = useBilletera();  // ✅ Usar realizarPago
  const [procesando, setProcesando] = useState(false);

  // Precio según el torneo (puedes ajustarlo)
  const obtenerPrecio = () => {
    const precios = {
      civil: 50,
      penal: 60,
      laboral: 70,
      amparo: 100,
      default: 50
    };
    const tipoClave = torneo?.tipo?.toLowerCase() || 'default';
    return precios[tipoClave] || precios.default;
  };

  const precio = obtenerPrecio();

  const handlePago = async () => {
    if (saldo < precio) {
      alert(`❌ Saldo insuficiente. Necesitas $${precio} MXN. Recarga desde Mi Billetera.`);
      return;
    }

    setProcesando(true);
    
    try {
      const exito = await realizarPago(precio, `Inscripción torneo: ${torneo?.titulo}`);
      if (exito) {
        alert(`✅ Pago exitoso! Se descontaron $${precio} MXN de tu billetera`);
        onPagoExitoso();
      } else {
        alert('❌ Error en el pago');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al procesar el pago');
    } finally {
      setProcesando(false);
    }
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
            <p className="text-xs text-gray-400 mt-2">💡 Puedes recargar saldo en "Mi Billetera"</p>
          </div>

          <div className="flex gap-3">
            <button onClick={onVolver} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancelar</button>
            <button 
              onClick={handlePago} 
              disabled={procesando || saldo < precio} 
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