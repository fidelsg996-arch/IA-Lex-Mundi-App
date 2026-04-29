// src/pages/AnalisisIA.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersistencia } from '../hooks/usePersistencia';

const AnalisisIA = () => {
  const navigate = useNavigate();
  const [casoTexto, setCasoTexto] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);
  
  // Usar persistencia para guardar el historial de análisis
  const { datos: historial, guardarDatos, cargando } = usePersistencia('analisis_ia', []);

  const analizarCaso = async () => {
    if (!casoTexto.trim()) {
      alert('Por favor, describe el caso jurídico para analizar');
      return;
    }

    setAnalizando(true);
    
    // Simulación de análisis con IA
    setTimeout(async () => {
      const palabrasClave = casoTexto.toLowerCase();
      let analisis = {};
      
      if (palabrasClave.includes('despido') || palabrasClave.includes('laboral') || palabrasClave.includes('trabajador')) {
        analisis = {
          tipo: 'Caso Laboral',
          resumen: 'Caso de despido injustificado identificado.',
          fundamentos: 'Ley Federal del Trabajo Artículos 47, 48 y 49.',
          puntosClave: [
            'El trabajador tiene derecho a indemnización constitucional',
            'La empresa debe pagar 3 meses de salario + 20 días por año trabajado',
            'El plazo para demandar es de 60 días hábiles'
          ],
          probabilidadExito: '85%',
          recomendacion: 'Proceder con demanda ante la Junta de Conciliación y Arbitraje'
        };
      } else if (palabrasClave.includes('contrato') || palabrasClave.includes('civil') || palabrasClave.includes('incumplimiento')) {
        analisis = {
          tipo: 'Caso Civil',
          resumen: 'Incumplimiento de contrato identificado.',
          fundamentos: 'Código Civil Federal Artículos 1796, 1949 y 2010.',
          puntosClave: [
            'Existe responsabilidad civil por incumplimiento',
            'Se pueden reclamar daños y perjuicios',
            'El plazo de prescripción es de 2 años'
          ],
          probabilidadExito: '70%',
          recomendacion: 'Enviar carta de reclamación antes de proceder legalmente'
        };
      } else if (palabrasClave.includes('penal') || palabrasClave.includes('delito') || palabrasClave.includes('robo')) {
        analisis = {
          tipo: 'Caso Penal',
          resumen: 'Posible responsabilidad penal identificada.',
          fundamentos: 'Código Penal Federal Artículos 7, 11 y 52.',
          puntosClave: [
            'Denunciar ante el Ministerio Público',
            'Recabar evidencia y testigos',
            'Solicitar medidas cautelares'
          ],
          probabilidadExito: '65%',
          recomendacion: 'Acudir a la Fiscalía General a presentar denuncia'
        };
      } else {
        analisis = {
          tipo: 'Caso General',
          resumen: 'Se requiere mayor información para un análisis preciso.',
          fundamentos: 'Revisión de legislación aplicable según la naturaleza del caso.',
          puntosClave: [
            'Recopilar toda la documentación relevante',
            'Identificar a las partes involucradas',
            'Determinar el tipo de procedimiento aplicable'
          ],
          probabilidadExito: '50%',
          recomendacion: 'Consultar con un abogado especializado para evaluación detallada'
        };
      }
      
      // Crear registro del análisis
      const nuevoAnalisis = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        textoOriginal: casoTexto.substring(0, 200),
        resultado: analisis
      };
      
      // Guardar en el historial (mantener últimos 20)
      const nuevoHistorial = [nuevoAnalisis, ...(historial || [])].slice(0, 20);
      await guardarDatos(nuevoHistorial);
      
      setResultado(analisis);
      setAnalizando(false);
    }, 2000);
  };

  const limpiar = () => {
    setCasoTexto('');
    setResultado(null);
  };

  const cargarAnalisisPrevio = (analisisGuardado) => {
    setCasoTexto(analisisGuardado.textoOriginal);
    setResultado(analisisGuardado.resultado);
  };

  const eliminarHistorial = async (id) => {
    if (window.confirm('¿Eliminar este análisis del historial?')) {
      const nuevoHistorial = (historial || []).filter(h => h.id !== id);
      await guardarDatos(nuevoHistorial);
    }
  };

  const limpiarTodoHistorial = async () => {
    if (window.confirm('¿Eliminar TODO el historial de análisis?')) {
      await guardarDatos([]);
    }
  };

  if (cargando) return <div className="text-center py-20">Cargando historial...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <button 
        onClick={() => navigate('/panel-principal')} 
        className="mb-6 text-indigo-500 hover:text-indigo-700 flex items-center gap-2 font-semibold"
      >
        ← Volver al Panel Principal
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🤖</span>
                <div>
                  <h1 className="text-3xl font-bold">Analizador IA</h1>
                  <p className="text-indigo-100 mt-1">Análisis predictivo con inteligencia artificial</p>
                </div>
              </div>
              {(historial && historial.length > 0) && (
                <button
                  onClick={limpiarTodoHistorial}
                  className="bg-red-500/20 hover:bg-red-500/30 text-white text-sm px-3 py-1 rounded-lg transition"
                >
                  Limpiar historial
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe tu caso jurídico
              </label>
              <textarea
                value={casoTexto}
                onChange={(e) => setCasoTexto(e.target.value)}
                placeholder="Ejemplo: Un trabajador fue despedido injustificadamente después de 5 años de servicio en una empresa. No le pagaron su liquidación completa ni le dieron finiquito. ¿Qué procede?"
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Mínimo 10 caracteres para un análisis preciso</p>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={analizarCaso}
                disabled={analizando || casoTexto.trim().length < 10}
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 transition flex items-center gap-2"
              >
                {analizando ? '🔍 Analizando...' : '🤖 Analizar con IA'}
              </button>
              <button
                onClick={limpiar}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Limpiar
              </button>
            </div>

            {analizando && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                  <span className="text-indigo-600">Procesando información con inteligencia artificial...</span>
                </div>
              </div>
            )}

            {/* Historial de análisis previos */}
            {historial && historial.length > 0 && !analizando && !resultado && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-3">📜 Análisis anteriores</h3>
                <div className="space-y-2">
                  {historial.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 transition cursor-pointer">
                      <div onClick={() => cargarAnalisisPrevio(item)} className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{new Date(item.fecha).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 truncate">{item.textoOriginal}</p>
                        <p className="text-xs text-indigo-600 mt-1">Tipo: {item.resultado.tipo}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); eliminarHistorial(item.id); }}
                        className="text-red-400 hover:text-red-600 text-sm ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado && !analizando && (
              <div className="mt-6 space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h3 className="font-bold text-indigo-800 text-lg mb-2">📋 Tipo de Caso</h3>
                  <p className="text-2xl font-bold text-gray-800">{resultado.tipo}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📝 Análisis del Caso</h3>
                  <p className="text-gray-700">{resultado.resumen}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">⚖️ Fundamentos Legales</h3>
                  <p className="text-gray-700">{resultado.fundamentos}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📌 Puntos Clave</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {resultado.puntosClave.map((punto, idx) => (
                      <li key={idx} className="text-gray-700">{punto}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-green-800">📊 Probabilidad de Éxito</h3>
                    <span className="text-2xl font-bold text-green-600">{resultado.probabilidadExito}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: resultado.probabilidadExito }}
                    ></div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2">💡 Recomendación del Sistema</h3>
                  <p className="text-gray-700">{resultado.recomendacion}</p>
                </div>

                <div className="text-center text-xs text-gray-400 pt-4">
                  ⚠️ Este análisis es un asistente de IA y no sustituye el consejo legal profesional
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisIA;