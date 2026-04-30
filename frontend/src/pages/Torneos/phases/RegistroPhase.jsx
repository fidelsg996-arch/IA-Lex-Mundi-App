// src/modules/Torneos/phases/RegistroPhase.jsx
import React, { useState } from 'react';
import { especialidadesDisponibles } from '../utils/constantes';

const RegistroPhase = ({ torneoActivo, onRegistrar, onPagar, onCancelar, mostrandoPago, usuarioExistente, saldo }) => {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(null);
  const [mostrarConfirmacionPago, setMostrarConfirmacionPago] = useState(false);

  const registrarUsuario = () => {
    if (!nombre.trim()) {
      alert("❌ Ingresa tu nombre");
      return;
    }
    if (!especialidad) {
      alert("❌ Selecciona tu especialidad");
      return;
    }
    if (!avatarSeleccionado) {
      alert("❌ Selecciona una imagen de perfil");
      return;
    }
    onRegistrar(nombre, especialidad, avatarSeleccionado);
  };

  const esReinscripcion = usuarioExistente && !usuarioExistente.inscrito;

  if (!mostrandoPago && !usuarioExistente?.nombre) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0f3460] to-[#1a1a2e] p-6 text-white">
              <h1 className="text-3xl font-bold">{torneoActivo?.nombre || "Torneo Jurídico"}</h1>
              <p className="text-gray-300 mt-2">{torneoActivo?.descripcion}</p>
              <div className="flex gap-4 mt-3 flex-wrap">
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                  🏆 Premio: {torneoActivo?.premio?.tipo === 'dinero' ? `$${torneoActivo.premio.monto?.toLocaleString()}` : torneoActivo?.premio?.descripcion}
                </span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  💰 Inscripción: ${torneoActivo?.costoInscripcion}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6">Registro de Litigante</h2>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Nombre completo"
                className="w-full p-3 border rounded-xl mb-4"
              />
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">📚 Especialidad Jurídica</label>
                <select
                  value={especialidad}
                  onChange={e => setEspecialidad(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-white"
                >
                  <option value="">-- Selecciona tu especialidad --</option>
                  {especialidadesDisponibles.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Tu especialidad aparecerá junto a tu nombre en los duelos</p>
              </div>
              <div className="flex flex-col items-center gap-4 mb-6">
                {avatarSeleccionado ? (
                  <div className="relative">
                    <img src={avatarSeleccionado} alt="Avatar" className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500" />
                    <button onClick={() => setAvatarSeleccionado(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6">
                      ✖
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">⚖️</div>
                )}
                <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
                  Subir imagen de perfil
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAvatarSeleccionado(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <button onClick={registrarUsuario} className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (usuarioExistente?.nombre && mostrandoPago) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              {esReinscripcion ? "🔄 Reinscripción al Torneo" : "💰 Pago de Inscripción"}
            </h2>
            <div className={`p-4 rounded-lg mb-6 text-center ${esReinscripcion ? 'bg-yellow-50' : 'bg-green-50'}`}>
              <p className="font-semibold">✅ Bienvenido, {usuarioExistente.nombre}</p>
              <p className="text-sm text-gray-600 mt-1">📚 Especialidad: {usuarioExistente.especialidad || "No especificada"}</p>
              {esReinscripcion && (
                <p className="text-sm text-red-600 mt-1">⚠️ Fuiste eliminado anteriormente. Debes pagar nuevamente la inscripción para volver a participar.</p>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between mb-2">
                <span>Costo de {esReinscripcion ? "reinscripción" : "inscripción"}:</span>
                <span className="font-bold">${torneoActivo?.costoInscripcion} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>Saldo disponible:</span>
                <span className={`font-bold ${saldo >= torneoActivo?.costoInscripcion ? 'text-blue-600' : 'text-red-600'}`}>${saldo.toLocaleString()} MXN</span>
              </div>
            </div>
            <button
              onClick={() => setMostrarConfirmacionPago(true)}
              disabled={saldo < torneoActivo?.costoInscripcion}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-green-600 transition"
            >
              Pagar {esReinscripcion ? "Reinscripción" : "Inscripción"} ${torneoActivo?.costoInscripcion} MXN
            </button>
            {esReinscripcion && (
              <button onClick={onCancelar} className="w-full mt-3 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-400 transition">
                Cancelar
              </button>
            )}
          </div>
        </div>

        {mostrarConfirmacionPago && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4">Confirmar {esReinscripcion ? 'Reinscripción' : 'Inscripción'}</h2>
              <p className="text-center mb-4">Costo: ${torneoActivo?.costoInscripcion} MXN</p>
              <div className="flex gap-3">
                <button onClick={() => setMostrarConfirmacionPago(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">
                  Cancelar
                </button>
                <button onClick={onPagar} className="flex-1 bg-green-500 text-white py-2 rounded-xl">
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default RegistroPhase;