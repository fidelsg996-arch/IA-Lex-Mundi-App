import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

export const guardarSolicitudRetiro = async (usuarioId, usuarioNombre, monto, clabe, torneoId, torneoNombre) => {
  try {
    const solicitudRef = await addDoc(collection(db, 'solicitudes_retiro'), {
      usuarioId: usuarioId,
      usuarioNombre: usuarioNombre,
      monto: monto,
      clabe: clabe,
      fecha: new Date(),
      estado: 'pendiente',
      torneoId: torneoId || null,
      torneoNombre: torneoNombre || null,
      createdAt: new Date().toISOString()
    });
    console.log('✅ Solicitud guardada con ID:', solicitudRef.id);
    return { success: true, id: solicitudRef.id };
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, error: error.message };
  }
};

export const obtenerSolicitudesUsuario = async (usuarioId) => {
  try {
    const q = query(collection(db, 'solicitudes_retiro'), where('usuarioId', '==', usuarioId), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    const solicitudes = [];
    querySnapshot.forEach((doc) => solicitudes.push({ id: doc.id, ...doc.data() }));
    return solicitudes;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};