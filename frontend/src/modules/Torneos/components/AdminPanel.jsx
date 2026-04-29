// src/modules/Torneos/components/AdminPanel.jsx
import React, { useState } from 'react';
import FormularioTorneo from './FormularioTorneo';

const AdminPanel = ({ torneos, torneoActivo, onGuardarTorneo, onEliminarTorneo, onActivarTorneo, onCerrar, librosDisponibles }) => {
  const [editandoTorneo, setEditandoTorneo] = useState(null);
  const [showFormTorneo, setShowFormTorneo] = useState(false);

  const abrirFormNuevo = () => {
    setEditandoTorneo(null);
    setShowFormTorneo(true);
  };

  const abrirFormEditar = (torneo) => {
    setEditandoTorneo(torneo);
    setShowFormTorneo(true);
  };

  const guardarTorneo = (formData) => {
    onGuardarTorneo(formData, editandoTorneo);
    setShowFormTorneo(false);
    setEditandoTorneo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Panel de Administración de Torneos</h1>
          <div className="flex gap-3">
            <button onClick={abrirFormNuevo} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
              + Nuevo Torneo
            </button>
            <button onClick={onCerrar} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
              Cerrar Panel
            </button>
          </div>
        </div>

        <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 mb-6">
          <p className="text-amber-300 text-sm flex items-center gap-2">
            <span className="text-sm">ℹ️</span>
            Torneo actualmente activo: <strong className="text-white">{torneoActivo?.nombre || 'Ninguno'}</strong>
          </p>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="bg-gray-100 px-4 py-3 border-b">
            <h2 className="font-bold text-gray-700">📋 Todos los Torneos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Torneo</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Premio Principal</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Premio Secundario</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Costo</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {torneos.map(torneo => (
                  <tr key={torneo.id} className={`border-t hover:bg-gray-50 transition ${torneoActivo?.id === torneo.id ? 'bg-amber-50' : ''}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {torneoActivo?.id === torneo.id && (
                          <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">ACTIVO</span>
                        )}
                        <div>
                          <p className="font-bold text-gray-800">{torneo.nombre}</p>
                          <p className="text-xs text-gray-500">{torneo.descripcion?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {torneo.premio?.tipo === "dinero" && (
                        <span className="text-green-600 font-bold">${torneo.premio.monto?.toLocaleString()} MXN</span>
                      )}
                      {torneo.premio?.tipo === "libro" && (
                        <span className="text-blue-600">📚 {torneo.premio.descripcion || "Libro"}</span>
                      )}
                      {torneo.premio?.tipo === "ambos" && (
                        <div>
                          <span className="text-green-600 font-bold">${torneo.premio.monto?.toLocaleString()} MXN</span>
                          <span className="text-blue-600 block text-xs">+ 📚 {torneo.premio.descripcion}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      {torneo.premioSecundario?.descripcion ? (
                        <span className="text-purple-600 text-sm">🎁 {torneo.premioSecundario.descripcion}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="p-3 font-bold">${torneo.costoInscripcion} MXN</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        torneo.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {torneo.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => onActivarTorneo(torneo)}
                          className={`px-2 py-1 rounded text-xs transition ${
                            torneoActivo?.id === torneo.id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                          disabled={torneoActivo?.id === torneo.id}
                        >
                          Activar
                        </button>
                        <button
                          onClick={() => abrirFormEditar(torneo)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onEliminarTorneo(torneo.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            💡 Para editar un torneo, haz clic en "Editar". Para cambiar el torneo activo, haz clic en "Activar".
            El torneo activo se muestra con fondo amarillo y badge "ACTIVO".
          </p>
        </div>

        {showFormTorneo && (
          <FormularioTorneo
            torneo={editandoTorneo}
            onSave={guardarTorneo}
            onCancel={() => setShowFormTorneo(false)}
            librosDisponibles={librosDisponibles}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;