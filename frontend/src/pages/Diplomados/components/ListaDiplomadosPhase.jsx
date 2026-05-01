import React from 'react';

const ListaDiplomadosPhase = ({ 
  diplomados, 
  modoAdmin, 
  onEditar, 
  onEliminar, 
  onTogglePremio, 
  onSeleccionarDiplomado,
  onAbrirFormNuevo,
  calcularProgreso 
}) => {
  return (
    <div className="px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-700"></div>
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-purple-400">workspace_premium</span>
              <h1 className="text-2xl font-black">Diplomados</h1>
            </div>
          </div>
          <p className="text-gray-200 text-sm">Programas de especialización con certificación oficial</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-500 text-sm">workspace_premium</span>
            <span className="text-xs text-gray-600">{diplomados.length} diplomados disponibles</span>
          </div>
          {modoAdmin && (
            <button onClick={onAbrirFormNuevo} className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-purple-600 transition">
              <span className="material-symbols-outlined text-sm">add</span> Nuevo Diplomado
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {diplomados.map((diplomado) => {
          const progreso = calcularProgreso ? calcularProgreso(diplomado.id) : 0;
          return (
            <div key={diplomado.id} className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${diplomado.esPremioTorneo ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'}`} onClick={() => onSeleccionarDiplomado(diplomado)}>
              {diplomado.esPremioTorneo && (
                <div className="absolute relative z-10">
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">emoji_events</span> Premio Torneo
                  </div>
                </div>
              )}
              <div className="h-40 bg-gradient-to-br from-purple-50 to-indigo-100 relative flex items-center justify-center overflow-hidden">
                <img src={diplomado.imagen || 'https://placehold.co/400x200/purple-100/purple-800?text=Diplomado'} alt={diplomado.titulo} className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/purple-100/purple-800?text=Diplomado'; }} />
                {progreso > 0 && (<div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"><div className="h-full bg-green-500 transition-all" style={{ width: `${progreso}%` }}></div></div>)}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">{diplomado.modulos?.length || 0} módulos</span>
                  {progreso > 0 && <span className="text-xs text-green-600 font-semibold">{progreso}% completado</span>}
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{diplomado.titulo}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{diplomado.descripcion}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500"><span className="material-symbols-outlined text-sm">schedule</span><span className="text-xs font-semibold">{diplomado.duracion || '160 horas'}</span></div>
                  {modoAdmin && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onEditar(diplomado)} className="text-blue-500 hover:text-blue-700" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => onEliminar(diplomado.id)} className="text-red-500 hover:text-red-700" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button>
                      <button onClick={() => onTogglePremio(diplomado.id)} className={`${diplomado.esPremioTorneo ? 'text-amber-500' : 'text-gray-400'} hover:text-amber-500`} title={diplomado.esPremioTorneo ? 'Quitar premio' : 'Marcar como premio'}><span className="material-symbols-outlined text-sm">emoji_events</span></button>
                    </div>
                  )}
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-800 flex items-center gap-0.5" onClick={(e) => { e.stopPropagation(); onSeleccionarDiplomado(diplomado); }}>Ver diplomado<span className="material-symbols-outlined text-xs">arrow_forward</span></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {diplomados.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">workspace_premium</span>
          <p className="text-gray-500">No hay diplomados disponibles</p>
          {modoAdmin && <button onClick={onAbrirFormNuevo} className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-lg">Crear primer diplomado</button>}
        </div>
      )}

      <style>{`.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; } .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default ListaDiplomadosPhase;