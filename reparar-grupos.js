// reparar-grupos.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs, query, where, deleteDoc } = require('firebase/firestore');
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

const NOMBRES_RIVALES = ["Ana Rodríguez", "Carlos Méndez", "Laura Fernández"];

async function repararGrupos() {
  try {
    await signInWithEmailAndPassword(auth, authConfig.email, authConfig.password);
    const user = auth.currentUser;
    console.log("✅ Autenticado:", user.email);
    console.log("UID:", user.uid);
    
    const torneoId = "torneo_principal";
    const grupo = "A";
    
    // 1. Eliminar duelos existentes
    const duelosQuery = query(collection(db, "duelos_grupos"), where("usuarioId", "==", user.uid));
    const duelosExistentes = await getDocs(duelosQuery);
    for (const docSnap of duelosExistentes.docs) {
      await deleteDoc(docSnap.ref);
    }
    console.log("🗑️ Eliminados duelos existentes:", duelosExistentes.docs.length);
    
    // 2. Crear/Actualizar participante con grupo
    const participanteRef = doc(db, "participantes_torneo", user.uid);
    await setDoc(participanteRef, {
      id: user.uid,
      nombre: user.displayName || user.email,
      email: user.email,
      torneoId: torneoId,
      grupo: grupo,
      fase: "grupos",
      puntajeTotal: 0,
      victorias: 0,
      partidosJugados: 0,
      fechaActualizacion: new Date().toISOString()
    }, { merge: true });
    console.log("✅ Participante actualizado con grupo:", grupo);
    
    // 3. Crear nuevos duelos
    for (let i = 0; i < NOMBRES_RIVALES.length; i++) {
      const rival = NOMBRES_RIVALES[i];
      const iniciales = rival.split(" ").map(n => n[0]).join("");
      const dueloId = "duelo_" + user.uid + "_" + Date.now() + "_" + i;
      
      await setDoc(doc(db, "duelos_grupos", dueloId), {
        id: dueloId,
        torneoId: torneoId,
        grupo: grupo,
        usuarioId: user.uid,
        usuarioNombre: user.displayName || user.email,
        rivalNombre: rival,
        rivalAvatar: "https://ui-avatars.com/api/?name=" + iniciales + "&background=6B7280&color=fff&rounded=true&size=128",
        orden: i,
        completado: false,
        ganado: false,
        puntosUsuario: 0,
        puntosRival: 0,
        fecha: null
      });
      console.log("✅ Duelo creado:", i+1, "vs", rival);
    }
    
    console.log("\n🎉 REPARACIÓN COMPLETADA");
    console.log("🔄 Ahora recarga la página del torneo");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

repararGrupos();