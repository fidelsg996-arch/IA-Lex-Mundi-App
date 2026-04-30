// src/modules/Torneos/components/Billetera.jsx
import React from 'react';

const Billetera = ({ saldo, usuario, onRecargar, onVerHistorial, onAdminClick, modoAdmin, onToggleAdminPanel, mostrarAdmin = true }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center gap-3 shadow-lg mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚖️</span>
        <span className="font-bold text-white text-sm">{usuario?.nombre || usuario?.email || 'Invitado'}</span>
      </div>
      <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1">
        <span className="text-lg">💰</span>
        <span className="font-bold text-white">${saldo.toLocaleString()}</span>
      </div>
      <button onClick={onRecargar} className="bg-white text-[#1a1a2e] text-xs px-3 py-1 rounded-full font-bold hover:bg-gray-100 transition">
        Recargar
      </button>
      <button onClick={onVerHistorial} className="bg-white text-[#1a1a2e] text-xs px-3 py-1 rounded-full font-bold hover:bg-gray-100 transition">
        Historial
      </button>
      {mostrarAdmin && !modoAdmin && (
        <button onClick={onAdminClick} className="bg-amber-500 text-[#1a1a2e] text-xs px-3 py-1 rounded-full font-bold hover:bg-amber-600 transition">
          ⚙️ Admin
        </button>
      )}
      {modoAdmin && (
        <button onClick={onToggleAdminPanel} className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold hover:bg-green-600 transition">
          📋 Panel Admin
        </button>
      )}
    </div>
  );
};

export default Billetera;