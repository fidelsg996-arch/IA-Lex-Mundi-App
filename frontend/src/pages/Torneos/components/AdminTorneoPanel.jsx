import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';

const AdminTorneoPanel = ({ onCerrar, onTorneoActualizado }) => {
  const [torneos, setTorneos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    costoInscripcion: 50,
    premioNombre: 'Guía y Modelos en Materia Agraria',
    premioLink: '/reclamar-premio',
    activo: true,
    victoriasNecesarias: 3,
    preguntasPorDuelo: 10
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargarTorneos = async () => {
    try {
      const snap = await getDocs(collection(db, "torneos"));
      const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTorneos(lista);
    } catch (error) {
      console.error("Error cargando torneos:", error);
    }
  };

  useEffect(() => {
    cargarTorneos();
  }, []);

  const guardarTorneo = async () => {
    if (!formData.nombre) {
      setMensaje("❌ El nombre es obligatorio");
      return;
    }
    setLoading(true);
    setMensaje('');
    const id = editando?.id || Date.now().toString();
    
    try {
      const nuevoTorneo = {
        id: id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        costoInscripcion: Number(formData.costoInscripcion),
        victoriasNecesarias: Number(formData.victoriasNecesarias),
        preguntasPorDuelo: Number(formData.preguntasPorDuelo),
        activo: formData.activo,
        premio: {
          tipo: 'libro',
          nombre: formData.premioNombre,
          link: formData.premioLink,
          codigoDescuento: 'AGRARIA2026'
        }
      };
      
      await setDoc(doc(db, 'torneos', id), nuevoTorneo);
      setMensaje("✅ Torneo guardado exitosamente");
      await cargarTorneos();
      setEditando(null);
      if (onTorneoActualizado) onTorneoActualizado();
      
      setFormData({
        nombre: '',
        descripcion: '',
        costoInscripcion: 50,
        premioNombre: 'Guía y Modelos en Materia Agraria',
        premioLink: '/reclamar-premio',
        activo: true,
        victoriasNecesarias: 3,
        preguntasPorDuelo: 10
      });
    } catch (error) {
      setMensaje("❌ Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const activarTorneo = async (torneo) => {
    try {
      const todos = await getDocs(collection(db, "torneos"));
      for (const t of todos.docs) {
        await updateDoc(doc(db, 'torneos', t.id), { activo: false });
      }
      await updateDoc(doc(db, 'torneos', torneo.id), { activo: true });
      await cargarTorneos();
      if (onTorneoActualizado) onTorneoActualizado();
      setMensaje(`✅ Torneo "${torneo.nombre}" activado`);
    } catch (error) {
      setMensaje("❌ Error al activar: " + error.message);
    }
  };

  const eliminarTorneo = async (id) => {
    if (!window.confirm('¿Eliminar este torneo permanentemente?')) return;
    try {
      await deleteDoc(doc(db, 'torneos', id));
      await cargarTorneos();
      if (onTorneoActualizado) onTorneoActualizado();
      setMensaje("✅ Torneo eliminado");
    } catch (error) {
      setMensaje("❌ Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 text-white sticky top-0">
          <h2 className="text-xl font-bold">👑 Administrar Torneos</h2>
          <button onClick={onCerrar} className="absolute top-4 right-4 text-white">✖️</button>
        </div>
        
        <div className="p-6">
          {mensaje && (
            <div className={`mb-4 p-3 rounded-lg text-center ${mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensaje}
            </div>
          )}
          
          <h3 className="font-bold text-lg mb-3">📋 Torneos Existentes</h3>
          {torneos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay torneos creados. Crea uno nuevo.</p>
          ) : (
            torneos.map(t => (
              <div key={t.id} className="border rounded-lg p-3 mb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{t.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Costo: ${t.costoInscripcion} | Victorias: {t.victoriasNecesarias} | {t.activo ? '✅ Activo' : '⭕ Inactivo'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { 
                      setEditando(t);
                      setFormData({
                        nombre: t.nombre || '',
                        descripcion: t.descripcion || '',
                        costoInscripcion: t.costoInscripcion || 50,
                        premioNombre: t.premio?.nombre || 'Guía y Modelos en Materia Agraria',
                        premioLink: t.premio?.link || '/reclamar-premio',
                        activo: t.activo || false,
                        victoriasNecesarias: t.victoriasNecesarias || 3,
                        preguntasPorDuelo: t.preguntasPorDuelo || 10
                      });
                    }} className="text-blue-500">✏️ Editar</button>
                    <button onClick={() => activarTorneo(t)} className="text-green-500">⭐ Activar</button>
                    <button onClick={() => eliminarTorneo(t.id)} className="text-red-500">🗑️ Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          <hr className="my-4" />
          <h3 className="font-bold text-lg mb-3">{editando ? '✏️ Editar Torneo' : '➕ Crear Nuevo Torneo'}</h3>
          
          <input
            type="text"
            placeholder="Nombre del torneo *"
            className="w-full p-2 border rounded mb-2"
            value={formData.nombre}
            onChange={e => setFormData({...formData, nombre: e.target.value})}
          />
          
          <textarea
            placeholder="Descripción del torneo"
            className="w-full p-2 border rounded mb-2"
            rows="2"
            value={formData.descripcion}
            onChange={e => setFormData({...formData, descripcion: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="number"
              placeholder="Costo inscripción (MXN)"
              className="p-2 border rounded"
              value={formData.costoInscripcion}
              onChange={e => setFormData({...formData, costoInscripcion: parseInt(e.target.value)})}
            />
            <input
              type="number"
              placeholder="Victorias necesarias"
              className="p-2 border rounded"
              value={formData.victoriasNecesarias}
              onChange={e => setFormData({...formData, victoriasNecesarias: parseInt(e.target.value)})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nombre del premio"
              className="p-2 border rounded"
              value={formData.premioNombre}
              onChange={e => setFormData({...formData, premioNombre: e.target.value})}
            />
            <input
              type="text"
              placeholder="Link del premio"
              className="p-2 border rounded"
              value={formData.premioLink}
              onChange={e => setFormData({...formData, premioLink: e.target.value})}
            />
          </div>
          
          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={e => setFormData({...formData, activo: e.target.checked})}
              /> Activar este torneo inmediatamente
            </label>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={guardarTorneo}
              disabled={loading}
              className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-bold hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (editando ? '✅ Actualizar Torneo' : '➕ Crear Torneo')}
            </button>
            {editando && (
              <button
                onClick={() => {
                  setEditando(null);
                  setFormData({
                    nombre: '',
                    descripcion: '',
                    costoInscripcion: 50,
                    premioNombre: 'Guía y Modelos en Materia Agraria',
                    premioLink: '/reclamar-premio',
                    activo: true,
                    victoriasNecesarias: 3,
                    preguntasPorDuelo: 10
                  });
                }}
                className="flex-1 bg-gray-300 py-2 rounded-lg font-bold hover:bg-gray-400"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTorneoPanel;