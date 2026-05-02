// src/pages/Torneos/data/preguntasPorFase.js

export const preguntasPorFase = {
  // FASE DE CLASIFICACIÓN - PREGUNTAS BÁSICAS
  clasificacion: [
    { id: 1, texto: '¿Qué es el derecho civil?', opciones: ['Ramas del derecho público', 'Regula relaciones privadas', 'Derecho penal', 'Derecho laboral'], correcta: 1 },
    { id: 2, texto: '¿Qué es una demanda?', opciones: ['Escrito inicial', 'Sentencia', 'Recurso', 'Prueba'], correcta: 0 },
    { id: 3, texto: '¿Qué es un contrato?', opciones: ['Acuerdo de voluntades', 'Ley', 'Decreto', 'Reglamento'], correcta: 0 },
    { id: 4, texto: '¿Qué es el derecho penal?', opciones: ['Regula delitos y penas', 'Regula contratos', 'Regula familia', 'Regula sucesiones'], correcta: 0 },
    { id: 5, texto: '¿Qué es la usucapión?', opciones: ['Pérdida de un derecho', 'Adquisición por posesión', 'Un tipo de contrato', 'Una sentencia'], correcta: 1 },
    { id: 6, texto: '¿Qué es la jurisdicción?', opciones: ['Facultad de juzgar', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 7, texto: '¿Qué es el derecho laboral?', opciones: ['Relaciones trabajador-empresario', 'Derecho penal', 'Derecho civil', 'Derecho fiscal'], correcta: 0 },
    { id: 8, texto: '¿Qué es una sentencia?', opciones: ['Resolución judicial', 'Demanda', 'Contrato', 'Apelación'], correcta: 0 },
    { id: 9, texto: '¿Qué es un juzgado?', opciones: ['Órgano jurisdiccional', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 10, texto: '¿Qué es un abogado?', opciones: ['Profesional del derecho', 'Juez', 'Fiscal', 'Notario'], correcta: 0 },
    { id: 11, texto: '¿Qué es un recurso?', opciones: ['Impugnar decisión', 'Demanda', 'Prueba', 'Sentencia'], correcta: 0 },
    { id: 12, texto: '¿Qué es una prueba?', opciones: ['Elemento para demostrar un hecho', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 13, texto: '¿Qué es un testigo?', opciones: ['Persona que declara sobre hechos', 'Juez', 'Abogado', 'Fiscal'], correcta: 0 },
    { id: 14, texto: '¿Qué es una audiencia?', opciones: ['Acto judicial público', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 15, texto: '¿Qué es una ley?', opciones: ['Norma jurídica', 'Sentencia', 'Demanda', 'Contrato'], correcta: 0 }
  ],

  // FASE DE GRUPOS - PREGUNTAS INTERMEDIAS
  grupos: [
    { id: 101, texto: '¿Qué es la prescripción?', opciones: ['Extinción de derechos por tiempo', 'Nuevo contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 102, texto: '¿Qué es la conciliación?', opciones: ['Acuerdo entre partes', 'Juicio', 'Apelación', 'Demanda'], correcta: 0 },
    { id: 103, texto: '¿Qué es un recurso de apelación?', opciones: ['Impugnar sentencia', 'Iniciar demanda', 'Firmar contrato', 'Pagar multa'], correcta: 0 },
    { id: 104, texto: '¿Qué es la jurisprudencia?', opciones: ['Interpretación reiterada de leyes', 'Ley nueva', 'Sentencia', 'Demanda'], correcta: 0 },
    { id: 105, texto: '¿Qué es la doctrina?', opciones: ['Opiniones de juristas', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0 },
    { id: 106, texto: '¿Qué es un embargo?', opciones: ['Aseguramiento de bienes', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 107, texto: '¿Qué es una garantía?', opciones: ['Protección de un derecho', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 108, texto: '¿Qué es una hipoteca?', opciones: ['Garantía inmobiliaria', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 109, texto: '¿Qué es un usufructo?', opciones: ['Derecho de uso y disfrute', 'Propiedad', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 110, texto: '¿Qué es una servidumbre?', opciones: ['Limitación a la propiedad', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 111, texto: '¿Qué es una sucesión?', opciones: ['Transmisión de bienes por herencia', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 112, texto: '¿Qué es un testamento?', opciones: ['Voluntad de disposición de bienes', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 113, texto: '¿Qué es una denuncia?', opciones: ['Noticia de un delito', 'Demanda', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 114, texto: '¿Qué es una querella?', opciones: ['Acusación particular', 'Denuncia', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 115, texto: '¿Qué es la flagrancia?', opciones: ['Delito en el momento de cometerse', 'Prueba', 'Testimonio', 'Sentencia'], correcta: 0 }
  ],

  // FASE ELIMINATORIA - PREGUNTAS AVANZADAS
  eliminatorias: [
    { id: 201, texto: '¿Qué es el amparo?', opciones: ['Juicio de garantías', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 202, texto: '¿Qué es la equidad?', opciones: ['Justicia natural', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0 },
    { id: 203, texto: '¿Qué es el derecho fiscal?', opciones: ['Regula impuestos', 'Derecho penal', 'Derecho civil', 'Derecho laboral'], correcta: 0 },
    { id: 204, texto: '¿Qué es la plusvalía?', opciones: ['Ganancia por venta de bienes', 'Impuesto', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 205, texto: '¿Qué es el IVA?', opciones: ['Impuesto al valor agregado', 'Impuesto a la renta', 'Impuesto predial', 'Impuesto vehicular'], correcta: 0 },
    { id: 206, texto: '¿Qué es el ISR?', opciones: ['Impuesto sobre la renta', 'IVA', 'IEPS', 'ISAN'], correcta: 0 },
    { id: 207, texto: '¿Qué es un sindicato?', opciones: ['Asociación de trabajadores', 'Empresa', 'Gobierno', 'Juzgado'], correcta: 0 },
    { id: 208, texto: '¿Qué es una huelga?', opciones: ['Paro laboral', 'Demanda', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 209, texto: '¿Qué es la indemnización?', opciones: ['Compensación por daño', 'Multa', 'Impuesto', 'Contrato'], correcta: 0 },
    { id: 210, texto: '¿Qué es la liquidación?', opciones: ['Finiquito laboral', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 }
  ],

  // FINAL - PREGUNTAS EXPERTO
  final: [
    { id: 301, texto: '¿Qué es el debido proceso?', opciones: ['Garantía constitucional', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
    { id: 302, texto: '¿Qué es la garantía de audiencia?', opciones: ['Derecho a ser escuchado', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
    { id: 303, texto: '¿Qué es el principio de legalidad?', opciones: ['Nadie está obligado a lo que la ley no manda', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
    { id: 304, texto: '¿Qué es la presunción de inocencia?', opciones: ['Derecho a ser considerado inocente hasta sentencia firme', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
    { id: 305, texto: '¿Qué es el principio de irretroactividad?', opciones: ['Las leyes no aplican al pasado', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 }
  ]
};

// Función para obtener preguntas aleatorias para una fase
export const obtenerPreguntasParaFase = (fase, cantidad = 15) => {
  const banco = preguntasPorFase[fase] || preguntasPorFase.clasificacion;
  const mezcladas = [...banco].sort(() => Math.random() - 0.5);
  return mezcladas.slice(0, cantidad);
};