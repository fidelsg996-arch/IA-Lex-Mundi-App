const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const preguntasAEliminar = [
  "En la práctica del CNPCyF, ¿en qué momento procesal debe el Ministerio Público interponer apelación de manera ordinaria?",
  "En la práctica del CNPCyF, ¿en qué momento procesal debe el testigo promover un incidente de manera ordinaria?",
  "¿Qué es la prueba confesional? (Fase eliminatorias)",
  "En la práctica del CNPCyF, ¿en qué momento procesal debe el juez recusar al juez de manera ordinaria?",
  "En la práctica del CNPCyF, ¿en qué momento procesal debe el testigo formular alegatos de manera ordinaria?",
  "En la práctica del CNPCyF, ¿en qué momento procesal debe el juez desahogar la vista de manera ordinaria?",
  "En la práctica del CNPCyF, ¿en qué momento procesal debe el Ministerio Público promover un incidente de manera ordinaria?"
];

async function eliminarPreguntas() {
  console.log('🔍 Buscando preguntas incorrectas...\n');
  
  const colecciones = [
    'preguntas_clasificacion',
    'preguntas_grupos', 
    'preguntas_eliminatorias',
    'preguntas'
  ];
  
  let totalEliminadas = 0;
  
  for (const coleccion of colecciones) {
    console.log(`📁 Revisando colección: ${coleccion}`);
    
    const snapshot = await db.collection(coleccion).limit(1).get();
    if (snapshot.empty) {
      console.log(`   ⏭️ Colección vacía o no existe\n`);
      continue;
    }
    
    for (const preguntaTexto of preguntasAEliminar) {
      try {
        const querySnapshot = await db.collection(coleccion)
          .where('texto', '==', preguntaTexto)
          .get();
        
        if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
            await doc.ref.delete();
            console.log(`   ✅ Eliminada: "${preguntaTexto.substring(0, 60)}..."`);
            totalEliminadas++;
          }
        }
      } catch (error) {
        console.log(`   ❌ Error con: ${preguntaTexto.substring(0, 40)}...`);
      }
    }
    console.log('');
  }
  
  console.log(`\n✅ Proceso completado. Total de preguntas eliminadas: ${totalEliminadas}`);
  process.exit(0);
}

eliminarPreguntas().catch(console.error);