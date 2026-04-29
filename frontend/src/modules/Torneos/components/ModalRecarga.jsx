// src/modules/Torneos/components/ModalRecarga.jsx
import React, { useState } from 'react';

const ModalRecarga = ({ saldo, onRecargar, onClose }) => {
  const [montoRecarga, setMontoRecarga] = useState(0);
  const [procesando, setProcesando] = useState(false);
  const [datosPago, setDatosPago] = useState({ numeroTarjeta: '', fechaExpiracion: '', cvv: '' });

  const handleRecargar = () => {
    if (montoRecarga <= 0) {
      alert('Ingresa un monto válido');
      return;
    }
    setProcesando(true);
    setTimeout(() => {
      onRecargar(montoRecarga);
      setProcesando(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Recargar Billetera</h2>
        <p className="text-center mb-4">Saldo actual: ${saldo.toLocaleString()}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[50, 100, 200, 500].map(m => (
            <button key={m} onClick={() => setMontoRecarga(m)} className="p-2 border rounded-xl hover:bg-gray-100 transition">
              ${m}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={montoRecarga}
          onChange={e => setMontoRecarga(parseInt(e.target.value) || 0)}
          placeholder="Monto personalizado"
          className="w-full p-3 border rounded-xl mb-4"
        />
        <div className="border-t pt-4">
          <input
            type="text"
            placeholder="Número de tarjeta (16 dígitos)"
            value={datosPago.numeroTarjeta}
            onChange={e => setDatosPago({ ...datosPago, numeroTarjeta: e.target.value.replace(/\D/g, '').slice(0, 16) })}
            className="w-full p-3 border rounded-xl mb-3"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="MM/AA"
              value={datosPago.fechaExpiracion}
              onChange={e => setDatosPago({ ...datosPago, fechaExpiracion: e.target.value })}
              className="p-3 border rounded-xl"
            />
            <input
              type="text"
              placeholder="CVV"
              value={datosPago.cvv}
              onChange={e => setDatosPago({ ...datosPago, cvv: e.target.value.slice(0, 3) })}
              className="p-3 border rounded-xl"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 bg-gray-200 py-3 rounded-xl hover:bg-gray-300 transition">
            Cancelar
          </button>
          <button onClick={handleRecargar} disabled={procesando} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-50">
            {procesando ? 'Procesando...' : 'Recargar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRecarga;