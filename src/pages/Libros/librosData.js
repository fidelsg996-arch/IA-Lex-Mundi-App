// src/pages/Libros/librosData.js
// 📚 TODOS LOS LIBROS DOCUMENTADOS - ACTUALIZACIÓN 2026
// Total de libros: 65

export const librosIniciales = [
  // ==============================================
  // GUÍAS Y MODELOS - COLECCIÓN PRINCIPAL
  // ==============================================
  { 
    id: 1, 
    titulo: 'Colección de Guías y Modelos', 
    subtitulo: 'Tomos 1-8 - Actualización 2026', 
    descripcion: 'Colección completa que incluye los 8 tomos de Guías y Modelos procesales para la práctica forense diaria.', 
    precio: 8000.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: '8 tomos', 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/coleccion-guias/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/m%C3%A1s-de-esta-colecci%C3%B3n.jpg', 
    esPremioTorneo: false, 
    destacados: [
      'Tomo 1: Materia Agraria', 
      'Tomo 2: Juicio Especial de Arrendamiento', 
      'Tomo 3: Juicio Especial Hipotecario Oral', 
      'Tomo 4: Juicio Ordinario Civil Oral', 
      'Tomo 5: Responsabilidad Civil', 
      'Tomo 6: Acción Reivindicatoria', 
      'Tomo 7: Prescripción', 
      'Tomo 8: Juicio Sucesorio'
    ],
    gratis: false
  },
  { 
    id: 2, 
    titulo: 'Guías y Modelos en Materia Agraria', 
    subtitulo: 'Tomo 1 - Actualización 2026', 
    descripcion: 'Guía práctica con esquemas procesales, jurisprudencia y formularios especializados en materia agraria.', 
    precio: 350.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 280, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guias-y-modelos-en-materia-agraria-tomo-1/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt1.jpg', 
    esPremioTorneo: false, 
    destacados: ['Esquemas procesales', 'Jurisprudencia agraria', 'Formatos y modelos'],
    gratis: false
  },
  { 
    id: 3, 
    titulo: 'Guía de Arrendamiento', 
    subtitulo: 'Tomo 2 - Actualización 2026', 
    descripcion: 'Guía especializada en materia de arrendamiento inmobiliario. Incluye modelos de contratos y demandas de desahucio.', 
    precio: 350.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 250, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guia-arrenamiento-tomo-2/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt2.jpg', 
    esPremioTorneo: false, 
    destacados: ['Modelos de contratos de arrendamiento', 'Demandas de desahucio', 'Jurisprudencia aplicable'],
    gratis: false
  },
  { 
    id: 4, 
    titulo: 'Guía y Modelos en Materia de Juicio Especial Hipotecario Oral', 
    subtitulo: 'Tomo 3 - Actualización 2026', 
    descripcion: 'Guía completa para la tramitación del juicio especial hipotecario oral.', 
    precio: 400.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 300, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-juicio-especial-hipotecario-oral-tomo-3/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt3.jpg', 
    esPremioTorneo: false, 
    destacados: ['Esquema procesal del juicio hipotecario', 'Demandas y contestaciones', 'Ejecución de sentencia'],
    gratis: false
  },
  { 
    id: 5, 
    titulo: 'Guía y Modelos en Materia de Juicio Ordinario Civil Oral', 
    subtitulo: 'Tomo 4 - Actualización 2026', 
    descripcion: 'Repertorio completo de guías procesales y modelos de escritos para juicio ordinario civil oral.', 
    precio: 1400.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 850, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-juicio-ordinario-civil-oral-tomo-4/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt4.jpg', 
    esPremioTorneo: false, 
    destacados: ['Etapas del juicio oral', 'Audiencia preliminar', 'Recursos procesales', 'Modelos de escritos'],
    gratis: false
  },
  { 
    id: 6, 
    titulo: 'Guía y Modelos en Materia de Responsabilidad Civil', 
    subtitulo: 'Tomo 5 - Actualización 2026', 
    descripcion: 'Guía especializada en responsabilidad civil, daño moral y reparación del daño.', 
    precio: 380.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 320, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-responsabilidad-civil-tomo-5/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt5.jpg', 
    esPremioTorneo: false, 
    destacados: ['Daño moral', 'Responsabilidad contractual y extracontractual', 'Cuantificación de daños'],
    gratis: false
  },
  { 
    id: 7, 
    titulo: 'Guía y Modelos en Materia de Acción Reivindicatoria', 
    subtitulo: 'Tomo 6 - Actualización 2026', 
    descripcion: 'Guía completa sobre la acción reivindicatoria, incluyendo demandas, contestaciones y jurisprudencia.', 
    precio: 380.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 310, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-accion-reivindicatoria-tomo-6/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt6.jpg', 
    esPremioTorneo: false, 
    destacados: ['Demandas reivindicatorias', 'Contestaciones', 'Pruebas en acción reivindicatoria'],
    gratis: false
  },
  { 
    id: 8, 
    titulo: 'Guía y Modelos en Materia de Prescripción', 
    subtitulo: 'Tomo 7 - Actualización 2026', 
    descripcion: 'Guía especializada en prescripción positiva y negativa. Incluye plazos, requisitos y jurisprudencia.', 
    precio: 380.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 330, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-prescripcion-tomo-7/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt7.jpg', 
    esPremioTorneo: false, 
    destacados: ['Usucapión', 'Prescripción adquisitiva', 'Plazos de prescripción', 'Jurisprudencia'],
    gratis: false
  },
  { 
    id: 9, 
    titulo: 'Guía y Modelos en Materia de Juicio Sucesorio', 
    subtitulo: 'Tomo 8 - Actualización 2026', 
    descripcion: 'Repertorio completo de guías procesales y modelos para juicio sucesorio testamentario e intestamentario.', 
    precio: 1200.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 1086, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-juicio-sucesorio-tomo-8/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt8.jpg', 
    esPremioTorneo: false, 
    destacados: ['Esquemas procesales', 'Jurisprudencia en materia sucesoria', 'Formatos y modelos de escritos'],
    gratis: false
  },
  { 
    id: 10, 
    titulo: 'Rescisión de Contratos', 
    subtitulo: 'Tomo 9 - Actualización 2026', 
    descripcion: 'Guía especializada en rescisión de contratos. Incluye causas, procedimiento y modelos.', 
    precio: 380.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 290, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/rescision-de-contratos-tomo-9/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/rescisi%C3%B3n%20tomo%209.jpg', 
    esPremioTorneo: false, 
    destacados: ['Demandas de rescisión de contrato', 'Contestaciones', 'Causales de rescisión'],
    gratis: false
  },
  { 
    id: 11, 
    titulo: 'Acción Plenaria de Posesión', 
    subtitulo: 'Tomo 11 - Actualización 2026', 
    descripcion: 'Guía completa sobre la acción plenaria de posesión, interdictos y protección de la posesión.', 
    precio: 380.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 300, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/accion-plenaria-de-posesion-tomo-11/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/plenaria%20posesi%C3%B3n%20tomo%2011.jpg', 
    esPremioTorneo: false, 
    destacados: ['Demandas plenarias de posesión', 'Interdictos', 'Protección de la posesión'],
    gratis: false
  },
  { 
    id: 12, 
    titulo: 'Incidente de Liquidación de Gastos y Costas', 
    subtitulo: 'Tomo 13 - Actualización 2026', 
    descripcion: 'Guía especializada en incidente de liquidación de gastos y costas procesales.', 
    precio: 380.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 270, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/incidente-de-liquidacion-de-gastos-y-costas-tomo-13/', 
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gastos%20y%20costas%20tomo%2013.jpg', 
    esPremioTorneo: false, 
    destacados: ['Procedimiento incidental de liquidación', 'Formularios', 'Jurisprudencia sobre costas'],
    gratis: false
  },

  // ==============================================
  // FORMULARIOS DE MATERIAS ESPECÍFICAS
  // ==============================================
  { 
    id: 13, 
    titulo: 'Notarial y Registral', 
    subtitulo: 'Formularios - Actualización 2026', 
    descripcion: 'Formularios especializados en materia notarial y registral para la práctica profesional.', 
    precio: 400.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 562, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/notarial-y-registral/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Notarial+y+Registral', 
    esPremioTorneo: false, 
    destacados: ['Formularios notariales', 'Formularios registrales', 'Jurisprudencia aplicable'],
    gratis: false
  },
  { 
    id: 14, 
    titulo: 'Jurisdicción Voluntaria', 
    subtitulo: 'Tomo 10 - Actualización 2026', 
    descripcion: 'Guía de formularios y procedimientos no contenciosos en materia familiar.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 298, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/jurisdiccion-voluntaria-tomo-10/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Jurisdicción+Voluntaria', 
    esPremioTorneo: false, 
    destacados: ['Procedimientos no contenciosos', 'Consignación de alimentos', 'Declaración de ausencia'],
    gratis: false
  },
  { 
    id: 15, 
    titulo: 'Patria Potestad', 
    subtitulo: 'Tomo 9 - Formularios - Actualización 2026', 
    descripcion: 'Formularios y guía práctica sobre los procedimientos de patria potestad.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 324, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/patria-potestad-t9/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Patria+Potestad', 
    esPremioTorneo: false, 
    destacados: ['Ejercicio de patria potestad', 'Suspensión y pérdida', 'Formularios'],
    gratis: false
  },
  { 
    id: 16, 
    titulo: 'Guardia y Custodia', 
    subtitulo: 'Tomo 8 - Formularios - Actualización 2026', 
    descripcion: 'Formularios y procedimientos en materia de guarda y custodia de menores.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 330, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/guardia-y-custodia-tomo-8/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Guardia+y+Custodia', 
    esPremioTorneo: false, 
    destacados: ['Tipos de custodia', 'Procedimiento', 'Formularios', 'Jurisprudencia'],
    gratis: false
  },
  { 
    id: 17, 
    titulo: 'Separación de Hogar Común', 
    subtitulo: 'Tomo 7 - Formularios - Actualización 2026', 
    descripcion: 'Formularios para el procedimiento de separación del hogar común.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 502, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/sepracion-de-hogar7/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Separación+de+Hogar', 
    esPremioTorneo: false, 
    destacados: ['Medidas provisionales', 'Órdenes de protección', 'Formularios'],
    gratis: false
  },
  { 
    id: 18, 
    titulo: 'Juicio de Divorcio', 
    subtitulo: 'Tomo 6 - Formularios - Actualización 2026', 
    descripcion: 'Formularios completos para la tramitación del juicio de divorcio incausado y necesario.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 502, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/divorcio-t6/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Juicio+de+Divorcio', 
    esPremioTorneo: false, 
    destacados: ['Demanda de divorcio', 'Convenio de divorcio', 'Sentencia', 'Formularios'],
    gratis: false
  },
  { 
    id: 19, 
    titulo: 'Juicio de Alimentos', 
    subtitulo: 'Tomo 5 - Formularios - Actualización 2026', 
    descripcion: 'Formularios y guía práctica para el procedimiento de alimentos.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 240, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/alimentos-t5/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Juicio+de+Alimentos', 
    esPremioTorneo: false, 
    destacados: ['Demanda de alimentos', 'Procedimiento incidental', 'Formularios'],
    gratis: false
  },
  { 
    id: 20, 
    titulo: 'Procedimiento de Adopción', 
    subtitulo: 'Tomo 4 - Formularios - Actualización 2026', 
    descripcion: 'Formularios para el procedimiento de adopción nacional e internacional.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 230, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/procedimiento-de-adopcion4/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Adopción', 
    esPremioTorneo: false, 
    destacados: ['Solicitud de adopción', 'Certificado de idoneidad', 'Formularios'],
    gratis: false
  },
  { 
    id: 21, 
    titulo: 'Juicio de Filiación', 
    subtitulo: 'Tomo 3 - Formularios - Actualización 2026', 
    descripcion: 'Formularios para los procedimientos de filiación, reconocimiento e impugnación.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 230, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/juicio-filiacion3/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Juicio+de+Filiación', 
    esPremioTorneo: false, 
    destacados: ['Reconocimiento de hijos', 'Impugnación de paternidad', 'Formularios'],
    gratis: false
  },
  { 
    id: 22, 
    titulo: 'Sucesión Intestamentaria', 
    subtitulo: 'Tomo 2 - Formularios - Actualización 2026', 
    descripcion: 'Formularios para la sucesión intestamentaria sin testamento.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 220, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/sucesionint2/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Sucesión+Intestamentaria', 
    esPremioTorneo: false, 
    destacados: ['Denuncia de intestado', 'Declaratoria de herederos', 'Formularios'],
    gratis: false
  },
  { 
    id: 23, 
    titulo: 'Sucesión Testamentaria', 
    subtitulo: 'Tomo 1 - Formularios - Actualización 2026', 
    descripcion: 'Formularios para la sucesión testamentaria con testamento.', 
    precio: 300.00, 
    formato: 'Impreso', 
    edicion: 'Primera', 
    paginas: 220, 
    autor: 'Editorial Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/sucesion-tes1/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Sucesión+Testamentaria', 
    esPremioTorneo: false, 
    destacados: ['Apertura de testamento', 'Reconocimiento de herederos', 'Formularios'],
    gratis: false
  },
  { 
    id: 24, 
    titulo: 'Manual Práctico del Juicio de Divorcio Unilateral y Adopción', 
    subtitulo: 'Actualización 2026', 
    descripcion: 'Manual práctico con guías procesales y modelos de escritos para divorcio unilateral y adopción.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 250, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/manual-divorcio-adopcion/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Divorcio+y+Adopción', 
    esPremioTorneo: false, 
    destacados: ['Divorcio unilateral', 'Procedimiento de adopción', 'Formularios'],
    gratis: false
  },

  // ==============================================
  // COMPENDIOS LEGISLATIVOS
  // ==============================================
  { 
    id: 25, 
    titulo: 'Compendio Agrario', 
    subtitulo: 'Leyes y Reglamentos - Actualización 2026', 
    descripcion: 'Compendio de leyes y reglamentos en materia agraria. Incluye Ley Agraria, Ley de Aguas Nacionales, Ley de Desarrollo Forestal y más.', 
    precio: 200.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 584, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-agrario/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Compendio+Agrario', 
    esPremioTorneo: false, 
    destacados: ['Ley Agraria', 'Ley de Aguas Nacionales', 'Reglamento de Tribunales Agrarios'],
    gratis: false
  },
  { 
    id: 26, 
    titulo: 'Compendio en Materia Ambiental', 
    subtitulo: 'Leyes y Reglamentos - Actualización 2026', 
    descripcion: 'Compendio de leyes y reglamentos en materia ambiental. Incluye LGEEPA, Ley de Vida Silvestre, Ley de Residuos y más.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 652, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-en-materia-ambiental/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Compendio+Ambiental', 
    esPremioTorneo: false, 
    destacados: ['LGEEPA', 'Ley de Vida Silvestre', 'Ley de Residuos', 'Ley de Cambio Climático'],
    gratis: false
  },
  { 
    id: 27, 
    titulo: 'Compendio de Propiedad Intelectual', 
    subtitulo: 'Leyes y Reglamentos - Actualización 2026', 
    descripcion: 'Compendio de leyes y tratados internacionales en materia de propiedad intelectual.', 
    precio: 160.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 302, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-de-propiedad-intelectual/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Propiedad+Intelectual', 
    esPremioTorneo: false, 
    destacados: ['Ley Federal del Derecho de Autor', 'Ley de Protección a la Propiedad Industrial', 'Tratados internacionales'],
    gratis: false
  },
  { 
    id: 28, 
    titulo: 'Compendio Electoral', 
    subtitulo: 'Leyes y Reglamentos - Actualización 2026', 
    descripcion: 'Compendio de leyes y reglamentos en materia electoral.', 
    precio: 280.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 794, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-electoral/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Compendio+Electoral', 
    esPremioTorneo: false, 
    destacados: ['LEGIPE', 'Ley de Medios de Impugnación', 'Ley de Partidos Políticos', 'Ley de Delitos Electorales'],
    gratis: false
  },
  { 
    id: 29, 
    titulo: 'Compendio de Amparo y Derechos Humanos', 
    subtitulo: 'Leyes y Tratados - Actualización 2026', 
    descripcion: 'Compendio completo de la Ley de Amparo, Constitución, tratados internacionales de derechos humanos y acuerdos del Poder Judicial.', 
    precio: 230.00, 
    formato: 'Impreso', 
    edicion: 'Quinta', 
    paginas: 698, 
    autor: 'H. Congreso de la Unión y ACNUDH', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-de-amparo-y-derechos-humanos/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Amparo+y+DDHH', 
    esPremioTorneo: false, 
    destacados: ['Ley de Amparo', 'Constitución', 'Tratados de DDHH', 'Acuerdos del CJF'],
    gratis: false
  },
  { 
    id: 30, 
    titulo: 'Compendio Nacional y Protocolos del Sistema Nacional de Seguridad Pública', 
    subtitulo: 'Leyes y Protocolos - Actualización 2026', 
    descripcion: 'Compendio de leyes y protocolos del Sistema Nacional de Seguridad Pública.', 
    precio: 200.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 674, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-nacional/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Seguridad+Pública', 
    esPremioTorneo: false, 
    destacados: ['CNPP', 'Ley Nacional de Ejecución Penal', 'Ley de la Guardia Nacional', 'Protocolos de actuación'],
    gratis: false
  },
  { 
    id: 31, 
    titulo: 'Compendio en Materia Militar', 
    subtitulo: 'Leyes y Reglamentos - Actualización 2026', 
    descripcion: 'Compendio de leyes y reglamentos en materia militar.', 
    precio: 200.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 472, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-militar/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Compendio+Militar', 
    esPremioTorneo: false, 
    destacados: ['Código de Justicia Militar', 'Ley Orgánica del Ejército', 'Ley de Ascensos', 'Ley de Disciplina'],
    gratis: false
  },
  { 
    id: 32, 
    titulo: 'Compendio Laboral y Convenios Internacionales', 
    subtitulo: 'Leyes y Tratados OIT - Actualización 2026', 
    descripcion: 'Compendio de leyes laborales y convenios de la Organización Internacional del Trabajo.', 
    precio: 280.00, 
    formato: 'Impreso', 
    edicion: 'Cuarta', 
    paginas: 840, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-laboral/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Compendio+Laboral', 
    esPremioTorneo: false, 
    destacados: ['LFT', 'Ley del Seguro Social', 'Convenios OIT', 'Salarios mínimos'],
    gratis: false
  },
  { 
    id: 33, 
    titulo: 'Compendio Fiscal y Administrativo Federal', 
    subtitulo: 'Leyes y Reglamentos - Actualización 2026', 
    descripcion: 'Compendio de leyes fiscales y administrativas federales.', 
    precio: 420.00, 
    formato: 'Impreso', 
    edicion: 'Cuarta', 
    paginas: 872, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/fiscal-administrativo-federal/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Fiscal+y+Administrativo', 
    esPremioTorneo: false, 
    destacados: ['Código Fiscal Federal', 'Ley del ISR', 'Ley del IVA', 'Ley Federal de Procedimiento Administrativo'],
    gratis: false
  },
  { 
    id: 34, 
    titulo: 'Compendio de Seguros y Fianzas', 
    subtitulo: 'Leyes y Reglamentos - Actualización 2026', 
    descripcion: 'Compendio de leyes y reglamentos en materia de seguros y fianzas.', 
    precio: 200.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 442, 
    autor: 'H. Congreso de la Unión', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/compendio-de-seguros-y-fianzas/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Seguros+y+Fianzas', 
    esPremioTorneo: false, 
    destacados: ['Ley de Instituciones de Seguros y Fianzas', 'Ley de Protección al Usuario Financiero', 'Ley Sobre el Contrato de Seguro'],
    gratis: false
  },

  // ==============================================
  // FORMULARIOS PRÁCTICOS FORENSES
  // ==============================================
  { 
    id: 35, 
    titulo: 'Formulario Práctico Forense en Materia de Fraude', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario completo con modelos de denuncias, querellas y escritos en materia de fraude.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 228, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-fraude/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Fraude', 
    esPremioTorneo: false, 
    destacados: ['Denuncias de fraude', 'Querellas', 'Formularios penales'],
    gratis: false
  },
  { 
    id: 36, 
    titulo: 'Formulario Práctico Forense en Materia de Robo', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario con modelos de denuncias, querellas y escritos en materia de robo.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 250, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-de-robo/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Robo', 
    esPremioTorneo: false, 
    destacados: ['Denuncias de robo', 'Querellas', 'Formularios del proceso penal acusatorio'],
    gratis: false
  },
  { 
    id: 37, 
    titulo: 'Formulario Práctico Forense en Materia de Responsabilidad Civil y Daño Moral', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario con modelos de demandas y escritos en materia de responsabilidad civil y daño moral.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 250, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-de-responsabilidad-civil-dano-moral/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Responsabilidad+Civil', 
    esPremioTorneo: false, 
    destacados: ['Demandas de daño moral', 'Cuantificación de daños', 'Jurisprudencia'],
    gratis: false
  },
  { 
    id: 38, 
    titulo: 'Formulario Práctico Forense en Materia de Juicio Reivindicatorio', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario con modelos para el juicio reivindicatorio.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 320, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-de-juicio-reivindicatorio/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Reivindicatorio', 
    esPremioTorneo: false, 
    destacados: ['Demandas reivindicatorias', 'Contestaciones', 'Pruebas', 'Sentencias'],
    gratis: false
  },
  { 
    id: 39, 
    titulo: 'Formulario Práctico Forense en Materia Agraria', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario completo para la práctica forense en materia agraria.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Segunda', 
    paginas: 380, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-agraria/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Agraria', 
    esPremioTorneo: false, 
    destacados: ['Demandas agrarias', 'Juicio sucesorio agrario', 'Usucapión', 'Asambleas ejidales'],
    gratis: false
  },
  { 
    id: 40, 
    titulo: 'Formulario Práctico Forense en Materia de Incidentes', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario con modelos para todo tipo de incidentes en diversas materias.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Segunda', 
    paginas: 594, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-de-incidentes/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Incidentes', 
    esPremioTorneo: false, 
    destacados: ['Incidentes en materia civil', 'Familiar', 'Laboral', 'Amparo', 'Penal'],
    gratis: false
  },
  { 
    id: 41, 
    titulo: 'Formulario Práctico Forense en Materia de Contencioso Administrativo', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario con modelos para el juicio contencioso administrativo federal.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Segunda', 
    paginas: 392, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-de-contencioso-administrativo/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Contencioso+Administrativo', 
    esPremioTorneo: false, 
    destacados: ['Demandas de nulidad fiscal', 'Recursos', 'Suspensión', 'Alegatos'],
    gratis: false
  },
  { 
    id: 42, 
    titulo: 'Formulario Práctico Forense en Materia Laboral', 
    subtitulo: 'Modelos de Escritos - Actualización 2026', 
    descripcion: 'Formulario completo para la práctica forense en materia laboral.', 
    precio: 250.00, 
    formato: 'Impreso', 
    edicion: 'Tercera', 
    paginas: 265, 
    autor: 'Compilaciones Jurídicas', 
    editorial: 'Compilaciones Jurídicas', 
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-laboral/', 
    imagen: 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Laboral', 
    esPremioTorneo: false, 
    destacados: ['Demandas laborales', 'Contestaciones', 'Ofrecimiento de pruebas', 'Laudos'],
    gratis: false
  }
];

// ==============================================
// FUNCIONES DE UTILERÍA
// ==============================================

// Función para agregar nuevos libros fácilmente
export const agregarLibro = (libros, nuevoLibro) => {
  const nuevoId = Math.max(...libros.map(l => l.id), 0) + 1;
  return [...libros, { ...nuevoLibro, id: nuevoId }];
};

// Función para actualizar un libro
export const actualizarLibro = (libros, libroActualizado) => {
  return libros.map(libro => 
    libro.id === libroActualizado.id ? libroActualizado : libro
  );
};

// Función para eliminar un libro
export const eliminarLibroPorId = (libros, id) => {
  return libros.filter(libro => libro.id !== id);
};

// Función para obtener libros gratis
export const obtenerLibrosGratis = (libros) => {
  return libros.filter(libro => libro.gratis === true || libro.precio === 0);
};

// Función para obtener libros premio del torneo
export const obtenerLibrosPremio = (libros) => {
  return libros.filter(libro => libro.esPremioTorneo === true);
};

// Función para buscar libros por título
export const buscarLibrosPorTitulo = (libros, texto) => {
  if (!texto) return libros;
  return libros.filter(libro => 
    libro.titulo.toLowerCase().includes(texto.toLowerCase()) ||
    (libro.subtitulo && libro.subtitulo.toLowerCase().includes(texto.toLowerCase()))
  );
};

// Función para obtener libros por rango de precio
export const obtenerLibrosPorPrecio = (libros, min, max) => {
  return libros.filter(libro => libro.precio >= min && libro.precio <= max);
};

// Función para obtener libros por formato
export const obtenerLibrosPorFormato = (libros, formato) => {
  return libros.filter(libro => libro.formato === formato);
};