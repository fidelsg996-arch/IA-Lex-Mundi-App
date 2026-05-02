// src/components/Billetera.jsx
import React, { useState } from 'react';
import { useBilletera } from '../context/BilleteraContext';

const Billetera = () => {
  const { usuario, saldo, recargarSaldo } = useBilletera();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monto, setMonto] = useState(0);

  if (!usuario) return null;

  return (
    <>
      <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-4 py-2 shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">👤</span>
          <span className="font-bold text-white text-sm max-w-[100px] truncate">{usuario.nombre}</span>
        </div>
        <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1">
          <span className="text-lg">💰</span>
          <span className="font-bold text-white">${saldo}</span>
        </div>
        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-white text-[#1a1a2e] text-xs px-3 py-1 rounded-full hover:bg-gray-100 font-bold"
        >
          Recargar
        </button>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <span className="text-5xl">💰</span>
              <h2 className="text-2xl font-bold mt-2">Recargar Billetera</h2>
              <p className="text-gray-500">Saldo actual: ${saldo}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button onClick={() => setMonto(50)} className="p-3 border rounded-xl hover:bg-gray-100">$50</button>
              <button onClick={() => setMonto(100)} className="p-3 border rounded-xl hover:bg-gray-100">$100</button>
              <button onClick={() => setMonto(200)} className="p-3 border rounded-xl hover:bg-gray-100">$200</button>
            </div>
            <div className="mb-6">
              <input 
                type="number" 
                value={monto} 
                onChange={(e) => setMonto(parseInt(e.target.value) || 0)} 
                placeholder="Otro monto" 
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMostrarModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">Cancelar</button>
              <button onClick={() => {
                if (monto > 0) {
                  recargarSaldo(monto);
                  setMostrarModal(false);
                  setMonto(0);
                } else {
                  alert('❌ Ingresa un monto válido');
                }
              }} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">Recargar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Billetera;