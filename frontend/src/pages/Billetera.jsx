import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Billetera = () => {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(1250.00);
  const [mostrarRecarga, setMostrarRecarga] = useState(false);
  const [montoRecarga, setMontoRecarga] = useState('');
  const [transacciones, setTransacciones] = useState([
    { id: 1, concepto: 'Compra de Diplomado', monto: -250, fecha: '2024-04-20', tipo: 'gasto' },
    { id: 2, concepto: 'Recarga de saldo', monto: 500, fecha: '2024-04-18', tipo: 'ingreso' },
    { id: 3, concepto: 'Suscripción Premium', monto: -99, fecha: '2024-04-15', tipo: 'gasto' }
  ]);

  const handleRecarga = () => {
    const monto = parseFloat(montoRecarga);
    if (monto > 0) {
      setSaldo(saldo + monto);
      setTransacciones([
        {
          id: transacciones.length + 1,
          concepto: 'Recarga de saldo',
          monto: monto,
          fecha: new Date().toISOString().split('T')[0],
          tipo: 'ingreso'
        },
        ...transacciones
      ]);
      setMontoRecarga('');
      setMostrarRecarga(false);
      alert(`¡Recarga exitosa! Se agregaron $${monto} a tu saldo.`);
    } else {
      alert('Ingresa un monto válido');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <button onClick={() => navigate('/')} className="mb-4 text-indigo-500 hover:text-indigo-700 flex items-center gap-2">
        ← Volver al Panel Principal
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">💳 Billetera Electrónica</h1>

        {/* Tarjeta de saldo */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100 text-sm">Saldo disponible</p>
              <p className="text-4xl font-bold">${saldo.toFixed(2)} MXN</p>
            </div>
            <button
              onClick={() => setMostrarRecarga(true)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              + Recargar saldo
            </button>
          </div>
        </div>

        {/* Tarjetas de acción rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:shadow-lg">
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold">Pagar suscripción</div>
            <div className="text-xs text-gray-500">Mensual o anual</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:shadow-lg">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold">Comprar diplomado</div>
            <div className="text-xs text-gray-500">Pago directo</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:shadow-lg">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">Historial</div>
            <div className="text-xs text-gray-500">Ver transacciones</div>
          </div>
        </div>

        {/* Historial de transacciones */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="font-bold text-gray-800">Historial de transacciones</h2>
          </div>
          <div className="divide-y">
            {transacciones.map((trans) => (
              <div key={trans.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                <div>
                  <div className="font-semibold text-gray-800">{trans.concepto}</div>
                  <div className="text-xs text-gray-500">{trans.fecha}</div>
                </div>
                <div className={`font-bold ${trans.monto > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trans.monto > 0 ? '+' : ''}{trans.monto.toFixed(2)} MXN
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de recarga */}
      {mostrarRecarga && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Recargar saldo</h2>
            <input
              type="number"
              placeholder="Monto a recargar"
              value={montoRecarga}
              onChange={(e) => setMontoRecarga(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setMostrarRecarga(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={handleRecarga} className="flex-1 bg-indigo-500 text-white rounded-lg">Recargar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billetera;
