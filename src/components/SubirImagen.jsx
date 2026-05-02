// src/components/SubirImagen.jsx
import { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SubirImagen = ({ onImageUploaded, carpeta = 'portadas', label = 'Subir imagen', className = '' }) => {
  const [subiendo, setSubiendo] = useState(false);
  const [preview, setPreview] = useState(null);

  const subirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ La imagen no debe superar 5MB');
      return;
    }
    
    setSubiendo(true);
    
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    
    try {
      const storageRef = ref(storage, `${carpeta}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onImageUploaded(url);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al subir la imagen');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className={`cursor-pointer bg-gray-100 text-center py-2 rounded border hover:bg-gray-200 transition text-sm ${className}`}>
        {subiendo ? '⏳ Subiendo...' : (preview ? '✅' : label)}
        <input type="file" accept="image/*" onChange={subirImagen} className="hidden" disabled={subiendo} />
      </label>
      {preview && <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded mx-auto mt-1 border" />}
    </div>
  );
};

export default SubirImagen;