// uploadSimple.js
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

const preguntas = [
  {
    texto: "¿Qué establece el artículo 1 del CNPCyF?",
    opciones: [
      "Las disposiciones son de orden público, interés social y observancia general",
      "Solo aplican en fuero federal",
      "Solo para materia familiar",
      "Solo para materia civil"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Cuál es el objeto del CNPCyF?",
    opciones: [
      "Regular procedimientos civiles y familiares con base en derechos humanos",
      "Regular solo materia penal",
      "Regular solo materia laboral",
      "Regular solo materia administrativa"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  },
  {
    texto: "¿Cuál es el plazo máximo para la entrada en vigor del CNPCyF?",
    opciones: [
      "1 de abril de 2027",
      "1 de enero de 2026",
      "1 de junio de 2025",
      "1 de diciembre de 2028"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  }
];

async function subir() {
  console.log("🚀 Subiendo preguntas...");
  for (let i = 0; i < preguntas.length; i++) {
    try {
      const docRef = await addDoc(collection(db, "preguntas_clasificacion"), preguntas[i]);
      console.log(`✅ ${i+1}: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  console.log("🎉 Listo!");
}

subir();