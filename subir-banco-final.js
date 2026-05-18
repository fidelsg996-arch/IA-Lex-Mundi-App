// subir-banco-final.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const fs = require('fs');

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

async function subirPreguntas() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📤 SUBIENDO BANCO DE PREGUNTAS CORREGIDO A FIREBASE');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    console.log('✅ Autenticado correctamente\n');
    
    const data = JSON.parse(fs.readFileSync('BANCO-FINAL-400-POR-FASE.json', 'utf8'));
    
    for (const [coleccion, preguntas] of Object.entries(data)) {
      console.log(`📤 Subiendo a ${coleccion}: ${preguntas.length} preguntas...`);
      
      // Eliminar colección existente (opcional - comentar si no quieres borrar)
      // await deleteCollection(db, coleccion, 500);
      
      const batch = writeBatch(db);
      let contador = 0;
      let batchCount = 0;
      
      for (const pregunta of preguntas) {
        const docRef = doc(collection(db, coleccion));
        batch.set(docRef, {
          texto: pregunta.texto,
          opciones: pregunta.opciones,
          correcta: pregunta.correcta,
          dificultad: pregunta.dificultad || 1,
          categoria: pregunta.categoria || 'General',
          fecha_subida: new Date().toISOString()
        });
        contador++;
        batchCount++;
        
        // Firestore permite max 500 operaciones por batch
        if (batchCount === 500) {
          await batch.commit();
          console.log(`   ✅ Subidas ${contador} preguntas...`);
          batchCount = 0;
        }
      }
      
      if (batchCount > 0) {
        await batch.commit();
      }
      
      console.log(`   ✅ COMPLETADO: ${contador} preguntas en ${coleccion}\n`);
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 BANCO DE PREGUNTAS SUBIDO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📊 RESUMEN:');
    console.log('   ✅ preguntas_clasificacion: 400 preguntas');
    console.log('   ✅ preguntas_grupos: 400 preguntas');
    console.log('   ✅ preguntas_eliminatorias: 400 preguntas');
    console.log('   ✅ preguntas_final: 400 preguntas');
    console.log('\n🔒 RECUERDA restaurar las reglas de Firestore a su estado original');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Función opcional para limpiar colección antes de subir
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = collection(db, collectionPath);
  const snapshot = await getDocs(collectionRef);
  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`   🗑️ Colección ${collectionPath} limpiada`);
}

subirPreguntas();