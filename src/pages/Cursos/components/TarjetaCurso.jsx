// src/pages/Cursos/components/TarjetaCurso.jsx
import React from 'react';
import { obtenerUrlImagen } from '../utils/helpers';

const TarjetaCurso = ({ curso, esPremio, modoAdmin, onSeleccionar, onEditar, onEliminar, onTogglePremio }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${
        esPremio ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'
      }`}
      onClick={onSeleccionar}
    >
      {esPremio && (
        <div className="absolute relative z-10">
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">emoji_events</span>
            Premio Torneo
          </div>
        </div>
      )}
      <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-100 relative flex items-center justify-center overflow-hidden">
        <img
          src={obtenerUrlImagen(curso)}
          alt={curso.titulo}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'; }}
        />
        {curso.esGratis ? (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            🎓 GRATIS
          </div>
        ) : curso.precio > 0 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            ${curso.precio.toFixed(2)} MXN
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Certificación</div>
        <h2 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{curso.titulo}</h2>
        {curso.subtitulo && <p className="text-xs text-gray-500 mb-2">{curso.subtitulo}</p>}
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{curso.descripcion.substring(0, 100)}...</p>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">📖 {curso.totalLecciones}</span>
          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">📦 {curso.totalModulos}</span>
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">🎓 {curso.incluyeConstancia}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-2">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">schedule</span>
            {curso.duracion}
          </div>
          <div className="flex items-center gap-2">
            {modoAdmin && (
              <>
                <button onClick={(e) => { e.stopPropagation(); onEditar(); }} className="text-blue-500 hover:text-blue-700" title="Editar">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onEliminar(); }} className="text-red-500 hover:text-red-700" title="Eliminar">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </>
            )}
            <button className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-0.5">
              Ver detalles
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetaCurso;