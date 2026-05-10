// src/pages/Libros/Libros.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const Libros = () => {
  const { user, isAdmin } = useAuth();
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [mostrarGratis, setMostrarGratis] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editandoLibro, setEditandoLibro] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', subtitulo: '', descripcion: '', precio: '',
    formato: 'Impreso', edicion: 'Primera', paginas: '',
    autor: 'Editorial Compilaciones Jurídicas', editorial: 'Compilaciones Jurídicas',
    url: '', imagen: '', esPremioTorneo: false, destacados: [], gratis: false
  });
  const [nuevoDestacado, setNuevoDestacado] = useState('');

  const modoAdmin = isAdmin();

  // Cargar libros desde Firestore
  const cargarLibros = async () => {
    setCargando(true);
    try {
      const querySnapshot = await getDocs(collection(db, "libros"));
      const librosData = [];
      querySnapshot.forEach((doc) => {
        librosData.push({ id: doc.id, ...doc.data() });
      });
      setLibros(librosData);
    } catch (error) {
      console.error("Error cargando libros:", error);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const resetForm = () => {
    setFormData({
      titulo: '', subtitulo: '', descripcion: '', precio: '',
      formato: 'Impreso', edicion: 'Primera', paginas: '',
      autor: 'Editorial Compilaciones Jurídicas', editorial: 'Compilaciones Jurídicas',
      url: '', imagen: '', esPremioTorneo: false, destacados: [], gratis: false
    });
    setNuevoDestacado('');
    setEditandoLibro(null);
  };

  const guardarLibro = async () => {
    if (!modoAdmin) return;
    if (!formData.titulo || !formData.precio) {
      alert('⚠️ Completa los campos obligatorios');
      return;
    }

    const libroData = {
      titulo: formData.titulo,
      subtitulo: formData.subtitulo,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      formato: formData.formato,
      edicion: formData.edicion,
      paginas: isNaN(parseInt(formData.paginas)) ? formData.paginas : parseInt(formData.paginas),
      autor: formData.autor,
      editorial: formData.editorial,
      url: formData.url,
      imagen: formData.imagen,
      esPremioTorneo: formData.esPremioTorneo,
      destacados: formData.destacados,
      gratis: formData.gratis || formData.precio <= 0,
      actualizado: new Date().toISOString()
    };

    try {
      if (editandoLibro) {
        await updateDoc(doc(db, "libros", editandoLibro.id), libroData);
      } else {
        libroData.creado = new Date().toISOString();
        await addDoc(collection(db, "libros"), libroData);
      }
      setShowForm(false);
      resetForm();
      cargarLibros(); // Recargar lista
      alert('✅ Libro guardado correctamente');
    } catch (error) {
      console.error("Error guardando libro:", error);
      alert('❌ Error al guardar');
    }
  };

  const eliminarLibro = async (id) => {
    if (!modoAdmin) return;
    if (window.confirm('¿Eliminar este libro permanentemente?')) {
      try {
        await deleteDoc(doc(db, "libros", id));
        cargarLibros();
        alert('✅ Libro eliminado');
      } catch (error) {
        console.error("Error eliminando libro:", error);
        alert('❌ Error al eliminar');
      }
    }
  };

  const abrirFormEditar = (libro) => {
    setEditandoLibro(libro);
    setFormData({
      titulo: libro.titulo, subtitulo: libro.subtitulo || '',
      descripcion: libro.descripcion, precio: libro.precio.toString(),
      formato: libro.formato, edicion: libro.edicion,
      paginas: libro.paginas.toString(), autor: libro.autor,
      editorial: libro.editorial, url: libro.url, imagen: libro.imagen,
      esPremioTorneo: libro.esPremioTorneo || false,
      destacados: libro.destacados || [],
      gratis: libro.gratis || false
    });
    setShowForm(true);
  };

  const agregarDestacado = () => {
    if (nuevoDestacado.trim()) {
      setFormData({ ...formData, destacados: [...formData.destacados, nuevoDestacado.trim()] });
      setNuevoDestacado('');
    }
  };

  const eliminarDestacado = (index) => {
    setFormData({ ...formData, destacados: formData.destacados.filter((_, i) => i !== index) });
  };

  const librosFiltrados = libros.filter(libro => {
    const cumpleFiltro = libro.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      (libro.subtitulo && libro.subtitulo.toLowerCase().includes(filtro.toLowerCase()));
    if (mostrarGratis) {
      return cumpleFiltro && (libro.precio === 0 || libro.gratis === true);
    }
    return cumpleFiltro;
  });

  const librosPremio = libros.filter(l => l.esPremioTorneo);
  const abrirDetalle = (libro) => setLibroSeleccionado(libro);
  const cerrarDetalle = () => setLibroSeleccionado(null);

  if (cargando) {
    return <div className="text-center py-20">Cargando biblioteca...</div>;
  }

  return (
    <div className="px-4">
      {/* Header - Igual que antes */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
        <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop" alt="Biblioteca" className="w-full h-32 object-cover opacity-30" />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-amber-400">menu_book</span>
            <h1 className="text-2xl font-black">Biblioteca Jurídica</h1>
          </div>
          <p className="text-gray-200 text-sm">Obras especializadas para la práctica forense</p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input type="text" placeholder="Buscar libro..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500" />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setMostrarGratis(!mostrarGratis)} className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition ${mostrarGratis ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
              <span className="material-symbols-outlined text-sm">redeem</span>
              {mostrarGratis ? 'Mostrando solo GRATIS' : 'Mostrar solo GRATIS'}
            </button>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-sm">library_books</span>
              <span className="text-xs text-gray-600">{librosFiltrados.length} títulos</span>
            </div>
            {modoAdmin && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-amber-600 transition">
                <span className="material-symbols-outlined text-sm">add</span>
                Nuevo Libro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Premios del Torneo */}
      {librosPremio.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-2xl text-amber-500">emoji_events</span>
            <h2 className="text-lg font-bold text-gray-800">🏆 Premios del Torneo Jurídico Activo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {librosPremio.map(libro => (
              <div key={libro.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md border border-amber-200 overflow-hidden cursor-pointer hover:shadow-lg transition" onClick={() => abrirDetalle(libro)}>
                <div className="flex p-3 gap-3">
                  <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img src={libro.imagen || 'https://placehold.co/100x120/e2e8f0/475569?text=Libro'} alt={libro.titulo} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
                      <span className="text-xs text-amber-600 font-semibold">Premio del Torneo</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{libro.titulo}</h3>
                    <p className="text-amber-700 font-bold text-sm mt-1">${libro.precio.toFixed(2)} MXN</p>
                    {modoAdmin && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(libro); }} className="text-xs text-blue-500">Editar</button>
                        <button onClick={(e) => { e.stopPropagation(); eliminarLibro(libro.id); }} className="text-xs text-red-500">Eliminar</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de libros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {librosFiltrados.map((libro) => (
          <div key={libro.id} className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group ${libro.esPremioTorneo ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'}`} onClick={() => abrirDetalle(libro)}>
            <div className="h-44 bg-gradient-to-br from-amber-50 to-yellow-100 relative flex items-center justify-center overflow-hidden">
              <img src={libro.imagen || 'https://placehold.co/400x500/f8f9fa/1a56db?text=📚+Libro'} alt={libro.titulo} className="h-full w-full object-contain bg-white p-2 group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x500/e2e8f0/475569?text=Libro'; }} />
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                {libro.precio === 0 || libro.gratis ? 'GRATIS' : `$${libro.precio.toFixed(2)} MXN`}
              </div>
              {libro.esPremioTorneo && (
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">emoji_events</span> Premio
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wide">{libro.formato}</div>
              <h2 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{libro.titulo}</h2>
              {libro.subtitulo && <p className="text-xs text-gray-500 mb-2">{libro.subtitulo}</p>}
              <p className="text-gray-600 text-xs mb-2 line-clamp-2">{libro.descripcion?.substring(0, 100)}...</p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">pages</span>
                  {typeof libro.paginas === 'number' ? `${libro.paginas} págs.` : libro.paginas}
                </div>
                <div className="flex items-center gap-2">
                  {modoAdmin && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(libro); }} className="text-blue-500 hover:text-blue-700" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={(e) => { e.stopPropagation(); eliminarLibro(libro.id); }} className="text-red-500 hover:text-red-700" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </>
                  )}
                  <button className="text-amber-600 text-xs font-medium hover:text-amber-700 flex items-center gap-0.5" onClick={(e) => { e.stopPropagation(); abrirDetalle(libro); }}>Ver detalles<span className="material-symbols-outlined text-xs">arrow_forward</span></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {librosFiltrados.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">search</span>
          <p className="text-gray-500">No se encontraron libros</p>
        </div>
      )}

      {/* Modal de formulario (igual que antes) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">{editandoLibro ? 'Editar Libro' : 'Nuevo Libro'}</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold">Título *</label><input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold">Subtítulo</label><input type="text" value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
              </div>
              <div><label className="block text-xs font-bold">Descripción</label><textarea rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full px-2 py-1 text-sm border rounded"></textarea></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-bold">Precio *</label><input type="number" step="0.01" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold">Páginas</label><input type="text" value={formData.paginas} onChange={e => setFormData({...formData, paginas: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold">Formato</label><select value={formData.formato} onChange={e => setFormData({...formData, formato: e.target.value})} className="w-full px-2 py-1 text-sm border rounded"><option>Impreso</option><option>Digital</option><option>Impreso + Digital</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold">URL del producto</label><input type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                <div><label className="block text-xs font-bold">URL de la imagen</label><input type="url" value={formData.imagen} onChange={e => setFormData({...formData, imagen: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.esPremioTorneo} onChange={e => setFormData({...formData, esPremioTorneo: e.target.checked})} /> Marcar como Premio del Torneo</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.gratis} onChange={e => setFormData({...formData, gratis: e.target.checked})} /> Marcar como GRATIS</label>
              </div>
              <div><label className="block text-xs font-bold mb-1">Contenido destacado</label><div className="flex gap-2 mb-2"><input type="text" value={nuevoDestacado} onChange={e => setNuevoDestacado(e.target.value)} placeholder="Nuevo elemento" className="flex-1 px-2 py-1 text-sm border rounded" /><button onClick={agregarDestacado} className="bg-gray-200 px-3 rounded text-sm">Agregar</button></div><div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">{formData.destacados.map((item, idx) => (<div key={idx} className="flex justify-between items-center text-sm py-0.5"><span>• {item}</span><button onClick={() => eliminarDestacado(idx)} className="text-red-500 text-xs">Eliminar</button></div>))}</div></div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t"><button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Cancelar</button><button onClick={guardarLibro} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Guardar</button></div>
          </div>
        </div>
      )}

      {/* Modal de detalle (simplificado) */}
      {libroSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-t-2xl">
              <button onClick={cerrarDetalle} className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/20 rounded-full w-8 h-8 flex items-center justify-center"><span className="material-symbols-outlined text-xl">close</span></button>
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-3xl text-amber-400">menu_book</span><h2 className="text-xl font-bold text-white pr-8">{libroSeleccionado.titulo}</h2></div>
              <p className="text-amber-300 text-sm mt-1">{libroSeleccionado.subtitulo}</p>
            </div>
            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img src={libroSeleccionado.imagen || 'https://placehold.co/400x500/e2e8f0/475569?text=Libro'} alt={libroSeleccionado.titulo} className="w-full object-contain bg-white" onError={(e) => { e.target.src = 'https://placehold.co/400x500/e2e8f0/475569?text=Portada'; }} />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-amber-700">{libroSeleccionado.precio === 0 || libroSeleccionado.gratis ? 'GRATIS' : `$${libroSeleccionado.precio.toFixed(2)} MXN`}</div>
                      <a href={libroSeleccionado.url} target="_blank" rel="noopener noreferrer" className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600 transition w-full inline-block text-center">Adquirir ejemplar</a>
                    </div>
                    <div className="border rounded-lg p-3 text-sm space-y-1.5">
                      <div className="flex justify-between"><span className="text-gray-500">Formato:</span><span className="font-medium">{libroSeleccionado.formato}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Edición:</span><span className="font-medium">{libroSeleccionado.edicion}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Páginas:</span><span className="font-medium">{typeof libroSeleccionado.paginas === 'number' ? `${libroSeleccionado.paginas}` : libroSeleccionado.paginas}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Editorial:</span><span className="font-medium">{libroSeleccionado.editorial}</span></div>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="mb-3"><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-amber-500 text-sm">description</span>Descripción</h3><p className="text-gray-600 text-sm leading-relaxed">{libroSeleccionado.descripcion}</p></div>
                  {libroSeleccionado.destacados?.length > 0 && (<div><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-amber-500 text-sm">format_list_bulleted</span>Contenido destacado</h3><div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto"><ul className="space-y-1">{libroSeleccionado.destacados.map((item, idx) => (<li key={idx} className="text-xs text-gray-600 flex items-start gap-2"><span className="material-symbols-outlined text-amber-500 text-xs">check_circle</span>{item}</li>))}</ul></div></div>)}
                  <div className="mt-4 pt-3 border-t flex justify-end"><button onClick={cerrarDetalle} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Cerrar</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default Libros;