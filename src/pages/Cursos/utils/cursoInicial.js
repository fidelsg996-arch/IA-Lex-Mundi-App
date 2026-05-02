// src/pages/Cursos/utils/cursoInicial.js
export const cursoInicial = {
  id: 1,
  titulo: 'Fundamentos del Derecho Contractual Internacional',
  subtitulo: 'Derecho Comparado',
  descripcion: 'Domina los principios esenciales de los contratos en el derecho comparado',
  precio: 1500.00,
  esGratis: false,
  esPremioTorneo: false,
  duracion: '40 horas',
  totalLecciones: '15 lecciones',
  totalModulos: '3 módulos',
  incluyeConstancia: 'Constancia incluida',
  imagen: null,
  imagenPreview: null,
  modulos: [
    {
      id: 1,
      titulo: 'Introducción al Derecho Contractual',
      lecciones: '5 lecciones',
      categoria: 'Contratos',
      leccionesLista: [
        { id: 1, titulo: 'Historia y evolución del contrato', contenido: 'El contrato ha sido el instrumento...', ejemplo: 'Ejemplo...', caso: 'Caso...' },
        { id: 2, titulo: 'Elementos esenciales del contrato', contenido: 'Todo contrato válido requiere...', ejemplo: 'Ejemplo...', caso: 'Caso...' }
      ]
    }
  ]
};