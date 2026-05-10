// crear_usuario.js
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

const UID = "TzGkbmKHZYYdAkZ4p5lbbqQNWGh1";
const EMAIL = "fidelsg996@gmail.com";

async function crearUsuario() {
  try {
    const userRef = doc(db, 'usuarios', UID);
    await setDoc(userRef, {
      uid: UID,
      email: EMAIL,
      name: "Fidel",
      role: "admin",
      plan: "free",
      activo: true,
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Usuario ${EMAIL} creado correctamente en Firestore`);
    console.log(`📝 Plan actual: free`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

crearUsuario();