import React, { useState } from 'react';

const RegistroPhase = ({ onRegistrar }) => {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [avatar, setAvatar] = useState('');

  const avatares = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg"
  ];

  const especialidades = [
    "Derecho Penal", "Derecho Civil", "Derecho Laboral",
    "Derecho Constitucional", "Derecho Mercantil", "Derecho Familiar"
  ];

  const handleSubmit = () => {
    if (!nombre.trim()) {
      alert("❌ Ingresa tu nombre completo");
      return;
    }
    if (!especialidad) {
      alert("❌ Selecciona tu especialidad");
      return;
    }
    onRegistrar({ nombre, especialidad, avatar: avatar || avatares[0] });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">📝 Registro de Participante</h1>
          <p className="opacity-90 mt-1">Completa tus datos para participar</p>
        </div>
        <div className="p-6 space-y-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona tu especialidad</option>
            {especialidades.map(esp => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex gap-3 flex-wrap">
              {avatares.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setAvatar(img)}
                  className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-all ${avatar === img ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-blue-400'}`}
                  alt={`Avatar ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mt-4"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroPhase;