// src/pages/MiBilletera.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersistencia } from '../hooks/usePersistencia';

const MiBilletera = () => {
  const navigate = useNavigate();
  
  // Usar persistencia para saldo y transacciones
  const { datos: billeteraData, guardarDatos, cargando } = usePersistencia('billetera', {
    saldo: 1250.00,
    transacciones: [
      { id: 1, concepto: 'Compra de Diplomado', monto: -250, fecha: '2024-04-20', tipo: 'gasto' },
      { id: 2, concepto: 'Recarga de saldo', monto: 500, fecha: '2024-04-18', tipo: 'ingreso' },
      { id: 3, concepto: 'Suscripción Premium', monto: -99, fecha: '2024-04-15', tipo: 'gasto' }
    ]
  });
  
  const [saldo, setSaldo] = useState(1250.00);
  const [transacciones, setTransacciones] = useState([]);
  const [mostrarRecarga, setMostrarRecarga] = useState(false);
  const [montoRecarga, setMontoRecarga] = useState('');
  const [mostrarPagoSuscripcion, setMostrarPagoSuscripcion] = useState(false);
  const [mostrarCompraDiplomado, setMostrarCompraDiplomado] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  // Sincronizar datos con Firestore
  useEffect(() => {
    if (billeteraData && !cargando) {
      setSaldo(billeteraData.saldo || 1250.00);
      setTransacciones(billeteraData.transacciones || []);
    }
  }, [billeteraData, cargando]);

  // Guardar cambios en Firestore
  const guardarCambios = async (nuevoSaldo, nuevasTransacciones) => {
    await guardarDatos({
      saldo: nuevoSaldo,
      transacciones: nuevasTransacciones,
      ultimaActualizacion: new Date().toISOString()
    });
  };

  const handleRecarga = async () => {
    const monto = parseFloat(montoRecarga);
    if (monto > 0) {
      const nuevoSaldo = saldo + monto;
      const nuevaTransaccion = {
        id: Date.now(),
        concepto: 'Recarga de saldo',
        monto: monto,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'ingreso'
      };
      const nuevasTransacciones = [nuevaTransaccion, ...transacciones];
      
      setSaldo(nuevoSaldo);
      setTransacciones(nuevasTransacciones);
      await guardarCambios(nuevoSaldo, nuevasTransacciones);
      
      setMontoRecarga('');
      setMostrarRecarga(false);
      alert(`✅ ¡Recarga exitosa! Se agregaron $${monto} a tu saldo.`);
    } else {
      alert('❌ Ingresa un monto válido');
    }
  };

  const handlePagarSuscripcion = async (plan, monto, periodo) => {
    if (saldo >= monto) {
      const nuevoSaldo = saldo - monto;
      const nuevaTransaccion = {
        id: Date.now(),
        concepto: `Suscripción ${plan} - ${periodo}`,
        monto: -monto,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'gasto',
        detalle: { plan, periodo }
      };
      const nuevasTransacciones = [nuevaTransaccion, ...transacciones];
      
      setSaldo(nuevoSaldo);
      setTransacciones(nuevasTransacciones);
      await guardarCambios(nuevoSaldo, nuevasTransacciones);
      
      setMostrarPagoSuscripcion(false);
      alert(`✅ ¡Suscripción ${plan} activada! Se descontaron $${monto}.`);
    } else {
      alert(`❌ Saldo insuficiente. Necesitas $${monto} para esta suscripción.`);
    }
  };

  const handleComprarDiplomado = async (diplomado, precio) => {
    if (saldo >= precio) {
      const nuevoSaldo = saldo - precio;
      const nuevaTransaccion = {
        id: Date.now(),
        concepto: `Compra de Diplomado: ${diplomado}`,
        monto: -precio,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'gasto',
        detalle: { diplomado }
      };
      const nuevasTransacciones = [nuevaTransaccion, ...transacciones];
      
      setSaldo(nuevoSaldo);
      setTransacciones(nuevasTransacciones);
      await guardarCambios(nuevoSaldo, nuevasTransacciones);
      
      setMostrarCompraDiplomado(false);
      alert(`✅ ¡Compra exitosa! Disfruta tu diplomado: ${diplomado}`);
    } else {
      alert(`❌ Saldo insuficiente. Necesitas $${precio} para este diplomado.`);
    }
  };

  if (cargando) return <div className="text-center py-20">Cargando billetera...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <button 
        onClick={() => navigate('/panel-principal')} 
        className="mb-4 text-indigo-500 hover:text-indigo-700 flex items-center gap-2"
      >
        ← Volver al Panel Principal
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">💳 Mi Billetera</h1>

        {/* Tarjeta de saldo */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100 text-sm">Saldo disponible</p>
              <p className="text-4xl font-bold">${saldo.toFixed(2)} MXN</p>
            </div>
            <button
              onClick={() => setMostrarRecarga(true)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              + Recargar saldo
            </button>
          </div>
        </div>

        {/* Tarjetas de acción rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            onClick={() => setMostrarPagoSuscripcion(true)}
            className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold">Pagar suscripción</div>
            <div className="text-xs text-gray-500">Mensual o anual</div>
          </div>
          <div 
            onClick={() => setMostrarCompraDiplomado(true)}
            className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold">Comprar diplomado</div>
            <div className="text-xs text-gray-500">Pago directo</div>
          </div>
          <div 
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">Historial</div>
            <div className="text-xs text-gray-500">Ver transacciones</div>
          </div>
        </div>

        {/* Historial de transacciones */}
        {mostrarHistorial && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h2 className="font-bold text-gray-800">Historial de transacciones</h2>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {transacciones.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No hay transacciones registradas</div>
              ) : (
                transacciones.map((trans) => (
                  <div key={trans.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <div>
                      <div className="font-semibold text-gray-800">{trans.concepto}</div>
                      <div className="text-xs text-gray-500">{trans.fecha}</div>
                    </div>
                    <div className={`font-bold ${trans.monto > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trans.monto > 0 ? '+' : ''}{Math.abs(trans.monto).toFixed(2)} MXN
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de recarga */}
      {mostrarRecarga && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Recargar saldo</h2>
            <input
              type="number"
              placeholder="Monto a recargar (MXN)"
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

      {/* Modal de pago de suscripción */}
      {mostrarPagoSuscripcion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Pagar Suscripción</h2>
            <div className="space-y-3 mb-4">
              <button 
                onClick={() => handlePagarSuscripcion('Básico', 99, 'Mensual')}
                className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 flex justify-between"
              >
                <span>📱 Plan Básico</span>
                <span className="font-bold">$99 MXN/mes</span>
              </button>
              <button 
                onClick={() => handlePagarSuscripcion('Pro', 299, 'Mensual')}
                className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 flex justify-between"
              >
                <span>🚀 Plan Pro</span>
                <span className="font-bold">$299 MXN/mes</span>
              </button>
              <button 
                onClick={() => handlePagarSuscripcion('Premium', 999, 'Anual')}
                className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 flex justify-between"
              >
                <span>👑 Plan Premium</span>
                <span className="font-bold">$999 MXN/año</span>
              </button>
            </div>
            <button onClick={() => setMostrarPagoSuscripcion(false)} className="w-full px-4 py-2 border rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal de compra de diplomado */}
      {mostrarCompraDiplomado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Comprar Diplomado</h2>
            <div className="space-y-3 mb-4">
              <button 
                onClick={() => handleComprarDiplomado('Derecho Laboral', 2500)}
                className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 flex justify-between"
              >
                <span>⚖️ Derecho Laboral</span>
                <span className="font-bold">$2,500 MXN</span>
              </button>
              <button 
                onClick={() => handleComprarDiplomado('Criminología', 3000)}
                className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 flex justify-between"
              >
                <span>🔍 Criminología</span>
                <span className="font-bold">$3,000 MXN</span>
              </button>
              <button 
                onClick={() => handleComprarDiplomado('Derecho Penal', 2800)}
                className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 flex justify-between"
              >
                <span>⚖️ Derecho Penal</span>
                <span className="font-bold">$2,800 MXN</span>
              </button>
            </div>
            <button onClick={() => setMostrarCompraDiplomado(false)} className="w-full px-4 py-2 border rounded-lg">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiBilletera;