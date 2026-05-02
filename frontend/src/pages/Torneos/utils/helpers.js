// src/modules/Torneos/utils/helpers.js

import { seleccionarPreguntaAleatoria, respuestaRivalInteligente } from './preguntasBanco';

export const convertirImagenABase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No se seleccionó ningún archivo');
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject('El archivo no es una imagen válida');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject('La imagen no debe superar los 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject('Error al leer la imagen');
    reader.readAsDataURL(file);
  });
};

export const obtenerUrlImagen = (curso) => {
  if (curso.imagen && curso.imagen.startsWith('data:image')) {
    return curso.imagen;
  }
  if (curso.imagen && curso.imagen.startsWith('http')) {
    return curso.imagen;
  }
  return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
};

export const obtenerLibrosParaPremios = () => {
  const stored = localStorage.getItem('lexmindi_libros');
  if (stored) {
    return JSON.parse(stored).map(libro => ({
      id: libro.id,
      titulo: libro.titulo,
      imagen: libro.imagen,
      precio: libro.precio
    }));
  }
  return [];
};

export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES');
};

export const generarId = () => {
  return Date.now();
};