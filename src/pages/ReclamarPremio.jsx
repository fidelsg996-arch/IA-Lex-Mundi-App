import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ReclamarPremio = () => {
  const { user } = useAuth();
  const [campeonData, setCampeonData] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [reclamado, setReclamado] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('campeon_actual');
    if (stored) {
      setCampeonData(JSON.parse(stored));
    }
  }, []);

  const handleReclamar = () => {
    if (!campeonData) {
      setMensaje('❌ No hay información de campeón');
      return;
    }

    // ✅ Verificar código automáticamente (sin admin)
    if (codigoIngresado !== campeonData.codigo) {
      setMensaje('❌ Código incorrecto');
      return;
    }

    setMensaje('✅ ¡Premio reclamado con éxito! El libro será enviado a tu correo.');
    setReclamado(true);
    
    // Marcar como reclamado para que no se pueda reclamar otra vez
    localStorage.setItem('premio_reclamado', 'true');
    
    setTimeout(() => {
      window.location.href = '/panel-principal';
    }, 3000);
  };

  if (!campeonData) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-xl font-bold mb-2">No hay premio pendiente</h2>
          <p className="text-gray-600">Participa en torneos para ganar premios.</p>
          <a href="/torneos" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Ver torneos
          </a>
        </div>
      </div>
    );
  }

  const premio = campeonData.premio || 'Guía completa de Derecho Agrario';
  const tituloTorneo = campeonData.torneo?.titulo || 'Torneo';
  const codigoGenerado = campeonData.codigo || '';

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-6 text-white text-center">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold">¡FELICIDADES CAMPEÓN!</h1>
          <p className="text-amber-100">Has ganado el torneo</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{tituloTorneo}</h2>
            <div className="bg-green-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-gray-500">🏆 Premio</p>
              <p className="font-bold text-green-700">{typeof premio === 'number' ? `$${premio.toLocaleString()} MXN` : premio}</p>
            </div>
          </div>

          {!reclamado ? (
            <>
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-amber-800 mb-2">🎫 Tu código de campeón</p>
                <div className="bg-white rounded-lg p-3 text-center border border-amber-200">
                  <p className="text-xs text-gray-500">Código único generado al ganar:</p>
                  <p className="font-mono text-lg font-bold text-amber-600">{codigoGenerado}</p>
                </div>
                <p className="text-xs text-amber-700 mt-2">
                  ⚠️ Guarda este código. Lo necesitarás para reclamar tu premio.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Confirma tu código</label>
                <input
                  type="text"
                  placeholder="Ingresa tu código de campeón"
                  value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value.toUpperCase())}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              {mensaje && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {mensaje}
                </div>
              )}

              <button
                onClick={handleReclamar}
                disabled={!codigoIngresado}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 disabled:opacity-50"
              >
                🎁 Reclamar Premio
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-green-600 font-bold mb-4">¡Premio reclamado con éxito!</p>
              <p className="text-gray-600">El premio será enviado a tu correo registrado.</p>
              <a href="/panel-principal" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                Ir al inicio
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReclamarPremio;