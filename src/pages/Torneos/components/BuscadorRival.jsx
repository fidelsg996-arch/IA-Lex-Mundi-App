const BuscadorRival = ({ torneo, fase, onBuscarRival, onVolver }) => {
  const textoFase = fase === 'clasificacion' ? 'Clasificación' : fase === 'grupos' ? 'Grupos' : fase === 'eliminatorias' ? 'Fase Eliminatoria' : 'Torneo';

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-white">
          <div className="text-center"><h2 className="text-lg font-bold">General</h2><p className="text-sm text-red-200">{torneo?.titulo}</p><p className="text-xs text-red-300 mt-1">Despacho Juridico F&H SA. de CV.</p></div>
          <button onClick={onVolver} className="absolute right-4 top-4 text-white/80 hover:text-white text-sm">← Volver</button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1"><div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-3xl text-white">person</span></div><h3 className="font-bold text-gray-800 mt-2">Listo</h3><p className="text-xs text-gray-500">Tú</p></div>
            <div className="flex-shrink-0 mx-4"><div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"><span className="material-symbols-outlined text-xl text-gray-500">question_mark</span></div><p className="text-center text-xs text-gray-400 mt-1">VS</p></div>
            <div className="text-center flex-1"><div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center"><span className="material-symbols-outlined text-3xl text-gray-400">person</span></div><h3 className="font-bold text-gray-400 mt-2">Sin rival</h3><p className="text-xs text-gray-400">?</p></div>
          </div>
          <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center"><p className="text-sm font-bold text-gray-700">🎯 Meta: 10 puntos</p><p className="text-xs text-gray-500 mt-1">15 preguntas · 30s cada una</p><p className="text-xs text-gray-500">{textoFase}</p></div>
          <button onClick={onBuscarRival} className="w-full mt-6 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">Buscar rival</button>
        </div>
      </div>
    </div>
  );
};

export default BuscadorRival;