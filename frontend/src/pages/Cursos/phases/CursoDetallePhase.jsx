import React, { useState } from 'react';

const CursoDetallePhase = ({ curso, onBack, onSeleccionarModulo, estaCompletada, onGenerarConstancia }) => {
  const [moduloExpandido, setModuloExpandido] = useState(null);
  const [capituloExpandido, setCapituloExpandido] = useState(null);
  const [subcapituloExpandido, setSubcapituloExpandido] = useState(null);

  const estructura = curso.estructura || [];

  const calcularProgresoModulo = (modulo) => {
    let total = 0;
    let completadas = 0;
    
    const contar = (items) => {
      items.forEach(item => {
        if (item.lecciones) {
          item.lecciones.forEach(leccion => {
            total++;
            if (estaCompletada(curso.id, modulo.id, leccion.id)) completadas++;
          });
        }
        if (item.subcapitulos) contar(item.subcapitulos);
        if (item.capitulos) contar(item.capitulos);
      });
    };
    
    if (modulo.capitulos) contar(modulo.capitulos);
    if (modulo.lecciones) contar(modulo.lecciones);
    
    return total === 0 ? 0 : Math.round((completadas / total) * 100);
  };

  const renderLeccion = (leccion, moduloId) => {
    const completada = estaCompletada(curso.id, moduloId, leccion.id);
    return (
      <div key={leccion.id} className="p-2 border-b flex justify-between items-center">
        <div>
          <span className="text-purple-600">📖 {leccion.titulo}</span>
          {leccion.tipo === 'video' && <span className="text-xs text-gray-400 ml-2">🎬 Video</span>}
          {leccion.duracion && <span className="text-xs text-gray-400 ml-2">⏱️ {leccion.duracion}</span>}
        </div>
        {completada ? (
          <span className="text-green-500 text-sm">✓ Completado</span>
        ) : (
          <button onClick={() => onSeleccionarModulo({ id: moduloId, lecciones: [leccion] })} className="text-blue-500 text-sm">Ver</button>
        )}
      </div>
    );
  };

  return (
    <div className="px-4">
      {/* Cabecera */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <img src={curso.imagen || 'https://placehold.co/1200x300'} alt={curso.titulo} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold">{curso.titulo}</h1>
          <p className="text-sm opacity-90">{curso.descripcion}</p>
          <div className="flex gap-3 mt-2 text-sm">
            <span>⭐ {curso.nivel}</span>
            <span>⏱️ {curso.duracion}</span>
            <span>💰 ${curso.precio} MXN</span>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between mb-6">
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded-lg">← Volver</button>
        {onGenerarConstancia && (
          <button onClick={onGenerarConstancia} className="bg-green-500 text-white px-4 py-2 rounded-lg">🎓 Generar Constancia</button>
        )}
      </div>

      {/* Contenido */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">📚 Contenido del Curso</h2>
        
        {estructura.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay contenido disponible</p>
        ) : (
          estructura.map((modulo, mIdx) => {
            const progresoModulo = calcularProgresoModulo(modulo);
            return (
              <div key={modulo.id} className="mb-4 border rounded-lg overflow-hidden">
                <button
                  onClick={() => setModuloExpandido(moduloExpandido === mIdx ? null : mIdx)}
                  className="w-full p-3 bg-blue-50 flex justify-between items-center hover:bg-blue-100"
                >
                  <div className="text-left">
                    <span className="font-bold text-blue-800">📘 {modulo.titulo}</span>
                    {modulo.descripcion && <p className="text-xs text-gray-500">{modulo.descripcion}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${progresoModulo}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{progresoModulo}%</span>
                    <span className="material-symbols-outlined">{moduloExpandido === mIdx ? 'expand_less' : 'expand_more'}</span>
                  </div>
                </button>
                
                {moduloExpandido === mIdx && (
                  <div className="p-3">
                    {modulo.capitulos?.length > 0 ? (
                      modulo.capitulos.map((capitulo, cIdx) => (
                        <div key={capitulo.id} className="ml-4 mb-3">
                          <button
                            onClick={() => setCapituloExpandido(capituloExpandido === `${mIdx}-${cIdx}` ? null : `${mIdx}-${cIdx}`)}
                            className="w-full text-left p-2 bg-green-50 rounded flex justify-between items-center"
                          >
                            <span className="font-medium text-green-700">📗 {capitulo.titulo}</span>
                            <span className="material-symbols-outlined text-sm">{capituloExpandido === `${mIdx}-${cIdx}` ? 'expand_less' : 'expand_more'}</span>
                          </button>
                          
                          {capituloExpandido === `${mIdx}-${cIdx}` && (
                            <div className="ml-4 mt-2">
                              {capitulo.subcapitulos?.length > 0 ? (
                                capitulo.subcapitulos.map((subcapitulo, scIdx) => (
                                  <div key={subcapitulo.id} className="ml-4 mb-2">
                                    <button
                                      onClick={() => setSubcapituloExpandido(subcapituloExpandido === `${mIdx}-${cIdx}-${scIdx}` ? null : `${mIdx}-${cIdx}-${scIdx}`)}
                                      className="w-full text-left p-2 bg-yellow-50 rounded flex justify-between items-center"
                                    >
                                      <span className="text-yellow-700">📙 {subcapitulo.titulo}</span>
                                      <span className="material-symbols-outlined text-sm">{subcapituloExpandido === `${mIdx}-${cIdx}-${scIdx}` ? 'expand_less' : 'expand_more'}</span>
                                    </button>
                                    
                                    {subcapituloExpandido === `${mIdx}-${cIdx}-${scIdx}` && (
                                      <div className="ml-4 mt-2">
                                        {subcapitulo.lecciones?.map(leccion => renderLeccion(leccion, modulo.id))}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                capitulo.lecciones?.map(leccion => renderLeccion(leccion, modulo.id))
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      modulo.lecciones?.map(leccion => renderLeccion(leccion, modulo.id))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CursoDetallePhase;