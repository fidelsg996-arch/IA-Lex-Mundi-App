// src/pages/Cursos/components/SeccionPremios.jsx
import React from 'react';
import { obtenerUrlImagen } from '../utils/helpers';

const SeccionPremios = ({ cursos, modoAdmin, onSeleccionar, onEditar, onTogglePremio }) => {
  if (cursos.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-2xl text-amber-500">emoji_events</span>
        <h2 className="text-lg font-bold text-gray-800">🏆 Premios del Torneo Jurídico Activo</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cursos.map(curso => (
          <div
            key={`premio-${curso.id}`}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md border border-amber-200 overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => onSeleccionar(curso)}
          >
            <div className="flex p-3 gap-3">
              <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                <img src={obtenerUrlImagen(curso)} alt={curso.titulo} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
                  <span className="text-xs text-amber-600 font-semibold">Premio del Torneo</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{curso.titulo}</h3>
                {curso.esGratis ? (
                  <p className="text-green-600 font-bold text-sm mt-1">🎓 GRATIS</p>
                ) : curso.precio > 0 && (
                  <p className="text-amber-700 font-bold text-sm mt-1">${curso.precio.toFixed(2)} MXN</p>
                )}
                {modoAdmin && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={(e) => { e.stopPropagation(); onEditar(curso); }} className="text-xs text-blue-500">Editar</button>
                    <button onClick={(e) => { e.stopPropagation(); onTogglePremio(curso.id); }} className="text-xs text-red-500">Quitar premio</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default SeccionPremios;