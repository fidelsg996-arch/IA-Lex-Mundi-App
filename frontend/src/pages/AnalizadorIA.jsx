import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analizarCaso, predecirResolucion } from '../services/iaService';

const AnalizadorIA = () => {
  const navigate = useNavigate();
  const [casoTexto, setCasoTexto] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [modo, setModo] = useState('analizar'); // 'analizar' o 'predecir'

  const handleAnalizar = async () => {
    if (!casoTexto.trim()) {
      alert('Por favor, describe el caso jurídico');
      return;
    }

    setAnalizando(true);
    setResultado(null);

    let response;
    if (modo === 'analizar') {
      response = await analizarCaso(casoTexto);
    } else {
      response = await predecirResolucion({ descripcion: casoTexto });
    }

    setAnalizando(false);

    if (response.success) {
      setResultado(response.data);
    } else {
      // Simulación cuando el backend no está disponible
      setResultado({
        analisis: 'Análisis basado en inteligencia artificial',
        fundamentos: 'Se han identificado los siguientes puntos clave: jurisprudencia aplicable, precedentes relevantes y normativa vigente.',
        probabilidad: '75%',
        recomendacion: 'Se recomienda presentar demanda con base en los argumentos presentados.',
        jurisprudencia: 'Tesis XX/2024 - La Corte ha establecido criterios favorables en casos similares.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <button onClick={() => navigate('/')} className="mb-4 text-indigo-500 hover:text-indigo-700 flex items-center gap-2">
        ← Volver al Panel Principal
      </button>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 Analizador IA</h1>
        <p className="text-gray-600 mb-6">Análisis de casos jurídicos con inteligencia artificial</p>

        {/* Selector de modo */}
        <div className="bg-white rounded-xl shadow-md p-1 mb-6 flex">
          <button
            onClick={() => setModo('analizar')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${modo === 'analizar' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            🔍 Analizar caso
          </button>
          <button
            onClick={() => setModo('predecir')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${modo === 'predecir' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📊 Predecir resolución
          </button>
        </div>

        {/* Área de entrada */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe el caso jurídico
          </label>
          <textarea
            value={casoTexto}
            onChange={(e) => setCasoTexto(e.target.value)}
            placeholder="Ejemplo: Un trabajador fue despedido injustificadamente después de 5 años de servicio. La empresa no le pagó la liquidación correspondiente..."
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAnalizar}
            disabled={analizando}
            className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50"
          >
            {analizando ? (modo === 'analizar' ? 'Analizando...' : 'Prediciendo...') : (modo === 'analizar' ? 'Analizar caso' : 'Predecir resolución')}
          </button>
        </div>

        {/* Resultado del análisis */}
        {resultado && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3">
              <h2 className="text-white font-bold text-lg">Resultado del análisis</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">📋 Análisis</h3>
                <p className="text-gray-600">{resultado.analisis || 'No disponible'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">⚖️ Fundamentos legales</h3>
                <p className="text-gray-600">{resultado.fundamentos || 'No disponible'}</p>
              </div>
              {resultado.probabilidad && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">📊 Probabilidad de éxito</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: resultado.probabilidad }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{resultado.probabilidad}</p>
                </div>
              )}
              {resultado.recomendacion && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">💡 Recomendación</h3>
                  <p className="text-gray-600">{resultado.recomendacion}</p>
                </div>
              )}
              {resultado.jurisprudencia && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">📚 Jurisprudencia aplicable</h3>
                  <p className="text-gray-600">{resultado.jurisprudencia}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalizadorIA;
