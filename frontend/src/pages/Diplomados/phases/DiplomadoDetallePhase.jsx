const DiplomadoDetallePhase = ({ diplomado, onBack, onSeleccionarModulo, estaCompletada, onGenerarConstancia, calcularProgresoDiplomado }) => {
  const progreso = calcularProgresoDiplomado(diplomado);
  const estaCompleto = progreso >= 100;
  
  return (
    <div className="px-4 py-3">
      <button onClick={onBack} className="mb-4 text-amber-600 font-semibold flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
      </button>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
          <h1 className="text-2xl font-bold">{diplomado.titulo}</h1>
          <p className="text-gray-300 mt-2">{diplomado.descripcion}</p>
          {diplomado.esPremioTorneo && (
            <span className="inline-block mt-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">🏆 Premio del Torneo</span>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">📖 Módulos</h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progreso: {Math.round(progreso)}%</p>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progreso}%` }}></div>
              </div>
            </div>
          </div>
          
          {(diplomado.modulos || []).map((modulo) => {
            const leccionesLista = modulo.leccionesLista || [];
            const completadasModulo = leccionesLista.filter(lec => estaCompletada(diplomado.id, modulo.id, lec.id)).length;
            const porcentajeModulo = leccionesLista.length > 0 ? (completadasModulo / leccionesLista.length) * 100 : 0;
            
            return (
              <div key={modulo.id} className="border rounded-xl mb-3 cursor-pointer hover:shadow-md" onClick={() => onSeleccionarModulo(modulo)}>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{modulo.titulo}</h3>
                      <p className="text-sm text-gray-500">{leccionesLista.length} lecciones</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">{completadasModulo}/{leccionesLista.length}</p>
                      <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                        <div className="bg-green-500 h-1 rounded-full" style={{ width: `${porcentajeModulo}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {estaCompleto && (
            <div className="mt-6">
              <button onClick={onGenerarConstancia} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                🎓 OBTENER CONSTANCIA
              </button>
              <p className="text-center text-sm text-green-600 mt-3">✅ ¡Felicidades! Has completado este diplomado al 100%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiplomadoDetallePhase;