// src/pages/Torneos/phases/ClasificacionPhase.jsx
import React from 'react';

const ClasificacionPhase = ({ torneoActivo, usuario, victorias, derrotas, onBuscarRival, cargando }) => {
  const victoriasNecesarias = torneoActivo?.victoriasNecesarias || 3;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">🏆 Fase de Clasificación</h1>
          <p className="opacity-90">Gana {victoriasNecesarias} duelos para avanzar a la fase de grupos</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">Victorias</p>
              <p className="text-4xl font-bold text-green-600">{victorias}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">Derrotas</p>
              <p className="text-4xl font-bold text-red-600">{derrotas}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(victorias / victoriasNecesarias) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600 mb-4">
              Progreso: {victorias} / {victoriasNecesarias} victorias
            </p>
            
            {victorias >= victoriasNecesarias ? (
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-700 font-bold">✅ ¡Clasificado! Avanzando a la fase de grupos...</p>
              </div>
            ) : (
              <button
                onClick={onBuscarRival}
                disabled={cargando}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {cargando ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Buscando rival...
                  </span>
                ) : (
                  "🔍 Buscar Rival"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Información del torneo */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">📋 Información del Torneo</h2>
        <div className="space-y-2">
          <p><strong>🏷️ Nombre:</strong> {torneoActivo?.nombre}</p>
          <p><strong>⚖️ Modalidad:</strong> {torneoActivo?.modalidad}</p>
          <p><strong>💰 Premio:</strong> ${torneoActivo?.premio?.monto?.toLocaleString() || "No especificado"} MXN</p>
          {torneoActivo?.premio?.tipo === "libro" && (
            <p><strong>📚 Libro en juego:</strong> {torneoActivo?.premio?.descripcion}</p>
          )}
          <p><strong>✅ Victorias necesarias:</strong> {victoriasNecesarias}</p>
        </div>
      </div>
    </div>
  );
};

export default ClasificacionPhase;