// src/pages/Torneos/data/bancoPreguntas.js

export const preguntasPorFase = {
  clasificacion: [
    { id: 1, texto: '¿Qué es el derecho civil?', opciones: ['Derecho público', 'Regula relaciones privadas', 'Derecho penal', 'Derecho laboral'], correcta: 1 },
    { id: 2, texto: '¿Qué es una demanda?', opciones: ['Escrito inicial', 'Sentencia', 'Recurso', 'Prueba'], correcta: 0 },
    { id: 3, texto: '¿Qué es un contrato?', opciones: ['Acuerdo de voluntades', 'Ley', 'Decreto', 'Reglamento'], correcta: 0 },
    { id: 4, texto: '¿Qué es el derecho penal?', opciones: ['Regula delitos y penas', 'Regula contratos', 'Regula familia', 'Regula sucesiones'], correcta: 0 },
    { id: 5, texto: '¿Qué es la usucapión?', opciones: ['Pérdida de un derecho', 'Adquisición por posesión', 'Tipo de contrato', 'Sentencia'], correcta: 1 },
    { id: 6, texto: '¿Qué es un juzgado?', opciones: ['Órgano jurisdiccional', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 7, texto: '¿Qué es un abogado?', opciones: ['Profesional del derecho', 'Juez', 'Fiscal', 'Notario'], correcta: 0 },
    { id: 8, texto: '¿Qué es un testigo?', opciones: ['Persona que declara sobre hechos', 'Juez', 'Abogado', 'Fiscal'], correcta: 0 },
    { id: 9, texto: '¿Qué es el derecho laboral?', opciones: ['Relaciones trabajador-empresario', 'Derecho penal', 'Derecho civil', 'Derecho fiscal'], correcta: 0 },
    { id: 10, texto: '¿Qué es una sentencia?', opciones: ['Resolución judicial', 'Demanda', 'Contrato', 'Apelación'], correcta: 0 },
    { id: 11, texto: '¿Qué es la jurisdicción?', opciones: ['Facultad de juzgar', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 12, texto: '¿Qué es un recurso?', opciones: ['Impugnar decisión', 'Demanda', 'Prueba', 'Sentencia'], correcta: 0 },
    { id: 13, texto: '¿Qué es una prueba?', opciones: ['Elemento para demostrar un hecho', 'Ley', 'Contrato', 'Sentencia'], correcta: 0 },
    { id: 14, texto: '¿Qué es una audiencia?', opciones: ['Acto judicial público', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 15, texto: '¿Qué es el derecho fiscal?', opciones: ['Regula impuestos', 'Derecho penal', 'Derecho civil', 'Derecho laboral'], correcta: 0 }
  ],
  grupos: [
    { id: 101, texto: '¿Qué es la prescripción?', opciones: ['Extinción de derechos por tiempo', 'Nuevo contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 102, texto: '¿Qué es la conciliación?', opciones: ['Acuerdo entre partes', 'Juicio', 'Apelación', 'Demanda'], correcta: 0 },
    { id: 103, texto: '¿Qué es un recurso de apelación?', opciones: ['Impugnar sentencia', 'Iniciar demanda', 'Firmar contrato', 'Pagar multa'], correcta: 0 },
    { id: 104, texto: '¿Qué es la jurisprudencia?', opciones: ['Interpretación reiterada de leyes', 'Ley nueva', 'Sentencia', 'Demanda'], correcta: 0 },
    { id: 105, texto: '¿Qué es la doctrina?', opciones: ['Opiniones de juristas', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0 }
  ],
  eliminatorias: [
    { id: 201, texto: '¿Qué es el amparo?', opciones: ['Juicio de garantías', 'Contrato', 'Demanda', 'Sentencia'], correcta: 0 },
    { id: 202, texto: '¿Qué es la equidad?', opciones: ['Justicia natural', 'Ley', 'Sentencia', 'Reglamento'], correcta: 0 },
    { id: 203, texto: '¿Qué es el derecho fiscal?', opciones: ['Regula impuestos', 'Derecho penal', 'Derecho civil', 'Derecho laboral'], correcta: 0 }
  ],
  final: [
    { id: 301, texto: '¿Qué es el debido proceso?', opciones: ['Garantía constitucional', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 },
    { id: 302, texto: '¿Qué es la garantía de audiencia?', opciones: ['Derecho a ser escuchado', 'Ley', 'Sentencia', 'Demanda'], correcta: 0 }
  ]
};

export const obtenerPreguntasParaFase = (fase, cantidad = 15) => {
  const banco = preguntasPorFase[fase] || preguntasPorFase.clasificacion;
  const mezcladas = [...banco].sort(() => Math.random() - 0.5);
  
  if (mezcladas.length < cantidad) {
    const resultado = [...mezcladas];
    while (resultado.length < cantidad) {
      resultado.push(...mezcladas.slice(0, cantidad - resultado.length));
    }
    return resultado;
  }
  
  return mezcladas.slice(0, cantidad);
};