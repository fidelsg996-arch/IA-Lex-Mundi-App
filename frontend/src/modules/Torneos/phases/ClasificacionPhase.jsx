// src/modules/Torneos/phases/ClasificacionPhase.jsx
import React from 'react';
import { rivalesDisponibles } from '../utils/constantes';

const ClasificacionPhase = ({ torneoActivo, usuario, victorias, derrotas, onBuscarRival, cargando }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white text-center">
            <h1 className="text-3xl font-bold">SALA DE DUELOS JURÍDICOS</h1>
            <p className="text-sm mt-2">Gana 3 duelos para clasificar a la Fase de Grupos</p>
            <p className="text-xs mt-1">Torneo: {torneoActivo?.nombre}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 text-center rounded">
                <p className="text-3xl font-bold text-blue-600">{victorias}</p>
                <p>Duelos Ganados</p>
                <p className="text-xs text-gray-500">Necesitas: 3</p>
              </div>
              <div className="bg-red-50 p-4 text-center rounded">
                <p className="text-3xl font-bold text-red-600">{derrotas}</p>
                <p>Duelos Perdidos</p>
                <p className="text-xs text-gray-500">Máximo: 2</p>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-4 mb-6 flex items-center gap-4">
              <img src={usuario?.avatar} className="w-16 h-16 rounded-full object-cover" alt="" />
              <div>
                <p className="font-bold text-lg">{usuario?.nombre}</p>
                <p className="text-sm text-blue-600 font-semibold">📚 Especialidad: {usuario?.especialidad || "General"}</p>
                <p className="text-xs text-gray-500">⚖️ Listo para litigar</p>
              </div>
            </div>
            
            <button
              onClick={onBuscarRival}
              disabled={cargando}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-xl hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50"
            >
              {cargando ? 'BUSCANDO OPOSITOR...' : 'BUSCAR OPOSITOR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClasificacionPhase;