// src/pages/Cursos/phases/ListaCursosPhase.jsx
import { useState, useEffect } from 'react';

const obtenerUrlImagen = (curso) => {
  if (curso?.imagenUrl && curso.imagenUrl.startsWith('http')) {
    return curso.imagenUrl;
  }
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"%3E%3Cpath d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 4v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6h20zM6 10v2h12v-2H6z"%3E%3C/path%3E%3C/svg%3E';
};

const ListaCursosPhase = ({ cursos, modoAdmin, onEditar, onEliminar, onTogglePremio, onSeleccionarCurso, onAbrirFormNuevo }) => {
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    setFiltro('');
  }, [modoAdmin]);

  const cursosFiltrados = cursos.filter(curso =>
    curso.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
    (curso.subtitulo && curso.subtitulo.toLowerCase().includes(filtro.toLowerCase()))
  );

  const cursosPremio = cursos.filter(c => c.esPremioTorneo);

  return (
    <div className="px-2 md:px-4 py-2 md:py-3">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4 md:mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
        <div className="relative z-10 p-3 md:p-4 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="material-symbols-outlined text-3xl md:text-4xl text-amber-400">school</span>
              <div>
                <h1 className="text-xl md:text-2xl font-black">Cursos Especializados</h1>
                <p className="text-xs md:text-sm text-gray-200">Formación profesional para abogados y juristas</p>
              </div>
            </div>
            {modoAdmin && (
              <button onClick={onAbrirFormNuevo} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>
                Nuevo Curso
              </button>
            )}
          </div>
          {modoAdmin && (
            <div className="mt-2 text-xs bg-amber-500/30 inline-block px-2 py-0.5 rounded-full">🔧 Modo Administrador Activado</div>
          )}
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl shadow-sm border mb-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
          <input type="text" placeholder="Buscar curso..." className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm md:text-base" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        </div>
      </div>

      {cursosPremio.length > 0 && (
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-xl md:text-2xl text-amber-500">emoji_events</span>
            <h2 className="text-base md:text-lg font-bold text-gray-800">🏆 Premios del Torneo</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {cursosPremio.map(curso => (
              <div key={curso.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 cursor-pointer border border-amber-200 hover:shadow-lg transition" onClick={() => onSeleccionarCurso(curso)}>
                <div className="flex gap-3">
                  <img src={obtenerUrlImagen(curso)} className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover" alt="" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{curso.titulo}</h3>
                    <p className="text-xs text-amber-600">🏆 Premio del Torneo</p>
                    {modoAdmin && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={(e) => { e.stopPropagation(); onEditar(curso); }} className="text-blue-500 text-xs">✏️ Editar</button>
                        <button onClick={(e) => { e.stopPropagation(); onTogglePremio(curso.id, curso); }} className="text-red-500 text-xs">❌ Quitar premio</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 mb-8">
        {cursosFiltrados.map(curso => (
          <div key={curso.id} className="bg-white rounded-xl shadow-md border overflow-hidden cursor-pointer hover:shadow-lg transition group" onClick={() => onSeleccionarCurso(curso)}>
            <div className="h-32 sm:h-36 md:h-40 bg-gradient-to-br from-amber-50 to-yellow-100 relative">
              <img src={obtenerUrlImagen(curso)} className="w-full h-full object-cover" alt={curso.titulo} />
              {curso.esGratis ? (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">🎓 GRATIS</span>
              ) : curso.precio > 0 && (
                <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">${curso.precio} MXN</span>
              )}
              {curso.esPremioTorneo && (
                <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">emoji_events</span> Premio
                </span>
              )}
            </div>
            <div className="p-3">
              <div className="text-xs text-amber-600 font-semibold mb-1">Curso</div>
              <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{curso.titulo}</h3>
              {curso.subtitulo && <p className="text-xs text-gray-500 mt-1">{curso.subtitulo}</p>}
              <p className="text-gray-600 text-xs mt-2 line-clamp-2">{curso.descripcion?.substring(0, 80)}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">📖 {curso.totalLecciones}</span>
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">📦 {curso.totalModulos}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-2">
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span><span className="text-xs">{curso.duracion}</span></div>
                {modoAdmin && (
                  <div className="flex gap-1 md:gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEditar(curso); }} className="text-blue-500 hover:text-blue-700" title="Editar"><span className="material-symbols-outlined text-sm md:text-base">edit</span></button>
                    <button onClick={(e) => { e.stopPropagation(); onEliminar(curso.id); }} className="text-red-500 hover:text-red-700" title="Eliminar"><span className="material-symbols-outlined text-sm md:text-base">delete</span></button>
                    <button onClick={(e) => { e.stopPropagation(); onTogglePremio(curso.id, curso); }} className="text-amber-500" title={curso.esPremioTorneo ? 'Quitar premio' : 'Premiar'}><span className="material-symbols-outlined text-sm md:text-base">emoji_events</span></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {cursosFiltrados.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border p-8 md:p-12 text-center">
          <span className="material-symbols-outlined text-5xl md:text-6xl text-gray-300 mb-3">search</span>
          <p className="text-gray-500 text-sm md:text-base">No hay cursos disponibles. Crea uno nuevo.</p>
        </div>
      )}
    </div>
  );
};

export default ListaCursosPhase;