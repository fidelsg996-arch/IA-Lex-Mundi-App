// src/pages/Diplomados.jsx
import { useState, useEffect, useRef } from 'react';

// ------------------------------------------------------------
// CONFIGURACIÓN INICIAL
// ------------------------------------------------------------
const STORAGE_KEY = 'lexmindi_diplomados';
const ADMIN_PASSWORD = 'admin123';

// ------------------------------------------------------------
// DIPLOMADO INICIAL
// ------------------------------------------------------------
const diplomadoInicial = {
  id: 1,
  titulo: 'Diplomado en Criminología, Criminalística e Investigación Privada',
  subtitulo: 'Formación de Detectives Privados',
  descripcion: 'Formación profesional completa con 11 módulos, 55 lecciones, simulador de casos, banco de 300+ preguntas y certificación digital oficial al aprobar con mínimo 80%.',
  precio: 2500.00,
  duracion: '120 horas',
  totalLecciones: '55 lecciones',
  totalModulos: '11 módulos',
  incluyeConstancia: 'Constancia incluida',
  imagen: null,
  esPremioTorneo: false,
  modulos: [
    { id: 1, titulo: 'Introducción a la Criminología', lecciones: '5 lecciones', categoria: 'Criminología', leccionesLista: [] },
    { id: 2, titulo: 'Fundamentos de Criminalística', lecciones: '5 lecciones', categoria: 'Criminalística', leccionesLista: [] }
  ]
};

// Componente de imagen con manejo seguro
const ImagenSegura = ({ src, alt, className, icono }) => {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  
  useEffect(() => {
    // Si src es un objeto File, crear URL
    if (src && typeof src === 'object' && src instanceof File) {
      const url = URL.createObjectURL(src);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url);
    } else if (src && typeof src === 'string' && src.startsWith('blob:')) {
      setImageSrc(src);
    } else if (src && typeof src === 'string' && src.length > 0) {
      setImageSrc(src);
    } else {
      setImageSrc(null);
    }
  }, [src]);
  
  if (error || !imageSrc) {
    return (
      <div className={`flex flex-col items-center justify-center h-full bg-gray-100 ${className || ''}`}>
        <span className="material-symbols-outlined text-4xl text-gray-400">{icono || 'image_not_supported'}</span>
        <span className="text-xs text-gray-400 mt-1">Sin imagen</span>
      </div>
    );
  }
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      onError={() => setError(true)}
    />
  );
};

// Componente selector de imagen con previsualización
const SelectorImagen = ({ imagenActual, onImagenSeleccionada, onRemoverImagen, label }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState('');

  useEffect(() => {
    if (imagenActual && typeof imagenActual === 'object' && imagenActual instanceof File) {
      const url = URL.createObjectURL(imagenActual);
      setPreviewUrl(url);
      setNombreArchivo(imagenActual.name);
      return () => URL.revokeObjectURL(url);
    } else if (imagenActual && typeof imagenActual === 'string' && imagenActual.startsWith('blob:')) {
      setPreviewUrl(imagenActual);
    } else if (imagenActual && typeof imagenActual === 'string' && imagenActual.length > 0) {
      setPreviewUrl(imagenActual);
      setNombreArchivo(imagenActual.split('/').pop() || 'imagen.jpg');
    }
  }, [imagenActual]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño máximo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB.');
        return;
      }
      onImagenSeleccionada(file);
    }
  };

  const handleRemover = () => {
    setPreviewUrl(null);
    setNombreArchivo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemoverImagen();
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold">{label}</label>}
      
      {/* Previsualización */}
      {previewUrl && (
        <div className="relative inline-block">
          <img 
            src={previewUrl} 
            alt="Previsualización" 
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemover}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
          {nombreArchivo && (
            <p className="text-xs text-gray-500 mt-1 truncate w-32">{nombreArchivo}</p>
          )}
        </div>
      )}
      
      {/* Input file */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="imagen-input"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">upload</span>
          {previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </button>
        <p className="text-xs text-gray-400">Formatos: JPG, PNG, GIF, WEBP (max 5MB)</p>
      </div>
    </div>
  );
};

const Diplomados = () => {
  const [diplomados, setDiplomados] = useState([]);
  const [diplomadoSeleccionado, setDiplomadoSeleccionado] = useState(null);
  const [vista, setVista] = useState('cursos');
  const [moduloActual, setModuloActual] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);
  const [leccionesCompletadas, setLeccionesCompletadas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modoAdmin, setModoAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState('');
  
  // Estado para el formulario de diplomado
  const [editandoDiplomado, setEditandoDiplomado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    precio: '',
    duracion: '',
    totalLecciones: '',
    totalModulos: '',
    incluyeConstancia: 'Constancia incluida',
    esPremioTorneo: false,
    modulos: []
  });

  // Función para guardar imágenes como archivos en un objeto global
  const imagenesStore = useRef({});

  // Función para validar y corregir la estructura de los diplomados
  const validarDiplomados = (diplomadosList) => {
    return diplomadosList.map(diplomado => ({
      ...diplomado,
      modulos: (diplomado.modulos || []).map(modulo => ({
        ...modulo,
        leccionesLista: modulo.leccionesLista || []
      }))
    }));
  };

  // Cargar diplomados desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const validados = validarDiplomados(parsed);
        setDiplomados(validados);
      } catch (e) {
        console.error('Error al cargar diplomados:', e);
        setDiplomados([diplomadoInicial]);
      }
    } else {
      setDiplomados([diplomadoInicial]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([diplomadoInicial]));
    }
  }, []);

  // Guardar diplomados en localStorage (solo datos, no las imágenes)
  useEffect(() => {
    if (diplomados.length > 0) {
      // Limpiar referencias a File antes de guardar
      const diplomadosParaGuardar = diplomados.map(d => ({
        ...d,
        imagen: d.imagen && typeof d.imagen === 'object' ? `img_${d.id}` : d.imagen
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diplomadosParaGuardar));
    }
  }, [diplomados]);

  // Login de administrador
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setModoAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Contraseña incorrecta');
    }
  };

  const handleAdminLogout = () => {
    setModoAdmin(false);
    setEditandoDiplomado(null);
    setShowForm(false);
    setImagenFile(null);
  };

  // CRUD de diplomados
  const abrirFormNuevo = () => {
    setEditandoDiplomado(null);
    setImagenFile(null);
    setFormData({
      titulo: '',
      subtitulo: '',
      descripcion: '',
      precio: '',
      duracion: '',
      totalLecciones: '',
      totalModulos: '',
      incluyeConstancia: 'Constancia incluida',
      esPremioTorneo: false,
      modulos: []
    });
    setShowForm(true);
  };

  const abrirFormEditar = (diplomado) => {
    setEditandoDiplomado(diplomado);
    setImagenFile(diplomado.imagen && typeof diplomado.imagen === 'object' ? diplomado.imagen : null);
    setFormData({
      titulo: diplomado.titulo,
      subtitulo: diplomado.subtitulo || '',
      descripcion: diplomado.descripcion,
      precio: diplomado.precio ? diplomado.precio.toString() : '',
      duracion: diplomado.duracion,
      totalLecciones: diplomado.totalLecciones,
      totalModulos: diplomado.totalModulos,
      incluyeConstancia: diplomado.incluyeConstancia,
      esPremioTorneo: diplomado.esPremioTorneo || false,
      modulos: diplomado.modulos ? JSON.parse(JSON.stringify(diplomado.modulos)) : []
    });
    setShowForm(true);
  };

  const guardarDiplomado = () => {
    if (!formData.titulo) {
      alert('Completa el campo obligatorio: título');
      return;
    }

    const nuevoDiplomado = {
      id: editandoDiplomado ? editandoDiplomado.id : Date.now(),
      titulo: formData.titulo,
      subtitulo: formData.subtitulo,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio) || 0,
      duracion: formData.duracion,
      totalLecciones: formData.totalLecciones,
      totalModulos: formData.totalModulos,
      incluyeConstancia: formData.incluyeConstancia,
      imagen: imagenFile || null,
      esPremioTorneo: formData.esPremioTorneo,
      modulos: formData.modulos.map(m => ({
        ...m,
        leccionesLista: m.leccionesLista || []
      }))
    };

    if (editandoDiplomado) {
      setDiplomados(diplomados.map(d => d.id === editandoDiplomado.id ? nuevoDiplomado : d));
    } else {
      setDiplomados([...diplomados, nuevoDiplomado]);
    }
    setShowForm(false);
    setEditandoDiplomado(null);
    setImagenFile(null);
  };

  const eliminarDiplomado = (id) => {
    if (window.confirm('¿Eliminar este diplomado permanentemente?')) {
      setDiplomados(diplomados.filter(d => d.id !== id));
    }
  };

  const togglePremioTorneo = (diplomadoId) => {
    setDiplomados(diplomados.map(diplomado => 
      diplomado.id === diplomadoId 
        ? { ...diplomado, esPremioTorneo: !diplomado.esPremioTorneo }
        : diplomado
    ));
  };

  // Gestión de módulos y lecciones en el formulario
  const agregarModulo = () => {
    const nuevoId = formData.modulos.length + 1;
    setFormData({
      ...formData,
      modulos: [...formData.modulos, {
        id: nuevoId,
        titulo: `Módulo ${nuevoId}`,
        lecciones: '0 lecciones',
        categoria: 'Nueva categoría',
        leccionesLista: []
      }]
    });
  };

  const eliminarModulo = (moduloId) => {
    if (window.confirm('¿Eliminar este módulo?')) {
      setFormData({
        ...formData,
        modulos: formData.modulos.filter(m => m.id !== moduloId)
      });
    }
  };

  const agregarLeccion = (moduloId) => {
    const modulo = formData.modulos.find(m => m.id === moduloId);
    if (modulo) {
      const nuevoId = (modulo.leccionesLista || []).length + 1;
      const nuevasLecciones = [...(modulo.leccionesLista || []), {
        id: nuevoId,
        titulo: `Lección ${nuevoId}: Nuevo tema`,
        contenido: 'Contenido de la lección',
        ejemplo: 'Ejemplo práctico',
        caso: 'Caso ilustrativo'
      }];
      setFormData({
        ...formData,
        modulos: formData.modulos.map(m => m.id === moduloId ? { ...m, leccionesLista: nuevasLecciones, lecciones: `${nuevasLecciones.length} lecciones` } : m)
      });
    }
  };

  const eliminarLeccion = (moduloId, leccionId) => {
    const modulo = formData.modulos.find(m => m.id === moduloId);
    if (modulo) {
      const nuevasLecciones = (modulo.leccionesLista || []).filter(l => l.id !== leccionId);
      setFormData({
        ...formData,
        modulos: formData.modulos.map(m => 
          m.id === moduloId 
            ? { ...m, leccionesLista: nuevasLecciones, lecciones: `${nuevasLecciones.length} lecciones` }
            : m
        )
      });
    }
  };

  const calcularProgresoDiplomado = (diplomado) => {
    if (!diplomado || !diplomado.modulos) return 0;
    const total = diplomado.modulos.reduce((acc, m) => acc + ((m.leccionesLista || []).length), 0);
    const completadas = leccionesCompletadas.filter(key => key.startsWith(`${diplomado.id}-`)).length;
    return total > 0 ? (completadas / total) * 100 : 0;
  };

  const marcarCompletada = (diplomadoId, moduloId, leccionId, leccionTitulo) => {
    const key = `${diplomadoId}-${moduloId}-${leccionId}`;
    if (!leccionesCompletadas.includes(key)) {
      setLeccionesCompletadas([...leccionesCompletadas, key]);
      alert(`✅ ¡Lección "${leccionTitulo}" completada!`);
    }
  };

  const estaCompletada = (diplomadoId, moduloId, leccionId) => {
    return leccionesCompletadas.includes(`${diplomadoId}-${moduloId}-${leccionId}`);
  };

  const diplomadosFiltrados = diplomados.filter(diplomado =>
    diplomado.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    (diplomado.subtitulo && diplomado.subtitulo.toLowerCase().includes(filtro.toLowerCase()))
  );

  const diplomadosPremio = diplomados.filter(d => d.esPremioTorneo);

  // Vista: Lista de diplomados
  if (vista === 'cursos') {
    return (
      <div className="px-4">
        {/* Portada */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
          <img 
            src="https://images.unsplash.com/photo-1589578228447-e1a4e481c6b8?q=80&w=2070&auto=format&fit=crop" 
            alt="Diplomados"
            className="w-full h-32 object-cover opacity-30"
          />
          <div className="relative z-10 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-amber-400">workspace_premium</span>
                <h1 className="text-2xl font-black">Diplomados Especializados</h1>
              </div>
              {!modoAdmin ? (
                <button onClick={() => setShowAdminLogin(true)} className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                  Admin
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">Modo Admin</span>
                  <button onClick={handleAdminLogout} className="text-white/70 hover:text-white text-sm">Salir</button>
                </div>
              )}
            </div>
            <p className="text-gray-200 text-sm">Formación profesional especializada para investigadores y peritos</p>
          </div>
        </div>

        {/* Modal de login admin */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdminLogin(false)}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Acceso Administrador</h2>
              <input type="password" placeholder="Contraseña" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} />
              {adminError && <p className="text-red-500 text-sm mb-3">{adminError}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowAdminLogin(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
                <button onClick={handleAdminLogin} className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg">Entrar</button>
              </div>
            </div>
          </div>
        )}

        {/* Barra de búsqueda y controles admin */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
              <input type="text" placeholder="Buscar diplomado..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-sm">workspace_premium</span>
                <span className="text-xs text-gray-600">{diplomadosFiltrados.length} diplomados</span>
              </div>
              {modoAdmin && (
                <button onClick={abrirFormNuevo} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Nuevo Diplomado
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Diplomados Premio del Torneo */}
        {diplomadosPremio.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-2xl text-amber-500">emoji_events</span>
              <h2 className="text-lg font-bold text-gray-800">🏆 Premios del Torneo Jurídico Activo</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diplomadosPremio.map(diplomado => (
                <div key={`premio-${diplomado.id}`} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md border border-amber-200 overflow-hidden cursor-pointer hover:shadow-lg transition" onClick={() => { setDiplomadoSeleccionado(diplomado); setLeccionesCompletadas([]); setVista('curso'); }}>
                  <div className="flex p-3 gap-3">
                    <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <ImagenSegura src={diplomado.imagen} alt={diplomado.titulo} className="w-full h-full object-cover" icono="workspace_premium" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
                        <span className="text-xs text-amber-600 font-semibold">Premio del Torneo</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{diplomado.titulo}</h3>
                      {diplomado.precio > 0 && <p className="text-amber-700 font-bold text-sm mt-1">${diplomado.precio.toFixed(2)} MXN</p>}
                      {modoAdmin && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(diplomado); }} className="text-xs text-blue-500">Editar</button>
                          <button onClick={(e) => { e.stopPropagation(); togglePremioTorneo(diplomado.id); }} className="text-xs text-red-500">Quitar premio</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid de diplomados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {diplomadosFiltrados.map((diplomado) => (
            <div key={diplomado.id} className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${diplomado.esPremioTorneo ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'}`} onClick={() => { setDiplomadoSeleccionado(diplomado); setLeccionesCompletadas([]); setVista('curso'); }}>
              {diplomado.esPremioTorneo && (
                <div className="absolute relative z-10">
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">emoji_events</span>
                    Premio Torneo
                  </div>
                </div>
              )}
              <div className="h-44 bg-gradient-to-br from-amber-50 to-yellow-100 relative flex items-center justify-center overflow-hidden">
                <ImagenSegura src={diplomado.imagen} alt={diplomado.titulo} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" icono="workspace_premium" />
                {diplomado.precio > 0 && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                    ${diplomado.precio.toFixed(2)} MXN
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wide">Diplomado</div>
                <h2 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{diplomado.titulo}</h2>
                {diplomado.subtitulo && <p className="text-xs text-gray-500 mb-2">{diplomado.subtitulo}</p>}
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{diplomado.descripcion.substring(0, 100)}...</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">📖 {diplomado.totalLecciones}</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">📦 {diplomado.totalModulos}</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">🎓 {diplomado.incluyeConstancia}</span>
                </div>
                {calcularProgresoDiplomado(diplomado) > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round(calcularProgresoDiplomado(diplomado))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${calcularProgresoDiplomado(diplomado)}%` }}></div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {diplomado.duracion}
                  </div>
                  <div className="flex items-center gap-2">
                    {modoAdmin && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(diplomado); }} className="text-blue-500 hover:text-blue-700" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button onClick={(e) => { e.stopPropagation(); eliminarDiplomado(diplomado.id); }} className="text-red-500 hover:text-red-700" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </>
                    )}
                    <button className="text-amber-600 text-xs font-medium hover:text-amber-700 flex items-center gap-0.5">
                      Ver detalles
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {diplomadosFiltrados.length === 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">search</span>
            <p className="text-gray-500">No se encontraron diplomados con "{filtro}"</p>
          </div>
        )}

        {/* Modal de formulario de diplomado (crear/editar) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-t-2xl sticky top-0">
                <h2 className="text-xl font-bold text-white">{editandoDiplomado ? 'Editar Diplomado' : 'Nuevo Diplomado'}</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Información básica */}
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold">Título *</label><input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                  <div><label className="block text-xs font-bold">Subtítulo</label><input type="text" value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                </div>
                <div><label className="block text-xs font-bold">Descripción</label><textarea rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full px-2 py-1 text-sm border rounded"></textarea></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-xs font-bold">Precio</label><input type="number" step="0.01" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                  <div><label className="block text-xs font-bold">Duración</label><input type="text" value={formData.duracion} onChange={e => setFormData({...formData, duracion: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                  <div><label className="block text-xs font-bold">Total Lecciones</label><input type="text" value={formData.totalLecciones} onChange={e => setFormData({...formData, totalLecciones: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold">Total Módulos</label><input type="text" value={formData.totalModulos} onChange={e => setFormData({...formData, totalModulos: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                  <div>
                    <SelectorImagen 
                      imagenActual={imagenFile}
                      onImagenSeleccionada={(file) => setImagenFile(file)}
                      onRemoverImagen={() => setImagenFile(null)}
                      label="Imagen de portada"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.esPremioTorneo} onChange={e => setFormData({...formData, esPremioTorneo: e.target.checked})} />
                    Marcar como Premio del Torneo Jurídico Activo
                  </label>
                </div>

                {/* Módulos y Lecciones */}
                <div className="border-t pt-4 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-sm">format_list_bulleted</span>
                      Módulos del Diplomado ({formData.modulos.length})
                    </h3>
                    <button onClick={agregarModulo} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">add</span>
                      Agregar Módulo
                    </button>
                  </div>
                  
                  {formData.modulos.map((modulo, idx) => (
                    <div key={modulo.id} className="border rounded-xl p-3 mb-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{modulo.id}</span>
                          <input type="text" value={modulo.titulo} onChange={e => {
                            const nuevosModulos = [...formData.modulos];
                            nuevosModulos[idx].titulo = e.target.value;
                            setFormData({...formData, modulos: nuevosModulos});
                          }} className="font-bold text-sm border rounded px-2 py-1" />
                          <input type="text" value={modulo.categoria} onChange={e => {
                            const nuevosModulos = [...formData.modulos];
                            nuevosModulos[idx].categoria = e.target.value;
                            setFormData({...formData, modulos: nuevosModulos});
                          }} className="text-xs border rounded px-2 py-1 text-gray-500 w-24" placeholder="Categoría" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => agregarLeccion(modulo.id)} className="text-green-600 text-xs flex items-center gap-0.5"><span className="material-symbols-outlined text-xs">add</span>Lección</button>
                          <button onClick={() => eliminarModulo(modulo.id)} className="text-red-500 text-xs">Eliminar</button>
                        </div>
                      </div>
                      <div className="ml-8 space-y-2">
                        {(modulo.leccionesLista || []).map((leccion, lecIdx) => (
                          <div key={`${modulo.id}-leccion-${leccion.id}`} className="bg-white rounded-lg p-2 border">
                            <div className="flex justify-between items-center">
                              <input type="text" value={leccion.titulo} onChange={e => {
                                const nuevosModulos = [...formData.modulos];
                                nuevosModulos[idx].leccionesLista[lecIdx].titulo = e.target.value;
                                setFormData({...formData, modulos: nuevosModulos});
                              }} className="text-sm font-semibold border rounded px-2 py-0.5 flex-1 mr-2" />
                              <div className="flex gap-1">
                                <button onClick={() => eliminarLeccion(modulo.id, leccion.id)} className="text-red-400 text-xs">🗑️</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-1 mt-1">
                              <textarea placeholder="Contenido" value={leccion.contenido || ''} onChange={e => {
                                const nuevosModulos = [...formData.modulos];
                                nuevosModulos[idx].leccionesLista[lecIdx].contenido = e.target.value;
                                setFormData({...formData, modulos: nuevosModulos});
                              }} className="text-xs border rounded p-1" rows="2"></textarea>
                              <div className="grid grid-cols-2 gap-1">
                                <textarea placeholder="Ejemplo práctico" value={leccion.ejemplo || ''} onChange={e => {
                                  const nuevosModulos = [...formData.modulos];
                                  nuevosModulos[idx].leccionesLista[lecIdx].ejemplo = e.target.value;
                                  setFormData({...formData, modulos: nuevosModulos});
                                }} className="text-xs border rounded p-1" rows="2"></textarea>
                                <textarea placeholder="Caso ilustrativo" value={leccion.caso || ''} onChange={e => {
                                  const nuevosModulos = [...formData.modulos];
                                  nuevosModulos[idx].leccionesLista[lecIdx].caso = e.target.value;
                                  setFormData({...formData, modulos: nuevosModulos});
                                }} className="text-xs border rounded p-1" rows="2"></textarea>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 p-4 border-t sticky bottom-0 bg-white">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button onClick={guardarDiplomado} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Guardar Diplomado</button>
              </div>
            </div>
          </div>
        )}

        <style>{`.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
      </div>
    );
  }

  // Vista: Diplomado (módulos)
  if (vista === 'curso' && diplomadoSeleccionado) {
    const progreso = calcularProgresoDiplomado(diplomadoSeleccionado);
    return (
      <div className="px-4">
        <button onClick={() => setVista('cursos')} className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver a diplomados
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-amber-400">workspace_premium</span>
              <h1 className="text-xl font-bold">{diplomadoSeleccionado.titulo}</h1>
            </div>
            <p className="text-gray-300 text-sm mt-1">{diplomadoSeleccionado.descripcion}</p>
            {diplomadoSeleccionado.esPremioTorneo && (
              <div className="mt-2 inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-xs">emoji_events</span>
                Premio del Torneo Jurídico Activo
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-sm">format_list_bulleted</span>
                Módulos del Diplomado
              </h2>
              <div className="text-right">
                <p className="text-xs text-gray-600">Progreso: {Math.round(progreso)}%</p>
                <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progreso}%` }}></div>
                </div>
              </div>
            </div>

            {(diplomadoSeleccionado.modulos || []).map((modulo) => {
              const completadasModulo = (modulo.leccionesLista || []).filter(lec => estaCompletada(diplomadoSeleccionado.id, modulo.id, lec.id)).length;
              return (
                <div key={modulo.id} className="border border-gray-200 rounded-xl mb-3 cursor-pointer hover:shadow-md transition bg-white" onClick={() => { setModuloActual(modulo); setVista('modulo'); }}>
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{modulo.titulo}</h3>
                        <p className="text-xs text-gray-500">{modulo.lecciones} · {modulo.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-600">{completadasModulo}/{(modulo.leccionesLista || []).length} completadas</p>
                        <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                          <div className="bg-green-500 h-1 rounded-full" style={{ width: `${(completadasModulo/(modulo.leccionesLista || []).length)*100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {progreso === 100 && (
              <button onClick={() => setVista('constancia')} className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-bold hover:from-amber-600 hover:to-orange-600 transition flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">emoji_events</span>
                Obtener Constancia
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista: Módulo (lecciones)
  if (vista === 'modulo' && moduloActual && diplomadoSeleccionado) {
    return (
      <div className="px-4">
        <button onClick={() => setVista('curso')} className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al diplomado
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
            <h1 className="text-xl font-bold">{moduloActual.titulo}</h1>
            <p className="text-gray-300 text-sm">{moduloActual.lecciones} · {moduloActual.categoria}</p>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {(moduloActual.leccionesLista || []).map((leccion, idx) => {
                const completada = estaCompletada(diplomadoSeleccionado.id, moduloActual.id, leccion.id);
                return (
                  <div key={`${moduloActual.id}-leccion-${leccion.id}`} className={`border rounded-xl p-3 cursor-pointer transition ${completada ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`} onClick={() => { setLeccionActual(leccion); setVista('leccion'); }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${completada ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{completada ? '✓' : idx + 1}</div>
                      <div className="flex-1"><h3 className="font-semibold text-gray-800 text-sm">{leccion.titulo}</h3></div>
                      {completada && <span className="text-green-600 text-xs">Completada</span>}
                      <span className="text-blue-600 text-sm flex items-center gap-0.5">Ver <span className="material-symbols-outlined text-xs">arrow_forward</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista: Lección
  if (vista === 'leccion' && leccionActual && moduloActual && diplomadoSeleccionado) {
    const completada = estaCompletada(diplomadoSeleccionado.id, moduloActual.id, leccionActual.id);
    const lecciones = moduloActual.leccionesLista || [];
    const idxActual = lecciones.findIndex(l => l.id === leccionActual.id);
    const siguienteLeccion = lecciones[idxActual + 1];

    return (
      <div className="px-4">
        <button onClick={() => setVista('modulo')} className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al módulo
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
            <span className="text-xs text-gray-300">Módulo {moduloActual.id} · Lección {leccionActual.id}</span>
            <h1 className="text-xl font-bold mt-1">{leccionActual.titulo}</h1>
          </div>

          <div className="p-4">
            <div className="mb-4"><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-amber-500 text-sm">description</span>Contenido</h3><p className="text-gray-700 text-sm leading-relaxed">{leccionActual.contenido || 'Contenido no disponible'}</p></div>
            <div className="mb-4"><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500 text-sm">lightbulb</span>Ejemplo práctico</h3><div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg"><p className="text-gray-700 text-sm">{leccionActual.ejemplo || 'Ejemplo no disponible'}</p></div></div>
            <div className="mb-4"><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-purple-500 text-sm">gavel</span>Caso ilustrativo</h3><div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg"><p className="text-gray-700 text-sm">{leccionActual.caso || 'Caso no disponible'}</p></div></div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setVista('modulo')} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm">Volver</button>
              {!completada && (<button onClick={() => marcarCompletada(diplomadoSeleccionado.id, moduloActual.id, leccionActual.id, leccionActual.titulo)} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 text-sm flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span>Marcar como completada</button>)}
              {siguienteLeccion && completada && (<button onClick={() => setLeccionActual(siguienteLeccion)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm flex items-center justify-center gap-1">Siguiente lección<span className="material-symbols-outlined text-sm">arrow_forward</span></button>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista: Constancia
  if (vista === 'constancia' && diplomadoSeleccionado) {
    const fecha = new Date().toLocaleDateString('es-ES');
    const registro = `DIP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    return (
      <div className="px-4">
        <button onClick={() => setVista('curso')} className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al diplomado
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="border-8 border-amber-600 m-5 rounded-lg">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 text-center">
              <div className="text-4xl mb-3">⚖️📜</div>
              <p className="text-xs text-gray-600">IA LEX MUNDI</p>
              <p className="text-[10px] text-gray-500">INTERNATIONAL LAW PLATFORM</p>
              <h2 className="text-xl font-bold text-gray-800 mt-4">CONSTANCIA DE PARTICIPACIÓN</h2>
              <div className="border-t-2 border-amber-600 w-20 mx-auto my-3"></div>
              <p className="text-xs text-gray-700">La Dirección General de Formación Jurídica de</p>
              <p className="font-bold text-gray-800 text-sm">IA Lex Mundi International Law Platform</p>
              <p className="text-xs text-gray-700">hace constar que</p>
              <p className="text-md font-bold text-gray-800 mt-3">Despacho Juridico F&H SA. de CV.</p>
              <p className="text-xs text-gray-700 mt-3">ha participado en el programa:</p>
              <p className="text-md font-bold text-amber-700 mt-1">{diplomadoSeleccionado.titulo}</p>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div><div className="border-t border-gray-400 pt-1"><p className="text-[10px] text-gray-600">Coordinación Académica</p><p className="font-semibold text-xs">Mtra. Carmen Fuentes Leal</p></div></div>
                <div><div className="border-t border-gray-400 pt-1"><p className="text-[10px] text-gray-600">Dirección General</p><p className="font-semibold text-xs">Dr. Alejandro Ríos Vargas</p></div></div>
              </div>
              <div className="mt-4 text-[10px] text-gray-500"><p>No. de Registro: {registro}</p></div>
              <div className="mt-3 p-2 bg-gray-100 rounded-lg text-[10px] text-gray-600"><p>Documento oficial de IA Lex Mundi. Verificable en: https://lexmundi.ia/verificar/{registro}</p></div>
              <p className="text-[10px] text-gray-400 mt-3">Ciudad de México; a {fecha}</p>
            </div>
          </div>
          <div className="p-4 flex gap-3">
            <button onClick={() => alert('📄 Descargando PDF... (simulación)')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">download</span>Descargar PDF</button>
            <button onClick={() => { setVista('cursos'); setLeccionesCompletadas([]); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 text-sm flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">school</span>Ver diplomados</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Diplomados;