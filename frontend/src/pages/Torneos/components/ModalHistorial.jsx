// src/modules/Torneos/components/ModalHistorial.jsx
import React from 'react';

const ModalHistorial = ({ transacciones, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Historial de Transacciones</h2>
        {transacciones.length === 0 ? (
          <p className="text-center text-gray-500">Sin transacciones</p>
        ) : (
          transacciones.slice().reverse().map(t => (
            <div key={t.id} className="border-b py-2">
              <p className="font-semibold">{t.tipo}</p>
              <p>${Math.abs(t.monto).toLocaleString()} - {new Date(t.fecha).toLocaleString()}</p>
              <p className="text-xs text-gray-500">{t.descripcion || t.metodo}</p>
            </div>
          ))
        )}
        <button onClick={onClose} className="mt-4 w-full bg-gray-200 py-2 rounded-xl hover:bg-gray-300 transition">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalHistorial;