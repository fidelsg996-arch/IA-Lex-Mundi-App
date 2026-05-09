// src/components/Avatar.jsx
import { useState, useEffect } from 'react';
import { obtenerAvatar, subirAvatar } from '../services/avatarService';

const Avatar = ({ 
  userId, 
  nombre, 
  size = 'w-12 h-12', 
  className = '', 
  editable = false,
  color = '3B82F6',
  onAvatarChange 
}) => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  
  useEffect(() => {
    if (userId && nombre) {
      cargarAvatar();
    } else if (nombre) {
      const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=${color}&color=fff&rounded=true&size=128`);
      setCargando(false);
    }
  }, [userId, nombre, color]);
  
  const cargarAvatar = async () => {
    setCargando(true);
    setError(false);
    const url = await obtenerAvatar(userId, nombre, color);
    setAvatarUrl(url);
    setCargando(false);
  };
  
  const handleSubirAvatar = async (archivo) => {
    setSubiendo(true);
    const result = await subirAvatar(userId, archivo, nombre);
    setSubiendo(false);
    
    if (result.success) {
      setAvatarUrl(result.url);
      if (onAvatarChange) onAvatarChange(result.url);
      alert('✅ Avatar actualizado correctamente');
    } else {
      alert('❌ Error: ' + result.error);
    }
  };
  
  const handleSeleccionarArchivo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleSubirAvatar(e.target.files[0]);
      }
    };
    input.click();
  };
  
  if (cargando) {
    return (
      <div className={`${size} rounded-full bg-gray-200 animate-pulse ${className}`} />
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className={`${size} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 shadow-md`}>
        {avatarUrl && !error ? (
          <img 
            src={avatarUrl} 
            alt={nombre || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-3xl">person</span>
          </div>
        )}
      </div>
      
      {editable && (
        <button 
          onClick={handleSeleccionarArchivo}
          disabled={subiendo}
          className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-1.5 shadow-md transition-colors disabled:opacity-50"
          title="Cambiar avatar"
        >
          {subiendo ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-white text-sm">edit</span>
          )}
        </button>
      )}
    </div>
  );
};

export default Avatar;