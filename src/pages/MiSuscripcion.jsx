// src/pages/MiSuscripcion.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const PLANES = [
  { id: 'free', nombre: 'Gratuito', precio: 0, periodo: 'siempre',
    caracteristicas: ['Acceso básico', 'Hasta 5 expedientes', 'Soporte email'],
    color: 'gray', colorClass: 'border-gray-300 bg-gray-50', buttonClass: 'bg-gray-500 hover:bg-gray-600', popular: false },
  { id: 'basico', nombre: 'Básico', precio: 149, periodo: 'mensual',
    caracteristicas: ['Acceso total', 'Expedientes ilimitados', 'Soporte prioritario', 'Participación en torneos'],
    color: 'blue', colorClass: 'border-blue-300 bg-blue-50', buttonClass: 'bg-blue-600 hover:bg-blue-700', popular: false },
  { id: 'pro', nombre: 'Pro', precio: 249, periodo: 'mensual',
    caracteristicas: ['Todo de Básico', 'IA avanzada', 'Exportación de datos', 'Certificados'],
    color: 'blue', colorClass: 'border-blue-400 bg-blue-50', buttonClass: 'bg-blue-700 hover:bg-blue-800', popular: true },
  { id: 'premium', nombre: 'Premium', precio: 349, periodo: 'mensual',
    caracteristicas: ['Todo de Pro', 'Asesoría legal', 'Insignia de verificación', 'Soporte telefónico'],
    color: 'yellow', colorClass: 'border-yellow-400 bg-yellow-50', buttonClass: 'bg-yellow-600 hover:bg-yellow-700', popular: false }
];

const MiSuscripcion = () => {
  const { user, updateUserPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarPlan = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, 'usuarios', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const plan = userSnap.data().plan || 'free';
            setCurrentPlan(plan);
            console.log('Plan cargado:', plan);
          } else {
            setCurrentPlan('free');
          }
        } catch (error) {
          console.error('Error cargando plan:', error);
          setCurrentPlan('free');
        }
      }
      setLoading(false);
    };
    cargarPlan();
  }, [user]);

  const handleUpgrade = async (planId) => {
    if (planId === currentPlan) {
      setMensaje(`Ya estás en el plan ${PLANES.find(p => p.id === planId)?.nombre}`);
      setTimeout(() => setMensaje(''), 3000);
      return;
    }
    
    const planNombre = PLANES.find(p => p.id === planId)?.nombre;
    const confirmar = window.confirm(`¿Confirmas cambiar al plan ${planNombre}?`);
    if (!confirmar) return;
    
    setSelectedPlan(planId);
    setProcesando(true);
    setMensaje('');
    
    try {
      // Actualizar directamente en Firestore
      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, { plan: planId });
      
      // Actualizar también con la función del contexto
      if (updateUserPlan) await updateUserPlan(planId);
      
      setCurrentPlan(planId);
      setMensaje(`✅ ¡Suscripción actualizada a ${planNombre}!`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMensaje(`❌ Error: ${error.message}`);
    } finally {
      setProcesando(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {mensaje && (
        <div className={`mb-4 p-3 rounded-lg text-center ${mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensaje}
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Mi Suscripción</h1>
        <p className="text-gray-600 mt-2">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>

      {/* Información del usuario */}
      <div className="bg-blue-50 rounded-xl p-4 mb-8 text-center">
        <p className="text-blue-800">
          <strong>Usuario:</strong> {user?.email}<br />
          <strong>Plan actual:</strong> <span className="font-bold">{PLANES.find(p => p.id === currentPlan)?.nombre || 'Gratuito'}</span>
        </p>
      </div>

      {/* Grid de planes */}
      <div className="grid md:grid-cols-4 gap-6">
        {PLANES.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div key={plan.id} className={`rounded-xl shadow-lg overflow-hidden border-2 ${isCurrent ? 'ring-4 ring-green-400 border-green-500' : plan.colorClass}`}>
              <div className={`p-6 ${plan.color === 'yellow' ? 'bg-yellow-100' : plan.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <h2 className="text-xl font-bold">{plan.nombre}</h2>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${plan.precio}</span>
                  {plan.precio > 0 && <span className="text-gray-600">/{plan.periodo}</span>}
                </div>
                {isCurrent && <span className="inline-block mt-2 bg-green-500 text-white text-xs px-2 py-1 rounded">✓ Plan actual</span>}
              </div>
              <div className="p-6 bg-white">
                <ul className="space-y-2 mb-6">
                  {plan.caracteristicas.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">✅ {f}</li>
                  ))}
                </ul>
                {!isCurrent ? (
                  <button onClick={() => handleUpgrade(plan.id)} disabled={procesando && selectedPlan === plan.id}
                    className={`w-full py-2 rounded-lg text-white ${plan.buttonClass} ${procesando && selectedPlan === plan.id ? 'opacity-50' : ''}`}>
                    {procesando && selectedPlan === plan.id ? 'Procesando...' : `Cambiar a ${plan.nombre}`}
                  </button>
                ) : (
                  <button disabled className="w-full py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed">Plan activo</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiSuscripcion;