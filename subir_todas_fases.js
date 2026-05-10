// subir_todas_fases.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');
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

// Colecciones donde se subirán las preguntas
const COLECCIONES = [
  { nombre: 'preguntas_clasificacion', fase: 'Clasificación' },
  { nombre: 'preguntas_grupos', fase: 'Grupos' },
  { nombre: 'preguntas_eliminatorias', fase: 'Eliminatorias' },
  { nombre: 'preguntas_final', fase: 'Final' }
];

// Cambia a false si NO quieres limpiar las colecciones antes de subir
const LIMPIAR_ANTES = false; // ✅ CAMBIADO A FALSE para evitar error

async function limpiarColeccion(nombreColeccion) {
  console.log(`🗑️ Limpiando colección '${nombreColeccion}'...`);
  const snapshot = await getDocs(collection(db, nombreColeccion));
  let eliminadas = 0;
  
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, nombreColeccion, docSnap.id));
    eliminadas++;
  }
  console.log(`✅ Eliminados ${eliminadas} documentos de '${nombreColeccion}'`);
  return eliminadas;
}

async function subirPreguntas() {
  console.log("📖 Leyendo archivo preguntas_cnpc yf.json...");
  
  // Leer el archivo JSON
  let preguntas;
  try {
    const data = fs.readFileSync('preguntas_cnpc yf.json', 'utf8');
    preguntas = JSON.parse(data);
    console.log(`✅ Archivo leído. Total de preguntas: ${preguntas.length}\n`);
  } catch (error) {
    console.error(`❌ Error leyendo archivo: ${error.message}`);
    console.log("💡 Asegúrate que el archivo 'preguntas_cnpc yf.json' existe en la carpeta actual");
    return;
  }

  for (const coleccion of COLECCIONES) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📚 PROCESANDO FASE: ${coleccion.fase} (${coleccion.nombre})`);
    console.log(`${'='.repeat(50)}`);
    
    // Limpiar colección solo si está configurado
    if (LIMPIAR_ANTES) {
      await limpiarColeccion(coleccion.nombre);
    }
    
    // Subir preguntas
    let subidas = 0;
    let errores = 0;
    
    for (let i = 0; i < preguntas.length; i++) {
      try {
        const preguntaData = {
          texto: preguntas[i].texto,
          opciones: preguntas[i].opciones,
          correcta: preguntas[i].correcta,
          creada: new Date().toISOString(),
          fase: coleccion.fase
        };
        await addDoc(collection(db, coleccion.nombre), preguntaData);
        subidas++;
        
        // Mostrar progreso cada 50 preguntas
        if ((i + 1) % 50 === 0) {
          console.log(`  📝 Progreso: ${i + 1}/${preguntas.length}`);
        }
      } catch (error) {
        console.error(`  ❌ Error en pregunta ${i + 1}: ${error.message}`);
        errores++;
      }
    }
    
    console.log(`\n📊 RESUMEN FASE ${coleccion.fase}:`);
    console.log(`  ✅ Subidas: ${subidas}`);
    console.log(`  ❌ Fallidas: ${errores}`);
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log("🎉 ¡PROCESO COMPLETADO!");
  console.log(`📝 Se subieron las preguntas a ${COLECCIONES.length} fases`);
  console.log(`${'='.repeat(50)}`);
}

subirPreguntas();