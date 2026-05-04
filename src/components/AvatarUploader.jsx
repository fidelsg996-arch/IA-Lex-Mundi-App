// src/components/AvatarUploader.jsx
import { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AvatarUploader = ({ userId, currentAvatar, onAvatarUpdate, size = 'w-24 h-24' }) => {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentAvatar) {
      setAvatarUrl(currentAvatar);
    }
  }, [currentAvatar]);

  const subirAvatar = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('❌ La imagen no debe superar 2MB');
      return;
    }
    
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${userId}_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `avatares/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
      if (onAvatarUpdate) onAvatarUpdate(url);
      alert('✅ Avatar actualizado correctamente');
    } catch (error) {
      console.error('Error subiendo avatar:', error);
      alert('❌ Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) subirAvatar(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${size} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg`}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-white text-4xl">person</span>
        )}
      </div>
      <label className="cursor-pointer bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition">
        {uploading ? '⏳ Subiendo...' : '📷 Cambiar foto'}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
};

export default AvatarUploader;