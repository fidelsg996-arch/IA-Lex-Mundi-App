const mongoose = require('mongoose');

const uri = "mongodb+srv://admin_user:diug9buHDvrc2EMe@cluster0.qx6ez3t.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
    console.log("Base de datos:", mongoose.connection.db.databaseName);
    
    // Prueba de inserción
    const db = mongoose.connection.db;
    db.collection('test').insertOne({ 
      mensaje: "Conexión exitosa", 
      fecha: new Date(),
      usuario: "admin_user"
    })
    .then(() => {
      console.log("✅ Documento de prueba insertado");
      mongoose.connection.close();
    })
    .catch(err => console.error("❌ Error al insertar:", err));
  })
  .catch(err => console.error("❌ Error de conexión:", err));