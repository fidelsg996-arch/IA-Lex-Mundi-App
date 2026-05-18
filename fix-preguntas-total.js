// fix-preguntas-total.js
const fs = require('fs');

console.log('═══════════════════════════════════════════════════════════');
console.log('🔧 CORRIGIENDO 1,864 PREGUNTAS AUTOMÁTICAMENTE');
console.log('═══════════════════════════════════════════════════════════\n');

const data = JSON.parse(fs.readFileSync('preguntas-firebase-export.json', 'utf8'));

// MAPEO DE CORRECCIONES MANUALES (las hago yo)
const correccionesTexto = {
  // Recusaciones absurdas
  "demandado recusar al juez": "parte recusar al juez",
  "juez recusar al juez": "parte recusar al juez",
  "actor recusar al juez": "parte recusar al juez",
  "tercero recusar al juez": "parte recusar al juez",
  "testigo recusar al juez": "parte recusar al juez",
  "perito recusar al juez": "parte recusar al juez",
  "Ministerio Público recusar al juez": "parte recusar al juez",
  
  // Sujetos procesales incorrectos
  "testigo contestar la demanda": "testigo declarar en juicio",
  "perito contestar la demanda": "perito rendir dictamen",
  "testigo ofrecer pruebas": "parte ofrecer pruebas con testigos",
  "perito ofrecer pruebas": "parte ofrecer prueba pericial",
  
  // Juez haciendo cosas de partes
  "juez ofrecer pruebas": "juez admitir pruebas",
  "juez formular alegatos": "partes formular alegatos",
  "juez interponer apelación": "parte interponer apelación",
  "juez promover incidente": "parte promover incidente",
  
  // Ministerio Público en materia civil (no es común)
  "Ministerio Público interponer apelación": "Ministerio Público emitir opinión",
  "Ministerio Público ofrecer pruebas": "Ministerio Público aportar elementos",
  
  // Correcciones de redacción
  "¿En qué momento procesal debe": "¿En qué momento procesal puede",
  "debe el": "puede el",
  "obligación de": "facultad de"
};

// Función para corregir texto
function corregirTexto(texto) {
  let corregido = texto;
  for (const [mal, bien] of Object.entries(correccionesTexto)) {
    const regex = new RegExp(mal, 'gi');
    corregido = corregido.replace(regex, bien);
  }
  return corregido;
}

// Función para validar si una pregunta tiene sentido
function preguntaValida(pregunta) {
  const texto = pregunta.texto || '';
  
  // Patrones inválidos (si quedan después de corregir)
  const invalidos = [
    /juez.*recusar.*juez/i,
    /recusarse a sí mismo/i,
    /testigo.*contestar.*demanda/i,
    /perito.*contestar.*demanda/i,
    /juez.*formular.*alegatos.*y.*juzgar/i
  ];
  
  for (const patron of invalidos) {
    if (patron.test(texto)) return false;
  }
  
  return texto.length > 20 && pregunta.opciones?.length === 4;
}

// Procesar cada fase
const resultado = {};
let totalOriginal = 0;
let totalCorregidas = 0;
let totalDescartadas = 0;

for (const [fase, contenido] of Object.entries(data)) {
  if (!contenido.preguntas) continue;
  
  console.log(`📖 Procesando ${fase} (${contenido.preguntas.length} originales)...`);
  
  const corregidas = [];
  
  for (const pregunta of contenido.preguntas) {
    totalOriginal++;
    
    // Corregir texto
    const textoCorregido = corregirTexto(pregunta.texto || '');
    
    const preguntaCorregida = {
      texto: textoCorregido,
      opciones: pregunta.opciones || ['', '', '', ''],
      correcta: typeof pregunta.correcta === 'number' ? pregunta.correcta : 0,
      dificultad: fase === 'clasificacion' ? 1 : fase === 'grupos' ? 2 : fase === 'eliminatorias' ? 3 : 4,
      categoria: obtenerCategoria(textoCorregido)
    };
    
    if (preguntaValida(preguntaCorregida)) {
      corregidas.push(preguntaCorregida);
      totalCorregidas++;
    } else {
      totalDescartadas++;
    }
  }
  
  // Tomar primeras 400 o rellenar si faltan
  let finales = corregidas.slice(0, 400);
  
  // Si faltan preguntas, generar algunas de respaldo
  if (finales.length < 400) {
    console.log(`   ⚠️ Faltan ${400 - finales.length} preguntas para ${fase}, generando respaldo...`);
    const respaldo = generarPreguntasRespaldo(fase, 400 - finales.length);
    finales = [...finales, ...respaldo];
  }
  
  resultado[fase] = finales;
  console.log(`   ✅ ${finales.length} preguntas listas (${corregidas.length} válidas, ${contenido.preguntas.length - corregidas.length} descartadas)\n`);
}

function obtenerCategoria(texto) {
  if (texto.includes('principio') || texto.includes('definición')) return 'Fundamentos';
  if (texto.includes('plazo') || texto.includes('días')) return 'Plazos';
  if (texto.includes('prueba') || texto.includes('testimonial')) return 'Pruebas';
  if (texto.includes('recurso') || texto.includes('apelación')) return 'Impugnación';
  if (texto.includes('sentencia') || texto.includes('ejecución')) return 'Resolución';
  return 'Procedimiento';
}

function generarPreguntasRespaldo(fase, cantidad) {
  const preguntasBase = {
    clasificacion: [
      { texto: "¿Qué principios rigen el CNPCyF?", opciones: ["Oralidad, inmediación, contradicción", "Escrito, formalidad, secrecía", "Privacidad, discreción, celeridad", "Flexibilidad, informalidad, gratuidad"], correcta: 0 },
      { texto: "¿Cuál es el objeto del CNPCyF?", opciones: ["Regular procedimientos civiles y familiares", "Regular solo materia penal", "Regular procedimientos administrativos", "Regular solo materia mercantil"], correcta: 0 },
      { texto: "¿Qué se entiende por litis?", opciones: ["El conflicto sometido a juicio", "La sentencia definitiva", "La demanda presentada", "El acuerdo de las partes"], correcta: 0 }
    ],
    grupos: [
      { texto: "¿Quiénes son partes en un juicio?", opciones: ["Actor y demandado", "Juez y secretario", "Testigos y peritos", "Ministerio Público"], correcta: 0 },
      { texto: "¿Qué es la competencia del juez?", opciones: ["La facultad para conocer un asunto", "La obligación de fallar", "El derecho de las partes", "La sentencia ejecutoriada"], correcta: 0 }
    ],
    eliminatorias: [
      { texto: "¿Qué medios de prueba reconoce el CNPCyF?", opciones: ["Confesional, documental, testimonial, pericial", "Solo prueba documental", "Solo prueba testimonial", "Solo prueba pericial"], correcta: 0 }
    ],
    final: [
      { texto: "¿Qué recurso procede contra sentencia definitiva?", opciones: ["Apelación", "Revocación", "Queja", "Reclamación"], correcta: 0 }
    ]
  };
  
  const base = preguntasBase[fase] || preguntasBase.clasificacion;
  const generadas = [];
  
  for (let i = 0; i < cantidad; i++) {
    const plantilla = base[i % base.length];
    generadas.push({
      ...plantilla,
      texto: plantilla.texto + ` (Nivel ${fase})`,
      dificultad: fase === 'clasificacion' ? 1 : fase === 'grupos' ? 2 : fase === 'eliminatorias' ? 3 : 4
    });
  }
  
  return generadas;
}

// Guardar resultado final
fs.writeFileSync('preguntas-400-por-fase-CORREGIDAS.json', JSON.stringify(resultado, null, 2));

console.log('═══════════════════════════════════════════════════════════');
console.log('📊 RESULTADO FINAL');
console.log('═══════════════════════════════════════════════════════════');
console.log(`📝 Originales: ${totalOriginal}`);
console.log(`✅ Corregidas: ${totalCorregidas}`);
console.log(`🗑️ Descartadas: ${totalDescartadas}`);
console.log(`\n📁 Archivo: preguntas-400-por-fase-CORREGIDAS.json`);
console.log('\n🔴 REVISIÓN MANUAL DE EJEMPLOS:');
console.log('═══════════════════════════════════════════════════════════\n');

// Mostrar ejemplos de cada fase
for (const [fase, preguntas] of Object.entries(resultado)) {
  console.log(`\n📌 ${fase.toUpperCase()} - Ejemplo:`);
  if (preguntas[0]) {
    console.log(`   Pregunta: ${preguntas[0].texto.substring(0, 150)}...`);
    console.log(`   Opciones: ${preguntas[0].opciones.join(' | ')}`);
    console.log(`   Respuesta: Opción ${preguntas[0].correcta + 1}`);
  }
}