import React from 'react';

const GruposPhase = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-3xl font-bold">🏆 Fase de Grupos</h1>
        <p className="opacity-90 mt-2">¡Felicidades! Has clasificado a la fase de grupos.</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 rounded-lg px-3 py-1">⚖️ Alta competencia</div>
          <div className="bg-white/20 rounded-lg px-3 py-1">📚 Casos reales</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-6xl mb-4">⚖️📜⚖️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Próximamente</h2>
        <p className="text-gray-600">La fase de grupos comenzará en breve. Los enfrentamientos se basarán en casos jurídicos reales.</p>
        <p className="text-gray-500 text-sm mt-4">Mientras tanto, sigue practicando en la fase de clasificación.</p>
      </div>
    </div>
  );
};

export default GruposPhase;