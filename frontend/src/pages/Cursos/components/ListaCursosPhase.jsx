// src/pages/cursos/components/ListaCursosPhase.jsx
import React from 'react';

const ListaCursosPhase = ({ 
  cursos, 
  modoAdmin, 
  onEditar, 
  onEliminar, 
  onTogglePremio, 
  onSeleccionarCurso,
  onAbrirFormNuevo,
  calcularProgreso 
}) => {
  return (
    <div className="px-4">
      {/* Cabecera */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700"></div>
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-blue-400">school</span>
              <h1 className="text-2xl font-black">Cursos Especializados</h1>
            </div>
          </div>
          <p className="text-gray-200 text-sm">Formación jurídica práctica para profesionales</p>
        </div>
      </div>

      {/* Barra superior con botón nuevo curso */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-sm">play_circle</span>
            <span className="text-xs text-gray-600">{cursos.length} cursos disponibles</span>
          </div>
          {/* ✅ Botón Nuevo Curso - SOLO en modo admin */}
          {modoAdmin && (
            <button
              onClick={onAbrirFormNuevo}
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600 transition"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Nuevo Curso
            </button>
          )}
        </div>
      </div>

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cursos.map((curso) => {
          const progreso = calcularProgreso ? calcularProgreso(curso.id) : 0;
          
          return (
            <div 
              key={curso.id} 
              className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${curso.esPremioTorneo ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'}`}
              onClick={() => onSeleccionarCurso(curso)}
            >
              {/* Badge de premio */}
              {curso.esPremioTorneo && (
                <div className="absolute relative z-10">
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">emoji_events</span>
                    Premio Torneo
                  </div>
                </div>
              )}
              
              {/* Imagen */}
              <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 relative flex items-center justify-center overflow-hidden">
                <img 
                  src={curso.imagen || 'https://placehold.co/400x200/blue-100/blue-800?text=Curso'} 
                  alt={curso.titulo}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x200/blue-100/blue-800?text=Curso';
                  }}
                />
                {progreso > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div className="h-full bg-green-500 transition-all" style={{ width: `${progreso}%` }}></div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                    {curso.modulos?.length || 0} módulos
                  </span>
                  {progreso > 0 && (
                    <span className="text-xs text-green-600 font-semibold">{progreso}% completado</span>
                  )}
                </div>
                
                <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{curso.titulo}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{curso.descripcion}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="text-xs font-semibold">{curso.nivel || 'Intermedio'}</span>
                  </div>
                  
                  {/* ✅ Botones de admin - SOLO en modo admin */}
                  {modoAdmin && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => onEditar(curso)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => onEliminar(curso.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                      <button 
                        onClick={() => onTogglePremio(curso.id)}
                        className={`${curso.esPremioTorneo ? 'text-amber-500' : 'text-gray-400'} hover:text-amber-500`}
                        title={curso.esPremioTorneo ? 'Quitar premio' : 'Marcar como premio'}
                      >
                        <span className="material-symbols-outlined text-sm">emoji_events</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Botón ver curso - SIEMPRE visible */}
                  <button 
                    className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-0.5"
                    onClick={(e) => { e.stopPropagation(); onSeleccionarCurso(curso); }}
                  >
                    Ver curso
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje si no hay cursos */}
      {cursos.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">school</span>
          <p className="text-gray-500">No hay cursos disponibles</p>
          {modoAdmin && (
            <button onClick={onAbrirFormNuevo} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg">
              Crear primer curso
            </button>
          )}
        </div>
      )}

      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ListaCursosPhase;