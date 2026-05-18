// subir-clasificacion.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNnqCNKHG7pDwvjYa4AxuVPRC9gMvllVg",
  authDomain: "ia-lex-mundi-90c11.firebaseapp.com",
  projectId: "ia-lex-mundi-90c11",
  storageBucket: "ia-lex-mundi-90c11.firebasestorage.app",
  messagingSenderId: "323596660830",
  appId: "1:323596660830:web:51e4454311570480ccc4cf"
};

// Credenciales
const authConfig = {
  email: "fidelsg996@gmail.com",
  password: "Segf@8005"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ====== 166 PREGUNTAS PARA FASE CLASIFICACIÓN ======
const preguntasClasificacion = [
  {
    texto: "¿Qué carácter tienen las disposiciones del CNPCyF y qué implica para los jueces locales?",
    opciones: [
      "Supletorio y dispositivo - implica que solo aplican si las partes lo aceptan",
      "De orden público, interés social y observancia general - implica que ningún juez local puede negarse a aplicarlo",
      "Federal exclusivo - implica que solo aplica en tribunales federales",
      "Local y temporal - implica que cada estado puede modificarlo"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuál es el objeto del CNPCyF?",
    opciones: [
      "Regular exclusivamente los juicios orales mercantiles",
      "Establecer normas sustantivas civiles y familiares",
      "Establecer la regulación procesal civil y familiar con base en derechos humanos",
      "Regular solo los procedimientos de jurisdicción voluntaria"
    ],
    correcta: 2,
    dificultad: 1
  },
  {
    texto: "¿Qué son los 'Ajustes de Procedimiento' según el CNPCyF?",
    opciones: [
      "Cambios en los plazos procesales acordados por las partes",
      "Modificaciones para facilitar el desempeño de personas en situación de vulnerabilidad",
      "Correcciones de errores ortográficos en la demanda",
      "Adaptaciones de las salas de audiencia para el público general"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué es una 'Audiencia virtual' según el CNPCyF?",
    opciones: [
      "Una audiencia grabada en video para consulta posterior",
      "Una audiencia celebrada por escrito a través de correo electrónico",
      "Cualquier audiencia de las previstas en el CNPCyF celebrada a través de una sala virtual",
      "Una audiencia donde las partes no tienen derecho a comparecer"
    ],
    correcta: 2,
    dificultad: 1
  },
  {
    texto: "¿Qué requisito debe cumplir una firma electrónica para ser considerada 'avanzada'?",
    opciones: [
      "Estar escaneada en un documento PDF",
      "Ser creada por medios electrónicos bajo el control exclusivo del firmante y vinculada únicamente a él",
      "Ser una contraseña para acceder al expediente electrónico",
      "Tener un sello digital del juzgado"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué efectos jurídicos produce la firma electrónica simple?",
    opciones: [
      "No tiene validez legal en juicio",
      "Solo es válida para actos de jurisdicción voluntaria",
      "Los mismos efectos que la firma autógrafa, siendo admisible como prueba en juicio",
      "Solo es válida si está notariada"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Quién puede ser 'Persona Representante Autorizada' según el CNPCyF?",
    opciones: [
      "Cualquier persona mayor de edad",
      "El notario público",
      "Abogado o licenciado en derecho con cédula profesional expedida por autoridad competente",
      "El pasante de derecho con carta de pasante"
    ],
    correcta: 2,
    dificultad: 1
  },
  {
    texto: "¿Qué debe ponderar el juez sobre los formalismos procesales?",
    opciones: [
      "La aplicación estricta de los plazos procesales",
      "La solución de la controversia sobre los formalismos procesales",
      "La declaración de incompetencia",
      "El sobreseimiento del juicio"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué obligación tienen las autoridades jurisdiccionales en materia de género?",
    opciones: [
      "Nombrar abogadas para todas las mujeres",
      "Actuar con perspectiva de género y garantizar la igualdad sustantiva entre mujeres y hombres",
      "Dar preferencia a las mujeres en todas las resoluciones",
      "Excluir a los hombres de los procedimientos familiares"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué facultades tiene el juez para hacer cumplir sus determinaciones?",
    opciones: [
      "Solo puede exhortar a las partes",
      "Puede hacer uso de las medidas de apremio previstas en el CNPCyF",
      "Debe solicitar autorización a un tribunal superior",
      "No tiene facultades coercitivas"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿De qué debe cerciorarse el juez respecto a la representación de las partes?",
    opciones: [
      "Que las partes se encuentren debidamente representadas por persona representante autorizada",
      "Que las partes tengan domicilio en la misma ciudad",
      "Que las partes sean mayores de edad",
      "Que las partes tengan ingresos suficientes"
    ],
    correcta: 0,
    dificultad: 1
  },
  {
    texto: "¿En qué casos el juez debe suplir oficiosamente las deficiencias de los planteamientos de las partes?",
    opciones: [
      "Siempre, sin excepción",
      "Nunca, por el principio de imparcialidad",
      "Cuando se trate de proteger intereses de personas en situación de vulnerabilidad",
      "Solo cuando lo solicite la parte afectada"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Con base en qué estándar debe resolver el juez en asuntos que involucran derechos de NNA?",
    opciones: [
      "La voluntad de los progenitores",
      "El interés superior de la niñez, con perspectiva de género",
      "El principio de legalidad estricta",
      "La economía procesal"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿A quiénes debe garantizar la autoridad jurisdiccional deberes reforzados de protección?",
    opciones: [
      "A todas las partes por igual",
      "Solo a los adultos mayores",
      "A las mujeres, adolescentes, niñas y niños",
      "Solo a las personas con discapacidad"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Para qué debe el juez adecuar sus actuaciones mediante formatos alternativos?",
    opciones: [
      "Para agilizar el procedimiento",
      "Para garantizar la igualdad sustantiva, equidad y accesibilidad de grupos en situación de vulnerabilidad",
      "Para reducir costos judiciales",
      "Para cumplir con la digitalización del expediente"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué debe resolver el juez cuando hay una persona indígena que no habla español y no hay intérprete?",
    opciones: [
      "Continuar la audiencia con un testigo como intérprete",
      "Suspender la audiencia y ordenar nueva fecha",
      "Desechar la comparecencia",
      "Nombrar a la contraparte como intérprete"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Quiénes NO pueden fungir como intérpretes?",
    opciones: [
      "Los peritos oficiales",
      "Las partes o los testigos",
      "Los traductores certificados",
      "Los notarios públicos"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿Qué derecho tiene cualquier persona según el principio de Acceso a la justicia?",
    opciones: [
      "A que su demanda sea aceptada sin revisión",
      "A acudir ante la autoridad jurisdiccional para formular una pretensión jurídica concreta",
      "A que se le nombre un abogado gratuito",
      "A que su caso sea resuelto en 15 días"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿En qué consiste el principio de Concentración?",
    opciones: [
      "Concentrar todos los juicios similares en un solo tribunal",
      "Desahogar la mayor cantidad de actuaciones procesales en una sola audiencia",
      "Unificar la competencia de varios jueces",
      "Acumular todas las pruebas en un solo escrito"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿En qué casos NO procede la conciliación por el principio de Colaboración?",
    opciones: [
      "Siempre procede sin excepción",
      "Solo en materia mercantil",
      "Cuando existan conductas de violencia en cualquiera de sus modalidades",
      "Cuando las partes no tengan abogado"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Cuál es la regla general sobre la continuidad de las audiencias?",
    opciones: [
      "Deben ser ininterrumpidas",
      "Pueden suspenderse libremente por las partes",
      "Se realizan por capítulos en días distintos",
      "Se suspenden automáticamente cada hora"
    ],
    correcta: 0,
    dificultad: 1
  },
  {
    texto: "¿Qué derecho tienen las partes según el principio de Contradicción?",
    opciones: [
      "A no contestar la demanda",
      "A debatir los hechos, argumentos jurídicos y pruebas de su contraparte",
      "A presentar pruebas sin límite",
      "A solicitar la recusación del juez sin causa"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿A quién está confiada la rectoría del proceso?",
    opciones: [
      "A las partes",
      "Al Ministerio Público",
      "Únicamente a las autoridades jurisdiccionales",
      "A los abogados de las partes"
    ],
    correcta: 2,
    dificultad: 1
  },
  {
    texto: "¿Desde qué momento rige el principio de Igualdad Procesal?",
    opciones: [
      "Solo durante la audiencia de juicio",
      "Desde la sentencia hasta la ejecución",
      "Desde el escrito inicial de demanda y hasta la ejecución de la sentencia",
      "Solo en la etapa de ofrecimiento de pruebas"
    ],
    correcta: 2,
    dificultad: 1
  },
  {
    texto: "¿Qué característica tiene el principio de Inmediación respecto del juez?",
    opciones: [
      "Puede delegar la audiencia en el secretario",
      "Es indelegable el contacto directo y personal del juez con las partes y pruebas",
      "Puede dictar sentencia sin presidir audiencias",
      "Solo aplica en materia familiar"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿Qué debe prevalecer cuando hay conflicto entre derechos de NNA y otros derechos?",
    opciones: [
      "Los derechos de los adultos",
      "El interés superior de la niñez",
      "La voluntad del juez",
      "El principio de legalidad"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿Quiénes tienen la facultad de solicitar diligencias para evitar la paralización del procedimiento?",
    opciones: [
      "Solo el juez",
      "Solo el actor",
      "Las partes",
      "Solo el Ministerio Público"
    ],
    correcta: 2,
    dificultad: 1
  },
  {
    texto: "¿A qué deben ajustar su conducta quienes participan en el proceso?",
    opciones: [
      "A ganar el juicio por cualquier medio",
      "A la dignidad de la justicia, respeto mutuo, probidad y buena fe",
      "A las instrucciones de sus abogados",
      "A la economía procesal"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿En qué materia aplica el principio de Litis abierta?",
    opciones: [
      "Solo en materia civil",
      "En materia familiar",
      "En materia mercantil",
      "En todas las materias"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué debe hacer el juez con hechos producidos durante el proceso no invocados oportunamente en materia familiar?",
    opciones: [
      "Ignorarlos",
      "Hacer mérito de ellos si están debidamente probados",
      "Remitirlos a un juicio separado",
      "Declarar su improcedencia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuál es la regla general sobre el desarrollo del proceso?",
    opciones: [
      "Se desarrollará por escrito",
      "Se desarrollará en audiencias orales",
      "Puede ser escrito u oral a elección de las partes",
      "Depende de la cuantía del asunto"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿Qué busca eliminar la perspectiva de género?",
    opciones: [
      "Los juicios orales",
      "Las causas de la opresión de género como la desigualdad, injusticia y jerarquización basada en el género",
      "La figura del juez",
      "Las pruebas periciales"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre si no se ejercen los derechos procesales en la etapa correspondiente?",
    opciones: [
      "Pueden ejercerse en la siguiente etapa",
      "Se extingue la oportunidad de ejercerlos en la posterior",
      "El juez debe exhortar a la parte a ejercerlos",
      "Se concede una prórroga automática"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿En qué materia el acceso a las audiencias queda reservado a las partes?",
    opciones: [
      "Materia civil",
      "Materia mercantil",
      "Materia familiar",
      "Materia administrativa"
    ],
    correcta: 2,
    dificultad: 1
  },
  {
    texto: "¿En qué materia las audiencias son públicas?",
    opciones: [
      "Materia familiar",
      "Materia civil",
      "Materia penal",
      "Materia laboral"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿Qué otro requisito se requiere para el ejercicio de la acción además de la existencia de un derecho?",
    opciones: [
      "El pago de derechos judiciales",
      "La capacidad o legitimación para ejercitar la acción",
      "La presentación de testigos",
      "La firma de un notario"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué tipo de derechos exceptúan lo señalado sobre capacidad o legitimación?",
    opciones: [
      "Derechos patrimoniales",
      "Derecho penal",
      "Derecho o interés difuso, colectivo o individual de incidencia colectiva",
      "Derechos laborales"
    ],
    correcta: 2,
    dificultad: 3
  },
  {
    texto: "¿Puede dictarse mandamiento de ejecución contra la Administración Pública?",
    opciones: [
      "Sí, como cualquier particular",
      "No, nunca podrá dictarse mandamiento de ejecución ni providencia de embargo",
      "Sí, pero solo con autorización judicial expresa",
      "Sí, pero solo en materia fiscal"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cómo se cumplimentan las resoluciones dictadas contra la Administración Pública?",
    opciones: [
      "Mediante embargo de sus cuentas",
      "Por las autoridades correspondientes dentro de los límites de sus atribuciones",
      "Mediando autorización del Congreso",
      "No se cumplimentan"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué efecto tiene expresar equivocadamente el nombre de la acción en la demanda?",
    opciones: [
      "La demanda se desecha de plano",
      "La acción procede siempre que se determine la prestación exigida y el título o causa de la acción",
      "Se requiere corregir la demanda",
      "El juez debe nombrar la acción correcta"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cómo se clasifican las acciones por razón de su objeto?",
    opciones: [
      "Principales, accesorias y cautelares",
      "Reales, personales y del estado civil de las personas",
      "Ordinarias, especiales y sumarias",
      "Civiles, familiares y mercantiles"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿Cuál de las siguientes es una acción real?",
    opciones: [
      "El cobro de una deuda",
      "La reclamación de un bien que pertenece a título de dominio",
      "El cumplimiento de un contrato",
      "La impugnación de un testamento"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿Contra quién se ejercitan las acciones personales?",
    opciones: [
      "Contra cualquier persona que tenga relación con el bien",
      "Contra la persona obligada, quien la haya garantizado y quienes legalmente le sucedan",
      "Contra el Estado",
      "Contra el juez que conoce del asunto"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué cuestiones comprenden las acciones del estado civil?",
    opciones: [
      "Solo el matrimonio y divorcio",
      "Nacimiento, reconocimiento, defunción, matrimonio, concubinato y su cesación",
      "Solo la filiación",
      "Solo la patria potestad"
    ],
    correcta: 1,
    dificultad: 1
  },
  {
    texto: "¿A quién compete la acción reivindicatoria?",
    opciones: [
      "A quien está en posesión del bien",
      "A quien no está en posesión del bien del cual tiene la propiedad",
      "A cualquier persona con interés legítimo",
      "Al Estado"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ordena la sentencia en la acción reivindicatoria?",
    opciones: [
      "El pago de daños morales",
      "Declarar el dominio del actor y ordenar la entrega con frutos y accesiones",
      "La expropiación del bien",
      "La adjudicación del bien al Estado"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué puede hacer el tenedor del bien demandado en reivindicación si no es propietario?",
    opciones: [
      "Contestar la demanda como propietario",
      "Declinar la responsabilidad designando a quien posee a título de dueño",
      "Entregar el bien inmediatamente",
      "Solicitar la suspensión del juicio"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué ocurre si el poseedor demandado niega la posesión en un juicio reivindicatorio?",
    opciones: [
      "Se le impone una multa",
      "Se le declara en rebeldía",
      "La perderá en beneficio del demandante",
      "El juicio se suspende"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Quiénes pueden ser demandados en reivindicación aunque no posean el bien?",
    opciones: [
      "Solo el propietario registral",
      "Quienes para evitar la acción dejaron de poseer y quienes están obligadas a restituir",
      "Solo los herederos",
      "Solo los arrendatarios"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Cuál de los siguientes bienes NO puede reivindicarse?",
    opciones: [
      "Bienes inmuebles con registro público",
      "Bienes muebles perdidos adquiridos de buena fe en almoneda",
      "Bienes heredados",
      "Bienes en copropiedad"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué acción compete a quien adquiere con justo título y de buena fe y es desposeído?",
    opciones: [
      "Acción reivindicatoria",
      "Acción plenaria de posesión",
      "Acción hipotecaria",
      "Acción negatoria"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo NO procede la acción plenaria de posesión?",
    opciones: [
      "Si el poseedor es de mala fe",
      "Cuando ambas posesiones fuesen dudosas, o el demandado tuviere título registrado y el actor no",
      "Siempre procede",
      "Si hay violencia"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué busca la acción negatoria?",
    opciones: [
      "Declarar la existencia de una servidumbre",
      "La declaración de libertad o reducción de gravámenes de bien inmueble y demolición de obras",
      "El pago de una deuda",
      "La restitución de un bien"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Quién puede ejercitar la acción confesoria?",
    opciones: [
      "Cualquier persona con interés legítimo",
      "El titular del derecho real sobre el inmueble o quien posea el fundo dominante interesado en la servidumbre",
      "El Estado",
      "El Ministerio Público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Para qué se intenta la acción hipotecaria?",
    opciones: [
      "Para constituir una sociedad",
      "Para obtener el pago o prelación del crédito que una hipoteca garantiza",
      "Para demandar alimentos",
      "Para impugnar un testamento"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué efectos produce la acción de petición de herencia?",
    opciones: [
      "Declarar heredero, entregar bienes con accesiones, indemnizar y rendir cuentas",
      "Solo declarar heredero",
      "Solo rendir cuentas",
      "Solo entregar bienes"
    ],
    correcta: 0,
    dificultad: 2
  },
  {
    texto: "¿Contra quién se deduce la acción de petición de herencia?",
    opciones: [
      "Solo contra el albacea",
      "Contra el albacea, poseedor de bienes hereditarios como heredero o cesionario, y quien no alega título de posesión",
      "Solo contra los coherederos",
      "Contra el notario que formalizó el testamento"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué debe hacer el juez cuando solo un copropietario ejercita acción reivindicatoria del bien común?",
    opciones: [
      "Desechar la demanda",
      "Llamar a todos los copropietarios al juicio ante la existencia de un litisconsorcio activo necesario",
      "Continuar solo con el copropietario actor",
      "Declarar la incompetencia"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué requisito se requiere para la procedencia del interdicto de retener?",
    opciones: [
      "Que la perturbación sea leve",
      "Que se reclame dentro de un año y la perturbación consista en actos preparatorios tendientes directamente a la usurpación violenta",
      "Que haya sentencia ejecutoriada",
      "Que haya dolo del perturbador"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Quién puede ejercitar la acción de recobrar?",
    opciones: [
      "Quien es perturbado en su posesión",
      "Quien es despojado de la posesión jurídica de un bien inmueble",
      "Quien tiene título de propiedad",
      "Quien es arrendatario"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué NO es objeto del interdicto de recuperar la posesión?",
    opciones: [
      "Reponer al despojado en la posesión",
      "Indemnizar por daños y perjuicios",
      "Declarar la propiedad del bien",
      "Obtener garantía de abstención con apercibimiento de multa y arresto"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Cuál es el plazo para deducir la acción de recuperar la posesión?",
    opciones: [
      "6 meses",
      "1 año",
      "2 años siguientes a los actos violentos",
      "3 años"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Qué se entiende por 'obra nueva'?",
    opciones: [
      "Solo construcción de nueva planta",
      "No solo la construcción de nueva planta, sino también la realizada sobre edificio antiguo añadiéndole, quitándole o dándole forma distinta",
      "Solo reparaciones menores",
      "Solo demoliciones"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué debe otorgar la parte actora para obtener la suspensión de la construcción en un juicio de obra nueva?",
    opciones: [
      "Una fianza de ley",
      "Garantía para responder de daños y perjuicios que se causen al demandado",
      "Un depósito del valor de la obra",
      "Una carta de no afectación"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿A quién se da la acción de obra peligrosa?",
    opciones: [
      "Solo al propietario del predio peligroso",
      "A quien esté en posesión de propiedad contigua que pueda resentirse por ruina o derrumbe",
      "Al Estado",
      "A cualquier vecino sin necesidad de afectación"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué puede ordenar el juez en el juicio de obra peligrosa?",
    opciones: [
      "La demolición inmediata sin garantía",
      "Previa garantía del actor, ordenar a la demandada suspenda la obra o realice las obras indispensables para evitar daños",
      "El desalojo del predio peligroso",
      "La clausura definitiva"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué facultad tienen los codeudores solidarios no demandados?",
    opciones: [
      "No pueden intervenir",
      "Pueden coadyuvar en el juicio seguido contra sus codeudores solidarios",
      "Deben ser demandados necesariamente",
      "Pueden iniciar un juicio separado"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué puede hacer la parte demandada al contestar la demanda respecto del obligado a la evicción?",
    opciones: [
      "Demandarlo directamente",
      "Denunciar el pleito a quien esté obligada a la evicción para que sea llamado a juicio",
      "Ignorarlo",
      "Solicitar su embargo"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿En qué plazo debe comparecer al juicio quien sea llamado para que le pare perjuicio la sentencia?",
    opciones: [
      "5 días",
      "10 días",
      "15 días",
      "30 días"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Qué facultad tiene el tercero que pretende excluir los derechos de la actora y demandada?",
    opciones: [
      "Solo puede recurrir la sentencia",
      "Puede concurrir al procedimiento o iniciar uno nuevo",
      "No puede intervenir",
      "Debe esperar a que termine el juicio"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridades son competentes para procedimientos relacionados con el estado civil?",
    opciones: [
      "Solo el juez familiar",
      "Autoridad jurisdiccional o autoridad administrativa, según Código Civil respectivo",
      "Solo el Registro Civil",
      "Solo el Ministerio Público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué debe ordenar la sentencia en procedimientos de reconocimiento de identidad de género?",
    opciones: [
      "Solo la anotación al margen del acta",
      "El levantamiento de nueva acta de nacimiento y cancelación del acta primigenia",
      "Solo una constancia",
      "La modificación del acta original"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué efecto producen las acciones del estado civil fundadas en posesión de estado de hijo?",
    opciones: [
      "Declarar la nulidad del acta",
      "Amparar o restituir a quien la disfrute contra cualquier perturbador",
      "Establecer una multa",
      "Suspender la patria potestad"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Las decisiones judiciales en acciones de estado civil perjudican a quienes no litigaron?",
    opciones: [
      "No, solo a las partes",
      "Sí, perjudican aún a quienes no litigaron",
      "Solo si son menores de edad",
      "Solo si son herederos"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad tiene el control del registro de personas deudoras alimentarias morosas?",
    opciones: [
      "El Ejecutivo",
      "El Legislativo",
      "La autoridad competente",
      "El Ministerio Público"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Qué derecho nace del enriquecimiento sin causa de una parte en detrimento de otra?",
    opciones: [
      "Acción penal",
      "Acción de indemnización en la medida del enriquecimiento",
      "Acción reivindicatoria",
      "Acción hipotecaria"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué requisito debe acreditar quien ejercita la acción proforma?",
    opciones: [
      "La existencia de un contrato verbal",
      "La titularidad registral del bien inmueble transmitido",
      "La buena fe del transmitente",
      "La posesión del bien por más de 5 años"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Quién puede ejercitar acciones mancomunadas por herencia si no se ha nombrado albacea?",
    opciones: [
      "Solo el juez sucesorio",
      "Quienes tengan un derecho reconocido de herencia o legado",
      "Solo el heredero universal",
      "Solo el legatario"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué requisito se necesita para que proceda la acción oblicua?",
    opciones: [
      "Que el deudor sea insolvente",
      "Que el crédito conste en título ejecutivo y, requerido el deudor, descuide o rehúse deducir las acciones",
      "Que haya sentencia firme",
      "Que el deudor sea moroso"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué acciones nunca podrá ejercitar el acreedor por acción oblicua?",
    opciones: [
      "Las acciones reales",
      "Las acciones derivadas de derechos inherentes a la persona del deudor",
      "Las acciones personales",
      "Las acciones hipotecarias"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿En qué proporción obligan a los herederos las acciones ejercitadas contra ellos?",
    opciones: [
      "En su totalidad, solidariamente",
      "En proporción a su masa hereditaria",
      "En partes iguales",
      "Según lo que determine el juez"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿En qué casos los herederos responden solidariamente?",
    opciones: [
      "Siempre, por disposición de la ley",
      "Cuando la obligación sea solidaria con el autor de la herencia, por ocultación de bienes o por dolo o fraude en administración de bienes indivisos",
      "Nunca responden solidariamente",
      "Solo si aceptan la herencia a beneficio de inventario"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Cuándo deben intentarse varias acciones en una sola demanda?",
    opciones: [
      "Siempre, sin excepción",
      "Cuando haya varias acciones contra una misma persona, respecto de un mismo bien y provengan de una misma causa",
      "Nunca, deben ir en demandas separadas",
      "Solo si el actor así lo decide"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué acciones NO pueden acumularse en la misma demanda?",
    opciones: [
      "Acciones reales y personales",
      "Acciones contrarias o contradictorias, posesorias con petitorias, o cuando una dependa del resultado de la otra",
      "Acciones civiles y familiares",
      "Acciones de estado civil"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Cuándo no son acumulables acciones en la misma demanda?",
    opciones: [
      "Siempre son acumulables",
      "Cuando por su cuantía, materia o naturaleza correspondan a jurisdicciones diferentes",
      "Solo si son de diferente materia",
      "Si son de la misma materia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo puede una persona exigir a otra que deduzca o continúe una acción?",
    opciones: [
      "Siempre que tenga interés",
      "Cuando alguno tenga acción o excepción que dependa del ejercicio de la acción de otro",
      "Nunca puede exigirse",
      "Solo mediante orden judicial"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Pueden modificarse la demanda o contestación una vez admitidas?",
    opciones: [
      "Sí, en cualquier momento",
      "No, salvo en los casos que el CNPCyF lo disponga",
      "Sí, con acuerdo de las partes",
      "Sí, con autorización del juez"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué requiere el desistimiento de la instancia realizado después del emplazamiento?",
    opciones: [
      "Solo la voluntad del actor",
      "El consentimiento de la persona demandada",
      "Autorización del juez",
      "El pago de costas"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿El desistimiento de la acción requiere consentimiento del demandado?",
    opciones: [
      "Sí, siempre",
      "No, extingue la acción aún sin consentimiento del demandado",
      "Depende de la etapa procesal",
      "Solo si hay sentencia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿En qué casos procede la acción de nulidad de juicio concluido?",
    opciones: [
      "Cuando la parte vencida no está de acuerdo con la sentencia",
      "Si se falló con base en pruebas falsas con posterioridad a la resolución, o por colusión o maniobra fraudulenta de las partes",
      "Cuando el juez no valoró correctamente las pruebas",
      "Cuando se omitió notificar a un testigo"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Quiénes pueden ejercitar la acción de nulidad de juicio concluido?",
    opciones: [
      "Solo las partes que litigaron",
      "Las partes, sus sucesores, causahabientes y terceros a quienes perjudique la resolución",
      "Solo el Ministerio Público",
      "Cualquier persona con interés"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional es competente para conocer de la acción de nulidad de juicio concluido?",
    opciones: [
      "La que dictó la sentencia original",
      "La autoridad jurisdiccional de proceso oral civil",
      "El Tribunal Superior de Justicia",
      "La Suprema Corte de Justicia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuál es el plazo máximo para interponer la acción de nulidad de juicio concluido?",
    opciones: [
      "6 meses desde la sentencia",
      "Un año desde que causó ejecutoria o tres meses desde que el recurrente conoció los motivos",
      "2 años desde la sentencia",
      "No hay plazo"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre con los plazos de nulidad si hay juicio pendiente sobre falsedad de prueba?",
    opciones: [
      "Continúan corriendo",
      "Se suspenden",
      "Se reinician",
      "Se reducen a la mitad"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué debe otorgar quien promueve nulidad de juicio para obtener la suspensión de la ejecución?",
    opciones: [
      "Una fianza de ley",
      "Garantía por daños y perjuicios que fije la autoridad jurisdiccional",
      "Un depósito del monto de la sentencia",
      "Una carta de crédito"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué ocurre con la garantía si la acción de nulidad se declara infundada?",
    opciones: [
      "Se devuelve al promovente",
      "Se adjudica a la parte demandada por concepto de daños y perjuicios sin necesidad de prueba",
      "Se paga al tribunal",
      "Se destina a gastos judiciales"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué recurso procede contra la sentencia dictada en el juicio de nulidad de juicio concluido?",
    opciones: [
      "Revocación",
      "Apelación",
      "Queja",
      "Reclamación"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Quién es siempre condenado al pago de gastos y costas en el juicio donde se declare fundada la acción de nulidad?",
    opciones: [
      "El actor",
      "La parte demandada que haya dado lugar a las causales",
      "Ambas partes por igual",
      "El Ministerio Público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo puede ser responsable solidario quien actúe en ejercicio del mandato judicial?",
    opciones: [
      "Siempre",
      "Solo cuando se acredite el dolo",
      "Nunca",
      "Solo si el mandante es insolvente"
    ],
    correcta: 1,
    dificultad: 3
  },
  {
    texto: "¿Qué son las excepciones procesales?",
    opciones: [
      "Defensas de fondo contra la pretensión del actor",
      "Oposiciones del demandado para impugnar el procedimiento sin atacar el derecho sustantivo",
      "Recursos contra resoluciones del juez",
      "Incidentes de nulidad de actuaciones"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuál de las siguientes NO es una excepción procesal?",
    opciones: [
      "La incompetencia de la autoridad jurisdiccional",
      "La litispendencia",
      "El pago de la deuda",
      "La cosa juzgada"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Cuándo deben hacerse valer las excepciones procesales?",
    opciones: [
      "En cualquier momento del juicio",
      "Al contestar la demanda, la reconvención o la solicitud de medidas cautelares",
      "Después de la audiencia preliminar",
      "Solo en la sentencia definitiva"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Las excepciones procesales suspenden el procedimiento?",
    opciones: [
      "Sí, siempre",
      "No, en ningún caso suspenden el procedimiento",
      "Sí, pero solo las de incompetencia",
      "Depende del criterio del juez"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿De cuántos días es el plazo para que la contraparte manifieste lo que a su derecho convenga sobre las excepciones?",
    opciones: [
      "3 días",
      "5 días",
      "9 días",
      "15 días"
    ],
    correcta: 0,
    dificultad: 2
  },
  {
    texto: "¿Qué tratamiento especial tiene la excepción de cosa juzgada?",
    opciones: [
      "Se tramita de forma incidental especial",
      "Se resuelve en la sentencia definitiva sin trámite",
      "Se desecha de plano",
      "No es una excepción procesal"
    ],
    correcta: 0,
    dificultad: 2
  },
  {
    texto: "¿Qué tipo de pruebas se admiten en las excepciones de falta de personalidad, conexidad o litispendencia?",
    opciones: [
      "Cualquier tipo de prueba",
      "Solo prueba documental en copia certificada",
      "Solo prueba testimonial",
      "Solo prueba pericial"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre si la contraparte se allana a la excepción de falta de cumplimiento de plazo o condición?",
    opciones: [
      "Se declara procedente de plano",
      "Se desecha",
      "Se reserva para sentencia",
      "Se requiere prueba adicional"
    ],
    correcta: 0,
    dificultad: 2
  },
  {
    texto: "¿Cuál es el efecto cuando se declara procedente la excepción de falta de cumplimiento de plazo o condición?",
    opciones: [
      "El sobreseimiento del juicio",
      "Dejar a salvo el derecho para que se haga valer cuando cambien las circunstancias",
      "La condena inmediata",
      "La nulidad de lo actuado"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "Cuando se declara la improcedencia de la vía, ¿qué efecto produce?",
    opciones: [
      "El sobreseimiento del juicio",
      "Continuar el procedimiento en la vía que se considere procedente, declarando la validez de lo actuado",
      "La nulidad de todo lo actuado",
      "El archivo del asunto"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cómo puede promoverse la incompetencia?",
    opciones: [
      "Solo por declinatoria",
      "Solo por inhibitoria",
      "Por declinatoria o inhibitoria",
      "Por vía incidental o de oficio"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Qué debe señalar quien opone la excepción de litispendencia?",
    opciones: [
      "El domicilio del actor",
      "La autoridad jurisdiccional ante quien se tramita el primer juicio y declarar que no hay sentencia definitiva",
      "El monto del juicio",
      "El nombre de los testigos"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Con qué documentos se acredita la litispendencia?",
    opciones: [
      "Con cualquier tipo de prueba",
      "Con copia autorizada de la demanda, contestación y constancia de emplazamiento del primer juicio",
      "Solo con testimonios",
      "Con un acuerdo entre partes"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué efecto tiene declarar procedente la litispendencia?",
    opciones: [
      "Acumular ambos juicios",
      "Sobreseer el juicio que en segundo lugar previno",
      "Declarar la nulidad del primer juicio",
      "Remitir ambos juicios a un tribunal superior"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre con las medidas provisionales en materia familiar cuando se declara procedente la litispendencia?",
    opciones: [
      "Se cancelan automáticamente",
      "Persisten hasta que determine lo contrario la autoridad que previno",
      "Las dicta el nuevo juez",
      "Se suspenden por 30 días"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿En qué caso existe conexidad de causas?",
    opciones: [
      "Identidad de personas y acciones, aunque los bienes sean distintos",
      "Siempre que haya dos juicios",
      "Cuando las partes son diferentes",
      "Cuando los bienes son los mismos"
    ],
    correcta: 0,
    dificultad: 2
  },
  {
    texto: "¿Qué busca la excepción de conexidad?",
    opciones: [
      "Sobreseer ambos juicios",
      "La remisión de los autos del segundo juicio al que previno para acumularlos y decidir en una sola sentencia",
      "Declarar la nulidad de ambos juicios",
      "Separar los juicios definitivamente"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo NO procede la excepción de conexidad?",
    opciones: [
      "Cuando los pleitos están en diversas instancias",
      "Siempre procede",
      "Cuando las partes son las mismas",
      "Cuando los bienes son distintos"
    ],
    correcta: 0,
    dificultad: 2
  },
  {
    texto: "¿En qué momento debe el juez estudiar de oficio la personalidad?",
    opciones: [
      "Solo si la contraparte lo solicita",
      "Al momento de proveer el escrito inicial de demanda y su posible contestación",
      "Después de la audiencia de juicio",
      "Solo en la sentencia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿De cuántos días es el plazo para subsanar deficiencias de personalidad?",
    opciones: [
      "3 días",
      "5 días",
      "9 días",
      "10 días"
    ],
    correcta: 3,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre si la parte actora no subsana su falta de personalidad?",
    opciones: [
      "Se le concede una prórroga",
      "Se sobresee el juicio",
      "Se continúa con el juicio",
      "Se le multa"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre si la parte demandada no subsana su falta de personalidad?",
    opciones: [
      "Se sobresee el juicio",
      "Se le impone una multa",
      "Se continúa el juicio en su rebeldía",
      "Se suspende el juicio"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Cómo se tramita la excepción de falta de personalidad en procedimientos escritos?",
    opciones: [
      "En la sentencia definitiva",
      "En forma incidental",
      "De plano",
      "Por la vía de apelación"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cómo se resuelve la falta de personalidad sobrevenida en la audiencia preliminar?",
    opciones: [
      "Se difiere la audiencia",
      "Se resuelve previo derecho de contradicción en la misma audiencia",
      "Se remite a un incidente por separado",
      "Se desecha de plano"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Hasta qué momento se pueden hacer valer objeciones de personalidad posteriores a los escritos que fijan la litis?",
    opciones: [
      "En cualquier momento del juicio",
      "Hasta antes del dictado de la sentencia definitiva",
      "Solo durante la audiencia de pruebas",
      "Después de la sentencia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué documentos deben exhibirse para acreditar la excepción de cosa juzgada?",
    opciones: [
      "Solo la sentencia",
      "Copia certificada de demanda, contestación, sentencia de segunda instancia y auto que la declaró ejecutoriada",
      "Cualquier documento que acredite el juicio anterior",
      "Solo el convenio de mediación"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué recurso procede si se declara procedente la excepción de cosa juzgada?",
    opciones: [
      "Revocación",
      "Apelación en ambos efectos",
      "Queja",
      "Reclamación"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Por cuáles criterios se determina la competencia de la autoridad jurisdiccional?",
    opciones: [
      "Por la materia, el grado y el territorio",
      "Solo por la materia",
      "Solo por el territorio",
      "Por la cuantía exclusivamente"
    ],
    correcta: 0,
    dificultad: 1
  },
  {
    texto: "¿Qué ocurre si en un lugar hay dos o más Tribunales Federales?",
    opciones: [
      "Se sortea",
      "Es competente el que elija el actor",
      "Es competente el que designe el demandado",
      "Se turna al Tribunal Superior"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Puede una autoridad jurisdiccional negarse a conocer de un asunto?",
    opciones: [
      "Sí, libremente",
      "No, salvo que considere que carece de competencia legal, expresando motivación y fundamentos",
      "Sí, si el asunto es de baja cuantía",
      "No, nunca puede negarse"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Puede una autoridad jurisdiccional sostener competencia con otra superior en su clase que no ejerza jurisdicción sobre ella?",
    opciones: [
      "No, nunca",
      "Sí, puede",
      "Solo si es de la misma materia",
      "Solo si ambas son federales"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Una autoridad que reconoce la jurisdicción de otra puede sostener su competencia?",
    opciones: [
      "Sí, siempre",
      "No, no puede sostener su competencia",
      "Sí, si es por territorio",
      "Depende de la materia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Hasta cuándo pueden las partes desistirse de sostener la competencia por territorio?",
    opciones: [
      "En cualquier momento del juicio",
      "Hasta antes que se resuelva la competencia",
      "Solo al inicio del juicio",
      "Después de la sentencia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuáles son las únicas competencias que se pueden prorrogar?",
    opciones: [
      "Por razón de territorio y materia",
      "Solo por razón de materia",
      "Solo por razón de territorio",
      "Por razón de grado y cuantía"
    ],
    correcta: 0,
    dificultad: 2
  },
  {
    texto: "¿En qué materias es prorrogable la competencia por razón de materia?",
    opciones: [
      "Solo en materia civil",
      "Solo en materia familiar",
      "En materias civil y familiar",
      "En todas las materias"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Quién conoce cuando el juez deja de conocer por excusa o recusación?",
    opciones: [
      "El tribunal superior",
      "La que siga en número o turno según la ley orgánica",
      "El juez que designen las partes",
      "El Ministerio Público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo es competente una autoridad jurisdiccional por sumisión de las partes?",
    opciones: [
      "Siempre",
      "Cuando las partes se hubieren sometido expresa o tácitamente, tratándose de fuero renunciable",
      "Solo si hay contrato por escrito",
      "Nunca, la competencia es de orden público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo hay sumisión expresa?",
    opciones: [
      "Cuando las partes se presentan a juicio",
      "Cuando las partes renuncian de forma clara y precisa al fuero que la ley les concede",
      "Cuando contestan la demanda",
      "Cuando ofrecen pruebas"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo se entiende sometido tácitamente el demandado?",
    opciones: [
      "Por el hecho de ocurrir al juzgado",
      "Por contestar la demanda o reconvenir al actor",
      "Por no comparecer",
      "Por ofrecer pruebas"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre con lo actuado por autoridad jurisdiccional declarada incompetente?",
    opciones: [
      "Es válido",
      "Es nulo todo lo actuado, salvo incompetencia sobrevenida",
      "Solo es nula la sentencia",
      "Se ratifica por el tribunal competente"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional es competente cuando el deudor ha designado lugar para ser requerido judicialmente?",
    opciones: [
      "La de su domicilio",
      "La del lugar designado para ser requerido",
      "La del lugar del contrato",
      "La del lugar del cumplimiento de la obligación"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "En una acción real sobre un inmueble, ¿qué autoridad jurisdiccional es competente?",
    opciones: [
      "La del domicilio del actor",
      "La de la ubicación del bien",
      "La del domicilio del demandado",
      "La que elija el actor"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "En acciones personales con varios demandados de diferentes domicilios, ¿qué autoridad es competente?",
    opciones: [
      "La del domicilio de cualquier demandado",
      "La del domicilio que elija el actor",
      "La del primer demandado mencionado",
      "La del lugar del contrato"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional es competente para conocer de juicios sucesorios?",
    opciones: [
      "La del domicilio del actor",
      "La donde haya tenido su último domicilio el autor de la sucesión",
      "La del lugar del fallecimiento",
      "La del lugar donde estén la mayoría de los bienes"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuál es el orden de competencia en juicios sucesorios a falta de domicilio?",
    opciones: [
      "Cualquier juez",
      "Ubicación de bienes inmuebles (el de mayor número), a falta, lugar del fallecimiento",
      "El del lugar del fallecimiento siempre",
      "El del registro civil"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "En asuntos de niñas, niños y adolescentes, ¿qué autoridad jurisdiccional es competente?",
    opciones: [
      "La del domicilio del progenitor que ejerce la patria potestad",
      "La del domicilio de las niñas, niños y adolescentes",
      "La del domicilio del actor",
      "La del lugar donde se cometió la violación de derechos"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "En los juicios de divorcio, ¿qué autoridad jurisdiccional es competente?",
    opciones: [
      "La del domicilio del actor",
      "La del último domicilio conyugal",
      "La del domicilio del demandado",
      "La del lugar donde se celebró el matrimonio"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "En juicios de alimentos o violencia familiar, ¿entre qué jurisdicciones puede elegir el actor?",
    opciones: [
      "Solo la del domicilio del demandado",
      "La del domicilio del acreedor alimentario/receptor de violencia o la del demandado",
      "Solo la del domicilio del actor",
      "La del lugar donde se cometió la violencia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional es competente cuando el demandado es indígena o afromexicano?",
    opciones: [
      "La del domicilio del actor",
      "La del lugar donde el demandado tenga su domicilio",
      "La que elija el actor",
      "La del lugar de los hechos"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional conoce de los interdictos?",
    opciones: [
      "La del domicilio del actor",
      "La del domicilio del demandado",
      "La de la ubicación del bien",
      "La que elijan las partes"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional conoce de la reconvención?",
    opciones: [
      "Una autoridad jurisdiccional distinta",
      "La que conoce de la demanda en el juicio principal",
      "La del domicilio del reconviniente",
      "La del lugar del contrato"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional conoce de las tercerías?",
    opciones: [
      "Una autoridad jurisdiccional independiente",
      "La competente para conocer del asunto principal",
      "La del domicilio del tercero",
      "La que designe el juez"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional es competente para los actos preparatorios del juicio?",
    opciones: [
      "Cualquier juez",
      "La que lo fuere para el procedimiento principal",
      "La del domicilio del actor",
      "La del lugar del acto"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional es competente para dictar medidas cautelares cuando el expediente está en segunda instancia?",
    opciones: [
      "El tribunal de segunda instancia",
      "La autoridad jurisdiccional que conoció en primera instancia",
      "Cualquier juez",
      "La Suprema Corte"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "En asuntos familiares urgentes, ¿qué autoridad jurisdiccional puede dictar medidas cautelares?",
    opciones: [
      "Solo la de primera instancia",
      "La de segunda instancia con plenitud de jurisdicción",
      "Solo la Suprema Corte",
      "El Ministerio Público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué autoridad jurisdiccional puede dictar medidas cautelares en caso de urgencia?",
    opciones: [
      "Solo la competente para el juicio principal",
      "La del lugar donde se hallen la persona o el bien objeto de la providencia",
      "Solo el tribunal superior",
      "El Ministerio Público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cómo pueden promoverse las contiendas sobre competencia?",
    opciones: [
      "Solo por inhibitoria",
      "Solo por declinatoria",
      "Por inhibitoria o por declinatoria",
      "Por vía de hecho"
    ],
    correcta: 2,
    dificultad: 2
  },
  {
    texto: "¿Ante quién se intenta la inhibitoria?",
    opciones: [
      "Ante el juez incompetente",
      "Ante la autoridad jurisdiccional a quien se considere competente",
      "Ante el tribunal superior",
      "Ante el Ministerio Público"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Ante quién se propondrá la declinatoria?",
    opciones: [
      "Ante el juez competente",
      "Ante la autoridad jurisdiccional a quien se considere que carece de competencia legal",
      "Ante el tribunal superior",
      "Ante el Pleno Regional"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿En qué momento debe proponerse la declinatoria?",
    opciones: [
      "En cualquier momento del juicio",
      "Al contestar la demanda",
      "Después de la audiencia preliminar",
      "Antes de la sentencia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿En cuántos días debe resolver la autoridad jurisdiccional de segunda instancia la competencia?",
    opciones: [
      "3 días",
      "5 días",
      "10 días",
      "15 días"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre si las partes no ofrecen prueba y no formulan alegatos en la cuestión de competencia?",
    opciones: [
      "Se desecha la competencia",
      "La autoridad jurisdiccional citará para resolución dentro de cinco días",
      "Se archiva el asunto",
      "Se devuelve al juez de primera instancia"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué plazo tiene la autoridad jurisdiccional requerida para resolver si acepta o no la inhibitoria?",
    opciones: [
      "3 días",
      "5 días",
      "9 días",
      "15 días"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Qué ocurre si no se promueve cuestión de competencia dentro de los términos señalados?",
    opciones: [
      "Se puede promover después",
      "Se considera sometida a la autoridad jurisdiccional que emplazó y se pierde todo derecho",
      "El juez debe promoverla de oficio",
      "Se declara la nulidad"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Las cuestiones de competencia suspenden el procedimiento principal?",
    opciones: [
      "Sí, siempre",
      "No, en ningún caso suspenden el procedimiento principal",
      "Sí, solo las de territorio",
      "Depende del juez"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo se desechará de plano la declinatoria?",
    opciones: [
      "Siempre que se promueva",
      "Si por documentos aparece que la parte promovente se ha sometido a la jurisdicción",
      "Si se promueve después de la contestación",
      "Si no se pagan costas"
    ],
    correcta: 1,
    dificultad: 2
  },
  {
    texto: "¿Cuándo deben inhibirse las autoridades jurisdiccionales de oficio?",
    opciones: [
      "En cualquier momento del juicio",
      "Cuando se trate de competencias por razón de territorio, materia, salvo artículo 83, y siempre que se inhiban en el primer proveído",
      "Nunca pueden inhibirse de oficio",
      "Solo si lo solicita el actor"
    ],
    correcta: 1,
    dificultad: 2
  }
];

// FUNCIÓN PARA SUBIR
async function subirPreguntas() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📤 SUBIENDO 166 PREGUNTAS A FASE CLASIFICACIÓN');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    console.log('✅ Autenticado correctamente\n');
    
    const batch = writeBatch(db);
    let count = 0;
    
    for (const pregunta of preguntasClasificacion) {
      const docRef = doc(collection(db, 'preguntas_clasificacion'));
      batch.set(docRef, {
        texto: pregunta.texto,
        opciones: pregunta.opciones,
        correcta: pregunta.correcta,
        dificultad: pregunta.dificultad,
        fecha_subida: new Date().toISOString()
      });
      count++;
    }
    
    await batch.commit();
    
    console.log(`✅ SUBIDAS EXITOSAMENTE: ${count} preguntas a preguntas_clasificacion`);
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🎉 PROCESO COMPLETADO');
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

subirPreguntas();