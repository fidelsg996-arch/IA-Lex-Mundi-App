// uploadPreguntasAuth.js
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

// 🔥 CAMBIA ESTOS DATOS POR TU EMAIL Y CONTRASEÑA DE ADMIN 🔥
const ADMIN_EMAIL = "tucorreo@example.com";  // ⚠️ CAMBIA ESTO
const ADMIN_PASSWORD = "tucontraseña";       // ⚠️ CAMBIA ESTO

// Preguntas para subir (solo 3 para probar)
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
    texto: "¿Qué son los 'Ajustes de Procedimiento' según el artículo 2 del CNPCyF?",
    opciones: [
      "Modificaciones para facilitar el desempeño de personas en situación de vulnerabilidad",
      "Cambios en los plazos procesales",
      "Modificaciones a las reglas de competencia",
      "Ajustes a las costas judiciales"
    ],
    correcta: 0,
    creada: new Date().toISOString()
  }
];

async function subirPreguntas() {
  try {
    // 1. Autenticarse con Firebase
    console.log("🔐 Iniciando sesión como admin...");
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log(`✅ Sesión iniciada: ${userCredential.user.email}`);
    
    // 2. Subir preguntas
    console.log("\n🚀 Subiendo preguntas a Firestore...");
    console.log(`📝 Total: ${preguntasClasificacion.length}`);
    
    let subidas = 0;
    let errores = 0;
    
    for (let i = 0; i < preguntasClasificacion.length; i++) {
      try {
        const docRef = await addDoc(collection(db, "preguntas_clasificacion"), preguntasClasificacion[i]);
        console.log(`✅ [${i + 1}/${preguntasClasificacion.length}] ${docRef.id}`);
        subidas++;
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        errores++;
      }
    }
    
    console.log("\n📊 RESUMEN:");
    console.log(`✅ Exitosas: ${subidas}`);
    console.log(`❌ Fallidas: ${errores}`);
    
  } catch (error) {
    console.error("❌ Error de autenticación:", error.message);
    console.log("\n💡 Soluciones:");
    console.log("1. Verifica que el email y contraseña sean correctos");
    console.log("2. Asegúrate que el usuario tenga rol de 'admin' en Firebase");
  }
}

subirPreguntas();