// subir_preguntas_grupos.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCNnqCNKHG7pDwvjYa4AxuVPRC9gMvllVg",
  authDomain: "ia-lex-mundi-90c11.firebaseapp.com",
  projectId: "ia-lex-mundi-90c11",
  storageBucket: "ia-lex-mundi-90c11.firebasestorage.app",
  messagingSenderId: "323596660830",
  appId: "1:323596660830:web:51e4454311570480ccc4cf",
  measurementId: "G-DRN37TXMJB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const preguntasGrupos = [
  {
    texto: "¿Cuál es el plazo para contestar una demanda en un juicio oral?",
    opciones: ["9 días", "15 días", "10 días", "20 días"],
    correcta: 0
  },
  {
    texto: "¿Qué sucede si el demandado no contesta la demanda en el plazo establecido?",
    opciones: [
      "Se le declara en rebeldía y se tienen por contestados los hechos en sentido negativo",
      "El juicio se da por terminado",
      "Se le impone una multa",
      "Se le concede una prórroga"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué plazo tiene la parte actora para ofrecer pruebas?",
    opciones: ["3 días", "5 días", "10 días", "15 días"],
    correcta: 0
  },
  {
    texto: "¿En qué etapa de la audiencia preliminar se admite la conciliación?",
    opciones: ["Segunda etapa", "Primera etapa", "Tercera etapa", "Cuarta etapa"],
    correcta: 0
  },
  {
    texto: "¿Qué es la depuración del procedimiento en la audiencia preliminar?",
    opciones: [
      "Examinar cuestiones de legitimación procesal y desahogo de excepciones",
      "Admitir pruebas",
      "Conciliar a las partes",
      "Dictar sentencia"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué pruebas se admiten en materia familiar según el CNPCyF?",
    opciones: [
      "Documental, testimonial, pericial, confesional e inspección judicial",
      "Solo documental",
      "Solo testimonial",
      "Solo pericial"
    ],
    correcta: 0
  },
  {
    texto: "¿Quién debe presentar a los testigos en el juicio oral?",
    opciones: [
      "La parte que los ofrece",
      "El juez",
      "El Ministerio Público",
      "La contraparte"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué pasa si la parte no presenta a sus testigos en la audiencia?",
    opciones: [
      "Se declara desierta la prueba",
      "Se concede una prórroga",
      "Se cita para nueva fecha",
      "Se multa al abogado"
    ],
    correcta: 0
  },
  {
    texto: "¿Cuándo procede la prueba pericial?",
    opciones: [
      "Cuando se requieren conocimientos especiales en ciencia, arte o técnica",
      "Siempre",
      "Nunca",
      "Solo si lo pide el juez"
    ],
    correcta: 0
  },
  {
    texto: "¿Cuántos peritos puede designar cada parte en un juicio oral civil?",
    opciones: [
      "Uno por cada parte",
      "Dos por cada parte",
      "Tres por cada parte",
      "El que cada parte quiera"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué pasa si los dictámenes periciales son contradictorios?",
    opciones: [
      "Se designa un perito tercero en discordia",
      "Gana el del actor",
      "Gana el del demandado",
      "Se desechan ambos"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué son las medidas cautelares en el CNPCyF?",
    opciones: [
      "Providencias para asegurar bienes o personas durante el juicio",
      "Sentencias definitivas",
      "Recursos",
      "Excepciones"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué providencia precautoria impide que el demandado se ausente?",
    opciones: [
      "Radicación de persona",
      "Retención de bienes",
      "Aseguramiento",
      "Embargo"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué plazo tiene el actor para presentar su demanda después de una providencia precautoria?",
    opciones: ["15 días", "5 días", "10 días", "30 días"],
    correcta: 0
  },
  {
    texto: "¿Cuál es el plazo para interponer el recurso de apelación contra sentencia definitiva?",
    opciones: ["9 días", "5 días", "15 días", "3 días"],
    correcta: 0
  },
  {
    texto: "¿Cuál es el plazo para apelar una sentencia interlocutoria?",
    opciones: ["5 días", "9 días", "3 días", "10 días"],
    correcta: 0
  },
  {
    texto: "¿En qué efecto se admite la apelación contra sentencia definitiva?",
    opciones: ["En ambos efectos", "Solo devolutivo", "Solo suspensivo", "En ningún efecto"],
    correcta: 0
  },
  {
    texto: "¿Quién puede apelar una resolución judicial?",
    opciones: [
      "Las partes que sufran agravio",
      "Cualquier persona",
      "Solo el Ministerio Público",
      "Solo el abogado"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué medidas puede dictar el juez en un juicio de alimentos?",
    opciones: [
      "Pensión alimenticia provisional y embargo de bienes",
      "Solo citar al demandado",
      "Solo pedir informes",
      "Ninguna medida"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué plazo tiene el deudor alimentario para cumplir con la pensión alimenticia provisional?",
    opciones: ["Inmediato", "3 días", "5 días", "10 días"],
    correcta: 0
  },
  {
    texto: "¿Qué pasa si el deudor alimentario no paga la pensión provisional?",
    opciones: [
      "Se ordena el embargo de sus bienes",
      "Solo se le apercibe",
      "Se le da un nuevo plazo",
      "No pasa nada"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué autoridad jurisdiccional es competente en un juicio de divorcio?",
    opciones: [
      "La del último domicilio conyugal",
      "La del domicilio del demandado",
      "La del lugar donde se celebró el matrimonio",
      "La Federal"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué autoridad es competente en un juicio de alimentos?",
    opciones: [
      "La del domicilio del acreedor alimentario",
      "La del domicilio del deudor",
      "La del lugar del convenio",
      "La Federal"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué es el interés superior de la niñez en el CNPCyF?",
    opciones: [
      "Hacer prevalecer los derechos de niñas, niños y adolescentes",
      "Dar preferencia económica a los niños",
      "Dar trato especial solo a los menores",
      "Eximirles de responsabilidades"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué debe hacer el juez en casos de violencia familiar según el CNPCyF?",
    opciones: [
      "Dictar órdenes de protección inmediatas",
      "Citar a conciliación",
      "Turnar a otra autoridad",
      "Desechar la denuncia"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué son las órdenes de protección en materia familiar?",
    opciones: [
      "Medidas para salvaguardar a víctimas de violencia",
      "Multas",
      "Arrestos",
      "Citaciones"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué plazo tiene el juez para fijar pensión alimenticia provisional?",
    opciones: [
      "Al día siguiente de recibir la solicitud",
      "3 días",
      "5 días",
      "10 días"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué documentos se necesitan para iniciar un juicio sucesorio?",
    opciones: [
      "Acta de defunción y testamento o denuncia de herederos",
      "Solo acta de defunción",
      "Solo testamento",
      "Acta de nacimiento del difunto"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué plazo tiene el albacea para aceptar su cargo?",
    opciones: ["3 días", "5 días", "10 días", "15 días"],
    correcta: 0
  },
  {
    texto: "¿Qué garantía debe otorgar el albacea?",
    opciones: [
      "Garantía suficiente a juicio del juez",
      "Fianza de un tercero",
      "Depósito en efectivo",
      "No requiere garantía"
    ],
    correcta: 0
  },
  {
    texto: "¿Qué sucede si no hay testamento en una sucesión?",
    opciones: [
      "Se tramita sucesión intestamentaria",
      "Los bienes pasan al Estado",
      "Se suspende el juicio",
      "Se abre testamento"
    ],
    correcta: 0
  },
  {
    texto: "¿Quiénes son herederos en una sucesión intestamentaria?",
    opciones: [
      "Cónyuge, hijos, ascendientes y colaterales hasta 4° grado",
      "Solo hijos",
      "Solo cónyuge",
      "Cualquier familiar"
    ],
    correcta: 0
  }
];

async function subirPreguntas() {
  console.log(`📤 Subiendo ${preguntasGrupos.length} preguntas a 'preguntas_grupos'...`);
  
  let subidas = 0;
  for (let i = 0; i < preguntasGrupos.length; i++) {
    try {
      await addDoc(collection(db, "preguntas_grupos"), {
        ...preguntasGrupos[i],
        creada: new Date().toISOString()
      });
      console.log(`✅ [${i+1}/${preguntasGrupos.length}] Pregunta subida`);
      subidas++;
    } catch (error) {
      console.error(`❌ Error en pregunta ${i+1}: ${error.message}`);
    }
  }
  console.log(`\n✅ Subidas exitosas: ${subidas}/${preguntasGrupos.length}`);
}

subirPreguntas();