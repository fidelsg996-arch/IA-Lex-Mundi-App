// src/services/avatarService.js
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Generar avatar fallback con UI Avatars
export const generarAvatarFallback = (nombre, color = '3B82F6') => {
  const iniciales = nombre ? nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=${color}&color=fff&rounded=true&size=128`;
};

// Caché de avatares
let cacheAvatares = {};

// Obtener avatar del usuario
export const obtenerAvatar = async (userId, nombre, color = '3B82F6') => {
  if (!userId) return generarAvatarFallback(nombre || 'Usuario', color);
  
  if (cacheAvatares[userId]) return cacheAvatares[userId];
  
  try {
    const perfilRef = doc(db, 'perfiles_participantes', userId);
    const perfilDoc = await getDoc(perfilRef);
    
    if (perfilDoc.exists() && perfilDoc.data()?.avatar?.url) {
      cacheAvatares[userId] = perfilDoc.data().avatar.url;
      return cacheAvatares[userId];
    }
    
    const fallback = generarAvatarFallback(nombre, color);
    cacheAvatares[userId] = fallback;
    return fallback;
  } catch (error) {
    console.error('Error obteniendo avatar:', error);
    return generarAvatarFallback(nombre || 'Usuario', color);
  }
};

// Subir avatar a Firebase Storage
export const subirAvatar = async (userId, archivo, nombre) => {
  if (!userId) return { success: false, error: 'Usuario no identificado' };
  
  try {
    if (!archivo.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }
    
    if (archivo.size > 2 * 1024 * 1024) {
      throw new Error('La imagen no debe superar los 2MB');
    }
    
    const imagenComprimida = await comprimirImagen(archivo);
    await eliminarAvatarAnterior(userId);
    
    const extension = archivo.type.split('/')[1];
    const storageRef = ref(storage, `avatares/${userId}/avatar_${Date.now()}.${extension}`);
    const snapshot = await uploadBytes(storageRef, imagenComprimida);
    const url = await getDownloadURL(snapshot.ref);
    
    const perfilRef = doc(db, 'perfiles_participantes', userId);
    await setDoc(perfilRef, {
      userId: userId,
      nombre: nombre,
      avatar: {
        url: url,
        path: snapshot.ref.fullPath,
        updatedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    cacheAvatares[userId] = url;
    
    return { success: true, url };
  } catch (error) {
    console.error('Error subiendo avatar:', error);
    return { success: false, error: error.message };
  }
};

const eliminarAvatarAnterior = async (userId) => {
  try {
    const perfilRef = doc(db, 'perfiles_participantes', userId);
    const perfilDoc = await getDoc(perfilRef);
    
    if (perfilDoc.exists() && perfilDoc.data()?.avatar?.path) {
      const oldAvatarRef = ref(storage, perfilDoc.data().avatar.path);
      await deleteObject(oldAvatarRef);
    }
  } catch (error) {
    console.log('No había avatar anterior:', error);
  }
};

const comprimirImagen = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 200, 200);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const limpiarCacheAvatares = () => {
  cacheAvatares = {};
};