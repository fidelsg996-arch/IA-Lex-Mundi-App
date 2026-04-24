// src/pages/MiSuscripcion.jsx
import React, { useState } from 'react';
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
    caracteristicas: ['Todo lo de Pro', 'Asesoría legal personalizada', 'Insignia de verificación'],
    color: 'yellow',
    colorClass: 'border-yellow-400 bg-yellow-50',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
  },
];

const MiSuscripcion = () => {
  const { user, updateUserPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const currentPlanId = user?.plan || 'free';

  const handleUpgrade = async (planId) => {
    if (planId === currentPlanId) return;
    setSelectedPlan(planId);
    setProcesando(true);
    // Simular proceso de pago (después conectar con pasarela real)
    setTimeout(() => {
      const success = updateUserPlan(planId);
      if (success) {
        alert(`¡Suscripción actualizada a ${PLANES.find(p => p.id === planId).nombre}!`);
      } else {
        alert('Error al actualizar el plan. Intenta de nuevo.');
      }
      setProcesando(false);
      setSelectedPlan(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Suscripción</h1>
      <p className="text-gray-600 mb-8">Elige el plan que mejor se adapte a tus necesidades</p>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANES.map((plan) => {
          const isCurrent = currentPlanId === plan.id;
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
                    Plan actual
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
                    {procesando && selectedPlan === plan.id ? 'Procesando...' : plan.precio === 0 ? 'Mantener gratuito' : 'Cambiar a este plan'}
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
    </div>
  );
};

export default MiSuscripcion;