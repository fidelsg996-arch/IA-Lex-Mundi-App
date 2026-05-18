// subir-preguntas-grupos.js
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

// ========== 100 PREGUNTAS NUEVAS PARA FASE DE GRUPOS ==========
// Basadas en artículos 101-202 del CNPCyF
const preguntasGrupos = [
  // Artículo 101 - Plazo para ofrecer pruebas en segunda instancia
  {
    texto: "Una vez recibidos los autos por la autoridad jurisdiccional de segunda instancia, ¿de cuántos días es el plazo que concede a las partes para ofrecer pruebas documentales y alegar?",
    opciones: [
      "3 días",
      "5 días",
      "9 días",
      "15 días"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 101 CNPCyF"
  },
  // Artículo 102 - Negativa de autoridades a conocer
  {
    texto: "Cuando dos o más autoridades jurisdiccionales federales se nieguen a conocer de un procedimiento, ¿ante quién debe ocurrir la parte interesada?",
    opciones: [
      "Ante la Suprema Corte de Justicia de la Nación",
      "Ante la autoridad jurisdiccional que faculte la Ley Orgánica del Poder Judicial de la Federación",
      "Ante el Tribunal Superior del circuito",
      "Ante el Consejo de la Judicatura"
    ],
    correcta: 1,
    dificultad: 3,
    fundamento: "Artículo 102 CNPCyF"
  },
  {
    texto: "Cuando la negativa a conocer se suscite entre autoridades del fuero común y federal en el mismo circuito judicial, ¿quién resuelve?",
    opciones: [
      "La Suprema Corte de Justicia de la Nación",
      "El Pleno Regional del Poder Judicial de la Federación respectivo",
      "El Tribunal Colegiado de Circuito",
      "El Consejo de la Judicatura Federal"
    ],
    correcta: 1,
    dificultad: 3,
    fundamento: "Artículo 102 CNPCyF"
  },
  // Artículo 103 - Corrección disciplinaria por incompetencia infundada
  {
    texto: "¿Qué procede cuando se declara infundada o improcedente una incompetencia promovida?",
    opciones: [
      "Una corrección disciplinaria en beneficio del Fondo de Administración de Justicia",
      "El sobreseimiento del juicio",
      "La nulidad de lo actuado",
      "La reposición del procedimiento"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 103 CNPCyF"
  },
  // Artículo 104 - Impedimentos forzosos (varias preguntas)
  {
    texto: "¿En qué grado de parentesco por consanguinidad produce impedimento para conocer de un procedimiento?",
    opciones: [
      "Solo en línea recta sin limitación de grados y colaterales dentro del cuarto grado",
      "Solo en línea recta hasta segundo grado",
      "Solo colaterales hasta tercer grado",
      "Todos los grados por igual"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 104, Fracción II CNPCyF"
  },
  {
    texto: "¿Hasta qué grado de parentesco por afinidad produce impedimento para conocer de un procedimiento?",
    opciones: [
      "Dentro del segundo grado",
      "Dentro del cuarto grado",
      "Dentro del tercer grado",
      "Sin limitación de grados"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 104, Fracción II CNPCyF"
  },
  {
    texto: "¿Qué constituye impedimento cuando la autoridad jurisdiccional tiene interés directo o indirecto en el procedimiento?",
    opciones: [
      "Impedimento forzoso para conocer",
      "Solo una excusa voluntaria",
      "No constituye impedimento",
      "Depende de la cuantía"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 104, Fracción I CNPCyF"
  },
  {
    texto: "Si la autoridad jurisdiccional ha externado públicamente el sentido de su fallo antes de resolver, ¿qué procede?",
    opciones: [
      "Es impedimento forzoso",
      "No es impedimento si fue en carácter académico",
      "Solo es impedimento si fue en medios masivos",
      "Es causa de recusación pero no de excusa"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 104, Fracción XVI CNPCyF"
  },
  {
    texto: "Las opiniones expresadas por la autoridad jurisdiccional al intentar conciliar entre las partes, ¿constituyen impedimento?",
    opciones: [
      "Sí, siempre",
      "No, no constituyen motivo de impedimento",
      "Sí, si son por escrito",
      "Depende del contenido de la opinión"
    ],
    correcta: 1,
    dificultad: 2,
    fundamento: "Artículo 104, párrafo 2 CNPCyF"
  },
  // Artículo 105 - Deber de excusarse
  {
    texto: "¿En qué plazo debe excusarse la autoridad jurisdiccional al ocurrir un impedimento?",
    opciones: [
      "Inmediatamente que se avoque al conocimiento o dentro de los tres días siguientes al conocimiento del impedimento",
      "Dentro de los 5 días siguientes",
      "Dentro de los 10 días siguientes",
      "No hay plazo establecido"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 105 CNPCyF"
  },
  // Artículo 106 - Procedencia de recusación
  {
    texto: "¿Cuándo procede la recusación?",
    opciones: [
      "Cuando la autoridad jurisdiccional no se excusare a pesar de existir impedimento",
      "En cualquier momento del juicio sin causa",
      "Solo después de la sentencia",
      "Solo en materia familiar"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 106 CNPCyF"
  },
  // Artículo 107 - Quiénes pueden recusar
  {
    texto: "¿Quiénes pueden hacer uso de la recusación?",
    opciones: [
      "Las partes, personas interesadas o sus representantes",
      "Solo el Ministerio Público",
      "Cualquier persona con interés legítimo",
      "Solo los testigos"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 107 CNPCyF"
  },
  // Artículo 108 - Autoridades que conocen de excusas y recusaciones
  {
    texto: "¿Quién conoce de las excusas y recusaciones de las autoridades jurisdiccionales de primera instancia?",
    opciones: [
      "Los Tribunales de Segunda Instancia",
      "El Consejo de la Judicatura",
      "La Suprema Corte de Justicia",
      "El Pleno Regional"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 108, Fracción II CNPCyF"
  },
  // Artículo 109 - Casos donde no procede recusación
  {
    texto: "¿En qué caso NO procede la recusación?",
    opciones: [
      "En los actos prejudiciales",
      "En los juicios ordinarios",
      "En materia familiar",
      "En ejecución de sentencia"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 109, Fracción I CNPCyF"
  },
  {
    texto: "¿Procede recusación al cumplimentar exhortos, despachos o cartas rogatorias?",
    opciones: [
      "Sí, siempre",
      "No, no procede recusación",
      "Sí, solo si hay impedimento manifiesto",
      "Depende de la materia"
    ],
    correcta: 1,
    dificultad: 2,
    fundamento: "Artículo 109, Fracción II CNPCyF"
  },
  // Artículo 111 - Plazo para interponer recusación
  {
    texto: "¿Hasta cuándo puede interponerse la recusación?",
    opciones: [
      "Hasta antes de la admisión de pruebas",
      "Hasta antes de la sentencia",
      "En cualquier momento del juicio",
      "Solo al inicio del procedimiento"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 111 CNPCyF"
  },
  {
    texto: "¿En cuántos días debe presentarse la recusación a partir de que se conoce la causal?",
    opciones: [
      "5 días",
      "3 días",
      "9 días",
      "15 días"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 111 CNPCyF"
  },
  // Artículo 112 - Efectos de la recusación
  {
    texto: "¿Qué efectos produce la interposición de una recusación en la jurisdicción de la autoridad recusada?",
    opciones: [
      "Se suspende su jurisdicción, excepto para medidas urgentes en materia familiar",
      "Continúa con plena jurisdicción",
      "Se suspende totalmente",
      "Pierde definitivamente la jurisdicción"
    ],
    correcta: 0,
    dificultad: 3,
    fundamento: "Artículo 112 CNPCyF"
  },
  // Artículo 113 - Efecto de recusación procedente
  {
    texto: "Declarada procedente o fundada la recusación, ¿qué ocurre con la jurisdicción de la autoridad recusada?",
    opciones: [
      "Termina su jurisdicción en el procedimiento",
      "Continúa conociendo del asunto",
      "Solo se suspende temporalmente",
      "Se traslada a un tribunal superior"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 113 CNPCyF"
  },
  // Artículo 114 - Retiro de recusación
  {
    texto: "Una vez interpuesta la recusación, ¿puede la parte recusante retirarla?",
    opciones: [
      "No, no puede retirarla en ningún tiempo",
      "Sí, antes de la resolución",
      "Sí, con consentimiento del juez",
      "Sí, pagando costas"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 114 CNPCyF"
  },
  // Artículo 115 - Nueva recusación
  {
    texto: "Si se declara improcedente una recusación, ¿se puede admitir otra contra la misma autoridad por la misma causal?",
    opciones: [
      "No, no se volverá a admitir",
      "Sí, cuantas veces se quiera",
      "Sí, después de 30 días",
      "Depende del juez"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 115 CNPCyF"
  },
  // Artículo 116 - Causales de desechamiento de recusación
  {
    texto: "¿Cuál es una causal para desechar de plano una recusación?",
    opciones: [
      "Por extemporánea",
      "Por falta de pruebas documentales",
      "Por no tener abogado",
      "Por falta de pago de costas"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 116, Fracción I CNPCyF"
  },
  // Artículo 117 - Procedimiento de recusación
  {
    texto: "¿Ante quién se interpone la recusación?",
    opciones: [
      "Ante la autoridad jurisdiccional que conozca del procedimiento",
      "Ante el tribunal superior",
      "Ante el Consejo de la Judicatura",
      "Ante el Ministerio Público"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 117 CNPCyF"
  },
  {
    texto: "¿Qué plazo tiene la autoridad recusada para remitir testimonio de actuaciones?",
    opciones: [
      "5 días improrrogables",
      "3 días",
      "9 días",
      "15 días"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 117 CNPCyF"
  },
  {
    texto: "¿Qué efecto produce la falta de informe justificado por parte de la autoridad recusada?",
    opciones: [
      "Hará presumir como cierto el impedimento alegado",
      "La recusación se desecha",
      "Se tiene por no interpuesta",
      "Se aplica una multa"
    ],
    correcta: 0,
    dificultad: 3,
    fundamento: "Artículo 117 CNPCyF"
  },
  // Artículo 118 - Trámite de recusación
  {
    texto: "¿La recusación se decide con o sin audiencia de la parte contraria?",
    opciones: [
      "Sin audiencia de la parte contraria",
      "Con audiencia obligatoria",
      "Con audiencia si la parte lo solicita",
      "Depende de la materia"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 118 CNPCyF"
  },
  // Artículo 119 - Pruebas en incidente de recusación
  {
    texto: "¿Qué medios de prueba NO son admisibles en el incidente de recusación?",
    opciones: [
      "La declaración de la autoridad jurisdiccional recusada",
      "La prueba documental",
      "La prueba testimonial",
      "La prueba pericial"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 119 CNPCyF"
  },
  // Artículo 120 - Recusación en Tribunales de Segunda Instancia
  {
    texto: "¿Quién conoce de la recusación de autoridades jurisdiccionales integrantes de un Tribunal de Segunda Instancia?",
    opciones: [
      "La autoridad jurisdiccional que corresponda según la Ley Orgánica",
      "El Pleno del Tribunal",
      "La Suprema Corte de Justicia",
      "El Consejo de la Judicatura"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 120 CNPCyF"
  },
  // Artículo 124 - Irrecurribilidad
  {
    texto: "¿La resolución que decide una recusación es recurrible?",
    opciones: [
      "No, es irrecurrible",
      "Sí, procede apelación",
      "Sí, procede queja",
      "Sí, procede revisión"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 124 CNPCyF"
  },
  // Artículo 125 - Interés para intervenir en procedimiento
  {
    texto: "¿Quién puede iniciar o intervenir en un procedimiento judicial?",
    opciones: [
      "Quien tenga interés en que la autoridad jurisdiccional declare, constituya o modifique un derecho",
      "Cualquier ciudadano",
      "Solo el Ministerio Público",
      "Solo los abogados"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 125 CNPCyF"
  },
  // Artículo 126 - Transmisión del interés
  {
    texto: "¿Las transmisiones del interés a un tercero afectan el procedimiento judicial?",
    opciones: [
      "No afectan el procedimiento judicial",
      "Sí, lo suspenden",
      "Sí, lo nulifican",
      "Solo afectan si hay oposición"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 126 CNPCyF"
  },
  // Artículo 128 - Legitimación para comparecer
  {
    texto: "¿Las personas jurídicas públicas o privadas cómo comparecen en juicio?",
    opciones: [
      "Por medio de quienes las representen según la ley o sus escrituras constitutivas",
      "Solo por medio de abogado particular",
      "Por medio de cualquier persona",
      "Solo por sus socios fundadores"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 128, Fracción II CNPCyF"
  },
  {
    texto: "¿Quién puede representar a los pueblos y comunidades indígenas en juicio?",
    opciones: [
      "Sus propias autoridades o las personas que designen con base en sus usos y costumbres",
      "Solo el Ministerio Público",
      "Solo un abogado titulado",
      "El Instituto Nacional de Pueblos Indígenas"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 128, Fracción VI CNPCyF"
  },
  // Artículo 129 - Terceras personas
  {
    texto: "¿Quiénes pueden comparecer como terceras personas en un juicio?",
    opciones: [
      "Quienes tengan interés propio y distinto de la actora o demandada",
      "Solo el Ministerio Público",
      "Cualquier persona con domicilio en la localidad",
      "Solo los peritos"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 129 CNPCyF"
  },
  // Artículo 130 - Representación de NNA
  {
    texto: "¿Quiénes representan a las niñas, niños y adolescentes en juicio?",
    opciones: [
      "Quienes ejerzan la patria potestad o la tutela",
      "Solo el Ministerio Público",
      "Cualquier adulto",
      "El DIF"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 130, Fracción I CNPCyF"
  },
  // Artículo 132 - Representante común en litisconsorcio
  {
    texto: "Si varios actores ejercen la misma acción, ¿cómo deben designar a su representante común?",
    opciones: [
      "En su primera intervención",
      "Al final del juicio",
      "Después de la sentencia",
      "Antes de la audiencia"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 132, Fracción II CNPCyF"
  },
  {
    texto: "¿Qué facultades NO tiene el representante común designado por la autoridad jurisdiccional?",
    opciones: [
      "Las de desistirse, transigir y comprometer en árbitros",
      "Las de ofrecer pruebas",
      "Las de alegar",
      "Las de comparecer a audiencias"
    ],
    correcta: 0,
    dificultad: 3,
    fundamento: "Artículo 132 CNPCyF"
  },
  // Artículo 133 - Reglas del litisconsorcio
  {
    texto: "En los casos de litisconsorcio, ¿a quién corresponde la carga de impulsar el procedimiento?",
    opciones: [
      "Al representante común del litisconsorcio",
      "A cada parte individualmente",
      "Al juez",
      "Al Ministerio Público"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 133, Fracción I CNPCyF"
  },
  // Artículo 135 - Procedimiento convencional
  {
    texto: "¿Las partes pueden pactar un procedimiento convencional distinto al del CNPCyF?",
    opciones: [
      "Sí, siempre que se respeten las formalidades esenciales",
      "No, es obligatorio seguir el CNPCyF",
      "Sí, solo en materia civil",
      "No, porque es de orden público"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 135 CNPCyF"
  },
  // Artículo 137 - Formalidades de promociones
  {
    texto: "¿En qué idioma deben redactarse las promociones judiciales?",
    opciones: [
      "En español",
      "En cualquier idioma oficial",
      "En inglés",
      "En el idioma materno de la parte"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 137, Fracción II CNPCyF"
  },
  {
    texto: "¿Qué deben hacer quienes no supieren o no pudieren firmar autógrafamente?",
    opciones: [
      "Imprimir su huella digital, firmando otra persona en su nombre y a su ruego",
      "No pueden comparecer",
      "Deben obtener un notario",
      "Solo pueden comparecer con abogado"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 137, Fracción III CNPCyF"
  },
  {
    texto: "¿Qué debe acompañarse a los documentos redactados en idioma extranjero?",
    opciones: [
      "Su traducción al español",
      "Una notaría",
      "Un perito traductor",
      "Un dictamen de validez"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 137, Fracción V CNPCyF"
  },
  // Artículo 138 - Asistencia a audiencias
  {
    texto: "¿Qué sanción se impone a la persona representante autorizada que deje de asistir a audiencias sin justa causa?",
    opciones: [
      "Multa hasta de 100 veces el valor diario de la UMA",
      "Arresto por 36 horas",
      "Suspensión de su cédula profesional",
      "Expulsión del juicio"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 138 CNPCyF"
  },
  // Artículo 139 - Diferimiento por falta de representante
  {
    texto: "Si una parte carece de persona representante autorizada, ¿cuántas veces puede diferirse la audiencia?",
    opciones: [
      "Por una sola ocasión",
      "Dos veces",
      "Tantas como solicite",
      "Ninguna"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 139 CNPCyF"
  },
  // Artículo 140 - Reglas de audiencias
  {
    texto: "¿Qué ocurre con la parte que asiste tardíamente a una audiencia?",
    opciones: [
      "Se incorpora en la etapa en que se encuentre, precluyendo derechos anteriores",
      "No se le permite el acceso",
      "Se suspende la audiencia",
      "Se reprograma la audiencia"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 140, Fracción VII CNPCyF"
  },
  // Artículo 142 - Prohibición de ingreso a audiencias
  {
    texto: "¿La autoridad jurisdiccional puede prohibir el ingreso a personas armadas a la audiencia?",
    opciones: [
      "Sí, por razones de orden o seguridad",
      "No, es un derecho constitucional",
      "Sí, solo si lo solicita una parte",
      "No, debe permitirse el ingreso"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 142 CNPCyF"
  },
  // Artículo 143 - Excepciones a la publicidad
  {
    texto: "¿En qué materia las audiencias pueden ser excepcionadas del principio de publicidad?",
    opciones: [
      "Cuando se afecte el interés superior de niñas, niños y adolescentes",
      "Siempre deben ser públicas",
      "Solo en materia penal",
      "Nunca se puede exceptuar"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 143, Fracción III CNPCyF"
  },
  // Artículo 145 - Registro de audiencias
  {
    texto: "¿Cómo se registran las audiencias según el CNPCyF?",
    opciones: [
      "Por medios electrónicos",
      "Solo por escrito",
      "Solo con taquígrafos",
      "Solo con videograbación"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 145 CNPCyF"
  },
  // Artículo 149 - Días y horas hábiles
  {
    texto: "¿Cuáles son días hábiles según el CNPCyF?",
    opciones: [
      "Todos los días excepto sábados, domingos y festivos",
      "Solo lunes a viernes",
      "Todos los días del año",
      "Solo días laborables"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 149 CNPCyF"
  },
  {
    texto: "¿Cuáles son las horas hábiles para actuaciones judiciales?",
    opciones: [
      "De las 7:00 a las 19:00 horas",
      "De las 9:00 a las 18:00 horas",
      "De las 8:00 a las 20:00 horas",
      "De las 6:00 a las 22:00 horas"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 149 CNPCyF"
  },
  // Artículo 150 - Habilitación de días inhábiles
  {
    texto: "¿En qué juicios todos los días y horas son hábiles?",
    opciones: [
      "En juicios sobre alimentos y derechos de NNA",
      "Solo en materia penal",
      "Solo en materia laboral",
      "En todos los juicios"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 150 CNPCyF"
  },
  // Artículo 151 - Oficialía de Partes
  {
    texto: "¿Qué requisito deben tener los escritos en procedimientos en línea?",
    opciones: [
      "Contar con firma electrónica avanzada",
      "Estar notariados",
      "Tener testigos",
      "Estar en papel membretado"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 151, Fracción II CNPCyF"
  },
  // Artículo 155 - Rechazo de promociones
  {
    texto: "¿Puede la Oficialía de Partes rechazar una promoción judicial?",
    opciones: [
      "No, en ningún caso y por ningún motivo",
      "Sí, si no cumple requisitos",
      "Sí, si es extemporánea",
      "Sí, si es improcedente"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 155 CNPCyF"
  },
  // Artículo 156 - Evasión del turno
  {
    texto: "¿Qué sanción se impone a quien intente eludir el turno establecido en las Oficialías de Partes?",
    opciones: [
      "Multa de 250 a 500 veces el valor diario de la UMA",
      "Arresto por 36 horas",
      "Suspensión del juicio",
      "Desechamiento de la demanda"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 156 CNPCyF"
  },
  // Artículo 158 - Dar vista vs correr traslado
  {
    texto: "¿Qué significa 'dar vista' en el CNPCyF?",
    opciones: [
      "Que los autos quedan en secretaría para que los interesados se impongan",
      "Entregar copias al interesado",
      "Notificar personalmente",
      "Publicar en el boletín judicial"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 158 CNPCyF"
  },
  {
    texto: "¿Qué significa 'correr traslado' según el CNPCyF?",
    opciones: [
      "Entregar copias al interesado",
      "Dejar los autos en secretaría",
      "Notificar por lista",
      "Publicar en edictos"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 158 CNPCyF"
  },
  // Artículo 159 - Pérdida de autos
  {
    texto: "¿Quién repone los autos que se perdieren?",
    opciones: [
      "A costa de quien fuere responsable de la pérdida",
      "El Estado",
      "El Poder Judicial",
      "El actor"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 159 CNPCyF"
  },
  // Artículo 163 - Nulidad de actuaciones
  {
    texto: "¿Cuándo serán nulas las actuaciones judiciales?",
    opciones: [
      "Cuando les falte formalidades esenciales que dejen sin defensa a cualquiera de las partes",
      "Por cualquier irregularidad",
      "Solo por falta de firma",
      "Solo por falta de notificación"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 163 CNPCyF"
  },
  // Artículo 166 - Convalidación de nulidades
  {
    texto: "¿En qué momento debe reclamarse la nulidad de una actuación?",
    opciones: [
      "En la actuación subsecuente, pues de lo contrario queda convalidada",
      "Al final del juicio",
      "En la sentencia",
      "Después de la ejecución"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 166 CNPCyF"
  },
  // Artículo 167 - Clasificación de resoluciones
  {
    texto: "¿Qué son los decretos según el CNPCyF?",
    opciones: [
      "Simples determinaciones de trámite que no impliquen impulso al procedimiento",
      "Decisiones que resuelven el fondo",
      "Resoluciones que admiten pruebas",
      "Sentencias definitivas"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 167, Fracción I CNPCyF"
  },
  {
    texto: "¿Qué son las sentencias definitivas según el CNPCyF?",
    opciones: [
      "Las que resuelven el fondo del asunto en lo principal",
      "Las que resuelven incidentes",
      "Los autos que admiten pruebas",
      "Los decretos de trámite"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 167, Fracción VII CNPCyF"
  },
  // Artículo 169 - Requisitos de resoluciones
  {
    texto: "¿Las resoluciones judiciales deben ser claras, precisas y congruentes con qué?",
    opciones: [
      "Con las promociones de las partes",
      "Con la ley",
      "Con la jurisprudencia",
      "Con la doctrina"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 169 CNPCyF"
  },
  // Artículo 172 - Aclaración de sentencias
  {
    texto: "¿En qué plazo puede solicitarse la aclaración de una sentencia?",
    opciones: [
      "En un plazo no mayor a tres días hábiles",
      "Dentro de los 9 días",
      "Dentro de los 15 días",
      "En cualquier tiempo"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 172 CNPCyF"
  },
  // Artículo 173 - Promociones notoriamente improcedentes
  {
    texto: "¿Qué debe hacer la autoridad jurisdiccional con promociones notoriamente improcedentes?",
    opciones: [
      "Desecharlas de plano",
      "Admitirlas a trámite",
      "Correr traslado a la contraria",
      "Reservarlas para sentencia"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 173 CNPCyF"
  },
  // Artículo 176 - Plazos supletorios
  {
    texto: "¿Cuál es el plazo para interponer recurso de apelación contra sentencia definitiva?",
    opciones: [
      "9 días",
      "5 días",
      "3 días",
      "15 días"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 176, Fracción I CNPCyF"
  },
  {
    texto: "¿Cuál es el plazo para interponer apelación de sentencia interlocutoria?",
    opciones: [
      "5 días",
      "9 días",
      "3 días",
      "15 días"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 176, Fracción II CNPCyF"
  },
  // Artículo 180 - Cobro de costas
  {
    texto: "¿Por ningún acto judicial se cobrarán costas, ni aun cuando se actuare con testigos?",
    opciones: [
      "Verdadero",
      "Falso, sí se cobran",
      "Depende del tipo de juicio",
      "Solo en materia mercantil"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 180 CNPCyF"
  },
  // Artículo 182 - Condena en costas
  {
    texto: "¿Cuándo se hará la condena en costas?",
    opciones: [
      "Cuando se haya procedido con temeridad o mala fe",
      "Siempre que se pierda el juicio",
      "Solo en ejecutivos",
      "Nunca"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 182 CNPCyF"
  },
  // Artículo 184 - Excepción de condena en costas
  {
    texto: "¿En qué procedimientos NO procede la condena en costas?",
    opciones: [
      "En juicios de derecho familiar",
      "En juicios ejecutivos",
      "En interdictos",
      "En materia mercantil"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 184 CNPCyF"
  },
  // Artículo 185 - Trámite de incidentes
  {
    texto: "¿Los incidentes suspenden el procedimiento principal?",
    opciones: [
      "No, nunca suspenden el procedimiento",
      "Sí, siempre",
      "Sí, solo los de nulidad",
      "Depende de la materia"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 185 CNPCyF"
  },
  // Artículo 191 - Medidas de apremio
  {
    texto: "¿Cuál es una medida de apremio que puede emplear la autoridad jurisdiccional?",
    opciones: [
      "El arresto hasta por treinta y seis horas",
      "La suspensión del juicio",
      "La nulidad de actuaciones",
      "El sobreseimiento"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 191, Fracción IV CNPCyF"
  },
  // Artículo 192 - Correcciones disciplinarias
  {
    texto: "¿Cuál es una corrección disciplinaria según el CNPCyF?",
    opciones: [
      "La amonestación",
      "El embargo de bienes",
      "La suspensión del juicio",
      "La nulidad"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 192, Fracción I CNPCyF"
  },
  // Artículo 194 - Definición de emplazamiento
  {
    texto: "¿Qué es el emplazamiento según el CNPCyF?",
    opciones: [
      "El primer acto por el que se hace saber a una persona que se ha iniciado un juicio en su contra",
      "La notificación de la sentencia",
      "La citación a testigos",
      "El requerimiento de pago"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 194 CNPCyF"
  },
  // Artículo 195 - Domicilio para emplazar
  {
    texto: "¿Dónde debe hacerse el emplazamiento?",
    opciones: [
      "En el domicilio que señale la parte actora donde vive, trabaja o habita el demandado",
      "En el domicilio del actor",
      "En el juzgado",
      "En cualquier lugar"
    ],
    correcta: 0,
    dificultad: 1,
    fundamento: "Artículo 195 CNPCyF"
  },
  // Artículo 199 - Emplazamiento por adhesión
  {
    texto: "¿En qué consiste el emplazamiento por adhesión?",
    opciones: [
      "Dejar adherido en lugar visible del domicilio las cédulas de notificación",
      "Notificar por correo",
      "Notificar por edictos",
      "Notificar por teléfono"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 199, Fracción I CNPCyF"
  },
  // Artículo 202 - Plazo para practicar notificaciones
  {
    texto: "¿En cuántos días deben practicarse los emplazamientos y notificaciones?",
    opciones: [
      "Dentro de los 3 días siguientes a recibir el expediente",
      "Dentro de 5 días",
      "Dentro de 9 días",
      "Dentro de 15 días"
    ],
    correcta: 0,
    dificultad: 2,
    fundamento: "Artículo 202 CNPCyF"
  }
];

async function subirPreguntas() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📤 SUBIENDO 70 PREGUNTAS NUEVAS - FASE DE GRUPOS');
  console.log('📋 BASADAS EN ARTÍCULOS 101-202 DEL CNPCyF');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    console.log('✅ Autenticado correctamente\n');
    
    // Verificar si ya hay preguntas en grupos
    const snapshot = await getDocs(collection(db, 'preguntas_grupos'));
    console.log(`📖 Preguntas actuales en grupos: ${snapshot.docs.length}`);
    
    if (snapshot.docs.length > 0) {
      console.log('🗑️ Limpiando preguntas existentes...');
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
    
    for (const pregunta of preguntasGrupos) {
      const docRef = doc(collection(db, 'preguntas_grupos'));
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
    
    console.log(`\n✅ SUBIDAS EXITOSAMENTE: ${count} preguntas a preguntas_grupos`);
    console.log('📋 BASADAS EN ARTÍCULOS 101 AL 202 DEL CNPCyF');
    console.log('🔄 PREGUNTAS NUEVAS - SIN REPETICIONES');
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🎉 PROCESO COMPLETADO');
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

subirPreguntas();