/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';

const FormularioCurso = ({ show, cursoEditado, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    nivel: 'Intermedio',
    duracion: '',
    precio: 0,
    esPremioTorneo: false,
    estructura: []
  });

  const [imagenPreview, setImagenPreview] = useState('');
  const [modulos, setModulos] = useState([]);
  const [modo, setModo] = useState('ver');
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [capituloSeleccionado, setCapituloSeleccionado] = useState(null);
  const [subcapituloSeleccionado, setSubcapituloSeleccionado] = useState(null);
  
  // Estados para edición
  const [editandoModulo, setEditandoModulo] = useState(null);
  const [editandoCapitulo, setEditandoCapitulo] = useState(null);
  const [editandoSubcapitulo, setEditandoSubcapitulo] = useState(null);
  const [editandoLeccion, setEditandoLeccion] = useState(null);
  
  const [nuevoModulo, setNuevoModulo] = useState({ titulo: '', descripcion: '' });
  const [nuevoCapitulo, setNuevoCapitulo] = useState({ titulo: '', descripcion: '' });
  const [nuevoSubcapitulo, setNuevoSubcapitulo] = useState({ titulo: '', descripcion: '' });
  const [nuevaLeccion, setNuevaLeccion] = useState({ titulo: '', contenido: '', videoUrl: '', tipo: 'texto', duracion: '' });

  // Cargar datos cuando se edita un curso
  useEffect(() => {
    if (cursoEditado) {
      setFormData({
        titulo: cursoEditado.titulo || '',
        descripcion: cursoEditado.descripcion || '',
        imagen: cursoEditado.imagen || '',
        nivel: cursoEditado.nivel || 'Intermedio',
        duracion: cursoEditado.duracion || '',
        precio: cursoEditado.precio || 0,
        esPremioTorneo: cursoEditado.esPremioTorneo || false,
        estructura: cursoEditado.estructura || []
      });
      setModulos(cursoEditado.estructura || []);
      setImagenPreview(cursoEditado.imagen || '');
    }
  }, [cursoEditado]);

  // ==================== AGREGAR ====================
  const agregarModulo = () => {
    if (!nuevoModulo.titulo.trim()) return alert('Escribe un nombre');
    setModulos([...modulos, { 
      id: Date.now(), 
      titulo: nuevoModulo.titulo, 
      descripcion: nuevoModulo.descripcion, 
      capitulos: [] 
    }]);
    setNuevoModulo({ titulo: '', descripcion: '' });
    setModo('ver');
  };

  const agregarCapitulo = () => {
    if (!nuevoCapitulo.titulo.trim()) return alert('Escribe un nombre');
    if (moduloSeleccionado === null) return alert('Selecciona un módulo');
    const nuevos = [...modulos];
    nuevos[moduloSeleccionado].capitulos.push({ 
      id: Date.now(), 
      titulo: nuevoCapitulo.titulo, 
      descripcion: nuevoCapitulo.descripcion, 
      subcapitulos: [] 
    });
    setModulos(nuevos);
    setNuevoCapitulo({ titulo: '', descripcion: '' });
    setModo('ver');
  };

  const agregarSubcapitulo = () => {
    if (!nuevoSubcapitulo.titulo.trim()) return alert('Escribe un nombre');
    if (moduloSeleccionado === null || capituloSeleccionado === null) return alert('Selecciona módulo y capítulo');
    const nuevos = [...modulos];
    if (!nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].subcapitulos) {
      nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].subcapitulos = [];
    }
    nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].subcapitulos.push({ 
      id: Date.now(), 
      titulo: nuevoSubcapitulo.titulo, 
      descripcion: nuevoSubcapitulo.descripcion, 
      lecciones: [] 
    });
    setModulos(nuevos);
    setNuevoSubcapitulo({ titulo: '', descripcion: '' });
    setModo('ver');
  };

  const agregarLeccion = () => {
    if (!nuevaLeccion.titulo.trim()) return alert('Escribe un título');
    const nuevos = [...modulos];
    const leccionObj = { 
      id: Date.now(), 
      titulo: nuevaLeccion.titulo,
      contenido: nuevaLeccion.contenido,
      videoUrl: nuevaLeccion.videoUrl,
      tipo: nuevaLeccion.tipo,
      duracion: nuevaLeccion.duracion
    };
    
    if (subcapituloSeleccionado !== null) {
      if (!nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].subcapitulos[subcapituloSeleccionado].lecciones) {
        nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].subcapitulos[subcapituloSeleccionado].lecciones = [];
      }
      nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].subcapitulos[subcapituloSeleccionado].lecciones.push(leccionObj);
    } else if (capituloSeleccionado !== null) {
      if (!nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].lecciones) {
        nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].lecciones = [];
      }
      nuevos[moduloSeleccionado].capitulos[capituloSeleccionado].lecciones.push(leccionObj);
    } else if (moduloSeleccionado !== null) {
      if (!nuevos[moduloSeleccionado].lecciones) {
        nuevos[moduloSeleccionado].lecciones = [];
      }
      nuevos[moduloSeleccionado].lecciones.push(leccionObj);
    }
    
    setModulos(nuevos);
    setNuevaLeccion({ titulo: '', contenido: '', videoUrl: '', tipo: 'texto', duracion: '' });
    setModo('ver');
  };

  // ==================== EDITAR ====================
  const guardarEdicionModulo = () => {
    if (editandoModulo !== null && nuevoModulo.titulo.trim()) {
      const nuevos = [...modulos];
      nuevos[editandoModulo] = {
        ...nuevos[editandoModulo],
        titulo: nuevoModulo.titulo,
        descripcion: nuevoModulo.descripcion
      };
      setModulos(nuevos);
      setEditandoModulo(null);
      setNuevoModulo({ titulo: '', descripcion: '' });
      setModo('ver');
    }
  };

  const guardarEdicionCapitulo = () => {
    if (editandoCapitulo && nuevoCapitulo.titulo.trim()) {
      const { mIdx, cIdx } = editandoCapitulo;
      const nuevos = [...modulos];
      nuevos[mIdx].capitulos[cIdx] = {
        ...nuevos[mIdx].capitulos[cIdx],
        titulo: nuevoCapitulo.titulo,
        descripcion: nuevoCapitulo.descripcion
      };
      setModulos(nuevos);
      setEditandoCapitulo(null);
      setNuevoCapitulo({ titulo: '', descripcion: '' });
      setModo('ver');
    }
  };

  const guardarEdicionSubcapitulo = () => {
    if (editandoSubcapitulo && nuevoSubcapitulo.titulo.trim()) {
      const { mIdx, cIdx, scIdx } = editandoSubcapitulo;
      const nuevos = [...modulos];
      nuevos[mIdx].capitulos[cIdx].subcapitulos[scIdx] = {
        ...nuevos[mIdx].capitulos[cIdx].subcapitulos[scIdx],
        titulo: nuevoSubcapitulo.titulo,
        descripcion: nuevoSubcapitulo.descripcion
      };
      setModulos(nuevos);
      setEditandoSubcapitulo(null);
      setNuevoSubcapitulo({ titulo: '', descripcion: '' });
      setModo('ver');
    }
  };

  const guardarEdicionLeccion = () => {
    if (editandoLeccion && nuevaLeccion.titulo.trim()) {
      const { mIdx, cIdx, scIdx, lIdx } = editandoLeccion;
      const nuevos = [...modulos];
      const leccionEditada = {
        id: Date.now(),
        titulo: nuevaLeccion.titulo,
        contenido: nuevaLeccion.contenido,
        videoUrl: nuevaLeccion.videoUrl,
        tipo: nuevaLeccion.tipo,
        duracion: nuevaLeccion.duracion
      };
      
      if (scIdx !== undefined) {
        nuevos[mIdx].capitulos[cIdx].subcapitulos[scIdx].lecciones[lIdx] = leccionEditada;
      } else if (cIdx !== undefined) {
        nuevos[mIdx].capitulos[cIdx].lecciones[lIdx] = leccionEditada;
      } else {
        nuevos[mIdx].lecciones[lIdx] = leccionEditada;
      }
      
      setModulos(nuevos);
      setEditandoLeccion(null);
      setNuevaLeccion({ titulo: '', contenido: '', videoUrl: '', tipo: 'texto', duracion: '' });
      setModo('ver');
    }
  };

  // ==================== ELIMINAR ====================
  const eliminarItem = (tipo, indices) => {
    if (!window.confirm('¿Eliminar?')) return;
    const nuevos = [...modulos];
    if (tipo === 'modulo') nuevos.splice(indices.mIdx, 1);
    else if (tipo === 'capitulo') nuevos[indices.mIdx].capitulos.splice(indices.cIdx, 1);
    else if (tipo === 'subcapitulo') nuevos[indices.mIdx].capitulos[indices.cIdx].subcapitulos.splice(indices.scIdx, 1);
    else if (tipo === 'leccion') {
      if (indices.scIdx !== undefined) nuevos[indices.mIdx].capitulos[indices.cIdx].subcapitulos[indices.scIdx].lecciones.splice(indices.lIdx, 1);
      else if (indices.cIdx !== undefined) nuevos[indices.mIdx].capitulos[indices.cIdx].lecciones.splice(indices.lIdx, 1);
      else nuevos[indices.mIdx].lecciones.splice(indices.lIdx, 1);
    }
    setModulos(nuevos);
    setModuloSeleccionado(null);
    setCapituloSeleccionado(null);
    setSubcapituloSeleccionado(null);
  };

  // ==================== RENDER ESTRUCTURA ====================
  const renderEstructura = () => {
    if (modulos.length === 0) {
      return <div className="text-center py-8 text-gray-400">No hay módulos. Agrega uno.</div>;
    }
    
    return modulos.map((m, mIdx) => (
      <div key={m.id} className="border rounded-lg mb-2">
        <div className="p-2 bg-gray-100 flex justify-between items-center">
          <span className="font-bold cursor-pointer" onClick={() => setModuloSeleccionado(moduloSeleccionado === mIdx ? null : mIdx)}>
            📘 {m.titulo}
          </span>
          <div className="flex gap-1">
            <button onClick={() => {
              setNuevoModulo({ titulo: m.titulo, descripcion: m.descripcion || '' });
              setEditandoModulo(mIdx);
              setModo('editandoModulo');
            }} className="text-blue-500 text-xs">✏️</button>
            <button onClick={(e) => { e.stopPropagation(); eliminarItem('modulo', { mIdx }); }} className="text-red-500">🗑️</button>
          </div>
        </div>
        
        {moduloSeleccionado === mIdx && (
          <div className="ml-4 p-2">
            {m.capitulos?.map((c, cIdx) => (
              <div key={c.id} className="border-l-2 border-green-300 pl-2 my-1">
                <div className="flex justify-between items-center">
                  <span className="cursor-pointer" onClick={() => setCapituloSeleccionado(capituloSeleccionado === cIdx ? null : cIdx)}>
                    📗 {c.titulo}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => {
                      setNuevoCapitulo({ titulo: c.titulo, descripcion: c.descripcion || '' });
                      setEditandoCapitulo({ mIdx, cIdx });
                      setModo('editandoCapitulo');
                    }} className="text-blue-500 text-xs">✏️</button>
                    <button onClick={() => eliminarItem('capitulo', { mIdx, cIdx })} className="text-red-500 text-xs">🗑️</button>
                  </div>
                </div>
                
                {capituloSeleccionado === cIdx && (
                  <div className="ml-4">
                    {c.subcapitulos?.map((s, scIdx) => (
                      <div key={s.id} className="border-l-2 border-yellow-300 pl-2 my-1">
                        <div className="flex justify-between items-center">
                          <span className="cursor-pointer" onClick={() => setSubcapituloSeleccionado(subcapituloSeleccionado === scIdx ? null : scIdx)}>
                            📙 {s.titulo}
                          </span>
                          <div className="flex gap-1">
                            <button onClick={() => {
                              setNuevoSubcapitulo({ titulo: s.titulo, descripcion: s.descripcion || '' });
                              setEditandoSubcapitulo({ mIdx, cIdx, scIdx });
                              setModo('editandoSubcapitulo');
                            }} className="text-blue-500 text-xs">✏️</button>
                            <button onClick={() => eliminarItem('subcapitulo', { mIdx, cIdx, scIdx })} className="text-red-500 text-xs">🗑️</button>
                          </div>
                        </div>
                        
                        {subcapituloSeleccionado === scIdx && s.lecciones?.map((l, lIdx) => (
                          <div key={l.id} className="ml-4 text-purple-600 flex justify-between items-center">
                            <span>📖 {l.titulo}</span>
                            <div className="flex gap-1">
                              <button onClick={() => {
                                setNuevaLeccion({
                                  titulo: l.titulo,
                                  contenido: l.contenido || '',
                                  videoUrl: l.videoUrl || '',
                                  tipo: l.tipo || 'texto',
                                  duracion: l.duracion || ''
                                });
                                setEditandoLeccion({ mIdx, cIdx, scIdx, lIdx });
                                setModo('editandoLeccion');
                              }} className="text-blue-500 text-xs">✏️</button>
                              <button onClick={() => eliminarItem('leccion', { mIdx, cIdx, scIdx, lIdx })} className="text-red-500 text-xs">🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    {c.lecciones?.map((l, lIdx) => (
                      <div key={l.id} className="text-purple-600 flex justify-between items-center">
                        <span>📖 {l.titulo}</span>
                        <div className="flex gap-1">
                          <button onClick={() => {
                            setNuevaLeccion({
                              titulo: l.titulo,
                              contenido: l.contenido || '',
                              videoUrl: l.videoUrl || '',
                              tipo: l.tipo || 'texto',
                              duracion: l.duracion || ''
                            });
                            setEditandoLeccion({ mIdx, cIdx, lIdx });
                            setModo('editandoLeccion');
                          }} className="text-blue-500 text-xs">✏️</button>
                          <button onClick={() => eliminarItem('leccion', { mIdx, cIdx, lIdx })} className="text-red-500 text-xs">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {m.lecciones?.map((l, lIdx) => (
              <div key={l.id} className="text-purple-600 flex justify-between items-center">
                <span>📖 {l.titulo}</span>
                <div className="flex gap-1">
                  <button onClick={() => {
                    setNuevaLeccion({
                      titulo: l.titulo,
                      contenido: l.contenido || '',
                      videoUrl: l.videoUrl || '',
                      tipo: l.tipo || 'texto',
                      duracion: l.duracion || ''
                    });
                    setEditandoLeccion({ mIdx, lIdx });
                    setModo('editandoLeccion');
                  }} className="text-blue-500 text-xs">✏️</button>
                  <button onClick={() => eliminarItem('leccion', { mIdx, lIdx })} className="text-red-500 text-xs">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  // ==================== RENDER FORMULARIOS ====================
  const renderFormularioAgregar = () => {
    // Editar Módulo
    if (modo === 'editandoModulo') {
      return (
        <div className="bg-blue-50 p-2 rounded mt-2">
          <h4 className="font-bold text-blue-800 mb-2">✏️ Editar Módulo</h4>
          <input type="text" placeholder="Nombre del módulo" value={nuevoModulo.titulo} onChange={e => setNuevoModulo({...nuevoModulo, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <textarea placeholder="Descripción" rows="2" value={nuevoModulo.descripcion} onChange={e => setNuevoModulo({...nuevoModulo, descripcion: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <div className="flex gap-2"><button onClick={guardarEdicionModulo} className="bg-green-500 text-white px-2 py-1 rounded">Guardar cambios</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
        </div>
      );
    }
    
    // Editar Capítulo
    if (modo === 'editandoCapitulo') {
      return (
        <div className="bg-green-50 p-2 rounded mt-2">
          <h4 className="font-bold text-green-800 mb-2">✏️ Editar Capítulo</h4>
          <input type="text" placeholder="Nombre del capítulo" value={nuevoCapitulo.titulo} onChange={e => setNuevoCapitulo({...nuevoCapitulo, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <textarea placeholder="Descripción" rows="2" value={nuevoCapitulo.descripcion} onChange={e => setNuevoCapitulo({...nuevoCapitulo, descripcion: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <div className="flex gap-2"><button onClick={guardarEdicionCapitulo} className="bg-green-500 text-white px-2 py-1 rounded">Guardar cambios</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
        </div>
      );
    }
    
    // Editar Subcapítulo
    if (modo === 'editandoSubcapitulo') {
      return (
        <div className="bg-yellow-50 p-2 rounded mt-2">
          <h4 className="font-bold text-yellow-800 mb-2">✏️ Editar Subcapítulo</h4>
          <input type="text" placeholder="Nombre del subcapítulo" value={nuevoSubcapitulo.titulo} onChange={e => setNuevoSubcapitulo({...nuevoSubcapitulo, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <textarea placeholder="Descripción" rows="2" value={nuevoSubcapitulo.descripcion} onChange={e => setNuevoSubcapitulo({...nuevoSubcapitulo, descripcion: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <div className="flex gap-2"><button onClick={guardarEdicionSubcapitulo} className="bg-green-500 text-white px-2 py-1 rounded">Guardar cambios</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
        </div>
      );
    }
    
    // Editar Lección
    if (modo === 'editandoLeccion') {
      return (
        <div className="bg-purple-50 p-2 rounded mt-2">
          <h4 className="font-bold text-purple-800 mb-2">✏️ Editar Lección</h4>
          <input type="text" placeholder="Título de la lección" value={nuevaLeccion.titulo} onChange={e => setNuevaLeccion({...nuevaLeccion, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <select value={nuevaLeccion.tipo} onChange={e => setNuevaLeccion({...nuevaLeccion, tipo: e.target.value})} className="w-full p-1 border rounded mb-1">
            <option value="texto">📝 Texto</option>
            <option value="video">🎬 Video</option>
          </select>
          <input type="text" placeholder="URL del video" value={nuevaLeccion.videoUrl} onChange={e => setNuevaLeccion({...nuevaLeccion, videoUrl: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <input type="text" placeholder="Duración (ej: 15 min)" value={nuevaLeccion.duracion} onChange={e => setNuevaLeccion({...nuevaLeccion, duracion: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <textarea placeholder="Contenido de la lección" rows="3" value={nuevaLeccion.contenido} onChange={e => setNuevaLeccion({...nuevaLeccion, contenido: e.target.value})} className="w-full p-1 border rounded mb-1" />
          <div className="flex gap-2"><button onClick={guardarEdicionLeccion} className="bg-green-500 text-white px-2 py-1 rounded">Guardar cambios</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
        </div>
      );
    }
    
    // Agregar nuevos
    switch(modo) {
      case 'agregarModulo':
        return (
          <div className="bg-blue-50 p-2 rounded mt-2">
            <h4 className="font-bold text-blue-800 mb-2">➕ Agregar Módulo</h4>
            <input type="text" placeholder="Nombre del módulo" value={nuevoModulo.titulo} onChange={e => setNuevoModulo({...nuevoModulo, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <textarea placeholder="Descripción" rows="2" value={nuevoModulo.descripcion} onChange={e => setNuevoModulo({...nuevoModulo, descripcion: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <div className="flex gap-2"><button onClick={agregarModulo} className="bg-blue-500 text-white px-2 py-1 rounded">Guardar</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
          </div>
        );
      case 'agregarCapitulo':
        return (
          <div className="bg-green-50 p-2 rounded mt-2">
            <h4 className="font-bold text-green-800 mb-2">➕ Agregar Capítulo</h4>
            <input type="text" placeholder="Nombre del capítulo" value={nuevoCapitulo.titulo} onChange={e => setNuevoCapitulo({...nuevoCapitulo, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <textarea placeholder="Descripción" rows="2" value={nuevoCapitulo.descripcion} onChange={e => setNuevoCapitulo({...nuevoCapitulo, descripcion: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <div className="flex gap-2"><button onClick={agregarCapitulo} className="bg-green-500 text-white px-2 py-1 rounded">Guardar</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
          </div>
        );
      case 'agregarSubcapitulo':
        return (
          <div className="bg-yellow-50 p-2 rounded mt-2">
            <h4 className="font-bold text-yellow-800 mb-2">➕ Agregar Subcapítulo</h4>
            <input type="text" placeholder="Nombre del subcapítulo" value={nuevoSubcapitulo.titulo} onChange={e => setNuevoSubcapitulo({...nuevoSubcapitulo, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <textarea placeholder="Descripción" rows="2" value={nuevoSubcapitulo.descripcion} onChange={e => setNuevoSubcapitulo({...nuevoSubcapitulo, descripcion: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <div className="flex gap-2"><button onClick={agregarSubcapitulo} className="bg-yellow-500 text-white px-2 py-1 rounded">Guardar</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
          </div>
        );
      case 'agregarLeccion':
        return (
          <div className="bg-purple-50 p-2 rounded mt-2">
            <h4 className="font-bold text-purple-800 mb-2">➕ Agregar Lección</h4>
            <input type="text" placeholder="Título de la lección" value={nuevaLeccion.titulo} onChange={e => setNuevaLeccion({...nuevaLeccion, titulo: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <select value={nuevaLeccion.tipo} onChange={e => setNuevaLeccion({...nuevaLeccion, tipo: e.target.value})} className="w-full p-1 border rounded mb-1">
              <option value="texto">📝 Texto</option>
              <option value="video">🎬 Video</option>
            </select>
            <input type="text" placeholder="URL del video" value={nuevaLeccion.videoUrl} onChange={e => setNuevaLeccion({...nuevaLeccion, videoUrl: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <textarea placeholder="Contenido" rows="3" value={nuevaLeccion.contenido} onChange={e => setNuevaLeccion({...nuevaLeccion, contenido: e.target.value})} className="w-full p-1 border rounded mb-1" />
            <div className="flex gap-2"><button onClick={agregarLeccion} className="bg-purple-500 text-white px-2 py-1 rounded">Guardar</button><button onClick={() => setModo('ver')} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button></div>
          </div>
        );
      default: return null;
    }
  };

  const handleSubmit = () => {
    if (!formData.titulo.trim()) return alert('Título requerido');
    if (!formData.descripcion.trim()) return alert('Descripción requerida');
    if (!formData.imagen.trim()) return alert('URL de imagen requerida');
    onSave({ ...formData, estructura: modulos }, cursoEditado?.id);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 p-4 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{cursoEditado ? 'Editar Curso' : 'Nuevo Curso'}</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" placeholder="Título del curso" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="p-2 border rounded" />
            <select value={formData.nivel} onChange={e => setFormData({...formData, nivel: e.target.value})} className="p-2 border rounded">
              <option>Básico</option><option>Intermedio</option><option>Avanzado</option>
            </select>
          </div>
          <textarea placeholder="Descripción" rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-2 border rounded mb-3" />
          
          <input type="url" placeholder="URL de la imagen (ej: https://images.unsplash.com/...)" value={formData.imagen} onChange={e => { setFormData({...formData, imagen: e.target.value}); setImagenPreview(e.target.value); }} className="w-full p-2 border rounded mb-3" />
          {imagenPreview && <img src={imagenPreview} alt="preview" className="h-20 object-cover rounded mb-3" />}
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" placeholder="Duración" value={formData.duracion} onChange={e => setFormData({...formData, duracion: e.target.value})} className="p-2 border rounded" />
            <input type="number" placeholder="Precio MXN" value={formData.precio} onChange={e => setFormData({...formData, precio: parseFloat(e.target.value) || 0})} className="p-2 border rounded" />
          </div>
          
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={formData.esPremioTorneo} onChange={e => setFormData({...formData, esPremioTorneo: e.target.checked})} /> 
            Marcar como Premio del Torneo
          </label>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-3">
              <h3 className="font-bold">📚 Estructura del Curso</h3>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setEditandoModulo(null); setModo('agregarModulo'); }} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">+ Módulo</button>
                <button onClick={() => moduloSeleccionado !== null && setModo('agregarCapitulo')} className="bg-green-500 text-white px-2 py-1 rounded text-sm">+ Capítulo</button>
                <button onClick={() => moduloSeleccionado !== null && capituloSeleccionado !== null && setModo('agregarSubcapitulo')} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">+ Subcapítulo</button>
                <button onClick={() => moduloSeleccionado !== null && setModo('agregarLeccion')} className="bg-purple-500 text-white px-2 py-1 rounded text-sm">+ Lección</button>
              </div>
            </div>
            <div className="border rounded p-3 max-h-80 overflow-y-auto bg-gray-50">
              {renderEstructura()}
            </div>
            {renderFormularioAgregar()}
            <div className="text-xs text-gray-400 mt-2">💡 Haz clic en un módulo/capítulo/subcapítulo para expandirlo y ver su contenido</div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Guardar Curso</button>
        </div>
      </div>
    </div>
  );
};

export default FormularioCurso;