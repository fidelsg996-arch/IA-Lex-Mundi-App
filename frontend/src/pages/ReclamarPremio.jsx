import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ReclamarPremio = () => {
  const { user } = useAuth();
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [premioInfo, setPremioInfo] = useState(null);
  const [yaReclamado, setYaReclamado] = useState(false);

  useEffect(() => {
    const cargarInfo = async () => {
      const torneoSnap = await getDoc(doc(db, "torneos", "torneo_agrario"));
      if (torneoSnap.exists()) {
        setPremioInfo(torneoSnap.data().premio);
      }
      
      if (user) {
        const reclamacionSnap = await getDoc(doc(db, "premios_reclamados", `${user.uid}_torneo_agrario`));
        if (reclamacionSnap.exists()) {
          setYaReclamado(true);
          setMensaje("✅ Ya has reclamado tu premio. Revisa tu correo.");
        }
      }
    };
    cargarInfo();
  }, [user]);

  const reclamarPremio = async () => {
    if (!user) {
      setMensaje("❌ Debes iniciar sesión para reclamar el premio");
      return;
    }
    
    if (yaReclamado) {
      setMensaje("❌ Ya has reclamado tu premio anteriormente");
      return;
    }
    
    if (codigo !== "AGRARIA2026") {
      setMensaje("❌ Código incorrecto. El código es: AGRARIA2026");
      return;
    }
    
    setLoading(true);
    
    try {
      const participanteRef = doc(db, "participantes_torneo", `torneo_agrario_${user.uid}`);
      const participanteSnap = await getDoc(participanteRef);
      const esCampeon = participanteSnap.exists() && participanteSnap.data().esCampeon === true;
      
      if (!esCampeon) {
        setMensaje("❌ Solo el campeón del torneo puede reclamar este premio");
        setLoading(false);
        return;
      }
      
      await setDoc(doc(db, "premios_reclamados", `${user.uid}_torneo_agrario`), {
        usuarioId: user.uid,
        usuarioEmail: user.email,
        usuarioNombre: participanteSnap.data()?.usuarioNombre || user.displayName,
        premio: premioInfo?.nombre || "Guía y Modelos en Materia Agraria",
        codigoUsado: codigo,
        fechaReclamacion: new Date().toISOString(),
        estado: "entregado"
      });
      
      setMensaje("✅ ¡Felicidades! Has reclamado tu libro. Revisa tu correo para los detalles de entrega.");
      setYaReclamado(true);
      
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Error al reclamar el premio. Contacta al administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">🏆 Reclamar Premio 🏆</h1>
          <p className="opacity-90 mt-1">Ingresa tu código de campeón</p>
        </div>
        
        <div className="p-6">
          {premioInfo && (
            <div className="bg-amber-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-600">Premio del Torneo Agrario</p>
              <p className="font-bold text-lg text-amber-700">{premioInfo.nombre}</p>
              <p className="text-xs text-gray-500 mt-1">{premioInfo.descripcion}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Código de campeón</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ingresa tu código"
              className="w-full p-3 border rounded-lg text-center text-xl font-mono"
              disabled={loading || yaReclamado}
            />
            <p className="text-xs text-gray-400 mt-1">El código es: AGRARIA2026</p>
          </div>
          
          {mensaje && (
            <div className={`p-3 rounded-lg mb-4 text-center ${mensaje.includes("✅") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensaje}
            </div>
          )}
          
          <button
            onClick={reclamarPremio}
            disabled={loading || yaReclamado}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-bold hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? 'Procesando...' : yaReclamado ? '✅ Premio reclamado' : '🎁 Reclamar Premio'}
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            El libro será enviado a tu correo electrónico registrado
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReclamarPremio;