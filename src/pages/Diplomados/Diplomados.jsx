import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const STORAGE_KEY = 'lexmindi_diplomados';

const diplomadosIniciales = [
  { 
    id: 1, 
    titulo: 'Diplomado en Derecho Corporativo', 
    subtitulo: 'Especialización en derecho empresarial',
    descripcion: 'Formación integral en derecho corporativo, gobierno corporativo, compliance y fusiones', 
    imagenPortada: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop',
    duracion: '160 horas', 
    nivel: 'Avanzado',
    modalidad: 'En vivo',
    precio: 5000, 
    gratis: false,
    esPremioTorneo: false,
    url: 'https://ejemplo.com/diplomado-corporativo',
    modulo: [],
    examenFinal: { preguntas: [] },
    constancia: '',
    certificacion: ''
  },
  { 
    id: 2, 
    titulo: 'Diplomado en Juicios Orales', 
    subtitulo: 'Técnicas y estrategias para juicios orales',
    descripcion: 'Preparación intensiva para litigación oral, teoría del caso y técnicas de interrogatorio', 
    imagenPortada: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?q=80&w=2070&auto=format&fit=crop',
    duracion: '120 horas', 
    nivel: 'Intermedio',
    modalidad: 'Presencial',
    precio: 4500, 
    gratis: false,
    esPremioTorneo: false,
    url: 'https://ejemplo.com/diplomado-juicios-orales',
    modulo: [],
    examenFinal: { preguntas: [] },
    constancia: '',
    certificacion: ''
  }
];

const Diplomados = () => {
  const { user, isAdmin } = useAuth();
  const modoAdmin = isAdmin();
  
  const [diplomados, setDiplomados] = useState([]);
  const [editandoDiplomado, setEditandoDiplomado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModuloForm, setShowModuloForm] = useState(false);
  const [showLeccionForm, setShowLeccionForm] = useState(false);
  const [showEditarLeccionForm, setShowEditarLeccionForm] = useState(false);
  const [moduloEditando, setModuloEditando] = useState(null);
  const [leccionEditando, setLeccionEditando] = useState(null);
  const [moduloIndexEditando, setModuloIndexEditando] = useState(null);
  const [editandoModuloTitulo, setEditandoModuloTitulo] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', subtitulo: '', descripcion: '', duracion: '', nivel: '', modalidad: '', precio: '',
    imagenPortada: '', url: '', gratis: false, esPremioTorneo: false,
    modulo: [], examenFinal: { preguntas: [] }, constancia: '', certificacion: ''
  });
  const [nuevoModulo, setNuevoModulo] = useState({ titulo: '' });
  const [nuevaLeccion, setNuevaLeccion] = useState({ titulo: '', contenido: '', video: '', recursos: [] });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setDiplomados(JSON.parse(stored));
    else setDiplomados(diplomadosIniciales);
  }, []);

  useEffect(() => {
    if (diplomados.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(diplomados));
  }, [diplomados]);

  const abrirFormNuevo = () => {
    if (!modoAdmin) return;
    setEditandoDiplomado(null);
    setFormData({
      titulo: '', subtitulo: '', descripcion: '', duracion: '', nivel: 'Intermedio', modalidad: 'En vivo', precio: '',
      imagenPortada: '', url: '', gratis: false, esPremioTorneo: false,
      modulo: [], examenFinal: { preguntas: [] }, constancia: '', certificacion: ''
    });
    setShowForm(true);
  };

  const abrirFormEditar = (diplomado) => {
    if (!modoAdmin) return;
    setEditandoDiplomado(diplomado);
    setFormData({
      titulo: diplomado.titulo, subtitulo: diplomado.subtitulo || '', descripcion: diplomado.descripcion,
      duracion: diplomado.duracion, nivel: diplomado.nivel || 'Intermedio', modalidad: diplomado.modalidad || 'En vivo',
      precio: diplomado.precio.toString(),
      imagenPortada: diplomado.imagenPortada || '', url: diplomado.url || '',
      gratis: diplomado.gratis || false, esPremioTorneo: diplomado.esPremioTorneo || false,
      modulo: diplomado.modulo || [], examenFinal: diplomado.examenFinal || { preguntas: [] },
      constancia: diplomado.constancia || '', certificacion: diplomado.certificacion || ''
    });
    setShowForm(true);
  };

  const editarTituloModulo = (moduloIndex, nuevoTitulo) => {
    const moduloActualizado = [...formData.modulo];
    moduloActualizado[moduloIndex].titulo = nuevoTitulo;
    setFormData({ ...formData, modulo: moduloActualizado });
    setEditandoModuloTitulo(null);
  };

  const abrirEditarLeccion = (moduloIndex, leccionIndex, leccion) => {
    setModuloIndexEditando(moduloIndex);
    setLeccionEditando({ ...leccion, index: leccionIndex, moduloIndex });
    setNuevaLeccion({
      titulo: leccion.titulo,
      contenido: leccion.contenido || '',
      video: leccion.video || '',
      recursos: leccion.recursos || []
    });
    setShowEditarLeccionForm(true);
  };

  const guardarEdicionLeccion = () => {
    if (!nuevaLeccion.titulo) return;
    const moduloActualizado = [...formData.modulo];
    moduloActualizado[moduloIndexEditando].lecciones[leccionEditando.index] = {
      ...leccionEditando,
      titulo: nuevaLeccion.titulo,
      contenido: nuevaLeccion.contenido,
      video: nuevaLeccion.video,
      recursos: nuevaLeccion.recursos
    };
    setFormData({ ...formData, modulo: moduloActualizado });
    setShowEditarLeccionForm(false);
    setLeccionEditando(null);
    setNuevaLeccion({ titulo: '', contenido: '', video: '', recursos: [] });
  };

  const agregarModulo = () => {
    if (!nuevoModulo.titulo) return;
    const nuevoModuloObj = {
      id: Date.now(),
      titulo: nuevoModulo.titulo,
      lecciones: [],
      examenParcial: { preguntas: [] }
    };
    setFormData({ ...formData, modulo: [...formData.modulo, nuevoModuloObj] });
    setNuevoModulo({ titulo: '' });
    setShowModuloForm(false);
  };

  const agregarLeccion = (moduloIndex) => {
    if (!nuevaLeccion.titulo) return;
    const nuevaLeccionObj = {
      id: Date.now(),
      titulo: nuevaLeccion.titulo,
      contenido: nuevaLeccion.contenido,
      video: nuevaLeccion.video,
      recursos: nuevaLeccion.recursos
    };
    const moduloActualizado = [...formData.modulo];
    moduloActualizado[moduloIndex].lecciones.push(nuevaLeccionObj);
    setFormData({ ...formData, modulo: moduloActualizado });
    setNuevaLeccion({ titulo: '', contenido: '', video: '', recursos: [] });
    setShowLeccionForm(false);
  };

  const eliminarModulo = (moduloIndex) => {
    if (window.confirm('¿Eliminar este módulo y todas sus lecciones?')) {
      const moduloActualizado = formData.modulo.filter((_, i) => i !== moduloIndex);
      setFormData({ ...formData, modulo: moduloActualizado });
    }
  };

  const eliminarLeccion = (moduloIndex, leccionIndex) => {
    if (window.confirm('¿Eliminar esta lección?')) {
      const moduloActualizado = [...formData.modulo];
      moduloActualizado[moduloIndex].lecciones = moduloActualizado[moduloIndex].lecciones.filter((_, i) => i !== leccionIndex);
      setFormData({ ...formData, modulo: moduloActualizado });
    }
  };

  const guardarDiplomado = () => {
    if (!modoAdmin) return;
    if (!formData.titulo) {
      alert('El título es obligatorio');
      return;
    }

    const nuevoDiplomado = {
      id: editandoDiplomado ? editandoDiplomado.id : Date.now(),
      titulo: formData.titulo,
      subtitulo: formData.subtitulo,
      descripcion: formData.descripcion,
      duracion: formData.duracion,
      nivel: formData.nivel,
      modalidad: formData.modalidad,
      precio: parseFloat(formData.precio) || 0,
      imagenPortada: formData.imagenPortada,
      url: formData.url,
      gratis: formData.gratis,
      esPremioTorneo: formData.esPremioTorneo,
      modulo: formData.modulo,
      examenFinal: formData.examenFinal,
      constancia: formData.constancia,
      certificacion: formData.certificacion
    };

    if (editandoDiplomado) {
      setDiplomados(diplomados.map(d => d.id === editandoDiplomado.id ? nuevoDiplomado : d));
    } else {
      setDiplomados([...diplomados, nuevoDiplomado]);
    }
    setShowForm(false);
    setEditandoDiplomado(null);
  };

  const eliminarDiplomado = (id) => {
    if (!modoAdmin) return;
    if (window.confirm('¿Eliminar este diplomado?')) {
      setDiplomados(diplomados.filter(d => d.id !== id));
    }
  };

  const toggleGratis = () => setFormData({ ...formData, gratis: !formData.gratis });
  const togglePremioTorneo = () => setFormData({ ...formData, esPremioTorneo: !formData.esPremioTorneo });

  if (!modoAdmin && showForm) setShowForm(false);

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
            {modoAdmin && (
              <button onClick={abrirFormNuevo} className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-purple-600">
                <span className="material-symbols-outlined text-sm">add</span> Nuevo Diplomado
              </button>
            )}
          </div>
          <p className="text-gray-200 text-sm">Programas de especialización con certificación oficial</p>
        </div>
      </div>

      {/* Grid de diplomados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {diplomados.map(dip => (
          <div key={dip.id} className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow ${dip.esPremioTorneo ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'}`}>
            <div className="h-36 bg-gradient-to-br from-purple-50 to-indigo-100 relative overflow-hidden">
              {dip.imagenPortada && <img src={dip.imagenPortada} alt={dip.titulo} className="w-full h-full object-cover" />}
              {!dip.imagenPortada && <div className="flex items-center justify-center h-full"><span className="material-symbols-outlined text-5xl text-purple-500">workspace_premium</span></div>}
              {dip.esPremioTorneo && <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-xs">emoji_events</span> Premio Torneo</div>}
              <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">{dip.gratis ? 'GRATIS' : `$${dip.precio.toFixed(2)} MXN`}</div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1"><h2 className="text-sm font-bold text-gray-800 line-clamp-2">{dip.titulo}</h2>{dip.subtitulo && <p className="text-xs text-gray-500 mt-0.5">{dip.subtitulo}</p>}</div>
                {modoAdmin && (<div className="flex gap-1 ml-2 flex-shrink-0"><button onClick={() => abrirFormEditar(dip)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button><button onClick={() => eliminarDiplomado(dip.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button></div>)}
              </div>
              <p className="text-gray-600 text-xs mt-2 line-clamp-2">{dip.descripcion}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-2"><div className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">schedule</span>{dip.duracion}</div><div className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">signal_cellular_alt</span>{dip.nivel}</div></div>
              <div className="mt-2 flex flex-wrap gap-1"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{dip.modulo?.length || 0} módulos</span>{dip.certificacion && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Certificado</span>}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal principal de edición - exactamente igual que Cursos */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-800 to-purple-700 p-4 rounded-t-2xl sticky top-0"><h2 className="text-xl font-bold text-white">{editandoDiplomado ? 'Editar Diplomado' : 'Nuevo Diplomado'}</h2></div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">Título *</label><input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold mb-1">Subtítulo</label><input type="text" value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
              </div>
              <div><label className="block text-xs font-bold mb-1">Descripción</label><textarea rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-2 text-sm border rounded"></textarea></div>
              <div className="grid grid-cols-4 gap-4">
                <div><label className="block text-xs font-bold mb-1">Duración</label><input type="text" value={formData.duracion} onChange={e => setFormData({...formData, duracion: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold mb-1">Nivel</label><select value={formData.nivel} onChange={e => setFormData({...formData, nivel: e.target.value})} className="w-full p-2 text-sm border rounded"><option value="Básico">Básico</option><option value="Intermedio">Intermedio</option><option value="Avanzado">Avanzado</option><option value="Experto">Experto</option></select></div>
                <div><label className="block text-xs font-bold mb-1">Modalidad</label><select value={formData.modalidad} onChange={e => setFormData({...formData, modalidad: e.target.value})} className="w-full p-2 text-sm border rounded"><option value="En vivo">En vivo</option><option value="Online">Online</option><option value="Presencial">Presencial</option><option value="Híbrido">Híbrido</option></select></div>
                <div><label className="block text-xs font-bold mb-1">Precio</label><input type="number" step="0.01" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">URL Imagen Portada</label><input type="url" value={formData.imagenPortada} onChange={e => setFormData({...formData, imagenPortada: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold mb-1">URL Producto</label><input type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
              </div>
              <div className="flex gap-6"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.gratis} onChange={toggleGratis} /> Marcar como GRATIS</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.esPremioTorneo} onChange={togglePremioTorneo} /> Marcar como Premio del Torneo Jurídico Activo</label></div>

              {/* Módulos del Diplomado */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-md">📚 Módulos del Diplomado</h3><button onClick={() => setShowModuloForm(true)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">+ Agregar Módulo</button></div>
                
                {formData.modulo.map((modulo, idx) => (
                  <div key={modulo.id} className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center">
                      {editandoModuloTitulo === modulo.id ? (
                        <input type="text" defaultValue={modulo.titulo} onBlur={(e) => editarTituloModulo(idx, e.target.value)} onKeyPress={(e) => e.key === 'Enter' && editarTituloModulo(idx, e.target.value)} className="font-semibold text-md border rounded px-2 py-1" autoFocus />
                      ) : (
                        <h4 className="font-semibold cursor-pointer hover:text-purple-600" onClick={() => setEditandoModuloTitulo(modulo.id)}>📘 {modulo.titulo} <span className="text-xs text-gray-400">(clic para editar)</span></h4>
                      )}
                      <button onClick={() => eliminarModulo(idx)} className="text-red-500 text-sm">Eliminar</button>
                    </div>
                    
                    <div className="ml-4 mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold">📖 Lecciones:</span>
                        <button onClick={() => { setModuloEditando(idx); setShowLeccionForm(true); }} className="text-blue-500 text-xs">+ Agregar Lección</button>
                      </div>
                      {modulo.lecciones.map((leccion, lecIdx) => (
                        <div key={leccion.id} className="bg-white rounded p-2 mb-1 text-sm flex justify-between items-center hover:bg-gray-100">
                          <div className="flex-1 cursor-pointer" onClick={() => abrirEditarLeccion(idx, lecIdx, leccion)}>
                            <span className="font-medium">📖 {leccion.titulo}</span>
                            <span className="text-xs text-gray-400 ml-2">(clic para editar contenido)</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => abrirEditarLeccion(idx, lecIdx, leccion)} className="text-blue-500 text-xs" title="Editar contenido">✏️</button>
                            <button onClick={() => eliminarLeccion(idx, lecIdx)} className="text-red-400 text-xs" title="Eliminar">🗑️</button>
                          </div>
                        </div>
                      ))}
                      {modulo.lecciones.length === 0 && <p className="text-xs text-gray-400 italic p-2">No hay lecciones aún. Haz clic en "+ Agregar Lección"</p>}
                    </div>
                  </div>
                ))}
                {formData.modulo.length === 0 && <p className="text-gray-400 text-sm italic text-center py-4">No hay módulos. Haz clic en "+ Agregar Módulo"</p>}
              </div>

              {/* Certificados */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div><label className="block text-xs font-bold mb-1">URL Constancia</label><input type="url" value={formData.constancia} onChange={e => setFormData({...formData, constancia: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold mb-1">URL Certificación</label><input type="url" value={formData.certificacion} onChange={e => setFormData({...formData, certificacion: e.target.value})} className="w-full p-2 text-sm border rounded" /></div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t sticky bottom-0 bg-white">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={guardarDiplomado} className="px-4 py-2 bg-purple-500 text-white rounded-lg">Guardar Diplomado</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar módulo */}
      {showModuloForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Agregar Módulo</h2>
            <input type="text" placeholder="Título del módulo" value={nuevoModulo.titulo} onChange={e => setNuevoModulo({...nuevoModulo, titulo: e.target.value})} className="w-full p-2 border rounded mb-4" />
            <div className="flex gap-3"><button onClick={() => setShowModuloForm(false)} className="flex-1 bg-gray-200 py-2 rounded">Cancelar</button><button onClick={agregarModulo} className="flex-1 bg-green-500 text-white py-2 rounded">Agregar</button></div>
          </div>
        </div>
      )}

      {/* Modal para agregar nueva lección */}
      {showLeccionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-t-2xl"><h2 className="text-xl font-bold text-white">Agregar Nueva Lección</h2></div>
            <div className="p-5 space-y-4">
              <div><label className="block text-xs font-bold mb-1">Título de la lección *</label><input type="text" placeholder="Ej: Introducción al Derecho Corporativo" value={nuevaLeccion.titulo} onChange={e => setNuevaLeccion({...nuevaLeccion, titulo: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-xs font-bold mb-1">Contenido completo (mínimo 50,000 palabras recomendado)</label><textarea placeholder="Desarrolla aquí el contenido extenso de la lección. Soporta hasta 500,000 caracteres." rows="15" value={nuevaLeccion.contenido} onChange={e => setNuevaLeccion({...nuevaLeccion, contenido: e.target.value})} className="w-full p-3 border rounded font-mono text-sm"></textarea><p className="text-xs text-gray-400 mt-1">Caracteres: {nuevaLeccion.contenido.length.toLocaleString()} / 500,000</p></div>
              <div><label className="block text-xs font-bold mb-1">URL del video (YouTube/Vimeo - opcional)</label><input type="url" placeholder="https://youtube.com/..." value={nuevaLeccion.video} onChange={e => setNuevaLeccion({...nuevaLeccion, video: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-xs font-bold mb-1">Recursos adicionales (URLs separadas por coma)</label><input type="text" placeholder="https://ejemplo.com/doc1.pdf, https://ejemplo.com/doc2.pdf" value={nuevaLeccion.recursos?.join(', ') || ''} onChange={e => setNuevaLeccion({...nuevaLeccion, recursos: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 border rounded" /></div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t"><button onClick={() => setShowLeccionForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button><button onClick={() => agregarLeccion(moduloEditando)} disabled={!nuevaLeccion.titulo} className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50">Guardar Lección</button></div>
          </div>
        </div>
      )}

      {/* Modal para editar lección existente */}
      {showEditarLeccionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 rounded-t-2xl"><h2 className="text-xl font-bold text-white">✏️ Editar Lección: {leccionEditando?.titulo}</h2></div>
            <div className="p-5 space-y-4">
              <div><label className="block text-xs font-bold mb-1">Título de la lección *</label><input type="text" value={nuevaLeccion.titulo} onChange={e => setNuevaLeccion({...nuevaLeccion, titulo: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-xs font-bold mb-1">Contenido completo</label><textarea rows="15" value={nuevaLeccion.contenido} onChange={e => setNuevaLeccion({...nuevaLeccion, contenido: e.target.value})} className="w-full p-3 border rounded font-mono text-sm"></textarea><p className="text-xs text-gray-400 mt-1">Caracteres: {nuevaLeccion.contenido.length.toLocaleString()} / 500,000</p></div>
              <div><label className="block text-xs font-bold mb-1">URL del video</label><input type="url" value={nuevaLeccion.video} onChange={e => setNuevaLeccion({...nuevaLeccion, video: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-xs font-bold mb-1">Recursos adicionales</label><input type="text" value={nuevaLeccion.recursos?.join(', ') || ''} onChange={e => setNuevaLeccion({...nuevaLeccion, recursos: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 border rounded" /></div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t"><button onClick={() => setShowEditarLeccionForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button><button onClick={guardarEdicionLeccion} disabled={!nuevaLeccion.titulo} className="px-4 py-2 bg-amber-500 text-white rounded-lg disabled:opacity-50">Guardar Cambios</button></div>
          </div>
        </div>
      )}

      {modoAdmin && (
        <div className="fixed bottom-4 right-4 z-50 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          <span className="text-sm font-semibold">Administrador</span>
        </div>
      )}

      <style>{`.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default Diplomados;