const ResultadoDuelo = ({ puntuacionUsuario, puntuacionRival, nombreRival, fase, torneo, onContinuar, onVerBracket }) => {
  const victoria = puntuacionUsuario > puntuacionRival;
  const textoFase = fase === 'clasificacion' ? 'Clasificación' : fase === 'grupos' ? 'Grupos' : fase === 'eliminatorias' ? 'Eliminatoria' : 'Torneo';

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white text-center"><p className="text-sm font-medium">Fase de {textoFase}</p><p className="text-xs text-green-200">{torneo?.titulo}</p></div>
        <div className="text-center py-8"><div className="text-6xl mb-4">{victoria ? '🏆' : '❌'}</div><h2 className="text-2xl font-bold text-gray-800">{victoria ? '¡Victoria!' : 'Derrota'}</h2><p className="text-gray-500 mt-2">{victoria ? 'Has superado esta ronda — espera al admin para activar la siguiente fase' : 'No lograste avanzar. ¡Suerte en el próximo torneo!'}</p></div>
        <div className="flex justify-center items-center gap-8 py-6 bg-gray-50"><div className="text-center"><p className="text-4xl font-bold text-blue-600">{puntuacionUsuario}</p><p className="text-xs text-gray-500">Tus puntos</p></div><div className="text-2xl font-bold text-gray-400">vs</div><div className="text-center"><p className="text-4xl font-bold text-gray-600">{puntuacionRival}</p><p className="text-xs text-gray-500">Lic. {nombreRival}</p></div></div>
        <div className="p-6 flex flex-col gap-3">
          {victoria && <button onClick={onVerBracket} className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">Ver bracket del torneo</button>}
          <button onClick={onContinuar} className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition">{victoria ? 'Continuar' : 'Salir'}</button>
        </div>
      </div>
    </div>
  );
};

export default ResultadoDuelo;