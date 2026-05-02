// src/services/cloudinary.js

// Configuración de Cloudinary
const CLOUD_NAME = 'di50h82ha';  // ✅ Tu Cloud Name
const UPLOAD_PRESET = 'lexmundi_preset';

export const subirImagenACloudinary = async (archivo) => {
  return new Promise((resolve, reject) => {
    if (!archivo || !archivo.type.startsWith('image/')) {
      reject(new Error('No es una imagen válida'));
      return;
    }

    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'lexmundi/cursos');

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          console.log('✅ Imagen subida a Cloudinary:', data.secure_url);
          resolve(data.secure_url);
        } else {
          reject(new Error(data.error?.message || 'Error al subir imagen'));
        }
      })
      .catch(err => reject(err));
  });
};