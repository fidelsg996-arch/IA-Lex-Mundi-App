// src/modules/Torneos/components/FormularioTorneo.jsx
import React, { useState } from 'react';

const FormularioTorneo = ({ torneo, onSave, onCancel, librosDisponibles }) => {
  const [formData, setFormData] = useState({
    nombre: torneo?.nombre || '',
    descripcion: torneo?.descripcion || '',
    premio: {
      tipo: torneo?.premio?.tipo || 'dinero',
      monto: torneo?.premio?.monto || 50000,
      descripcion: torneo?.premio?.descripcion || ''
    },
    costoInscripcion: torneo?.costoInscripcion || 10,
    estado: torneo?.estado || 'activo',
    maxParticipantes: torneo?.maxParticipantes || 32,
    fechaInicio: torneo?.fechaInicio || new Date().toISOString().split('T')[0],
    fechaFin: torneo?.fechaFin || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    rondas: torneo?.rondas || ['clasificacion', 'grupos', 'octavos', 'cuartos', 'semifinal', 'final'],
    premioSecundario: torneo?.premioSecundario || null
  });

  const [mostrarPremioSecundario, setMostrarPremioSecundario] = useState(!!formData.premioSecundario);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">{torneo ? 'Editar Torneo' : 'Nuevo Torneo'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold">Nombre del Torneo *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows="2"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">🏆 Premio Principal</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Tipo de premio</label>
                <select
                  value={formData.premio.tipo}
                  onChange={e => setFormData({ ...formData, premio: { ...formData.premio, tipo: e.target.value } })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="dinero">💰 Dinero</option>
                  <option value="libro">📚 Libro</option>
                  <option value="ambos">💰 Dinero + 📚 Libro</option>
                </select>
              </div>
              {(formData.premio.tipo === 'dinero' || formData.premio.tipo === 'ambos') && (
                <div>
                  <label className="block text-sm">Monto ($)</label>
                  <input
                    type="number"
                    value={formData.premio.monto}
                    onChange={e => setFormData({ ...formData, premio: { ...formData.premio, monto: parseInt(e.target.value) || 0 } })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}
            </div>
            {(formData.premio.tipo === 'libro' || formData.premio.tipo === 'ambos') && (
              <div className="mt-2">
                <label className="block text-sm">Seleccionar libro</label>
                <select
                  value={formData.premio.descripcion}
                  onChange={e => setFormData({ ...formData, premio: { ...formData.premio, descripcion: e.target.value } })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- Selecciona un libro --</option>
                  {librosDisponibles.map(libro => (
                    <option key={libro.id} value={libro.titulo}>
                      {libro.titulo} (${libro.precio})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">🎁 Premio Secundario (participación)</h3>
              <button
                type="button"
                onClick={() => {
                  if (mostrarPremioSecundario) {
                    setFormData({ ...formData, premioSecundario: null });
                    setMostrarPremioSecundario(false);
                  } else {
                    setFormData({ ...formData, premioSecundario: { tipo: 'libro', descripcion: '', libroId: null } });
                    setMostrarPremioSecundario(true);
                  }
                }}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                {mostrarPremioSecundario ? '❌ Eliminar premio' : '➕ Agregar premio secundario'}
              </button>
            </div>
            {mostrarPremioSecundario && (
              <>
                <div>
                  <label className="block text-sm">Descripción del premio</label>
                  <input
                    type="text"
                    value={formData.premioSecundario?.descripcion || ''}
                    onChange={e => setFormData({ ...formData, premioSecundario: { ...formData.premioSecundario, descripcion: e.target.value } })}
                    placeholder="Ej: Formulario Práctico Forense"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm">Vincular con libro (opcional)</label>
                  <select
                    value={formData.premioSecundario?.libroId || ''}
                    onChange={e => {
                      const libroId = e.target.value ? parseInt(e.target.value) : null;
                      const libro = librosDisponibles.find(l => l.id === libroId);
                      setFormData({
                        ...formData,
                        premioSecundario: {
                          ...formData.premioSecundario,
                          libroId,
                          descripcion: libro ? libro.titulo : formData.premioSecundario?.descripcion || ''
                        }
                      });
                    }}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">-- Ninguno --</option>
                    {librosDisponibles.map(libro => (
                      <option key={libro.id} value={libro.id}>
                        {libro.titulo} (${libro.precio})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold">Costo inscripción ($)</label>
              <input
                type="number"
                value={formData.costoInscripcion}
                onChange={e => setFormData({ ...formData, costoInscripcion: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Estado</label>
              <select
                value={formData.estado}
                onChange={e => setFormData({ ...formData, estado: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold">Fecha inicio</label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={e => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Fecha fin</label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={e => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold">Máximo participantes</label>
            <input
              type="number"
              value={formData.maxParticipantes}
              onChange={e => setFormData({ ...formData, maxParticipantes: parseInt(e.target.value) || 32 })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Guardar Torneo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioTorneo;