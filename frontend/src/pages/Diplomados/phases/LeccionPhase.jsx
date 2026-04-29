const LeccionPhase = ({ diplomado, modulo, leccion, completada, onBack, onMarcarCompletada, siguienteLeccion, onSiguienteLeccion }) => {
  return (
    <div className="px-4 py-3">
      <button onClick={onBack} className="mb-4 text-amber-600 font-semibold flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al módulo
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
          <h1 className="text-xl font-bold">{leccion.titulo}</h1>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-bold text-amber-600">📖 Contenido</h3>
            <p className="text-gray-700 mt-1">{leccion.contenido || 'Contenido no disponible'}</p>
          </div>
          
          {leccion.ejemplo && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-bold text-blue-600">💡 Ejemplo práctico</h3>
              <p className="text-gray-700">{leccion.ejemplo}</p>
            </div>
          )}
          
          {leccion.caso && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <h3 className="font-bold text-purple-600">⚖️ Caso ilustrativo</h3>
              <p className="text-gray-700">{leccion.caso}</p>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button onClick={onBack} className="flex-1 bg-gray-300 py-2 rounded-lg font-semibold">Volver</button>
            {!completada && (
              <button onClick={onMarcarCompletada} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold">
                ✅ Marcar completada
              </button>
            )}
            {siguienteLeccion && completada && (
              <button onClick={onSiguienteLeccion} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold">
                Siguiente lección →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeccionPhase;