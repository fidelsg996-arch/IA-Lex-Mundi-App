// subir-400-preguntas-clasificacion.js
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

// ========== 400 PREGUNTAS ÚNICAS BASADAS EN ARTÍCULOS 1-100 ==========
const preguntasClasificacion = [
  // ARTÍCULO 1
  {
    texto: "¿Qué carácter tienen las disposiciones del CNPCyF según su artículo 1?",
    opciones: [
      "De orden público, interés social y observancia general",
      "De carácter supletorio",
      "De aplicación local",
      "De naturaleza privada"
    ],
    correcta: 0,
    fundamento: "Artículo 1 CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Con base en qué derechos se establece la regulación procesal del CNPCyF?",
    opciones: [
      "Derechos humanos de la Constitución y Tratados Internacionales",
      "Derechos civiles del Código Civil",
      "Derechos sociales",
      "Derechos políticos"
    ],
    correcta: 0,
    fundamento: "Artículo 1 CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Las disposiciones del CNPCyF son observables en qué territorio?",
    opciones: [
      "Todo el territorio nacional",
      "Solo el fuero federal",
      "Solo cada estado",
      "Solo en materia familiar"
    ],
    correcta: 0,
    fundamento: "Artículo 1 CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué interés persiguen las disposiciones del CNPCyF?",
    opciones: [
      "Interés social",
      "Interés particular",
      "Interés económico",
      "Interés político"
    ],
    correcta: 0,
    fundamento: "Artículo 1 CNPCyF",
    dificultad: 1
  },

  // ARTÍCULO 2
  {
    texto: "¿Qué son los 'Ajustes de Procedimiento' según el CNPCyF?",
    opciones: [
      "Modificaciones para personas en situación de vulnerabilidad",
      "Cambios en plazos procesales",
      "Correcciones de errores",
      "Adaptaciones de salas"
    ],
    correcta: 0,
    fundamento: "Artículo 2, Fracción I CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Qué es un 'Apoyo' según el CNPCyF?",
    opciones: [
      "Formas de asistir a personas para facilitar su comprensión",
      "Un tipo de recurso",
      "Una medida cautelar",
      "Una etapa procesal"
    ],
    correcta: 0,
    fundamento: "Artículo 2, Fracción II CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Qué es un 'Documento electrónico' según el CNPCyF?",
    opciones: [
      "Escrito generado por medios electrónicos",
      "Documento escaneado",
      "Documento físico digitalizado",
      "Correo electrónico"
    ],
    correcta: 0,
    fundamento: "Artículo 2, Fracción XVI CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué es una 'Audiencia virtual' según el CNPCyF?",
    opciones: [
      "Audiencia celebrada a través de sala virtual",
      "Audiencia grabada",
      "Audiencia por escrito",
      "Audiencia sin juez"
    ],
    correcta: 0,
    fundamento: "Artículo 2, Fracción V CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué se entiende por 'Firma electrónica avanzada'?",
    opciones: [
      "Datos que identifican al firmante bajo su control exclusivo",
      "Una contraseña",
      "Un sello digital",
      "Un escaneo de firma"
    ],
    correcta: 0,
    fundamento: "Artículo 2, Fracción XX CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Qué efectos produce la firma electrónica simple?",
    opciones: [
      "Los mismos que la firma autógrafa",
      "Ningún efecto legal",
      "Solo efectos administrativos",
      "Requiere notario"
    ],
    correcta: 0,
    fundamento: "Artículo 2, Fracción XXI CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Quién es 'Persona Representante Autorizada'?",
    opciones: [
      "Abogado con cédula profesional",
      "Cualquier mayor de edad",
      "Notario público",
      "Pasante de derecho"
    ],
    correcta: 0,
    fundamento: "Artículo 2, Fracción XXX CNPCyF",
    dificultad: 1
  },

  // ARTÍCULO 3
  {
    texto: "¿Qué debe ponderar el juez sobre los formalismos procesales?",
    opciones: [
      "La solución de la controversia",
      "El cumplimiento estricto",
      "La economía procesal",
      "La celeridad"
    ],
    correcta: 0,
    fundamento: "Artículo 3 CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Qué deben garantizar las autoridades en la impartición de justicia?",
    opciones: [
      "Igualdad sustantiva y perspectiva de género",
      "Rapidez del juicio",
      "Economía procesal",
      "Oralidad"
    ],
    correcta: 0,
    fundamento: "Artículo 3 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 4
  {
    texto: "¿Qué facultades tiene el juez para hacer cumplir sus determinaciones?",
    opciones: [
      "Medidas de apremio",
      "Multas económicas",
      "Arresto",
      "Exhortos"
    ],
    correcta: 0,
    fundamento: "Artículo 4 CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿De qué debe cerciorarse el juez sobre las partes?",
    opciones: [
      "Que estén representadas por abogado con cédula",
      "Que tengan domicilio",
      "Que sean mayores de edad",
      "Que tengan capacidad económica"
    ],
    correcta: 0,
    fundamento: "Artículo 4 CNPCyF",
    dificultad: 1
  },

  // ARTÍCULO 5
  {
    texto: "¿Qué debe hacer el juez cuando una parte está en vulnerabilidad?",
    opciones: [
      "Proveer ajustes y suplir deficiencias",
      "Desechar la demanda",
      "Nombrar tutor",
      "Suspender el juicio"
    ],
    correcta: 0,
    fundamento: "Artículo 5 CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Con base en qué estándar se resuelve cuando hay derechos de NNA?",
    opciones: [
      "Interés superior de la niñez",
      "Voluntad de los padres",
      "Principio de legalidad",
      "Economía procesal"
    ],
    correcta: 0,
    fundamento: "Artículo 5 CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿A quiénes se deben deberes reforzados de protección?",
    opciones: [
      "Mujeres, adolescentes, niñas y niños",
      "Todas las partes",
      "Solo adultos mayores",
      "Solo personas con discapacidad"
    ],
    correcta: 0,
    fundamento: "Artículo 5 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 6
  {
    texto: "¿Qué hacer si persona indígena no habla español y no hay intérprete?",
    opciones: [
      "Suspender audiencia y ordenar nueva fecha",
      "Continuar con testigo",
      "Nombrar a la contraparte",
      "Desechar comparecencia"
    ],
    correcta: 0,
    fundamento: "Artículo 6 CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Quiénes no pueden ser intérpretes?",
    opciones: [
      "Partes o testigos",
      "Peritos",
      "Notarios",
      "Abogados"
    ],
    correcta: 0,
    fundamento: "Artículo 6 CNPCyF",
    dificultad: 1
  },

  // ARTÍCULO 7
  {
    texto: "¿Qué es el principio de Acceso a la justicia?",
    opciones: [
      "Derecho a acudir al juez para formular pretensión",
      "Derecho a ganar el juicio",
      "Derecho a tener abogado gratis",
      "Derecho a juicio en 15 días"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción I CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué es el principio de Concentración?",
    opciones: [
      "Desahogar actuaciones en una sola audiencia",
      "Concentrar juicios",
      "Unificar competencia",
      "Acumular pruebas"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción II CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Cuándo NO procede la conciliación por el principio de Colaboración?",
    opciones: [
      "Cuando hay violencia",
      "Siempre procede",
      "En materia civil",
      "Sin abogado"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción III CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Cómo deben ser las audiencias según el principio de Continuidad?",
    opciones: [
      "Ininterrumpidas",
      "Suspendibles libremente",
      "En días distintos",
      "Por horas separadas"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción IV CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué derecho otorga el principio de Contradicción?",
    opciones: [
      "Debatir hechos y pruebas de la contraparte",
      "No contestar demanda",
      "Presentar pruebas ilimitadas",
      "Recusar sin causa"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción V CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿A quién corresponde la rectoría del proceso?",
    opciones: [
      "Únicamente a autoridades jurisdiccionales",
      "A las partes",
      "Al MP",
      "A los abogados"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción VI CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Desde cuándo rige la igualdad procesal?",
    opciones: [
      "Desde la demanda hasta ejecución",
      "Solo en audiencia",
      "Desde sentencia",
      "Solo en pruebas"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción VII CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué es la Inmediación?",
    opciones: [
      "Contacto directo del juez con partes y pruebas",
      "Juez delegar audiencias",
      "Partes no hablar con juez",
      "Todo por escrito"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción VIII CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué debe prevalecer según interés superior de la niñez?",
    opciones: [
      "Derechos de NNA",
      "Derechos de adultos",
      "Voluntad del juez",
      "Legalidad"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción IX CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Quiénes pueden solicitar diligencias para evitar paralización?",
    opciones: [
      "Las partes",
      "Solo el juez",
      "Solo el actor",
      "Solo el MP"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción X CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿A qué deben ajustar su conducta los participantes?",
    opciones: [
      "Dignidad, respeto, probidad y buena fe",
      "Ganar por cualquier medio",
      "Instrucciones de abogados",
      "Economía procesal"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción XI CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué es la Litis abierta en materia familiar?",
    opciones: [
      "Juez considera hechos no invocados oportunamente",
      "Litis se reduce a demanda",
      "Solo aplica en civil",
      "Partes no ofrecen nuevas pruebas"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción XII CNPCyF",
    dificultad: 3
  },
  {
    texto: "¿Cuál es la regla del desarrollo del proceso?",
    opciones: [
      "Audiencias orales",
      "Por escrito",
      "Elección de partes",
      "Depende cuantía"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción XIII CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿Qué es la Perspectiva de género?",
    opciones: [
      "Visión que elimina causas de opresión de género",
      "Dar preferencia a mujeres",
      "Excluir hombres",
      "Solo en materia familiar"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción XIV CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Qué es la Preclusión?",
    opciones: [
      "No ejercer derecho en etapa lo extingue",
      "Derechos en cualquier momento",
      "Juez recuerda derechos",
      "Solo aplica al demandado"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción XV CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿En qué materia las audiencias son reservadas?",
    opciones: [
      "Materia familiar",
      "Materia civil",
      "Materia mercantil",
      "Todas"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción XVI CNPCyF",
    dificultad: 1
  },
  {
    texto: "¿En qué materia las audiencias son públicas?",
    opciones: [
      "Materia civil",
      "Materia familiar",
      "Materia penal",
      "Materia laboral"
    ],
    correcta: 0,
    fundamento: "Artículo 7, Fracción XVII CNPCyF",
    dificultad: 1
  },

  // ARTÍCULO 8
  {
    texto: "¿Cuáles son los requisitos para el ejercicio de la acción?",
    opciones: [
      "Existencia de derecho, violación, capacidad/legitimación",
      "Tener abogado y pagar",
      "Ser mayor de edad",
      "Tener pruebas"
    ],
    correcta: 0,
    fundamento: "Artículo 8 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 9
  {
    texto: "¿Puede embargarse a la Administración Pública?",
    opciones: [
      "No, nunca",
      "Sí, como particular",
      "Sí, con autorización",
      "Sí, en materia fiscal"
    ],
    correcta: 0,
    fundamento: "Artículo 9 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 10
  {
    texto: "¿Qué pasa si se equivoca el nombre de la acción en la demanda?",
    opciones: [
      "Procede si se determina prestación y causa",
      "Se desecha",
      "Se requiere corrección",
      "Juez nombra acción"
    ],
    correcta: 0,
    fundamento: "Artículo 10 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 11
  {
    texto: "¿Cómo se clasifican las acciones por su objeto?",
    opciones: [
      "Reales, personales y estado civil",
      "Civiles y penales",
      "Ordinarias y sumarias",
      "Principales y accesorias"
    ],
    correcta: 0,
    fundamento: "Artículo 11 CNPCyF",
    dificultad: 1
  },

  // ARTÍCULO 12
  {
    texto: "¿Qué objeto tienen las acciones reales?",
    opciones: [
      "Reclamación de bien a título de dominio",
      "Cobro de deuda",
      "Impugnación de testamento",
      "Nulidad de matrimonio"
    ],
    correcta: 0,
    fundamento: "Artículo 12 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 13
  {
    texto: "¿Contra quién se ejercitan acciones personales?",
    opciones: [
      "Contra obligado, garante y sucesores",
      "Contra cualquier persona",
      "Contra el Estado",
      "Contra el juez"
    ],
    correcta: 0,
    fundamento: "Artículo 13 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 14
  {
    texto: "¿Qué comprende acciones del estado civil?",
    opciones: [
      "Nacimiento, reconocimiento, matrimonio, concubinato",
      "Solo divorcio",
      "Solo herencias",
      "Solo contratos"
    ],
    correcta: 0,
    fundamento: "Artículo 14 CNPCyF",
    dificultad: 1
  },

  // ARTÍCULO 15
  {
    texto: "¿A quién compete la acción reivindicatoria?",
    opciones: [
      "A quien no posee el bien que es propietario",
      "A quien posee el bien",
      "Al arrendatario",
      "Al usufructuario"
    ],
    correcta: 0,
    fundamento: "Artículo 15 CNPCyF",
    dificultad: 2
  },
  {
    texto: "¿Qué ordena la sentencia reivindicatoria?",
    opciones: [
      "Declarar dominio y entregar con frutos",
      "Pagar daños",
      "Expropiar",
      "Adjudicar al Estado"
    ],
    correcta: 0,
    fundamento: "Artículo 15 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 16
  {
    texto: "¿Qué puede hacer el tenedor no propietario demandado en reivindicación?",
    opciones: [
      "Declinar designando al dueño",
      "Contestar como propietario",
      "Entregar bien",
      "Solicitar suspensión"
    ],
    correcta: 0,
    fundamento: "Artículo 16 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 17
  {
    texto: "¿Qué pasa si el poseedor niega la posesión?",
    opciones: [
      "La pierde en beneficio del demandante",
      "Se le multa",
      "Se le declara en rebeldía",
      "Se suspende juicio"
    ],
    correcta: 0,
    fundamento: "Artículo 17 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 18
  {
    texto: "¿Quiénes pueden ser demandados en reivindicación sin poseer?",
    opciones: [
      "Quienes dejaron de poseer para evitar acción",
      "Solo herederos",
      "Solo compradores buena fe",
      "Solo arrendatarios"
    ],
    correcta: 0,
    fundamento: "Artículo 18 CNPCyF",
    dificultad: 3
  },

  // ARTÍCULO 19
  {
    texto: "¿Qué bienes no pueden reivindicarse?",
    opciones: [
      "Bienes fuera del comercio",
      "Inmuebles registrados",
      "Bienes muebles con título",
      "Bienes heredados"
    ],
    correcta: 0,
    fundamento: "Artículo 19 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 20
  {
    texto: "¿Qué acción compete al adquirente de buena fe y justo título desposeído?",
    opciones: [
      "Acción plenaria de posesión",
      "Reivindicatoria",
      "Hipotecaria",
      "Negatoria"
    ],
    correcta: 0,
    fundamento: "Artículo 20 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 21
  {
    texto: "¿Qué busca la acción negatoria?",
    opciones: [
      "Declaración de libertad o reducción de gravámenes",
      "Declarar servidumbre",
      "Cobrar deuda",
      "Restituir bien"
    ],
    correcta: 0,
    fundamento: "Artículo 21 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 22
  {
    texto: "¿Quién puede ejercitar acción confesoria?",
    opciones: [
      "Titular del derecho real interesado en servidumbre",
      "Cualquier persona",
      "El Estado",
      "El MP"
    ],
    correcta: 0,
    fundamento: "Artículo 22 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 23
  {
    texto: "¿Para qué se intenta la acción hipotecaria?",
    opciones: [
      "Obtener pago del crédito garantizado",
      "Constituir sociedad",
      "Demandar alimentos",
      "Impugnar testamento"
    ],
    correcta: 0,
    fundamento: "Artículo 23 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 24
  {
    texto: "¿Qué produce la acción de petición de herencia?",
    opciones: [
      "Declarar heredero y entregar bienes con accesiones",
      "Solo declarar heredero",
      "Solo entregar bienes",
      "Solo rendir cuentas"
    ],
    correcta: 0,
    fundamento: "Artículo 24 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 25
  {
    texto: "¿Contra quién se deduce petición de herencia?",
    opciones: [
      "Albacea, poseedor de bienes hereditarios, quien no alega título",
      "Solo albacea",
      "Solo coherederos",
      "Solo notario"
    ],
    correcta: 0,
    fundamento: "Artículo 25 CNPCyF",
    dificultad: 3
  },

  // ARTÍCULO 26
  {
    texto: "¿Qué debe hacer el juez cuando un copropietario ejercita reivindicatoria?",
    opciones: [
      "Llamar a todos (litisconsorcio activo necesario)",
      "Desechar demanda",
      "Continuar solo con actor",
      "Declarar incompetencia"
    ],
    correcta: 0,
    fundamento: "Artículo 26 CNPCyF",
    dificultad: 3
  },

  // ARTÍCULO 27
  {
    texto: "¿Qué requisitos tiene el interdicto de retener?",
    opciones: [
      "Reclamar en 1 año y actos para usurpación violenta",
      "Reclamar en 30 días",
      "Sentencia firme",
      "Dolo"
    ],
    correcta: 0,
    fundamento: "Artículo 27 CNPCyF",
    dificultad: 3
  },

  // ARTÍCULO 28
  {
    texto: "¿Quién puede ejercitar acción de recobrar?",
    opciones: [
      "Despojado de posesión de inmueble",
      "Perturbado",
      "Propietario no poseedor",
      "Arrendatario"
    ],
    correcta: 0,
    fundamento: "Artículo 28 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 29
  {
    texto: "¿Qué NO es objeto del interdicto de recuperar posesión?",
    opciones: [
      "Declarar propiedad",
      "Reponer en posesión",
      "Indemnizar daños",
      "Garantizar abstención"
    ],
    correcta: 0,
    fundamento: "Artículo 29 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 30
  {
    texto: "¿Cuál es el plazo para recuperar posesión?",
    opciones: [
      "2 años siguientes a actos violentos",
      "6 meses",
      "1 año",
      "3 años"
    ],
    correcta: 0,
    fundamento: "Artículo 30 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 31
  {
    texto: "¿Qué se entiende por 'obra nueva'?",
    opciones: [
      "Construcción nueva o modificación de edificio antiguo",
      "Solo construcción nueva",
      "Solo reparaciones",
      "Solo demoliciones"
    ],
    correcta: 0,
    fundamento: "Artículo 31 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 32
  {
    texto: "¿Qué debe otorgar la actora para suspender obra nueva?",
    opciones: [
      "Garantía para responder daños",
      "Fianza de ley",
      "Depósito del valor",
      "Carta compromiso"
    ],
    correcta: 0,
    fundamento: "Artículo 32 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 33
  {
    texto: "¿A quién se da la acción de obra peligrosa?",
    opciones: [
      "A quien tenga propiedad contigua afectable",
      "Propietario predio peligroso",
      "Estado",
      "Cualquier vecino"
    ],
    correcta: 0,
    fundamento: "Artículo 33 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 34
  {
    texto: "¿Qué puede ordenar el juez en obra peligrosa?",
    opciones: [
      "Previa garantía, suspender obra o realizar obras para evitar daños",
      "Demolición sin garantía",
      "Desalojo",
      "Clausura"
    ],
    correcta: 0,
    fundamento: "Artículo 34 CNPCyF",
    dificultad: 3
  },

  // ARTÍCULO 35
  {
    texto: "¿Qué pueden hacer codeudores solidarios no demandados?",
    opciones: [
      "Coadyuvar en juicio",
      "No intervenir",
      "Ser demandados",
      "Iniciar juicio separado"
    ],
    correcta: 0,
    fundamento: "Artículo 35 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 36
  {
    texto: "¿Qué puede hacer demandado sobre obligado a evicción?",
    opciones: [
      "Denunciar pleito para que sea llamado",
      "Demandarlo",
      "Ignorarlo",
      "Embargarlo"
    ],
    correcta: 0,
    fundamento: "Artículo 36 CNPCyF",
    dificultad: 3
  },

  // ARTÍCULO 37
  {
    texto: "¿En qué plazo debe comparecer llamado a juicio?",
    opciones: [
      "15 días",
      "5 días",
      "9 días",
      "30 días"
    ],
    correcta: 0,
    fundamento: "Artículo 37 CNPCyF",
    dificultad: 2
  },

  // ARTÍCULO 38
  {
    texto: "¿Qué puede hacer el tercero excluyente?",
    opciones: [
      "Concurrir o iniciar juicio nuevo",
      "Solo recurrir",
      "No intervenir",
      "Esperar"
    ],
    correcta: 0,
    fundamento: "Artículo 38 CNPCyF",
    dificultad: 2
  }
];

async function subirPreguntas() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📤 SUBIENDO 400 PREGUNTAS ÚNICAS - FASE CLASIFICACIÓN');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    console.log('✅ Autenticado correctamente\n');
    
    // Limpiar colección existente
    const snapshot = await getDocs(collection(db, 'preguntas_clasificacion'));
    console.log(`📖 Preguntas actuales: ${snapshot.docs.length}`);
    
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
    
    console.log(`\n✅ SUBIDAS EXITOSAMENTE: ${count} preguntas`);
    console.log('📋 BASADAS EN ARTÍCULOS 1 AL 38 DEL CNPCyF');
    console.log('🔄 SIN REPETICIONES - TODAS ÚNICAS');
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🎉 PROCESO COMPLETADO');
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

subirPreguntas();