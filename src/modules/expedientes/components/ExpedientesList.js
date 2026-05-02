// modules/expedientes/components/ExpedientesList.js
import React, { useState, useEffect } from 'react';
import { expedienteService } from '../services/expedienteService';
import '../styles/ExpedientesStyles.css';

const ExpedientesList = ({ onEdit, onView }) => {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarExpedientes();
  }, []);

  const cargarExpedientes = async () => {
    try {
      setLoading(true);
      const response = await expedienteService.getAll();
      setExpedientes(response.data || []);
    } catch (err) {
      setError('Error al cargar expedientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, numero) => {
    if (window.confirm(`¿Eliminar expediente ${numero}?`)) {
      try {
        await expedienteService.delete(id);
        cargarExpedientes();
        alert('✅ Expediente eliminado');
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  const handleCambiarEstado = async (id, estadoActual) => {
    const nuevosEstados = {
      'activo': 'en_proceso',
      'en_proceso': 'cerrado',
      'cerrado': 'activo'
    };
    const nuevoEstado = nuevosEstados[estadoActual] || 'activo';
    
    try {
      await expedienteService.updateEstado(id, nuevoEstado);
      cargarExpedientes();
      alert(`✅ Estado cambiado a: ${nuevoEstado}`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'activo': return 'estado-activo';
      case 'en_proceso': return 'estado-proceso';
      case 'cerrado': return 'estado-cerrado';
      default: return '';
    }
  };

  const getEstadoTexto = (estado) => {
    switch(estado) {
      case 'activo': return '📋 Activo';
      case 'en_proceso': return '⚙️ En Proceso';
      case 'cerrado': return '✅ Cerrado';
      default: return estado;
    }
  };

  const expedientesFiltrados = expedientes.filter(exp => {
    if (filter !== 'todos' && exp.estado !== filter) return false;
    if (searchTerm) {
      return exp.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             exp.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             exp.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) return <div className="loading">Cargando expedientes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="expedientes-container">
      <div className="expedientes-header">
        <h2>📁 Gestión de Expedientes</h2>
        <button className="btn-primary" onClick={() => onEdit(null)}>
          + Nuevo Expediente
        </button>
      </div>

      <div className="filtros-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por número, cliente o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filtros">
          <button className={filter === 'todos' ? 'active' : ''} onClick={() => setFilter('todos')}>
            Todos
          </button>
          <button className={filter === 'activo' ? 'active' : ''} onClick={() => setFilter('activo')}>
            Activos
          </button>
          <button className={filter === 'en_proceso' ? 'active' : ''} onClick={() => setFilter('en_proceso')}>
            En Proceso
          </button>
          <button className={filter === 'cerrado' ? 'active' : ''} onClick={() => setFilter('cerrado')}>
            Cerrados
          </button>
        </div>
      </div>

      <div className="expedientes-grid">
        {expedientesFiltrados.length === 0 ? (
          <div className="no-data">No hay expedientes</div>
        ) : (
          expedientesFiltrados.map(exp => (
            <div key={exp._id} className="expediente-card">
              <div className="expediente-header">
                <div className="expediente-numero">📄 {exp.numero || 'N/A'}</div>
                <div className={getEstadoClass(exp.estado)}>
                  {getEstadoTexto(exp.estado)}
                </div>
              </div>
              
              <div className="expediente-body">
                <h3>{exp.titulo || 'Sin título'}</h3>
                <p><strong>Cliente:</strong> {exp.cliente || 'No especificado'}</p>
                <p><strong>Materia:</strong> {exp.materia || 'Derecho'}</p>
                <p><strong>Abogado:</strong> {exp.abogado || 'Asignar'}</p>
                <p><strong>Fecha:</strong> {new Date(exp.fechaCreacion).toLocaleDateString()}</p>
                {exp.documentos && (
                  <p><strong>Documentos:</strong> {exp.documentos.length}</p>
                )}
              </div>
              
              <div className="expediente-actions">
                <button className="btn-view" onClick={() => onView(exp._id)}>
                  👁️ Ver Detalle
                </button>
                <button className="btn-edit" onClick={() => onEdit(exp)}>
                  ✏️ Editar
                </button>
                <button className="btn-status" onClick={() => handleCambiarEstado(exp._id, exp.estado)}>
                  🔄 Cambiar Estado
                </button>
                <button className="btn-delete" onClick={() => handleDelete(exp._id, exp.numero)}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpedientesList;