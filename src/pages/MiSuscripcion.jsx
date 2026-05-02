// src/pages/MiSuscripcion.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PLANES = [
  {
    id: 'free',
    nombre: 'Gratuito',
    precio: 0,
    periodo: 'siempre',
    caracteristicas: ['Acceso básico', 'Hasta 5 expedientes', 'Soporte email'],
    color: 'gray',
    colorClass: 'border-gray-300 bg-gray-50',
    buttonClass: 'bg-gray-500 hover:bg-gray-600',
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precio: 199,
    periodo: 'mensual',
    caracteristicas: ['Acceso total', 'Expedientes ilimitados', 'Soporte prioritario', 'Participación en torneos'],
    color: 'blue',
    colorClass: 'border-blue-300 bg-blue-50',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: 399,
    periodo: 'mensual',
    caracteristicas: ['Todo lo de Pro', 'Asesoría legal personalizada', 'Insignia de verificación', 'Constancias automáticas'],
    color: 'yellow',
    colorClass: 'border-yellow-400 bg-yellow-50',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
  },
];

const MiSuscripcion = () => {
  const { user, updateUserPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setCurrentPlan(user.plan || 'free');
    }
    setLoading(false);
  }, [user]);

  const handleUpgrade = async (planId) => {
    if (planId === currentPlan) return;
    
    setSelectedPlan(planId);
    setProcesando(true);
    
    // Simular proceso de pago (después conectar con Stripe/MercadoPago)
    setTimeout(async () => {
      const success = await updateUserPlan(planId);
      if (success) {
        setCurrentPlan(planId);
        alert(`✅ ¡Suscripción actualizada a ${PLANES.find(p => p.id === planId).nombre}!`);
      } else {
        alert('❌ Error al actualizar el plan. Intenta de nuevo.');
      }
      setProcesando(false);
      setSelectedPlan(null);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center py-20">
        <div className="spinner-border text-amber-500" role="status">
          <span className="visually-hidden">Cargando suscripción...</span>
        </div>
        <p className="mt-3 text-gray-500">Cargando tu plan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Suscripción</h1>
      <p className="text-gray-600 mb-8">Elige el plan que mejor se adapte a tus necesidades</p>

      {/* Información del usuario */}
      <div className="bg-blue-50 rounded-xl p-4 mb-8">
        <p className="text-blue-800">
          <strong>Usuario:</strong> {user?.email} <br />
          <strong>Plan actual:</strong> <span className="font-bold">{PLANES.find(p => p.id === currentPlan)?.nombre || 'Gratuito'}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANES.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                isCurrent ? 'ring-4 ring-green-400 border-green-500' : plan.colorClass
              }`}
            >
              <div className={`p-6 ${plan.color === 'yellow' ? 'bg-yellow-100' : plan.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <h2 className="text-2xl font-bold text-gray-800">{plan.nombre}</h2>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${plan.precio}</span>
                  {plan.precio > 0 && <span className="text-gray-600">/{plan.periodo}</span>}
                </div>
                {isCurrent && (
                  <span className="inline-block mt-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    ✓ Plan actual
                  </span>
                )}
              </div>
              <div className="p-6 bg-white">
                <ul className="space-y-2 mb-6">
                  {plan.caracteristicas.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {!isCurrent ? (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={procesando && selectedPlan === plan.id}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition ${plan.buttonClass} ${
                      procesando && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {procesando && selectedPlan === plan.id ? 'Procesando...' : plan.precio === 0 ? 'Cambiar a Gratuito' : `Cambiar a ${plan.nombre}`}
                  </button>
                ) : (
                  <button disabled className="w-full py-3 rounded-lg bg-gray-300 text-gray-500 font-semibold cursor-not-allowed">
                    Plan activo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 text-sm">
          🔒 Los pagos son seguros y procesados a través de Stripe. <br />
          Puedes cancelar tu suscripción en cualquier momento desde este panel. <br />
          Al actualizar tu plan, los cambios se reflejarán inmediatamente.
        </p>
      </div>
    </div>
  );
};

export default MiSuscripcion;