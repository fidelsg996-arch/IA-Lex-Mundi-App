import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const RegistroTorneo = ({ torneo, onRegistrar, onVolver }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ nombre: user?.displayName || '', telefono: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) { alert('Nombre completo obligatorio'); return; }
    if (!formData.telefono.trim()) { alert('Teléfono obligatorio'); return; }
    onRegistrar(formData);
  };

  return (
    <div className="px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
        <button onClick={onVolver} className="text-gray-500 mb-4 hover:text-gray-700">← Volver</button>
        <h1 className="text-2xl font-bold mb-4">Registro para {torneo.titulo}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-bold mb-1">Nombre completo *</label><input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm font-bold mb-1">Teléfono *</label><input type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm font-bold mb-1">Correo electrónico</label><input type="email" value={user?.email || ''} disabled className="w-full p-2 border rounded bg-gray-100" /></div>
          <div className="bg-amber-50 p-3 rounded-lg"><p className="font-bold">Costo de inscripción: ${torneo.costo} MXN</p></div>
          <button type="submit" className="w-full bg-red-500 text-white py-2 rounded-lg font-bold">Continuar al pago</button>
        </form>
      </div>
    </div>
  );
};

export default RegistroTorneo;