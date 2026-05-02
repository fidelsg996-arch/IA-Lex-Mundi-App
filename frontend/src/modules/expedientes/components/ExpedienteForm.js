// modules/expedientes/components/ExpedienteForm.js
import React, { useState, useEffect } from 'react';
import { expedienteService } from '../services/expedienteService';
import '../styles/ExpedientesStyles.css';

const ExpedienteForm = ({ expediente, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    numero: '',
    titulo: '',
    cliente: '',
    materia: 'Derecho Civil',
    abogado: '',
    descripcion: '',
    estado: 'activo',
    prioridad: 'media',
    juzgado: '',
    ciudad: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expediente) {
      setFormData({
        numero: expediente.numero || '',
        titulo: expediente.titulo || '',
        cliente: expediente.cliente || '',
        materia: expediente.materia || 'Derecho Civil',
        abogado: expediente.abogado || '',
        descripcion: expediente.descripcion || '',
        estado: expediente.estado || 'activo',
        prioridad: expediente.prioridad || 'media',
        juzgado: expediente.juzgado || '',
        ciudad: expediente.ciudad || ''
      });
    }
  }, [expediente]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (expediente) {
        await expedienteService.update(expediente._id, formData);
        alert('✅ Expediente actualizado');
      } else {
        await expedienteService.create(formData);
        alert('✅ Expediente creado');
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const materias = [
    'Derecho Civil', 'Derecho Penal', 'Derecho Laboral', 
    'Derecho Familiar', 'Derecho Corporativo', 'Derecho Internacional',
    'Derecho Administrativo', 'Derecho Tributario', 'Derecho Digital'
  ];

  const prioridades = ['alta', 'media', 'baja'];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{expediente ? '✏️ Editar Expediente' : '📁 Nuevo Expediente'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Número de Expediente *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Ej: EXP-2024-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Título del caso"
                required
              />
            </div>

            <div className="form-group">
              <label>Cliente *</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Nombre del cliente"
                required
              />
            </div>

            <div className="form-group">
              <label>Materia *</label>
              <select name="materia" value={formData.materia} onChange={handleChange}>
                {materias.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Abogado Asignado</label>
              <input
                type="text"
                name="abogado"
                value={formData.abogado}
                onChange={handleChange}
                placeholder="Nombre del abogado"
              />
            </div>

            <div className="form-group">
              <label>Prioridad</label>
              <select name="prioridad" value={formData.prioridad} onChange={handleChange}>
                {prioridades.map(p => (
                  <option key={p} value={p}>
                    {p === 'alta' ? '🔴 Alta' : p === 'media' ? '🟡 Media' : '🟢 Baja'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Juzgado/Tribunal</label>
              <input
                type="text"
                name="juzgado"
                value={formData.juzgado}
                onChange={handleChange}
                placeholder="Juzgado o tribunal"
              />
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Ciudad"
              />
            </div>

            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                placeholder="Descripción detallada del caso"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : (expediente ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpedienteForm;