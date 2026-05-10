// C:\IA LEX MUNDI\IA-Lex-Mundi-App\frontend\uploadPreguntasAuth.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNnqCNKHG7pDwvjYa4AxuVPRC9gMvllVg",
  authDomain: "ia-lex-mundi-90c11.firebaseapp.com",
  projectId: "ia-lex-mundi-90c11",
  storageBucket: "ia-lex-mundi-90c11.firebasestorage.app",
  messagingSenderId: "323596660830",
  appId: "1:323596660830:web:51e4454311570480ccc4cf",
  measurementId: "G-DRN37TXMJB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ TUS CREDENCIALES
const ADMIN_EMAIL = "fidelsg996@gmail.com";
const ADMIN_PASSWORD = "Segf@8005";

// ============================================
// PREGUNTAS DEL CNPCyF (FASE CLASIFICACIÓN)
// ============================================
const preguntasClasificacion = [
  {
    texto: "¿Qué establece el artículo 1 del Código Nacional de Procedimientos Civiles y Familiares?",
    opciones: [
      "Las disposiciones son de orden público, interés social y observancia general en todo el territorio nacional",
      "Las disposiciones solo aplican en el fuero federal",
      "Las disposiciones son solo para materia familiar",
      "Las disposiciones son solo para materia civil"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Cuál es el objeto del CNPCyF según su artículo 1?",
    opciones: [
      "Establecer la regulación procesal civil y familiar con base en derechos humanos",
      "Regular únicamente los juicios orales",
      "Regular exclusivamente la materia penal",
      "Establecer solo procedimientos administrativos"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Cuál es el plazo máximo para que entre en vigor el CNPCyF en todo el territorio nacional?",
    opciones: [
      "1 de abril de 2027",
      "1 de enero de 2026",
      "1 de junio de 2025",
      "1 de diciembre de 2028"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué son los 'Ajustes de Procedimiento' según el artículo 2 del CNPCyF?",
    opciones: [
      "Modificaciones para facilitar el desempeño de personas en situación de vulnerabilidad",
      "Cambios en los plazos procesales",
      "Modificaciones a las reglas de competencia",
      "Ajustes a las costas judiciales"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué entiende el CNPCyF por 'Apoyo' en su artículo 2?",
    opciones: [
      "Formas de asistir en el procedimiento a las personas para facilitar su comprensión",
      "La ayuda económica para litigar",
      "La asistencia de un abogado particular",
      "El apoyo del Ministerio Público"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es una 'Audiencia virtual' según el CNPCyF?",
    opciones: [
      "Cualquier audiencia celebrada a través de una sala virtual",
      "Una audiencia sin partes",
      "Una audiencia realizada por escrito",
      "Una audiencia en el extranjero"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué se entiende por 'Autoridad jurisdiccional' en el CNPCyF?",
    opciones: [
      "Jueza, juez, magistrada, magistrado u órganos del Poder Judicial con facultades para emitir resoluciones",
      "Solo la Suprema Corte de Justicia",
      "Solo los jueces de primera instancia",
      "Cualquier servidor público"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es una 'Firma electrónica avanzada' según el CNPCyF?",
    opciones: [
      "Conjunto de datos que permite la identificación del firmante bajo su exclusivo control",
      "Cualquier firma escaneada",
      "La firma autógrafa digitalizada",
      "Un correo electrónico firmado"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué efecto jurídico produce la firma electrónica avanzada?",
    opciones: [
      "Los mismos efectos que la firma autógrafa",
      "Solo efectos informativos",
      "Ningún efecto jurídico",
      "Solo efectos administrativos"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué son los 'Grupos sociales en situación de vulnerabilidad' según el CNPCyF?",
    opciones: [
      "Personas que enfrentan situaciones de riesgo o discriminación",
      "Personas de bajos recursos económicos",
      "Personas sin empleo",
      "Personas que no saben leer"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es un 'Procedimiento en línea' según el CNPCyF?",
    opciones: [
      "Procedimiento que se tramita utilizando sistemas de justicia digital",
      "Procedimiento realizado por teléfono",
      "Procedimiento sin abogados",
      "Procedimiento en otro país"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es una 'Promoción electrónica' según el CNPCyF?",
    opciones: [
      "Documento enviado ante un órgano jurisdiccional a través de sistemas de justicia digital",
      "Una oferta comercial",
      "Un anuncio publicitario",
      "Una notificación por correo"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es una 'Sala virtual' según el CNPCyF?",
    opciones: [
      "Programa de cómputo que permite comunicación sincrónica entre partes y órgano jurisdiccional",
      "Una sala de cine",
      "Un aula escolar en línea",
      "Una videollamada familiar"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué deben garantizar las autoridades jurisdiccionales según el artículo 3 del CNPCyF?",
    opciones: [
      "La igualdad sustantiva entre mujeres y hombres con perspectiva de género",
      "La celeridad procesal únicamente",
      "La economía procesal",
      "La publicidad de los actos"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué facultades tienen las autoridades jurisdiccionales según el artículo 4 del CNPCyF?",
    opciones: [
      "Las más amplias facultades de dirección procesal",
      "Solo facultades de ejecución",
      "Solo facultades de supervisión",
      "Ninguna facultad especial"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué deben hacer las autoridades jurisdiccionales cuando se involucran derechos de niñas, niños y adolescentes?",
    opciones: [
      "Actuar con base en el interés superior de la niñez",
      "Aplicar las mismas reglas que para adultos",
      "Desechar la demanda",
      "Turnar el asunto al Ministerio Público"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué principio establece el artículo 7 fracción I del CNPCyF?",
    opciones: [
      "Acceso a la justicia",
      "Oralidad",
      "Concentración",
      "Preclusión"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿En qué consiste el principio de 'Concentración' según el CNPCyF?",
    opciones: [
      "Desahogar la mayor cantidad de actuaciones procesales en una sola audiencia",
      "Reunir a todas las partes en un solo lugar",
      "Centralizar todos los juicios",
      "Unificar criterios judiciales"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué establece el principio de 'Colaboración' en el CNPCyF?",
    opciones: [
      "Propiciar que las partes resuelvan por sí mismas el conflicto mediante acuerdos conciliatorios",
      "Obligar a las partes a llegar a un acuerdo",
      "Que el juez imponga una solución",
      "Que las partes deleguen en terceros"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿En qué consiste el principio de 'Contradicción'?",
    opciones: [
      "Las partes tienen derecho a debatir los hechos y pruebas de su contraparte",
      "Las partes no pueden contradecirse",
      "Solo el juez puede contradecir",
      "Las pruebas no se pueden controvertir"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es el principio de 'Dirección Procesal'?",
    opciones: [
      "La rectoría del proceso está confiada únicamente a las autoridades jurisdiccionales",
      "Las partes dirigen el proceso",
      "Los abogados dirigen el proceso",
      "El Ministerio Público dirige el proceso"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿En qué consiste el principio de 'Igualdad Procesal'?",
    opciones: [
      "Las personas reciben el mismo trato, oportunidades, derechos y cargas procesales sin discriminación",
      "Solo las mujeres tienen derechos especiales",
      "Solo los hombres tienen derechos especiales",
      "Las partes no tienen derechos"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es el principio de 'Inmediación'?",
    opciones: [
      "Contacto directo, personal e indelegable de la autoridad jurisdiccional con las partes y las pruebas",
      "Las partes se comunican directamente",
      "El juicio se resuelve de inmediato",
      "Notificación inmediata"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué establece el principio de 'Interés superior de la niñez'?",
    opciones: [
      "Hacer prevalecer los derechos de las niñas, niños o adolescentes sobre otros derechos en pugna",
      "Los niños no tienen derechos",
      "Los adultos tienen prioridad",
      "Solo importa el interés económico"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿En qué consiste el principio de 'Oralidad'?",
    opciones: [
      "El proceso se desarrollará en audiencias orales",
      "Todo debe hacerse por escrito",
      "No hay audiencias",
      "Solo se usan documentos"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué es el principio de 'Perspectiva de género' según el CNPCyF?",
    opciones: [
      "Visión científica que promueve la igualdad sustantiva entre los géneros",
      "Dar preferencia a las mujeres",
      "Dar preferencia a los hombres",
      "Ignorar las diferencias de género"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿En qué consiste el principio de 'Preclusión'?",
    opciones: [
      "El no ejercicio de los derechos procesales en la etapa correspondiente extingue la oportunidad",
      "Los derechos procesales son perpetuos",
      "Se pueden ejercer derechos en cualquier momento",
      "No hay plazos procesales"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Qué establece el artículo 8 del CNPCyF sobre el ejercicio de la acción?",
    opciones: [
      "Requiere existencia de un derecho, violación del mismo y capacidad o legitimación",
      "Solo requiere la voluntad del actor",
      "No se requieren requisitos",
      "Solo requiere un abogado"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  }
];

// ============================================
// FUNCIÓN PARA SUBIR LAS PREGUNTAS
// ============================================
async function subirPreguntas() {
  console.log("🔐 Iniciando sesión como admin...");
  
  try {
    // Autenticación
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log(`✅ Sesión iniciada: ${userCredential.user.email}`);
    
    console.log("\n🚀 Subiendo preguntas a Firestore...");
    console.log(`📝 Total de preguntas a subir: ${preguntasClasificacion.length}`);
    
    let subidas = 0;
    let errores = 0;
    
    for (let i = 0; i < preguntasClasificacion.length; i++) {
      const pregunta = preguntasClasificacion[i];
      try {
        const docRef = await addDoc(collection(db, "preguntas_clasificacion"), pregunta);
        console.log(`✅ [${i + 1}/${preguntasClasificacion.length}] Pregunta subida: ${docRef.id}`);
        subidas++;
      } catch (error) {
        console.error(`❌ Error en pregunta ${i + 1}:`, error.message);
        errores++;
      }
    }
    
    console.log("\n📊 RESUMEN DE SUBIDA:");
    console.log(`✅ Exitosas: ${subidas}`);
    console.log(`❌ Fallidas: ${errores}`);
    console.log("🎉 Proceso completado!");
    
  } catch (error) {
    console.error("❌ Error de autenticación:", error.message);
    console.log("\n💡 Posibles soluciones:");
    console.log("1. Verifica que el usuario exista en Firebase Authentication");
    console.log("2. Confirma que la contraseña sea correcta");
    console.log("3. En Firebase Console → Firestore → Rules, cambia a: allow read, write: if request.auth != null;");
  }
}

// Ejecutar la función
subirPreguntas();