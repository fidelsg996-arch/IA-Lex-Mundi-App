// limpiar_y_subir.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } = require('firebase/firestore');
const fs = require('fs');

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

const COLECCION = "preguntas_clasificacion";
const ARCHIVO = "preguntas_cnpc yf.json";

async function limpiarYSubir() {
  console.log("🗑️ Eliminando preguntas existentes...");
  
  // 1. Eliminar todas las preguntas existentes
  const snapshot = await getDocs(collection(db, COLECCION));
  let eliminadas = 0;
  
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, COLECCION, docSnap.id));
    eliminadas++;
    console.log(`🗑️ Eliminada: ${docSnap.id}`);
  }
  
  console.log(`✅ Eliminadas ${eliminadas} preguntas viejas\n`);
  
  // 2. Subir las nuevas preguntas del CNPCyF
  console.log("📖 Leyendo archivo de preguntas correctas...");
  const preguntas = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
  console.log(`📝 Total de nuevas preguntas: ${preguntas.length}\n`);
  
  let subidas = 0;
  
  for (let i = 0; i < preguntas.length; i++) {
    try {
      const pregunta = {
        ...preguntas[i],
        creada: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, COLECCION), pregunta);
      console.log(`✅ [${i+1}/${preguntas.length}] ${docRef.id}`);
      subidas++;
    } catch (error) {
      console.error(`❌ Error en ${i+1}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`🗑️ Eliminadas: ${eliminadas}`);
  console.log(`✅ Subidas: ${subidas}`);
  console.log(`🎉 Proceso completado!`);
}

limpiarYSubir();