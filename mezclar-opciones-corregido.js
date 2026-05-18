// mezclar-opciones-corregido.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, doc } = require('firebase/firestore');
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

// Función para mezclar opciones manteniendo la correcta
function mezclarOpciones(pregunta) {
  const opcionesOriginales = [...pregunta.opciones];
  const correctaOriginal = pregunta.correcta;
  const textoCorrecto = opcionesOriginales[correctaOriginal];
  
  // Crear array de pares [texto, esCorrecta]
  const opcionesConFlag = opcionesOriginales.map((texto, idx) => ({
    texto,
    esCorrecta: idx === correctaOriginal
  }));
  
  // Mezclar aleatoriamente
  for (let i = opcionesConFlag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opcionesConFlag[i], opcionesConFlag[j]] = [opcionesConFlag[j], opcionesConFlag[i]];
  }
  
  // Extraer opciones mezcladas y nueva posición correcta
  const nuevasOpciones = opcionesConFlag.map(item => item.texto);
  const nuevaCorrecta = opcionesConFlag.findIndex(item => item.esCorrecta);
  
  return {
    opciones: nuevasOpciones,
    correcta: nuevaCorrecta
  };
}

async function mezclarTodasLasOpciones() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 MEZCLANDO OPCIONES DE TODAS LAS PREGUNTAS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    console.log('✅ Autenticado correctamente\n');
    
    const colecciones = ['preguntas_clasificacion', 'preguntas_grupos', 'preguntas_eliminatorias', 'preguntas_final'];
    let totalMezcladas = 0;
    
    for (const coleccion of colecciones) {
      const snapshot = await getDocs(collection(db, coleccion));
      console.log(`📖 Procesando ${coleccion}: ${snapshot.docs.length} preguntas`);
      
      if (snapshot.docs.length === 0) {
        console.log(`   ⚠️ No hay preguntas en ${coleccion}\n`);
        continue;
      }
      
      // Crear un nuevo batch para esta colección
      let batch = writeBatch(db);
      let count = 0;
      let batchCount = 0;
      
      for (const docSnap of snapshot.docs) {
        const pregunta = docSnap.data();
        const { opciones, correcta } = mezclarOpciones(pregunta);
        
        batch.update(docSnap.ref, {
          opciones: opciones,
          correcta: correcta
        });
        count++;
        batchCount++;
        totalMezcladas++;
        
        // Firestore permite max 500 operaciones por batch
        if (batchCount >= 500) {
          await batch.commit();
          console.log(`   📦 Commiteado batch de ${batchCount} preguntas`);
          batch = writeBatch(db); // Crear nuevo batch
          batchCount = 0;
        }
      }
      
      // Commitear el último batch si tiene operaciones pendientes
      if (batchCount > 0) {
        await batch.commit();
        console.log(`   📦 Commiteado batch final de ${batchCount} preguntas`);
      }
      
      console.log(`   ✅ Mezcladas ${count} preguntas en ${coleccion}\n`);
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🎉 TOTAL DE PREGUNTAS MEZCLADAS: ${totalMezcladas}`);
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

mezclarTodasLasOpciones();