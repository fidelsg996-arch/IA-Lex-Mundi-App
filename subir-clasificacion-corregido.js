// subir-clasificacion-corregido.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCNnqCNKHG7pDwvjYa4AxuVPRC9gMvllVg",
  authDomain: "ia-lex-mundi-90c11.firebaseapp.com",
  projectId: "ia-lex-mundi-90c11",
  storageBucket: "ia-lex-mundi-90c11.firebasestorage.app",
  messagingSenderId: "323596660830",
  appId: "1:323596660830:web:51e4454311570480ccc4cf"
};

const authConfig = {
  email: "fidelsg996@gmail.com",
  password: "Segf@8005"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const preguntasClasificacion = [
  // ========== ARTÍCULO 1 ==========
  {
    texto: "De conformidad con el artículo 1 del CNPCyF, ¿qué carácter tienen sus disposiciones?",
    opciones: [
      "De orden público, interés social y observancia general en todo el territorio nacional",
      "De carácter supletorio y dispositivo",
      "De aplicación exclusiva en el fuero federal",
      "De observancia solo en materia familiar"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 1 CNPCyF"
  },
  {
    texto: "Según el artículo 1 del CNPCyF, ¿con base en qué derechos se establece la regulación procesal civil y familiar?",
    opciones: [
      "Derechos humanos previstos en la Constitución y Tratados Internacionales",
      "Derechos civiles del Código Civil Federal",
      "Derechos sociales del trabajo",
      "Derechos políticos de los ciudadanos"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 1 CNPCyF"
  },

  // ========== ARTÍCULO 2 ==========
  {
    texto: "¿Qué son los 'Ajustes de Procedimiento' según la fracción I del artículo 2 del CNPCyF?",
    opciones: [
      "Modificaciones para facilitar el desempeño de personas en situación de vulnerabilidad",
      "Cambios en los plazos procesales",
      "Correcciones de errores en la demanda",
      "Adaptaciones de las salas de audiencia"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 2, Fracción I CNPCyF"
  },
  {
    texto: "De acuerdo con el artículo 2, fracción V del CNPCyF, ¿qué es una audiencia virtual?",
    opciones: [
      "Cualquier audiencia celebrada a través de una sala virtual",
      "Una audiencia grabada en video",
      "Una audiencia por escrito",
      "Una audiencia sin presencia judicial"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 2, Fracción V CNPCyF"
  },
  {
    texto: "Según la fracción XX del artículo 2 del CNPCyF, ¿qué requisitos debe cumplir la firma electrónica avanzada?",
    opciones: [
      "Identificación del firmante, creada bajo su control exclusivo, vinculada a él, que permite detectar modificaciones",
      "Estar escaneada en un documento PDF",
      "Tener un sello notarial",
      "Ser una contraseña numérica"
    ],
    correcta: 0,
    dificultad: 3,
    fundamento: "Artículo 2, Fracción XX CNPCyF"
  },

  // ========== ARTÍCULO 3 ==========
  {
    texto: "¿Qué debe ponderar el juez sobre los formalismos procesales según el artículo 3 del CNPCyF?",
    opciones: [
      "La solución de la controversia",
      "El cumplimiento estricto de los plazos",
      "La economía procesal",
      "La oralidad"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 3 CNPCyF"
  },

  // ========== ARTÍCULO 4 ==========
  {
    texto: "¿Qué facultad otorga el artículo 4 del CNPCyF al juez para hacer cumplir sus determinaciones?",
    opciones: [
      "Medidas de apremio",
      "Multa personal",
      "Arresto",
      "Exhortos"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 4 CNPCyF"
  },

  // ========== ARTÍCULO 5 ==========
  {
    texto: "¿Qué debe hacer el juez cuando una parte revela su condición de vulnerabilidad según el artículo 5 del CNPCyF?",
    opciones: [
      "Proveer ajustes de procedimiento y suplir deficiencias de oficio",
      "Desechar la demanda",
      "Nombrar un tutor",
      "Suspender el juicio"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 5 CNPCyF"
  },

  // ========== ARTÍCULO 6 ==========
  {
    texto: "¿Qué debe hacer el juez si una persona indígena no habla español y no hay intérprete disponible según el artículo 6 del CNPCyF?",
    opciones: [
      "Suspender la audiencia y ordenar nueva fecha",
      "Continuar con un testigo como intérprete",
      "Nombrar a la contraparte como intérprete",
      "Desechar la comparecencia"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 6 CNPCyF"
  },
  {
    texto: "¿Quiénes no pueden fungir como intérpretes según el artículo 6 del CNPCyF?",
    opciones: [
      "Las partes o los testigos",
      "Los peritos",
      "Los notarios",
      "Los abogados"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 6 CNPCyF"
  },

  // ========== ARTÍCULO 7 ==========
  {
    texto: "Según el artículo 7 del CNPCyF, ¿qué significa el principio de Concentración?",
    opciones: [
      "Desahogar la mayor cantidad de actuaciones en una sola audiencia",
      "Concentrar todos los juicios en un tribunal",
      "Unificar la competencia",
      "Acumular todas las pruebas"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 7, Fracción II CNPCyF"
  },
  {
    texto: "¿Cuándo no procede la conciliación según el principio de Colaboración del artículo 7 del CNPCyF?",
    opciones: [
      "Cuando existan conductas de violencia",
      "Siempre procede",
      "Solo en materia civil",
      "Cuando las partes no tengan abogado"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 7, Fracción III CNPCyF"
  },
  {
    texto: "¿Cuál es la regla sobre la continuidad de las audiencias según el artículo 7 del CNPCyF?",
    opciones: [
      "Deben ser ininterrumpidas",
      "Se suspenden cada hora",
      "Pueden suspenderse por voluntad de las partes",
      "Se realizan en días distintos"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 7, Fracción IV CNPCyF"
  },
  {
    texto: "¿Qué derecho tienen las partes según el principio de Contradicción del artículo 7 del CNPCyF?",
    opciones: [
      "Debatir los hechos, argumentos y pruebas de la contraparte",
      "No contestar la demanda",
      "Presentar pruebas sin límite",
      "Recusar al juez sin causa"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 7, Fracción V CNPCyF"
  },
  {
    texto: "¿A quién está confiada la rectoría del proceso según el artículo 7 del CNPCyF?",
    opciones: [
      "Únicamente a las autoridades jurisdiccionales",
      "A las partes",
      "Al Ministerio Público",
      "A los abogados"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 7, Fracción VI CNPCyF"
  },
  {
    texto: "¿Qué característica tiene el principio de Inmediación según el artículo 7 del CNPCyF?",
    opciones: [
      "El contacto directo, personal e indelegable del juez con las partes y pruebas",
      "El juez puede delegar audiencias",
      "Las partes no pueden hablar con el juez",
      "Todo se hace por escrito"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 7, Fracción VIII CNPCyF"
  },
  {
    texto: "¿Qué debe prevalecer cuando hay conflicto de derechos según el principio de Interés Superior de la Niñez del artículo 7 del CNPCyF?",
    opciones: [
      "Los derechos de las niñas, niños y adolescentes",
      "Los derechos de los adultos",
      "La voluntad del juez",
      "El principio de legalidad"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 7, Fracción IX CNPCyF"
  },
  {
    texto: "¿Qué es la Litis abierta en materia familiar según el artículo 7 del CNPCyF?",
    opciones: [
      "El juez debe considerar hechos producidos durante el proceso aunque no fueron invocados",
      "La litis se reduce a la demanda",
      "Solo aplica en materia civil",
      "Las partes no pueden ofrecer nuevas pruebas"
    ],
    correcta: 0,
    dificultad: 3,
    fundamento: "Artículo 7, Fracción XII CNPCyF"
  },
  {
    texto: "¿Qué implica la Preclusión según el artículo 7 del CNPCyF?",
    opciones: [
      "El no ejercicio de derechos procesales en la etapa correspondiente extingue la oportunidad",
      "Los derechos pueden ejercerse en cualquier momento",
      "El juez debe recordar los derechos a las partes",
      "Solo aplica al demandado"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 7, Fracción XV CNPCyF"
  },
  {
    texto: "¿En qué materia las audiencias quedan reservadas a las partes según el artículo 7 del CNPCyF?",
    opciones: [
      "Materia familiar",
      "Materia civil",
      "Materia mercantil",
      "En todas"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 7, Fracción XVI CNPCyF"
  },

  // ========== ARTÍCULO 8 ==========
  {
    texto: "¿Cuáles son los requisitos para el ejercicio de la acción según el artículo 8 del CNPCyF?",
    opciones: [
      "Existencia de un derecho, su violación, capacidad o legitimación",
      "Tener abogado y pagar derechos",
      "Ser mayor de edad y ciudadano",
      "Tener pruebas y testigos"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 8 CNPCyF"
  },

  // ========== ARTÍCULO 9 ==========
  {
    texto: "¿Puede dictarse mandamiento de ejecución o providencia de embargo contra la Administración Pública según el artículo 9 del CNPCyF?",
    opciones: [
      "No, nunca",
      "Sí, como cualquier particular",
      "Sí, con autorización del Congreso",
      "Sí, en materia fiscal"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 9 CNPCyF"
  },

  // ========== ARTÍCULO 10 ==========
  {
    texto: "¿Qué efecto tiene expresar equivocadamente el nombre de la acción en la demanda según el artículo 10 del CNPCyF?",
    opciones: [
      "La acción procede si se determina la prestación y causa de pedir",
      "Se desecha la demanda",
      "Se requiere corrección",
      "El juez nombra la acción correcta"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 10 CNPCyF"
  },

  // ========== ARTÍCULO 11 ==========
  {
    texto: "¿Cómo se clasifican las acciones por razón de su objeto según el artículo 11 del CNPCyF?",
    opciones: [
      "Reales, personales y del estado civil",
      "Civiles, penales y administrativas",
      "Ordinarias, sumarias y especiales",
      "Principales, accesorias y cautelares"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 11 CNPCyF"
  },

  // ========== ARTÍCULO 12 ==========
  {
    texto: "¿Qué objeto tienen las acciones reales según el artículo 12 del CNPCyF?",
    opciones: [
      "La reclamación de un bien a título de dominio",
      "El cobro de una deuda",
      "La impugnación de un testamento",
      "La nulidad del matrimonio"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 12 CNPCyF"
  },

  // ========== ARTÍCULO 13 ==========
  {
    texto: "¿Contra quién se ejercitan las acciones personales según el artículo 13 del CNPCyF?",
    opciones: [
      "Contra la persona obligada, quien la garantizó y sus sucesores",
      "Contra cualquier persona",
      "Contra el Estado",
      "Contra el juez"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 13 CNPCyF"
  },

  // ========== ARTÍCULO 14 ==========
  {
    texto: "¿Qué cuestiones comprenden las acciones del estado civil según el artículo 14 del CNPCyF?",
    opciones: [
      "Nacimiento, reconocimiento, defunción, matrimonio, concubinato",
      "Solo divorcio",
      "Solo herencias",
      "Solo contratos"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 14 CNPCyF"
  },

  // ========== ARTÍCULO 15 ==========
  {
    texto: "¿A quién compete la acción reivindicatoria según el artículo 15 del CNPCyF?",
    opciones: [
      "A quien no posee el bien del cual tiene la propiedad",
      "A quien posee el bien",
      "Al arrendatario",
      "Al usufructuario"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 15 CNPCyF"
  },
  {
    texto: "¿Qué ordena la sentencia en la acción reivindicatoria según el artículo 15 del CNPCyF?",
    opciones: [
      "Declarar el dominio del actor y ordenar la entrega con frutos y accesiones",
      "Pagar daños morales",
      "Expropiar el bien",
      "Adjudicar al Estado"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 15 CNPCyF"
  },

  // ========== ARTÍCULO 16 ==========
  {
    texto: "¿Qué puede hacer el tenedor no propietario demandado en reivindicación según el artículo 16 del CNPCyF?",
    opciones: [
      "Declinar la responsabilidad designando al dueño",
      "Contestar como propietario",
      "Entregar el bien inmediatamente",
      "Solicitar suspensión"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 16 CNPCyF"
  },

  // ========== ARTÍCULO 17 ==========
  {
    texto: "¿Qué ocurre si el poseedor demandado niega la posesión según el artículo 17 del CNPCyF?",
    opciones: [
      "La perderá en beneficio del demandante",
      "Se le multa",
      "Se le declara en rebeldía",
      "El juicio se suspende"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 17 CNPCyF"
  }
];

async function subirPreguntas() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📤 SUBIENDO PREGUNTAS BASADAS EN ARTÍCULOS 1-17 DEL CNPCyF');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    console.log('✅ Autenticado correctamente\n');
    
    // Limpiar la colección primero
    const snapshot = await getDocs(collection(db, 'preguntas_clasificacion'));
    console.log(`📖 Preguntas actuales en Firebase: ${snapshot.docs.length}`);
    
    if (snapshot.docs.length > 0) {
      console.log('🗑️ Limpiando colección existente...');
      const batchDelete = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batchDelete.delete(docSnap.ref);
      });
      await batchDelete.commit();
      console.log('✅ Colección limpiada');
    }
    
    // Subir nuevas preguntas
    const batch = writeBatch(db);
    let count = 0;
    
    for (const pregunta of preguntasClasificacion) {
      const docRef = doc(collection(db, 'preguntas_clasificacion'));
      batch.set(docRef, {
        texto: pregunta.texto,
        opciones: pregunta.opciones,
        correcta: pregunta.correcta,
        dificultad: pregunta.dificultad,
        fundamento: pregunta.fundamento,
        fecha_subida: new Date().toISOString()
      });
      count++;
    }
    
    await batch.commit();
    
    console.log(`\n✅ SUBIDAS EXITOSAMENTE: ${count} preguntas a preguntas_clasificacion`);
    console.log('📋 BASADAS EN ARTÍCULOS 1 al 17 DEL CNPCyF');
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🎉 PROCESO COMPLETADO');
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

subirPreguntas();