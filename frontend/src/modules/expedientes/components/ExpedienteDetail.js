// modules/expedientes/components/ExpedienteDetail.js
import React, { useState, useEffect } from 'react';
import { expedienteService } from '../services/expedienteService';
import '../styles/ExpedientesStyles.css';

const ExpedienteDetail = ({ expedienteId, onClose, onEdit }) => {
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [nuevoDocumento, setNuevoDocumento] = useState({
    titulo: '',
    tipo: 'pdf',
    descripcion: ''
  });

  useEffect(() => {
    cargarExpediente();
  }, [expedienteId]);

  const cargarExpediente = async () => {
    try {
      setLoading(true);
      const response = await expedienteService.getById(expedienteId);
      setExpediente(response.data);
    } catch (err) {
      setError('Error al cargar expediente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocumento = async (e) => {
    e.preventDefault();
    try {
      await expedienteService.addDocumento(expedienteId, nuevoDocumento);
      alert('✅ Documento agregado');
      setShowDocumentForm(false);
      setNuevoDocumento({ titulo: '', tipo: 'pdf', descripcion: '' });
      cargarExpediente();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      await expedienteService.updateEstado(expedienteId, nuevoEstado);
      alert(`✅ Estado cambiado a: ${nuevoEstado}`);
      cargarExpediente();
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

  const getPrioridadIcon = (prioridad) => {
    switch(prioridad) {
      case 'alta': return '🔴';
      case 'media': return '🟡';
      case 'baja': return '🟢';
      default: return '⚪';
    }
  };

  if (loading) return <div className="loading">Cargando detalles...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!expediente) return <div className="error">Expediente no encontrado</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>📄 Expediente: {expediente.numero}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="expediente-detail">
          <div className="detail-section">
            <div className="detail-header">
              <h3>Información General</h3>
              <div className="detail-actions">
                <button className="btn-edit" onClick={() => onEdit(expediente)}>
                  ✏️ Editar
                </button>
              </div>
            </div>
            
            <div className="detail-grid">
              <div className="detail-item">
                <label>Título:</label>
                <p>{expediente.titulo}</p>
              </div>
              <div className="detail-item">
                <label>Cliente:</label>
                <p>{expediente.cliente}</p>
              </div>
              <div className="detail-item">
                <label>Materia:</label>
                <p>{expediente.materia}</p>
              </div>
              <div className="detail-item">
                <label>Abogado:</label>
                <p>{expediente.abogado || 'No asignado'}</p>
              </div>
              <div className="detail-item">
                <label>Estado:</label>
                <p className={getEstadoClass(expediente.estado)}>
                  {expediente.estado === 'activo' ? '📋 Activo' : 
                   expediente.estado === 'en_proceso' ? '⚙️ En Proceso' : '✅ Cerrado'}
                </p>
              </div>
              <div className="detail-item">
                <label>Prioridad:</label>
                <p>{getPrioridadIcon(expediente.prioridad)} {expediente.prioridad}</p>
              </div>
              <div className="detail-item">
                <label>Juzgado:</label>
                <p>{expediente.juzgado || 'No especificado'}</p>
              </div>
              <div className="detail-item">
                <label>Ciudad:</label>
                <p>{expediente.ciudad || 'No especificada'}</p>
              </div>
              <div className="detail-item full-width">
                <label>Descripción:</label>
                <p>{expediente.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-header">
              <h3>📎 Documentos ({expediente.documentos?.length || 0})</h3>
              <button className="btn-primary small" onClick={() => setShowDocumentForm(!showDocumentForm)}>
                + Agregar Documento
              </button>
            </div>

            {showDocumentForm && (
              <form className="document-form" onSubmit={handleAddDocumento}>
                <input
                  type="text"
                  placeholder="Título del documento"
                  value={nuevoDocumento.titulo}
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, titulo: e.target.value})}
                  required
                />
                <select
                  value={nuevoDocumento.tipo}
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, tipo: e.target.value})}
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">Documento Word</option>
                  <option value="txt">Texto</option>
                  <option value="image">Imagen</option>
                </select>
                <textarea
                  placeholder="Descripción"
                  value={nuevoDocumento.descripcion}
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, descripcion: e.target.value})}
                />
                <button type="submit">Guardar Documento</button>
                <button type="button" onClick={() => setShowDocumentForm(false)}>Cancelar</button>
              </form>
            )}

            <div className="documentos-list">
              {expediente.documentos?.length === 0 ? (
                <p>No hay documentos</p>
              ) : (
                expediente.documentos?.map((doc, idx) => (
                  <div key={idx} className="documento-item">
                    <div className="documento-icon">
                      {doc.tipo === 'pdf' ? '📄' : doc.tipo === 'doc' ? '📝' : '📎'}
                    </div>
                    <div className="documento-info">
                      <h4>{doc.titulo}</h4>
                      <p>{doc.descripcion}</p>
                      <small>{new Date(doc.fecha).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-header">
              <h3>⚙️ Acciones</h3>
            </div>
            <div className="acciones-buttons">
              <button 
                className="btn-status"
                onClick={() => handleCambiarEstado('activo')}
                disabled={expediente.estado === 'activo'}
              >
                📋 Marcar como Activo
              </button>
              <button 
                className="btn-status"
                onClick={() => handleCambiarEstado('en_proceso')}
                disabled={expediente.estado === 'en_proceso'}
              >
                ⚙️ Marcar En Proceso
              </button>
              <button 
                className="btn-status"
                onClick={() => handleCambiarEstado('cerrado')}
                disabled={expediente.estado === 'cerrado'}
              >
                ✅ Cerrar Expediente
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpedienteDetail;