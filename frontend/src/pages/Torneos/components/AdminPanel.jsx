import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';

const AdminTorneoPanel = ({ onCerrar, onTorneoActualizado }) => {
  const [torneos, setTorneos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    costoInscripcion: 10,
    premioMonto: 1000,
    premioDescripcion: '$1,000 MXN',
    activo: false,
    victoriasNecesarias: 3
  });

  const cargarTorneos = async () => {
    const snap = await getDocs(collection(db, "torneos"));
    setTorneos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { cargarTorneos(); }, []);

  const guardarTorneo = async () => {
    const id = editando?.id || Date.now().toString();
    await setDoc(doc(db, 'torneos', id), {
      ...formData,
      id,
      premio: { tipo: 'dinero', monto: formData.premioMonto, descripcion: formData.premioDescripcion }
    });
    await cargarTorneos();
    setEditando(null);
    setFormData({ nombre: '', descripcion: '', costoInscripcion: 10, premioMonto: 1000, premioDescripcion: '$1,000 MXN', activo: false, victoriasNecesarias: 3 });
    if (onTorneoActualizado) onTorneoActualizado();
  };

  const eliminarTorneo = async (id) => {
    if (window.confirm('¿Eliminar este torneo?')) {
      await deleteDoc(doc(db, 'torneos', id));
      await cargarTorneos();
      if (onTorneoActualizado) onTorneoActualizado();
    }
  };

  const activarTorneo = async (torneo) => {
    const todos = await getDocs(collection(db, "torneos"));
    for (const t of todos.docs) {
      await updateDoc(doc(db, 'torneos', t.id), { activo: false });
    }
    await updateDoc(doc(db, 'torneos', torneo.id), { activo: true });
    await cargarTorneos();
    if (onTorneoActualizado) onTorneoActualizado();
    alert(`✅ Torneo "${torneo.nombre}" activado`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 text-white sticky top-0">
          <h2 className="text-xl font-bold">👑 Panel de Administración - Torneos</h2>
          <button onClick={onCerrar} className="absolute top-4 right-4 text-white">✖️</button>
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-lg mb-3">📋 Lista de Torneos</h3>
          {torneos.map(t => (
            <div key={t.id} className="border rounded-lg p-3 mb-2 flex justify-between items-center">
              <div>
                <p className="font-bold">{t.nombre}</p>
                <p className="text-sm text-gray-600">Costo: ${t.costoInscripcion} | Premio: ${t.premio?.monto} | {t.activo ? '✅ Activo' : '⭕ Inactivo'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditando(t); setFormData({ nombre: t.nombre, descripcion: t.descripcion, costoInscripcion: t.costoInscripcion, premioMonto: t.premio?.monto, premioDescripcion: t.premio?.descripcion, activo: t.activo, victoriasNecesarias: t.victoriasNecesarias || 3 }); }} className="text-blue-500">✏️</button>
                <button onClick={() => activarTorneo(t)} className="text-green-500">⭐ Activar</button>
                <button onClick={() => eliminarTorneo(t.id)} className="text-red-500">🗑️</button>
              </div>
            </div>
          ))}
          
          <hr className="my-4" />
          <h3 className="font-bold text-lg mb-3">{editando ? 'Editar Torneo' : 'Crear Nuevo Torneo'}</h3>
          <input type="text" placeholder="Nombre" className="w-full p-2 border rounded mb-2" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
          <textarea placeholder="Descripción" className="w-full p-2 border rounded mb-2" rows="2" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Costo inscripción" className="p-2 border rounded" value={formData.costoInscripcion} onChange={e => setFormData({...formData, costoInscripcion: parseInt(e.target.value)})} />
            <input type="number" placeholder="Premio en MXN" className="p-2 border rounded" value={formData.premioMonto} onChange={e => setFormData({...formData, premioMonto: parseInt(e.target.value)})} />
          </div>
          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} /> Activar este torneo</label>
            <label className="flex items-center gap-2">Victorias necesarias: <input type="number" className="w-16 p-1 border rounded" value={formData.victoriasNecesarias} onChange={e => setFormData({...formData, victoriasNecesarias: parseInt(e.target.value)})} /></label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={guardarTorneo} className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-bold">{editando ? 'Actualizar' : 'Crear'} Torneo</button>
            {editando && <button onClick={() => { setEditando(null); setFormData({ nombre: '', descripcion: '', costoInscripcion: 10, premioMonto: 1000, premioDescripcion: '$1,000 MXN', activo: false, victoriasNecesarias: 3 }); }} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancelar</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTorneoPanel;