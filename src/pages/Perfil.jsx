import React from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button 
        onClick={() => navigate('/')}
        className="mb-4 text-indigo-500 hover:text-indigo-700 flex items-center gap-2"
      >
        ← Volver al Panel Principal
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">👤 Mi Perfil</h1>
      <p className="text-gray-600">Configuración de cuenta y preferencias.</p>
    </div>
  );
};

export default Perfil;
