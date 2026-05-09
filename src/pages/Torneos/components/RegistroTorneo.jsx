import { useState } from 'react';
import AvatarUploader from '../../../components/AvatarUploader';

const RegistroTorneo = ({ torneo, onRegistrar, onVolver }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    avatar: null
  });
  const [errorNombre, setErrorNombre] = useState('');
  const [registrando, setRegistrando] = useState(false);

  const verificarNombreUnico = (nombre) => {
    const nombreUpper = nombre.toUpperCase().trim();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('torneo_')) {
        try {
          const p = JSON.parse(localStorage.getItem(key));
          if (p.nombre && p.nombre.toUpperCase() === nombreUpper && !p.esBot) {
            return false;
          }
        } catch(e) {}
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nombreLimpio = formData.nombre.trim().toUpperCase();
    
    if (!nombreLimpio) {
      alert('El nombre es obligatorio');
      return;
    }
    
    if (!verificarNombreUnico(nombreLimpio)) {
      setErrorNombre('❌ Este nombre ya está registrado. Elige otro.');
      return;
    }
    
    setRegistrando(true);
    
    onRegistrar({ 
      nombre: nombreLimpio, 
      telefono: formData.telefono, 
      email: formData.email, 
      avatar: formData.avatar,
      grupo: 'A'
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <h2 className="text-xl font-bold">Registro al Torneo</h2>
          <p className="text-blue-100 text-sm">{torneo?.titulo || 'Torneo de Derecho Civil'}</p>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <AvatarUploader 
              userId="temp"
              currentAvatar={formData.avatar}
              onAvatarUpdate={(url) => setFormData({...formData, avatar: url})}
              size="w-24 h-24"
            />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Nombre completo *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="Ej: JUAN PEREZ"
                required
                disabled={registrando}
              />
              {errorNombre && <p className="text-red-500 text-xs mt-1">{errorNombre}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="Ej: 5512345678"
                disabled={registrando}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="tu@email.com"
                disabled={registrando}
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
              <p className="font-semibold">📊 Información del torneo:</p>
              <p>• Capacidad: 128 participantes</p>
              <p>• 4 participantes por grupo</p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onVolver} 
                className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300"
                disabled={registrando}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={!!errorNombre || !formData.nombre || registrando}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {registrando ? 'Registrando...' : 'Registrarme'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroTorneo;
