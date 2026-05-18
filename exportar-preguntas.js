// exportar-preguntas.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const fs = require('fs');

// 🔥 TU CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCNnqCNKHG7pDwvjYa4AxuVPRC9gMvllVg",
  authDomain: "ia-lex-mundi-90c11.firebaseapp.com",
  projectId: "ia-lex-mundi-90c11",
  storageBucket: "ia-lex-mundi-90c11.firebasestorage.app",
  messagingSenderId: "323596660830",
  appId: "1:323596660830:web:51e4454311570480ccc4cf",
  measurementId: "G-DRN37TXMJB"
};

// 🔐 CREDENCIALES DE USUARIO - CONTRASEÑA ACTUALIZADA
const authConfig = {
  email: "fidelsg996@gmail.com",
  password: "Segf@8005"
};

// 📚 NOMBRES DE COLECCIONES A BUSCAR
const colecciones = [
  'preguntas_clasificacion',
  'preguntas_grupos', 
  'preguntas_eliminatorias',
  'preguntas_final'
];

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function exportarTodasLasPreguntas() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     EXPORTADOR DE PREGUNTAS - FIREBASE');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    // 1. Autenticar usuario
    console.log('🔐 Autenticando usuario:', authConfig.email);
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    console.log('✅ Autenticación exitosa!\n');
    
    console.log(`📡 Conectado a proyecto: ${firebaseConfig.projectId}\n`);
    
    const todasLasPreguntas = {};
    let totalGeneral = 0;
    
    // 2. Recorrer cada colección
    for (const coleccion of colecciones) {
      console.log(`📖 Leyendo colección: ${coleccion}...`);
      
      try {
        const querySnapshot = await getDocs(collection(db, coleccion));
        const preguntas = [];
        
        querySnapshot.forEach((doc) => {
          preguntas.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        todasLasPreguntas[coleccion] = {
          total: preguntas.length,
          preguntas: preguntas
        };
        
        totalGeneral += preguntas.length;
        console.log(`   ✅ ${preguntas.length} preguntas encontradas`);
        
        // Mostrar preview de las primeras preguntas
        if (preguntas.length > 0) {
          console.log(`\n   📝 PREVIEW (primeras 3 preguntas):`);
          preguntas.slice(0, 3).forEach((p, idx) => {
            console.log(`\n   ┌─ Pregunta ${idx + 1}`);
            console.log(`   │ 📌 Texto: ${p.texto?.substring(0, 80)}${p.texto?.length > 80 ? '...' : ''}`);
            if (p.opciones && Array.isArray(p.opciones)) {
              console.log(`   │ 🔘 Opciones:`);
              p.opciones.forEach((opt, optIdx) => {
                const esCorrecta = optIdx === p.correcta;
                console.log(`   │    ${optIdx + 1}. ${opt} ${esCorrecta ? '✓' : ''}`);
              });
            }
            console.log(`   │ ✅ Correcta: ${p.correcta !== undefined ? p.correcta + 1 : 'No definida'}`);
            console.log(`   └─`);
          });
          console.log('');
        } else {
          console.log(`   ⚠️ No hay preguntas en esta colección\n`);
        }
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        todasLasPreguntas[coleccion] = {
          total: 0,
          error: error.message,
          preguntas: []
        };
      }
    }
    
    // 3. Guardar archivo JSON
    const outputFile = 'preguntas-firebase-export.json';
    fs.writeFileSync(outputFile, JSON.stringify(todasLasPreguntas, null, 2));
    
    // 4. Mostrar resumen final
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 RESUMEN FINAL');
    console.log('═══════════════════════════════════════════════════════════');
    for (const [key, value] of Object.entries(todasLasPreguntas)) {
      const estado = value.error ? `❌ Error: ${value.error}` : `✅ ${value.total} preguntas`;
      console.log(`   ${key}: ${estado}`);
    }
    console.log(`\n   📦 TOTAL GENERAL: ${totalGeneral} preguntas`);
    console.log(`\n📁 Archivo guardado: ${outputFile}`);
    console.log(`📍 Ruta completa: ${__dirname}\\${outputFile}`);
    console.log('\n═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n💡 POSIBLES SOLUCIONES:');
    console.log('   1. Verifica que la contraseña sea correcta');
    console.log('   2. En Firebase Console → Authentication → Users, verifica que el email existe');
    console.log('   3. En Firebase Console → Firestore Database → Rules, cambia a: allow read, write: if true;');
    console.log('   4. Verifica que las colecciones existan con los nombres correctos');
  }
}

// Ejecutar
exportarTodasLasPreguntas();