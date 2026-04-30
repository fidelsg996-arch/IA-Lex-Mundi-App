// src/modules/Torneos/utils/preguntasBanco.js

export const bancoPreguntasPorArea = {
  "Derecho Civil": [
    { pregunta: "¿Qué artículo del Código Civil Federal regula la capacidad jurídica de las personas?", opciones: ["Artículo 22", "Artículo 24", "Artículo 450", "Artículo 1795"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué tipo de contrato se perfecciona con la simple manifestación de la voluntad?", opciones: ["Contrato real", "Contrato consensual", "Contrato formal", "Contrato unilateral"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Cuál es el plazo para la prescripción positiva de bienes inmuebles?", opciones: ["3 años", "5 años", "10 años", "15 años"], correcta: 2, area: "Derecho Civil" },
    { pregunta: "¿Qué es la acción reivindicatoria?", opciones: ["Recuperar la posesión", "Reclamar la propiedad", "Demandar daños", "Impugnar un testamento"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué es el usufructo?", opciones: ["Derecho de usar y disfrutar", "Derecho de propiedad", "Derecho de posesión", "Derecho de habitación"], correcta: 0, area: "Derecho Civil" },
    { pregunta: "¿Qué es la cosa juzgada?", opciones: ["Sentencia firme e inapelable", "Juicio en curso", "Prueba documental", "Testimonio de parte"], correcta: 0, area: "Derecho Civil" },
    { pregunta: "¿Qué es el contrato de adhesión?", opciones: ["Contrato negociado", "Contrato con cláusulas predispuestas", "Contrato bilateral", "Contrato gratuito"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué requiere el pago de una obligación?", opciones: ["Consentimiento del deudor", "Entrega de la cosa o cantidad debida", "Presencia de un notario", "Documento escrito"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué es la simulación de un acto jurídico?", opciones: ["Acto verdadero", "Acto falso aparente", "Acto nulo", "Acto condicionado"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué es la prescripción?", opciones: ["Pérdida de derechos", "Adquisición de derechos por tiempo", "Nulidad del acto", "Caducidad de la acción"], correcta: 1, area: "Derecho Civil" }
  ],
  "Derecho Penal": [
    { pregunta: "¿Cuál es el principio fundamental del derecho penal que establece que una persona es inocente hasta que se demuestre lo contrario?", opciones: ["Principio de legalidad", "Presunción de inocencia", "Debido proceso", "Non bis in idem"], correcta: 1, area: "Derecho Penal" },
    { pregunta: "¿Qué tipo de falta se sanciona con prisión preventiva oficiosa?", opciones: ["Faltas administrativas", "Delitos graves", "Faltas cívicas", "Delitos culposos"], correcta: 1, area: "Derecho Penal" },
    { pregunta: "¿Qué es el dolo en materia penal?", opciones: ["Culpa", "Negligencia", "Intención de cometer el delito", "Caso fortuito"], correcta: 2, area: "Derecho Penal" },
    { pregunta: "¿Qué es la tentativa en derecho penal?", opciones: ["Delito consumado", "Actos preparatorios punibles", "Inicio de ejecución sin consumación", "Desistimiento voluntario"], correcta: 2, area: "Derecho Penal" },
    { pregunta: "¿Qué es el delito culposo?", opciones: ["Intencional", "Por imprudencia o negligencia", "Por caso fortuito", "Por fuerza mayor"], correcta: 1, area: "Derecho Penal" },
    { pregunta: "¿Qué es la punibilidad?", opciones: ["Capacidad de ser juzgado", "Capacidad de ser sancionado", "Capacidad de ser absuelto", "Capacidad de ser procesado"], correcta: 1, area: "Derecho Penal" },
    { pregunta: "¿Qué es la antijuridicidad?", opciones: ["Acto contrario a la ley", "Acto permitido", "Acto justificado", "Acto irrelevante"], correcta: 0, area: "Derecho Penal" }
  ],
  "Derecho Constitucional": [
    { pregunta: "¿Qué artículo de la Constitución Mexicana establece la división de poderes?", opciones: ["Artículo 39", "Artículo 49", "Artículo 123", "Artículo 27"], correcta: 1, area: "Derecho Constitucional" },
    { pregunta: "¿Cuántos ministros integran la Suprema Corte de Justicia de la Nación?", opciones: ["9", "11", "13", "15"], correcta: 1, area: "Derecho Constitucional" },
    { pregunta: "¿Qué es la 'acción de amparo'?", opciones: ["Un recurso para proteger derechos humanos", "Una sentencia judicial", "Un tipo de contrato", "Una ley federal"], correcta: 0, area: "Derecho Constitucional" },
    { pregunta: "¿Qué es el principio de supremacía constitucional?", opciones: ["La constitución está sobre cualquier ley", "El presidente está sobre la constitución", "Las leyes locales tienen prioridad", "Los tratados internacionales no aplican"], correcta: 0, area: "Derecho Constitucional" },
    { pregunta: "¿Qué es el juicio de controversia constitucional?", opciones: ["Entre poderes o niveles de gobierno", "Entre particulares", "Por violación de derechos humanos", "Amparo directo"], correcta: 0, area: "Derecho Constitucional" },
    { pregunta: "¿Qué es la reforma constitucional?", opciones: ["Modificación de la constitución", "Derogación total", "Nueva constitución", "Reglamento interno"], correcta: 0, area: "Derecho Constitucional" },
    { pregunta: "¿Qué son los derechos humanos de tercera generación?", opciones: ["Individuales", "Sociales y colectivos", "Políticos", "Económicos"], correcta: 1, area: "Derecho Constitucional" }
  ],
  "Derecho Laboral": [
    { pregunta: "¿Qué principio del derecho laboral protege al trabajador en caso de duda?", opciones: ["Principio de continuidad", "Principio in dubio pro operario", "Principio de primacía de la realidad", "Principio de irrenunciabilidad"], correcta: 1, area: "Derecho Laboral" },
    { pregunta: "¿Cuál es la jornada máxima de trabajo diurna en México?", opciones: ["6 horas", "8 horas", "10 horas", "12 horas"], correcta: 1, area: "Derecho Laboral" },
    { pregunta: "¿Qué es el salario mínimo?", opciones: ["Salario más bajo legal", "Salario promedio", "Salario más alto", "Salario por hora"], correcta: 0, area: "Derecho Laboral" },
    { pregunta: "¿Qué es el aguinaldo?", opciones: ["Bono de productividad", "Prestación anual", "Vale de despensa", "Fondo de ahorro"], correcta: 1, area: "Derecho Laboral" },
    { pregunta: "¿Qué son las utilidades?", opciones: ["Participación de los trabajadores", "Bonos del patrón", "Ahorro voluntario", "Fondo de retiro"], correcta: 0, area: "Derecho Laboral" }
  ],
  "Derecho Mercantil": [
    { pregunta: "¿Qué principio rige la competencia económica en México?", opciones: ["Monopolio estatal", "Libre competencia", "Intervención total", "Economía cerrada"], correcta: 1, area: "Derecho Mercantil" },
    { pregunta: "¿Qué ley regula los títulos de crédito en México?", opciones: ["Ley General de Sociedades", "Ley de Títulos y Operaciones de Crédito", "Código de Comercio", "Ley de Quiebras"], correcta: 1, area: "Derecho Mercantil" },
    { pregunta: "¿Qué es una letra de cambio?", opciones: ["Contrato de compraventa", "Título de crédito", "Documento fiscal", "Recibo de pago"], correcta: 1, area: "Derecho Mercantil" },
    { pregunta: "¿Qué es un pagaré?", opciones: ["Promesa de pago", "Contrato de préstamo", "Recibo de nómina", "Factura comercial"], correcta: 0, area: "Derecho Mercantil" },
    { pregunta: "¿Qué es un cheque?", opciones: ["Orden de pago", "Contrato bancario", "Recibo de depósito", "Tarjeta de crédito"], correcta: 0, area: "Derecho Mercantil" }
  ],
  "Derecho Internacional": [
    { pregunta: "¿Qué es el Derecho Internacional Público?", opciones: ["Relaciones entre estados", "Relaciones entre particulares", "Derecho interno", "Derecho comercial"], correcta: 0, area: "Derecho Internacional" },
    { pregunta: "¿Qué es un tratado internacional?", opciones: ["Acuerdo entre estados", "Ley nacional", "Contrato comercial", "Decreto presidencial"], correcta: 0, area: "Derecho Internacional" },
    { pregunta: "¿Qué es la Corte Internacional de Justicia?", opciones: ["Tribunal de la ONU", "Tribunal penal", "Corte comercial", "Tribunal regional"], correcta: 0, area: "Derecho Internacional" },
    { pregunta: "¿Qué es el principio de no intervención?", opciones: ["No interferir en asuntos internos", "Intervención humanitaria", "Ayuda internacional", "Cooperación militar"], correcta: 0, area: "Derecho Internacional" },
    { pregunta: "¿Qué es la extradición?", opciones: ["Entrega de un fugitivo", "Expulsión de un extranjero", "Deportación", "Refugio político"], correcta: 0, area: "Derecho Internacional" }
  ],
  "Derecho Fiscal": [
    { pregunta: "¿Qué es el Impuesto Sobre la Renta (ISR)?", opciones: ["Impuesto a los ingresos", "Impuesto a las ventas", "Impuesto a la propiedad", "Impuesto a las importaciones"], correcta: 0, area: "Derecho Fiscal" },
    { pregunta: "¿Qué es el IVA?", opciones: ["Impuesto al Valor Agregado", "Impuesto a la Renta", "Impuesto a la Exportación", "Impuesto a la Nómina"], correcta: 0, area: "Derecho Fiscal" },
    { pregunta: "¿Qué es una declaración fiscal?", opciones: ["Informe de impuestos", "Pago de impuestos", "Auditoría fiscal", "Devolución de impuestos"], correcta: 0, area: "Derecho Fiscal" },
    { pregunta: "¿Qué es el RFC?", opciones: ["Registro Federal de Contribuyentes", "Registro Fiscal de Compañías", "Registro de Facturación", "Registro de Comercio"], correcta: 0, area: "Derecho Fiscal" },
    { pregunta: "¿Qué es un crédito fiscal?", opciones: ["Deuda tributaria", "Préstamo del SAT", "Devolución de impuestos", "Exención fiscal"], correcta: 0, area: "Derecho Fiscal" }
  ]
};

// Función para seleccionar pregunta aleatoria por área o general
export const seleccionarPreguntaAleatoria = (areaEspecifica = null) => {
  let areas = Object.keys(bancoPreguntasPorArea);
  if (areaEspecifica && bancoPreguntasPorArea[areaEspecifica]) {
    areas = [areaEspecifica];
  }
  const areaAleatoria = areas[Math.floor(Math.random() * areas.length)];
  const preguntasArea = bancoPreguntasPorArea[areaAleatoria];
  const indice = Math.floor(Math.random() * preguntasArea.length);
  return preguntasArea[indice];
};

// Función para obtener preguntas por dificultad (para eliminatorias)
export const seleccionarPreguntaPorDificultad = (dificultad) => {
  const todasPreguntas = Object.values(bancoPreguntasPorArea).flat();
  const preguntasFiltradas = todasPreguntas; // Por ahora todas
  const indice = Math.floor(Math.random() * preguntasFiltradas.length);
  return preguntasFiltradas[indice];
};

// Respuesta del rival con 95% de efectividad
export const respuestaRivalInteligente = (pregunta) => {
  const acierta = Math.random() < 0.95;
  if (acierta) {
    return pregunta.correcta;
  } else {
    const opcionesIncorrectas = pregunta.opciones
      .map((_, idx) => idx)
      .filter(idx => idx !== pregunta.correcta);
    return opcionesIncorrectas[Math.floor(Math.random() * opcionesIncorrectas.length)];
  }
};