// src/pages/Cursos.jsx
import { useState, useEffect } from 'react';

// ------------------------------------------------------------
// CONFIGURACIÓN INICIAL
// ------------------------------------------------------------
const STORAGE_KEY = 'lexmindi_cursos';
const STORAGE_IMAGES_KEY = 'lexmindi_imagenes';
const ADMIN_PASSWORD = 'admin123';

// ------------------------------------------------------------
// FUNCIÓN PARA CONVERTIR IMAGEN A BASE64
// ------------------------------------------------------------
const convertirImagenABase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No se seleccionó ningún archivo');
      return;
    }
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      reject('El archivo no es una imagen válida');
      return;
    }
    
    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject('La imagen no debe superar los 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject('Error al leer la imagen');
    reader.readAsDataURL(file);
  });
};

// ------------------------------------------------------------
// CURSO INICIAL
// ------------------------------------------------------------
const cursoInicial = {
  id: 1,
  titulo: 'Fundamentos del Derecho Contractual Internacional',
  subtitulo: 'Derecho Comparado',
  descripcion: 'Domina los principios esenciales de los contratos en el derecho comparado',
  precio: 1500.00,
  duracion: '40 horas',
  totalLecciones: '15 lecciones',
  totalModulos: '3 módulos',
  incluyeConstancia: 'Constancia incluida',
  imagen: null,
  imagenPreview: null,
  esPremioTorneo: false,
  modulos: [
    {
      id: 1,
      titulo: 'Introducción al Derecho Contractual',
      lecciones: '5 lecciones',
      categoria: 'Contratos',
      leccionesLista: [
        { id: 1, titulo: 'Historia y evolución del contrato', contenido: 'El contrato ha sido el instrumento jurídico central del comercio desde el Derecho Romano...', ejemplo: 'El contrato de compraventa en Roma requería la entrega efectiva de la cosa...', caso: 'La evolución del pacta sunt servanda como principio universal...' },
        { id: 2, titulo: 'Elementos esenciales del contrato', contenido: 'Todo contrato válido requiere: consentimiento, objeto y causa lícita...', ejemplo: 'Si una persona es obligada a firmar un contrato bajo amenazas...', caso: 'Caso Williams v. Roffey Bros (1990): Beneficio práctico como consideration válida.' },
        { id: 3, titulo: 'Clasificación de contratos', contenido: 'Los contratos se clasifican en unilaterales/bilaterales...', ejemplo: 'El mandato es generalmente gratuito, mientras que la compraventa es onerosa.', caso: 'Contratos de adhesión con cláusulas predispuestas que pueden ser abusivas.' },
        { id: 4, titulo: 'Formación del contrato: oferta y aceptación', contenido: 'La oferta debe ser completa, firme y dirigida a persona determinada...', ejemplo: 'Una oferta pública por catálogo es una invitación a ofertar...', caso: 'Caso Carlill v. Carbolic Smoke Ball Co (1893): La oferta al público puede ser vinculante.' },
        { id: 5, titulo: 'Nulidad, rescisión y resolución', contenido: 'La nulidad absoluta opera por falta de elementos esenciales...', ejemplo: 'Contrato con objeto ilícito es nulo absolutamente.', caso: 'Rescisión por incumplimiento: El comprador puede pedir la rescisión y daños.' }
      ]
    },
    {
      id: 2,
      titulo: 'Derecho Comparado de Contratos',
      lecciones: '5 lecciones',
      categoria: 'Derecho Comparado',
      leccionesLista: [
        { id: 1, titulo: 'Sistemas jurídicos: Civil Law vs Common Law', contenido: 'Civil Law (codificado, basado en principios generales) vs Common Law...', ejemplo: 'En Francia, el contrato se rige por el Código Civil...', caso: 'Caso Hadley v. Baxendale (1854): Regla de la previsibilidad en daños.' },
        { id: 2, titulo: 'Autonomía de la voluntad y libertad contractual', contenido: 'Las partes tienen libertad para contratar y determinar el contenido...', ejemplo: 'Pueden pactar intereses moratorios, pero no exceder límites legales.', caso: 'Caso Lochner v. New York (1905): Reconocimiento de libertad contractual.' },
        { id: 3, titulo: 'Buena fe contractual', contenido: 'Principio que exige comportarse con honestidad y lealtad en el contrato...', ejemplo: 'Si una parte conoce un vicio oculto y no lo revela, actúa de mala fe.', caso: 'Caso Carter v. Boehm (1766): Buena fe en contratos de seguro.' },
        { id: 4, titulo: 'Interpretación de contratos', contenido: 'Reglas: literal, sistemática, funcional, principio de conservación...', ejemplo: 'Cláusula ambigua se interpreta contra quien la redactó.', caso: 'Caso Wood v. Lucy, Lady Duff-Gordon (1917): Obligación implícita de mejores esfuerzos.' },
        { id: 5, titulo: 'Contratos internacionales y UNIDROIT', contenido: 'Principios UNIDROIT para contratos comerciales internacionales...', ejemplo: 'Empresa mexicana y china pueden pactar los Principios UNIDROIT.', caso: 'Tribunal aplicó Principios UNIDROIT para controversia sobre hardship.' }
      ]
    },
    {
      id: 3,
      titulo: 'Incumplimiento y Remedios',
      lecciones: '5 lecciones',
      categoria: 'Incumplimiento',
      leccionesLista: [
        { id: 1, titulo: 'Teoría del incumplimiento', contenido: 'El incumplimiento es la falta de ejecución de una obligación contractual...', ejemplo: 'Entregar un producto defectuoso es incumplimiento parcial.', caso: 'Caso Hong Kong Fir Shipping Co v. Kawasaki Kisen Kaisha (1962)' },
        { id: 2, titulo: 'Remedios en el Common Law', contenido: 'Damages (indemnización), specific performance (cumplimiento específico), injunction...', ejemplo: 'Venta de obra de arte única permite cumplimiento específico.', caso: 'Caso Hadley v. Baxendale (1854): Daños previsibles.' },
        { id: 3, titulo: 'Remedios en el Civil Law', contenido: 'Cumplimiento forzado, rescisión, rebaja de precio, excepción de contrato no cumplido...', ejemplo: 'Si el contratista hace mal la obra, reducción del precio.', caso: 'Arrêt de la Chambre des Requêtes (1876): Exceptio non adimpleti contractus.' },
        { id: 4, titulo: 'Cláusulas penales y daños liquidados', contenido: 'Pacto que fija anticipadamente la indemnización por incumplimiento...', ejemplo: '$1,000 por día de retraso si refleja daño real estimado.', caso: 'Dunlop Pneumatic Tyre Co v. New Garage (1915): Criterios para distinguir penas válidas.' },
        { id: 5, titulo: 'Frustración del contrato y hardship', contenido: 'Frustración extingue el contrato por evento imprevisible...', ejemplo: 'Pandemia que impide evento presencial.', caso: 'Taylor v. Caldwell (1863): Frustración por destrucción de la sala.' }
      ]
    }
  ]
};

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [vista, setVista] = useState('cursos');
  const [moduloActual, setModuloActual] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);
  const [leccionesCompletadas, setLeccionesCompletadas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modoAdmin, setModoAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState('');
  
  // Estado para la imagen a subir
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState('');
  
  // Estado para el formulario de curso
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    precio: '',
    duracion: '',
    totalLecciones: '',
    totalModulos: '',
    incluyeConstancia: 'Constancia incluida',
    imagen: null,
    imagenPreview: null,
    esPremioTorneo: false,
    modulos: []
  });
  const [moduloEditando, setModuloEditando] = useState(null);
  const [leccionEditando, setLeccionEditando] = useState(null);

  // Cargar cursos desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCursos(JSON.parse(stored));
    } else {
      setCursos([cursoInicial]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([cursoInicial]));
    }
  }, []);

  // Guardar cursos en localStorage
  useEffect(() => {
    if (cursos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cursos));
    }
  }, [cursos]);

  // Obtener URL de imagen para mostrar (priorizar imagen subida)
  const obtenerUrlImagen = (curso) => {
    if (curso.imagen && curso.imagen.startsWith('data:image')) {
      return curso.imagen; // Imagen en Base64
    }
    if (curso.imagen && curso.imagen.startsWith('http')) {
      return curso.imagen; // URL externa (backwards compatibility)
    }
    // Imagen por defecto
    return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
  };

  // Manejar selección de imagen local
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const base64 = await convertirImagenABase64(file);
      setImagenPreviewUrl(URL.createObjectURL(file));
      
      // Actualizar formData
      setFormData({
        ...formData,
        imagen: base64,
        imagenPreview: URL.createObjectURL(file)
      });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

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
    setEditandoCurso(null);
    setShowForm(false);
  };

  // CRUD de cursos
  const abrirFormNuevo = () => {
    setEditandoCurso(null);
    setFormData({
      titulo: '',
      subtitulo: '',
      descripcion: '',
      precio: '',
      duracion: '',
      totalLecciones: '',
      totalModulos: '',
      incluyeConstancia: 'Constancia incluida',
      imagen: null,
      imagenPreview: null,
      esPremioTorneo: false,
      modulos: []
    });
    setImagenPreviewUrl('');
    setShowForm(true);
  };

  const abrirFormEditar = (curso) => {
    setEditandoCurso(curso);
    setFormData({
      titulo: curso.titulo,
      subtitulo: curso.subtitulo || '',
      descripcion: curso.descripcion,
      precio: curso.precio ? curso.precio.toString() : '',
      duracion: curso.duracion,
      totalLecciones: curso.totalLecciones,
      totalModulos: curso.totalModulos,
      incluyeConstancia: curso.incluyeConstancia,
      imagen: curso.imagen || null,
      imagenPreview: curso.imagen ? (curso.imagen.startsWith('data:') ? curso.imagen : null) : null,
      esPremioTorneo: curso.esPremioTorneo || false,
      modulos: curso.modulos ? JSON.parse(JSON.stringify(curso.modulos)) : []
    });
    if (curso.imagen && curso.imagen.startsWith('data:')) {
      setImagenPreviewUrl(curso.imagen);
    } else {
      setImagenPreviewUrl('');
    }
    setShowForm(true);
  };

  const guardarCurso = () => {
    if (!formData.titulo) {
      alert('Completa el campo obligatorio: título');
      return;
    }

    const nuevoCurso = {
      id: editandoCurso ? editandoCurso.id : Date.now(),
      titulo: formData.titulo,
      subtitulo: formData.subtitulo,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio) || 0,
      duracion: formData.duracion,
      totalLecciones: formData.totalLecciones,
      totalModulos: formData.totalModulos,
      incluyeConstancia: formData.incluyeConstancia,
      imagen: formData.imagen || null,
      imagenPreview: formData.imagenPreview,
      esPremioTorneo: formData.esPremioTorneo,
      modulos: formData.modulos
    };

    if (editandoCurso) {
      setCursos(cursos.map(c => c.id === editandoCurso.id ? nuevoCurso : c));
    } else {
      setCursos([...cursos, nuevoCurso]);
    }
    setShowForm(false);
    setEditandoCurso(null);
    setImagenPreviewUrl('');
  };

  const eliminarCurso = (id) => {
    if (window.confirm('¿Eliminar este curso permanentemente?')) {
      setCursos(cursos.filter(c => c.id !== id));
    }
  };

  const togglePremioTorneo = (cursoId) => {
    setCursos(cursos.map(curso => 
      curso.id === cursoId 
        ? { ...curso, esPremioTorneo: !curso.esPremioTorneo }
        : curso
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
        lecciones: '5 lecciones',
        categoria: 'Nueva categoría',
        leccionesLista: []
      }]
    });
  };

  const editarModulo = (modulo) => {
    setModuloEditando(modulo);
  };

  const guardarModulo = (moduloEditado) => {
    setFormData({
      ...formData,
      modulos: formData.modulos.map(m => m.id === moduloEditado.id ? moduloEditado : m)
    });
    setModuloEditando(null);
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
      const nuevoId = modulo.leccionesLista.length + 1;
      const nuevasLecciones = [...modulo.leccionesLista, {
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

  const editarLeccion = (moduloId, leccion) => {
    setLeccionEditando({ moduloId, leccion });
  };

  const guardarLeccion = (moduloId, leccionEditada) => {
    setFormData({
      ...formData,
      modulos: formData.modulos.map(m => 
        m.id === moduloId 
          ? { ...m, leccionesLista: m.leccionesLista.map(l => l.id === leccionEditada.id ? leccionEditada : l) }
          : m
      )
    });
    setLeccionEditando(null);
  };

  const eliminarLeccion = (moduloId, leccionId) => {
    if (window.confirm('¿Eliminar esta lección?')) {
      const modulo = formData.modulos.find(m => m.id === moduloId);
      const nuevasLecciones = modulo.leccionesLista.filter(l => l.id !== leccionId);
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

  const calcularProgresoCurso = (curso) => {
    if (!curso || !curso.modulos) return 0;
    const total = curso.modulos.reduce((acc, m) => acc + (m.leccionesLista ? m.leccionesLista.length : 0), 0);
    const completadas = leccionesCompletadas.filter(key => key.startsWith(`${curso.id}-`)).length;
    return total > 0 ? (completadas / total) * 100 : 0;
  };

  const marcarCompletada = (cursoId, moduloId, leccionId, leccionTitulo) => {
    const key = `${cursoId}-${moduloId}-${leccionId}`;
    if (!leccionesCompletadas.includes(key)) {
      setLeccionesCompletadas([...leccionesCompletadas, key]);
      alert(`✅ ¡Lección "${leccionTitulo}" completada!`);
    }
  };

  const estaCompletada = (cursoId, moduloId, leccionId) => {
    return leccionesCompletadas.includes(`${cursoId}-${moduloId}-${leccionId}`);
  };

  const cursosFiltrados = cursos.filter(curso =>
    curso.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    (curso.subtitulo && curso.subtitulo.toLowerCase().includes(filtro.toLowerCase()))
  );

  const cursosPremio = cursos.filter(c => c.esPremioTorneo);

  // Vista: Lista de cursos
  if (vista === 'cursos') {
    return (
      <div className="px-4">
        {/* Portada */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
            alt="Cursos jurídicos"
            className="w-full h-32 object-cover opacity-30"
          />
          <div className="relative z-10 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-amber-400">school</span>
                <h1 className="text-2xl font-black">Cursos y Formación</h1>
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
            <p className="text-gray-200 text-sm">Formación jurídica continua para profesionales del derecho</p>
          </div>
        </div>

        {/* Modal de login admin */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
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
              <input type="text" placeholder="Buscar curso..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-sm">school</span>
                <span className="text-xs text-gray-600">{cursosFiltrados.length} cursos</span>
              </div>
              {modoAdmin && (
                <button onClick={abrirFormNuevo} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Nuevo Curso
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Cursos Premio del Torneo */}
        {cursosPremio.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-2xl text-amber-500">emoji_events</span>
              <h2 className="text-lg font-bold text-gray-800">🏆 Premios del Torneo Jurídico Activo</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cursosPremio.map(curso => (
                <div key={`premio-${curso.id}`} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md border border-amber-200 overflow-hidden cursor-pointer hover:shadow-lg transition" onClick={() => { setCursoSeleccionado(curso); setLeccionesCompletadas([]); setVista('curso'); }}>
                  <div className="flex p-3 gap-3">
                    <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img src={obtenerUrlImagen(curso)} alt={curso.titulo} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/100x120/e2e8f0/475569?text=Curso'; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
                        <span className="text-xs text-amber-600 font-semibold">Premio del Torneo</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{curso.titulo}</h3>
                      {curso.precio > 0 && <p className="text-amber-700 font-bold text-sm mt-1">${curso.precio.toFixed(2)} MXN</p>}
                      {modoAdmin && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(curso); }} className="text-xs text-blue-500">Editar</button>
                          <button onClick={(e) => { e.stopPropagation(); togglePremioTorneo(curso.id); }} className="text-xs text-red-500">Quitar premio</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {cursosFiltrados.map((curso) => (
            <div key={curso.id} className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${curso.esPremioTorneo ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'}`} onClick={() => { setCursoSeleccionado(curso); setLeccionesCompletadas([]); setVista('curso'); }}>
              {curso.esPremioTorneo && (
                <div className="absolute relative z-10">
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">emoji_events</span>
                    Premio Torneo
                  </div>
                </div>
              )}
              <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-100 relative flex items-center justify-center overflow-hidden">
                <img src={obtenerUrlImagen(curso)} alt={curso.titulo} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'; }} />
                {curso.precio > 0 && (
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
                {calcularProgresoCurso(curso) > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round(calcularProgresoCurso(curso))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${calcularProgresoCurso(curso)}%` }}></div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {curso.duracion}
                  </div>
                  <div className="flex items-center gap-2">
                    {modoAdmin && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(curso); }} className="text-blue-500 hover:text-blue-700" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button onClick={(e) => { e.stopPropagation(); eliminarCurso(curso.id); }} className="text-red-500 hover:text-red-700" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button>
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
          ))}
        </div>

        {cursosFiltrados.length === 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">search</span>
            <p className="text-gray-500">No se encontraron cursos con "{filtro}"</p>
          </div>
        )}

        {/* Modal de formulario de curso (crear/editar) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-t-2xl sticky top-0">
                <h2 className="text-xl font-bold text-white">{editandoCurso ? 'Editar Curso' : 'Nuevo Curso'}</h2>
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
                  <div><label className="block text-xs font-bold">Incluye constancia</label><input type="text" value={formData.incluyeConstancia} onChange={e => setFormData({...formData, incluyeConstancia: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" /></div>
                </div>

                {/* SECCIÓN DE IMAGEN CON SUBIDA LOCAL */}
                <div className="border rounded-lg p-3 bg-gray-50 mb-3">
                  <label className="block text-xs font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-amber-500">image</span>
                    Imagen del curso
                  </label>
                  
                  {/* Vista previa de la imagen */}
                  {imagenPreviewUrl && (
                    <div className="mb-3 relative inline-block">
                      <img 
                        src={imagenPreviewUrl} 
                        alt="Vista previa" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-amber-300 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagenPreviewUrl('');
                          setFormData({...formData, imagen: null, imagenPreview: null});
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {/* Input de subida de archivos */}
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-amber-400 transition bg-white">
                        <span className="material-symbols-outlined text-gray-400 text-2xl">cloud_upload</span>
                        <p className="text-xs text-gray-500 mt-1">
                          Haz clic para seleccionar imagen
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Formatos: JPG, PNG, GIF, WEBP (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 mt-2">
                    * La imagen se guardará automáticamente en el curso
                  </p>
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
                      Módulos del Curso ({formData.modulos.length})
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
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => agregarLeccion(modulo.id)} className="text-green-600 text-xs flex items-center gap-0.5"><span className="material-symbols-outlined text-xs">add</span>Lección</button>
                          <button onClick={() => eliminarModulo(modulo.id)} className="text-red-500 text-xs">Eliminar</button>
                        </div>
                      </div>
                      <div className="ml-8 space-y-2">
                        {modulo.leccionesLista && modulo.leccionesLista.map((leccion, lecIdx) => (
                          <div key={leccion.id} className="bg-white rounded-lg p-2 border">
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
                              <textarea placeholder="Contenido" value={leccion.contenido} onChange={e => {
                                const nuevosModulos = [...formData.modulos];
                                nuevosModulos[idx].leccionesLista[lecIdx].contenido = e.target.value;
                                setFormData({...formData, modulos: nuevosModulos});
                              }} className="text-xs border rounded p-1" rows="2"></textarea>
                              <div className="grid grid-cols-2 gap-1">
                                <textarea placeholder="Ejemplo práctico" value={leccion.ejemplo} onChange={e => {
                                  const nuevosModulos = [...formData.modulos];
                                  nuevosModulos[idx].leccionesLista[lecIdx].ejemplo = e.target.value;
                                  setFormData({...formData, modulos: nuevosModulos});
                                }} className="text-xs border rounded p-1" rows="2"></textarea>
                                <textarea placeholder="Caso ilustrativo" value={leccion.caso} onChange={e => {
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
                <button onClick={guardarCurso} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Guardar Curso</button>
              </div>
            </div>
          </div>
        )}

        <style>{`.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
      </div>
    );
  }

  // Vista: Curso (módulos)
  if (vista === 'curso' && cursoSeleccionado) {
    const progreso = calcularProgresoCurso(cursoSeleccionado);
    return (
      <div className="px-4">
        <button onClick={() => setVista('cursos')} className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver a cursos
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-amber-400">school</span>
              <h1 className="text-xl font-bold">{cursoSeleccionado.titulo}</h1>
            </div>
            <p className="text-gray-300 text-sm mt-1">{cursoSeleccionado.descripcion}</p>
            {cursoSeleccionado.esPremioTorneo && (
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
                Módulos del curso
              </h2>
              <div className="text-right">
                <p className="text-xs text-gray-600">Progreso: {Math.round(progreso)}%</p>
                <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progreso}%` }}></div>
                </div>
              </div>
            </div>

            {cursoSeleccionado.modulos.map((modulo) => {
              const completadasModulo = modulo.leccionesLista.filter(lec => estaCompletada(cursoSeleccionado.id, modulo.id, lec.id)).length;
              return (
                <div key={modulo.id} className="border border-gray-200 rounded-xl mb-3 cursor-pointer hover:shadow-md transition bg-white" onClick={() => { setModuloActual(modulo); setVista('modulo'); }}>
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{modulo.titulo}</h3>
                        <p className="text-xs text-gray-500">{modulo.lecciones} · {modulo.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-600">{completadasModulo}/{modulo.leccionesLista.length} completadas</p>
                        <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                          <div className="bg-green-500 h-1 rounded-full" style={{ width: `${(completadasModulo/modulo.leccionesLista.length)*100}%` }}></div>
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
  if (vista === 'modulo' && moduloActual && cursoSeleccionado) {
    return (
      <div className="px-4">
        <button onClick={() => setVista('curso')} className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al curso
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
            <h1 className="text-xl font-bold">{moduloActual.titulo}</h1>
            <p className="text-gray-300 text-sm">{moduloActual.lecciones} · {moduloActual.categoria}</p>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {moduloActual.leccionesLista.map((leccion, idx) => {
                const completada = estaCompletada(cursoSeleccionado.id, moduloActual.id, leccion.id);
                return (
                  <div key={leccion.id} className={`border rounded-xl p-3 cursor-pointer transition ${completada ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`} onClick={() => { setLeccionActual(leccion); setVista('leccion'); }}>
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
  if (vista === 'leccion' && leccionActual && moduloActual && cursoSeleccionado) {
    const completada = estaCompletada(cursoSeleccionado.id, moduloActual.id, leccionActual.id);
    const lecciones = moduloActual.leccionesLista;
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
            <div className="mb-4"><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-amber-500 text-sm">description</span>Contenido</h3><p className="text-gray-700 text-sm leading-relaxed">{leccionActual.contenido}</p></div>
            <div className="mb-4"><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500 text-sm">lightbulb</span>Ejemplo práctico</h3><div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg"><p className="text-gray-700 text-sm">{leccionActual.ejemplo}</p></div></div>
            <div className="mb-4"><h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-purple-500 text-sm">gavel</span>Caso ilustrativo</h3><div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg"><p className="text-gray-700 text-sm">{leccionActual.caso}</p></div></div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setVista('modulo')} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm">Volver</button>
              {!completada && (<button onClick={() => marcarCompletada(cursoSeleccionado.id, moduloActual.id, leccionActual.id, leccionActual.titulo)} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 text-sm flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span>Marcar como completada</button>)}
              {siguienteLeccion && completada && (<button onClick={() => setLeccionActual(siguienteLeccion)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm flex items-center justify-center gap-1">Siguiente lección<span className="material-symbols-outlined text-sm">arrow_forward</span></button>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista: Constancia
  if (vista === 'constancia' && cursoSeleccionado) {
    const fecha = new Date().toLocaleDateString('es-ES');
    const registro = `CONST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    return (
      <div className="px-4">
        <button onClick={() => setVista('curso')} className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al curso
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
              <p className="text-md font-bold text-amber-700 mt-1">{cursoSeleccionado.titulo}</p>
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
            <button onClick={() => { setVista('cursos'); setLeccionesCompletadas([]); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 text-sm flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">school</span>Ver cursos</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Cursos;