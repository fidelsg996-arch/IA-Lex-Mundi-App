const ModuloPhase = ({ diplomado, modulo, onBack, onSeleccionarLeccion, estaCompletada }) => {
  const leccionesLista = modulo.leccionesLista || [];

  return (
    <div className="px-4 py-3">
      <button onClick={onBack} className="mb-4 text-amber-600 font-semibold flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al diplomado
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
          <h1 className="text-xl font-bold">{modulo.titulo}</h1>
          <p className="text-gray-300 text-sm">{leccionesLista.length} lecciones · {modulo.categoria}</p>
        </div>

        <div className="p-4 space-y-2">
          {leccionesLista.map((leccion, idx) => {
            const completada = estaCompletada(diplomado.id, modulo.id, leccion.id);
            return (
              <div key={leccion.id} className={`border rounded-xl p-3 cursor-pointer ${completada ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                onClick={() => onSeleccionarLeccion(leccion)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${completada ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                      {completada ? '✓' : idx + 1}
                    </div>
                    <h3 className="font-semibold">{leccion.titulo}</h3>
                  </div>
                  {completada && <span className="text-green-600 text-sm">Completada</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuloPhase;