// subir_libros_firestore.js
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

// Tus libros (puedes exportarlos desde librosData.js)
const libros = [
  // Aquí van TODOS tus libros (copia el array de librosIniciales)
];

async function subirLibros() {
  console.log(`📤 Subiendo ${libros.length} libros a Firestore...`);
  
  let subidos = 0;
  for (let i = 0; i < libros.length; i++) {
    try {
      await addDoc(collection(db, "libros"), {
        ...libros[i],
        creado: new Date().toISOString()
      });
      console.log(`✅ [${i+1}/${libros.length}] ${libros[i].titulo}`);
      subidos++;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  console.log(`\n✅ Subidos ${subidos}/${libros.length} libros`);
}

subirLibros();