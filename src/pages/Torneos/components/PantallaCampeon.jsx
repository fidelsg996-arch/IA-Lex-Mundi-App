import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { guardarSolicitudRetiro } from '../../../services/retiroService';

const PantallaCampeon = ({ torneo, participante, premio, onCerrar }) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [mostrarOpcionesRetiro, setMostrarOpcionesRetiro] = useState(false);
  const [retiroSolicitado, setRetiroSolicitado] = useState(false);
  const [clabe, setClabe] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorClabe, setErrorClabe] = useState('');

  // Validar CLABE (18 dígitos)
  const validarCLABE = (clabe) => {
    const soloNumeros = clabe.replace(/\D/g, '');
    if (soloNumeros.length === 0) return '';
    if (soloNumeros.length !== 18) return 'La CLABE debe tener 18 dígitos';
    return '';
  };

  const handleClabeChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 18);
    setClabe(valor);
    setErrorClabe(validarCLABE(valor));
  };

  // Solicitar retiro bancario
  const solicitarRetiroBancario = async () => {
    const error = validarCLABE(clabe);
    if (error) {
      setErrorClabe(error);
      return;
    }

    setEnviando(true);
    
    const resultado = await guardarSolicitudRetiro(
      usuario?.uid,
      participante?.nombre || usuario?.displayName || 'Usuario',
      premio || 0,
      clabe,
      torneo?.id,
      torneo?.titulo
    );
    
    if (resultado.success) {
      setRetiroSolicitado(true);
      setMostrarOpcionesRetiro(false);
    } else {
      alert('Error al procesar tu solicitud. Intenta de nuevo más tarde.');
    }
    
    setEnviando(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center animate-bounce-in">
        {/* Copa */}
        <div className="mb-6 text-8xl animate-pulse">🏆</div>
        
        {/* Título */}
        <h1 className="text-4xl font-black text-yellow-600 mb-2">¡CAMPEÓN!</h1>
        <p className="text-gray-600 mb-6">Has ganado el torneo</p>
        
        {/* Detalles del torneo */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Torneo</p>
          <p className="font-bold text-lg">{torneo?.titulo || 'Torneo Sin Nombre'}</p>
        </div>
        
        {/* Premio en efectivo */}
        <div className="bg-amber-50 rounded-xl p-4 mb-4 border-2 border-amber-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-sm font-bold text-amber-700 uppercase tracking-wide">Premio en efectivo</span>
          </div>
          <p className="text-3xl font-bold text-amber-700">
            ${(premio || 0).toLocaleString()} MXN
          </p>
          {torneo?.premioDescripcion && (
            <p className="text-xs text-amber-600 mt-2">{torneo.premioDescripcion}</p>
          )}
        </div>
        
        {/* Monedero interno */}
        <div className="bg-green-50 rounded-xl p-4 mb-4 border-2 border-green-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">💼</span>
            <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Monedero Lex Mundi</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            ${(premio || 0).toLocaleString()} MXN
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Premio acreditado automáticamente
          </p>
          <button
            onClick={() => setMostrarOpcionesRetiro(true)}
            className="mt-3 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
          >
            🏦 Retirar a mi cuenta bancaria
          </button>
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
          El premio se acredita automáticamente en tu monedero. Puedes usarlo en cursos, diplomados o solicitar retiro bancario.
        </p>
      </div>

      {/* Modal de solicitud de retiro bancario */}
      {mostrarOpcionesRetiro && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">💸 Retirar ${(premio || 0).toLocaleString()} MXN</h2>
            
            {!retiroSolicitado ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  El dinero se transferirá a tu cuenta bancaria en un plazo de 5 a 10 días hábiles.
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CLABE interbancaria (18 dígitos)
                </label>
                <input
                  type="text"
                  maxLength="18"
                  className={`w-full border rounded-lg p-3 mb-2 text-center text-lg tracking-wider ${
                    errorClabe ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234 5678 9012 3456 78"
                  value={clabe}
                  onChange={handleClabeChange}
                />
                
                {errorClabe && (
                  <p className="text-red-500 text-xs mb-4">{errorClabe}</p>
                )}
                
                {clabe.length === 18 && !errorClabe && (
                  <p className="text-green-600 text-xs mb-4">✅ CLABE válida</p>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setMostrarOpcionesRetiro(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={solicitarRetiroBancario}
                    disabled={clabe.length !== 18 || enviando}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {enviando ? 'Enviando...' : 'Solicitar retiro'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-green-600 font-bold mb-2">¡Solicitud enviada!</p>
                <p className="text-sm text-gray-600 mb-4">
                  Tu solicitud ha sido registrada. El administrador revisará y procesará el retiro en los próximos días.
                </p>
                <button
                  onClick={() => setMostrarOpcionesRetiro(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
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
