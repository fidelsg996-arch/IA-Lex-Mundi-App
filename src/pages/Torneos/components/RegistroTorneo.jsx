import { useState, useEffect } from 'react';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AvatarUploader from '../../../components/AvatarUploader';

const RegistroTorneo = ({ torneo, onRegistrar, onVolver }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    avatar: null
  });
  const [errorNombre, setErrorNombre] = useState('');
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);

  // Verificar si el nombre ya existe en el torneo
  const verificarNombreUnico = (nombre) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(`torneo_${torneo.id}_`)) {
        const p = JSON.parse(localStorage.getItem(key));
        if (p.nombre && p.nombre.toLowerCase() === nombre.toLowerCase()) {
          return false;
        }
      }
    }
    return true;
  };

  // Función para asignar grupo aleatorio (máximo 4 participantes por grupo)
  const asignarGrupoAleatorio = () => {
    const participantesExistentes = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(`torneo_${torneo.id}_`)) {
        const p = JSON.parse(localStorage.getItem(key));
        participantesExistentes.push(p);
      }
    }
    
    const grupoCount = {};
    participantesExistentes.forEach(p => {
      if (p.grupo) {
        grupoCount[p.grupo] = (grupoCount[p.grupo] || 0) + 1;
      }
    });
    
    let grupoAsignado = 'A';
    let minParticipantes = 999;
    
    for (let i = 65; i <= 70; i++) {
      const letra = String.fromCharCode(i);
      const count = grupoCount[letra] || 0;
      if (count < 4 && count < minParticipantes) {
        minParticipantes = count;
        grupoAsignado = letra;
      }
      if (minParticipantes === 0) break;
    }
    
    return grupoAsignado;
  };

  // Calcular grupos disponibles
  useEffect(() => {
    const participantesExistentes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(`torneo_${torneo.id}_`)) {
        const p = JSON.parse(localStorage.getItem(key));
        participantesExistentes.push(p);
      }
    }
    
    const grupoCount = {};
    participantesExistentes.forEach(p => {
      if (p.grupo) {
        grupoCount[p.grupo] = (grupoCount[p.grupo] || 0) + 1;
      }
    });
    
    const disponibles = [];
    for (let i = 65; i <= 70; i++) {
      const letra = String.fromCharCode(i);
      const count = grupoCount[letra] || 0;
      if (count < 4) {
        disponibles.push({ grupo: letra, cupos: 4 - count });
      }
    }
    setGruposDisponibles(disponibles);
  }, [torneo.id]);

  // Actualizar avatar después de subir
  const handleAvatarUpdate = (avatarUrl) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const handleNombreChange = (e) => {
    const nuevoNombre = e.target.value;
    setFormData({...formData, nombre: nuevoNombre});
    
    if (nuevoNombre.trim()) {
      if (!verificarNombreUnico(nuevoNombre)) {
        setErrorNombre('❌ Este nombre ya está registrado. Elige otro.');
      } else {
        setErrorNombre('');
      }
    } else {
      setErrorNombre('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre) {
      alert('El nombre es obligatorio');
      return;
    }
    
    if (!verificarNombreUnico(formData.nombre)) {
      alert('❌ Este nombre ya está registrado en el torneo. Elige otro nombre.');
      return;
    }
    
    const grupo = asignarGrupoAleatorio();
    onRegistrar({ ...formData, grupo });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <h2 className="text-xl font-bold">Registro al Torneo</h2>
          <p className="text-blue-100 text-sm">{torneo?.titulo}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <AvatarUploader 
              userId={`temp_${Date.now()}`}
              currentAvatar={formData.avatar}
              onAvatarUpdate={handleAvatarUpdate}
              size="w-20 h-20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">Nombre completo *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={handleNombreChange}
              className={`w-full p-2 border rounded-lg ${errorNombre ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errorNombre && <p className="text-red-500 text-xs mt-1">{errorNombre}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
            <p>📌 Serás asignado aleatoriamente a un grupo de hasta 4 participantes.</p>
            <p className="text-xs mt-1 text-blue-600">Grupos disponibles: {gruposDisponibles.map(g => `${g.grupo} (${g.cupos} cupos)`).join(', ') || 'A'}</p>
          </div>
          
          <div className="flex gap-3">
            <button type="button" onClick={onVolver} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancelar</button>
            <button 
              type="submit" 
              disabled={!!errorNombre || !formData.nombre}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Registrarme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroTorneo;