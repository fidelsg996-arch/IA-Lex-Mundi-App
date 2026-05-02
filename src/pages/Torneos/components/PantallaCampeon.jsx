import { useNavigate } from 'react-router-dom';

const PantallaCampeon = ({ torneo, participante, premio }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center animate-bounce-in">
        {/* Copa - UNA SOLA */}
        <div className="mb-6 text-8xl animate-pulse">🏆</div>
        
        {/* Título */}
        <h1 className="text-4xl font-black text-yellow-600 mb-2">¡CAMPEÓN!</h1>
        <p className="text-gray-600 mb-6">Has ganado el torneo</p>
        
        {/* Detalles del torneo */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Torneo</p>
          <p className="font-bold text-lg">{torneo?.titulo || 'Torneo Sin Nombre'}</p>
        </div>
        
        {/* Premio */}
        <div className="bg-amber-50 rounded-xl p-4 mb-4 border-2 border-amber-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-sm font-bold text-amber-700 uppercase tracking-wide">Premio</span>
          </div>
          <p className="text-3xl font-bold text-amber-700">
            ${(premio || 0).toLocaleString()} MXN
          </p>
          {torneo?.premioDescripcion && (
            <p className="text-xs text-amber-600 mt-2">{torneo.premioDescripcion}</p>
          )}
        </div>
        
        {/* Participante */}
        <div className="bg-blue-50 rounded-xl p-3 mb-6">
          <p className="text-xs text-blue-500">Campeón</p>
          <p className="font-bold text-blue-800">{participante?.nombre || 'Participante'}</p>
        </div>
        
        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/torneos')}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition"
          >
            Volver a torneos
          </button>
          <button
            onClick={() => navigate('/panel-principal')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
          >
            Ir al inicio
          </button>
        </div>
        
        {/* Mensaje de admin */}
        <p className="text-xs text-gray-400 mt-4">
          El premio será entregado por el administrador del torneo
        </p>
      </div>
      
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PantallaCampeon;