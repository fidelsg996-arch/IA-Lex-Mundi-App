// src/pages/Libros.js
import { useState, useEffect } from 'react';

// ------------------------------------------------------------
// CONFIGURACIÓN INICIAL
// ------------------------------------------------------------
const STORAGE_KEY = 'lexmindi_libros';
const ADMIN_PASSWORD = 'admin123'; // Cambia esta contraseña

// ------------------------------------------------------------
// DATOS INICIALES (los 16 libros que ya tenemos)
// ------------------------------------------------------------
const librosIniciales = [
  {
    id: 1,
    titulo: 'Colección de Guías y Modelos',
    subtitulo: 'Tomos 1-8 - Actualización 2026',
    descripcion: 'Colección completa que incluye los 8 tomos de Guías y Modelos...',
    precio: 8000.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: '8 tomos',
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/coleccion-guias/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/m%C3%A1s-de-esta-colecci%C3%B3n.jpg',
    esPremioTorneo: false,
    destacados: ['Tomo 1: Materia Agraria', 'Tomo 2: Juicio Especial de Arrendamiento', 'Tomo 3: Juicio Especial Hipotecario Oral', 'Tomo 4: Juicio Ordinario Civil Oral', 'Tomo 5: Responsabilidad Civil', 'Tomo 6: Acción Reivindicatoria', 'Tomo 7: Prescripción', 'Tomo 8: Juicio Sucesorio']
  },
  {
    id: 2,
    titulo: 'Guías y Modelos en Materia Agraria',
    subtitulo: 'Tomo 1 - Actualización 2026',
    descripcion: 'Guía práctica con esquemas procesales, jurisprudencia y formularios especializados en materia agraria.',
    precio: 350.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 280,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guias-y-modelos-en-materia-agraria-tomo-1/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt1.jpg',
    esPremioTorneo: false,
    destacados: ['Esquemas procesales', 'Jurisprudencia agraria', 'Formatos y modelos']
  },
  {
    id: 3,
    titulo: 'Guía de Arrendamiento',
    subtitulo: 'Tomo 2 - Actualización 2026',
    descripcion: 'Guía especializada en materia de arrendamiento inmobiliario.',
    precio: 350.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 250,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guia-arrenamiento-tomo-2/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt2.jpg',
    esPremioTorneo: false,
    destacados: ['Modelos de contratos', 'Demandas de desahucio']
  },
  {
    id: 4,
    titulo: 'Guía y Modelos en Materia de Juicio Especial Hipotecario Oral',
    subtitulo: 'Tomo 3 - Actualización 2026',
    descripcion: 'Guía completa para la tramitación del juicio especial hipotecario oral.',
    precio: 400.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 300,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-juicio-especial-hipotecario-oral-tomo-3/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt3.jpg',
    esPremioTorneo: false,
    destacados: ['Esquema procesal', 'Demandas y contestaciones']
  },
  {
    id: 5,
    titulo: 'Guía y Modelos en Materia de Juicio Ordinario Civil Oral',
    subtitulo: 'Tomo 4 - Actualización 2026',
    descripcion: 'Repertorio completo de guías procesales y modelos de escritos para juicio ordinario civil oral.',
    precio: 1400.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 850,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-juicio-ordinario-civil-oral-tomo-4/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt4.jpg',
    esPremioTorneo: false,
    destacados: ['Etapas del juicio oral', 'Audiencia preliminar', 'Recursos procesales']
  },
  {
    id: 6,
    titulo: 'Guía y Modelos en Materia de Responsabilidad Civil',
    subtitulo: 'Tomo 5 - Actualización 2026',
    descripcion: 'Guía especializada en responsabilidad civil, daño moral y reparación del daño.',
    precio: 380.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 320,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-responsabilidad-civil-tomo-5/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt5.jpg',
    esPremioTorneo: false,
    destacados: ['Daño moral', 'Responsabilidad contractual']
  },
  {
    id: 7,
    titulo: 'Guía y Modelos en Materia de Acción Reivindicatoria',
    subtitulo: 'Tomo 6 - Actualización 2026',
    descripcion: 'Guía completa sobre la acción reivindicatoria.',
    precio: 380.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 310,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-accion-reivindicatoria-tomo-6/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt6.jpg',
    esPremioTorneo: false,
    destacados: ['Demandas reivindicatorias', 'Contestaciones']
  },
  {
    id: 8,
    titulo: 'Guía y Modelos en Materia de Prescripción',
    subtitulo: 'Tomo 7 - Actualización 2026',
    descripcion: 'Guía especializada en prescripción positiva y negativa.',
    precio: 380.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 330,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-prescripcion-tomo-7/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt7.jpg',
    esPremioTorneo: false,
    destacados: ['Usucapión', 'Prescripción adquisitiva']
  },
  {
    id: 9,
    titulo: 'Guía y Modelos en Materia de Juicio Sucesorio',
    subtitulo: 'Tomo 8 - Actualización 2026',
    descripcion: 'Repertorio completo de guías procesales y modelos para juicio sucesorio.',
    precio: 1200.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 1086,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/guia-y-modelos-en-materia-de-juicio-sucesorio-tomo-8/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gt8.jpg',
    esPremioTorneo: false,
    destacados: ['Esquemas procesales', 'Jurisprudencia', 'Formatos']
  },
  {
    id: 10,
    titulo: 'Rescisión de Contratos',
    subtitulo: 'Tomo 9 - Actualización 2026',
    descripcion: 'Guía especializada en rescisión de contratos.',
    precio: 380.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 290,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/rescision-de-contratos-tomo-9/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/rescisi%C3%B3n%20tomo%209.jpg',
    esPremioTorneo: false,
    destacados: ['Demandas de rescisión', 'Contestaciones']
  },
  {
    id: 11,
    titulo: 'Acción Plenaria de Posesión',
    subtitulo: 'Tomo 11 - Actualización 2026',
    descripcion: 'Guía completa sobre la acción plenaria de posesión.',
    precio: 380.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 300,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/accion-plenaria-de-posesion-tomo-11/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/plenaria%20posesi%C3%B3n%20tomo%2011.jpg',
    esPremioTorneo: false,
    destacados: ['Demandas plenarias', 'Protección de la posesión']
  },
  {
    id: 12,
    titulo: 'Incidente de Liquidación de Gastos y Costas',
    subtitulo: 'Tomo 13 - Actualización 2026',
    descripcion: 'Guía especializada en incidente de liquidación de gastos y costas.',
    precio: 380.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 270,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/incidente-de-liquidacion-de-gastos-y-costas-tomo-13/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/gastos%20y%20costas%20tomo%2013.jpg',
    esPremioTorneo: false,
    destacados: ['Procedimiento incidental', 'Formularios']
  },
  {
    id: 13,
    titulo: 'La Tercería',
    subtitulo: 'Tomo 14 - Actualización 2026',
    descripcion: 'Guía completa sobre la tercería excluyente de dominio y coadyuvante.',
    precio: 380.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 310,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/la-terceria-tomo-14/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/tercer%C3%ADa%20tomo%2014.jpg',
    esPremioTorneo: false,
    destacados: ['Tercería excluyente', 'Tercería coadyuvante']
  },
  {
    id: 14,
    titulo: 'Formulario Práctico Forense en Materia de Sucesión Testamentaria',
    subtitulo: 'Actualización 2026',
    descripcion: 'Repertorio completo de guías procesales y modelos de escritos para sucesión testamentaria.',
    precio: 250.00,
    formato: 'Impreso',
    edicion: 'Segunda',
    paginas: 244,
    autor: 'Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/formulario-practico-forense-en-materia-de-sucesion-testamentaria/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/2021/09/B51CA097-8A33-4809-ABF1-E4C771B6D31A.jpeg',
    esPremioTorneo: false,
    destacados: ['Testamentos', 'Demandas', 'Escritos', 'Juicios']
  },
  {
    id: 15,
    titulo: 'La Prescripción Positiva o Usucapión y sus Implicaciones Jurídicas en México',
    subtitulo: 'Tomo 1 - Actualización 2026',
    descripcion: 'Obra completa sobre prescripción positiva o usucapión.',
    precio: 300.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 420,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/la-prescripcion-positiva-o-usucapion-y-sus-implicaciones-juridicas-en-mexico/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/prescripcion%20tomo%201.jpg',
    esPremioTorneo: false,
    destacados: ['Doctrina', 'Legislación estatal', 'Formularios', 'Jurisprudencia']
  },
  {
    id: 16,
    titulo: 'El Recurso de Apelación en México',
    subtitulo: 'Tomo 1 - Actualización 2026',
    descripcion: 'Obra integral sobre el recurso de apelación en México.',
    precio: 350.00,
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: 350,
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: 'https://compilacionesjuridicas.com/producto/apelacion-en-mexico/',
    imagen: 'https://compilacionesjuridicas.com/wp-content/uploads/import_temp/COMPENDIOS/apelaci%C3%B3n.jpg',
    esPremioTorneo: false,
    destacados: ['Fundamentos', 'Formularios', 'Jurisprudencia']
  }
];

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [modoAdmin, setModoAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState('');
  
  // Estado para el formulario de libro
  const [editandoLibro, setEditandoLibro] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    precio: '',
    formato: 'Impreso',
    edicion: 'Primera',
    paginas: '',
    autor: 'Editorial Compilaciones Jurídicas',
    editorial: 'Compilaciones Jurídicas',
    url: '',
    imagen: '',
    esPremioTorneo: false,
    destacados: []
  });
  const [nuevoDestacado, setNuevoDestacado] = useState('');

  // Cargar libros desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLibros(JSON.parse(stored));
    } else {
      setLibros(librosIniciales);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(librosIniciales));
    }
  }, []);

  // Guardar libros en localStorage cuando cambien
  useEffect(() => {
    if (libros.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
    }
  }, [libros]);

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
    setEditandoLibro(null);
    setShowForm(false);
  };

  // CRUD de libros
  const abrirFormNuevo = () => {
    setEditandoLibro(null);
    setFormData({
      titulo: '',
      subtitulo: '',
      descripcion: '',
      precio: '',
      formato: 'Impreso',
      edicion: 'Primera',
      paginas: '',
      autor: 'Editorial Compilaciones Jurídicas',
      editorial: 'Compilaciones Jurídicas',
      url: '',
      imagen: '',
      esPremioTorneo: false,
      destacados: []
    });
    setShowForm(true);
  };

  const abrirFormEditar = (libro) => {
    setEditandoLibro(libro);
    setFormData({
      titulo: libro.titulo,
      subtitulo: libro.subtitulo || '',
      descripcion: libro.descripcion,
      precio: libro.precio.toString(),
      formato: libro.formato,
      edicion: libro.edicion,
      paginas: libro.paginas.toString(),
      autor: libro.autor,
      editorial: libro.editorial,
      url: libro.url,
      imagen: libro.imagen,
      esPremioTorneo: libro.esPremioTorneo || false,
      destacados: libro.destacados || []
    });
    setShowForm(true);
  };

  const guardarLibro = () => {
    if (!formData.titulo || !formData.precio) {
      alert('Completa los campos obligatorios: título y precio');
      return;
    }

    const nuevoLibro = {
      id: editandoLibro ? editandoLibro.id : Date.now(),
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
      destacados: formData.destacados
    };

    if (editandoLibro) {
      setLibros(libros.map(l => l.id === editandoLibro.id ? nuevoLibro : l));
    } else {
      setLibros([...libros, nuevoLibro]);
    }
    setShowForm(false);
    setEditandoLibro(null);
  };

  const eliminarLibro = (id) => {
    if (window.confirm('¿Eliminar este libro permanentemente?')) {
      setLibros(libros.filter(l => l.id !== id));
    }
  };

  const agregarDestacado = () => {
    if (nuevoDestacado.trim()) {
      setFormData({
        ...formData,
        destacados: [...formData.destacados, nuevoDestacado.trim()]
      });
      setNuevoDestacado('');
    }
  };

  const eliminarDestacado = (index) => {
    setFormData({
      ...formData,
      destacados: formData.destacados.filter((_, i) => i !== index)
    });
  };

  const togglePremioTorneo = (libroId) => {
    setLibros(libros.map(libro => 
      libro.id === libroId 
        ? { ...libro, esPremioTorneo: !libro.esPremioTorneo }
        : libro
    ));
  };

  const librosFiltrados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    (libro.subtitulo && libro.subtitulo.toLowerCase().includes(filtro.toLowerCase()))
  );

  const librosPremio = libros.filter(l => l.esPremioTorneo);

  const abrirDetalle = (libro) => {
    setLibroSeleccionado(libro);
  };

  const cerrarDetalle = () => {
    setLibroSeleccionado(null);
  };

  return (
    <div className="px-4">
      {/* Portada */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop" 
          alt="Biblioteca jurídica"
          className="w-full h-32 object-cover opacity-30"
        />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-amber-400">menu_book</span>
              <h1 className="text-2xl font-black">Biblioteca Jurídica</h1>
            </div>
            {/* ✅ CORREGIDO: Solo muestra el botón Admin si NO está en modo admin */}
            {!modoAdmin ? (
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="text-white/70 hover:text-white text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                Admin
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">Modo Admin</span>
                <button 
                  onClick={handleAdminLogout}
                  className="text-white/70 hover:text-white text-sm"
                >
                  Salir
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-200 text-sm">Obras especializadas para la práctica forense</p>
        </div>
      </div>

      {/* Modal de login admin */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4">Acceso Administrador</h2>
            <input
              type="password"
              placeholder="Contraseña"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
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
            <input
              type="text"
              placeholder="Buscar libro..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-sm">library_books</span>
              <span className="text-xs text-gray-600">{librosFiltrados.length} títulos</span>
            </div>
            {/* ✅ CORREGIDO: Solo muestra "Nuevo Libro" si está en modo admin */}
            {modoAdmin && (
              <button
                onClick={abrirFormNuevo}
                className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Nuevo Libro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Libros Premio del Torneo */}
      {librosPremio.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-2xl text-amber-500">emoji_events</span>
            <h2 className="text-lg font-bold text-gray-800">🏆 Premios del Torneo Jurídico Activo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {librosPremio.map(libro => (
              <div 
                key={`premio-${libro.id}`}
                className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md border border-amber-200 overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => abrirDetalle(libro)}
              >
                <div className="flex p-3 gap-3">
                  <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img src={libro.imagen} alt={libro.titulo} className="w-full h-full object-contain" onError={(e) => { e.target.src = 'https://placehold.co/100x120/e2e8f0/475569?text=Libro'; }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
                      <span className="text-xs text-amber-600 font-semibold">Premio del Torneo</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{libro.titulo}</h3>
                    <p className="text-amber-700 font-bold text-sm mt-1">${libro.precio.toFixed(2)} MXN</p>
                    {/* ✅ CORREGIDO: Solo muestra botones de admin si está en modo admin */}
                    {modoAdmin && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(libro); }} className="text-xs text-blue-500">Editar</button>
                        <button onClick={(e) => { e.stopPropagation(); togglePremioTorneo(libro.id); }} className="text-xs text-red-500">Quitar premio</button>
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
          <div 
            key={libro.id} 
            className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${libro.esPremioTorneo ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'}`}
            onClick={() => abrirDetalle(libro)}
          >
            {/* Badge de premio si aplica */}
            {libro.esPremioTorneo && (
              <div className="absolute relative z-10">
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">emoji_events</span>
                  Premio Torneo
                </div>
              </div>
            )}
            
            {/* Imagen */}
            <div className="h-44 bg-gradient-to-br from-amber-50 to-yellow-100 relative flex items-center justify-center overflow-hidden">
              <img 
                src={libro.imagen} 
                alt={libro.titulo}
                className="h-full w-full object-contain bg-white p-2 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="flex flex-col items-center justify-center h-full"><span class="material-symbols-outlined text-4xl text-amber-600">menu_book</span></div>';
                }}
              />
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                ${libro.precio.toFixed(2)} MXN
              </div>
            </div>
            
            <div className="p-3">
              <div className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wide">
                {libro.formato}
              </div>
              <h2 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                {libro.titulo}
              </h2>
              {libro.subtitulo && (
                <p className="text-xs text-gray-500 mb-2">{libro.subtitulo}</p>
              )}
              <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                {libro.descripcion.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">pages</span>
                  {typeof libro.paginas === 'number' ? `${libro.paginas} págs.` : libro.paginas}
                </div>
                <div className="flex items-center gap-2">
                  {/* ✅ CORREGIDO: Solo muestra botones de editar/eliminar si está en modo admin */}
                  {modoAdmin && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); abrirFormEditar(libro); }}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); eliminarLibro(libro.id); }}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </>
                  )}
                  <button 
                    className="text-amber-600 text-xs font-medium hover:text-amber-700 flex items-center gap-0.5"
                    onClick={(e) => { e.stopPropagation(); abrirDetalle(libro); }}
                  >
                    Ver detalles
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay libros */}
      {librosFiltrados.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">search</span>
          <p className="text-gray-500">No se encontraron libros con "{filtro}"</p>
        </div>
      )}

      {/* Modal de formulario de libro (crear/editar) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">{editandoLibro ? 'Editar Libro' : 'Nuevo Libro'}</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold">Título *</label>
                  <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" />
                </div>
                <div>
                  <label className="block text-xs font-bold">Subtítulo</label>
                  <input type="text" value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold">Descripción</label>
                <textarea rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full px-2 py-1 text-sm border rounded"></textarea>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold">Precio *</label>
                  <input type="number" step="0.01" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" />
                </div>
                <div>
                  <label className="block text-xs font-bold">Páginas</label>
                  <input type="text" value={formData.paginas} onChange={e => setFormData({...formData, paginas: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" />
                </div>
                <div>
                  <label className="block text-xs font-bold">Formato</label>
                  <select value={formData.formato} onChange={e => setFormData({...formData, formato: e.target.value})} className="w-full px-2 py-1 text-sm border rounded">
                    <option>Impreso</option>
                    <option>Digital</option>
                    <option>Impreso + Digital</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold">URL del producto</label>
                  <input type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" />
                </div>
                <div>
                  <label className="block text-xs font-bold">URL de la imagen</label>
                  <input type="url" value={formData.imagen} onChange={e => setFormData({...formData, imagen: e.target.value})} className="w-full px-2 py-1 text-sm border rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.esPremioTorneo} onChange={e => setFormData({...formData, esPremioTorneo: e.target.checked})} />
                  Marcar como Premio del Torneo Jurídico Activo
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Contenido destacado</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={nuevoDestacado} onChange={e => setNuevoDestacado(e.target.value)} placeholder="Nuevo elemento" className="flex-1 px-2 py-1 text-sm border rounded" />
                  <button onClick={agregarDestacado} className="bg-gray-200 px-3 rounded text-sm">Agregar</button>
                </div>
                <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
                  {formData.destacados.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-0.5">
                      <span>• {item}</span>
                      <button onClick={() => eliminarDestacado(idx)} className="text-red-500 text-xs">Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={guardarLibro} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {libroSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-t-2xl">
              <button onClick={cerrarDetalle} className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/20 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-amber-400">menu_book</span>
                <h2 className="text-xl font-bold text-white pr-8">{libroSeleccionado.titulo}</h2>
              </div>
              <p className="text-amber-300 text-sm mt-1">{libroSeleccionado.subtitulo}</p>
              {libroSeleccionado.esPremioTorneo && (
                <div className="absolute bottom-2 left-4 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">emoji_events</span>
                  Premio del Torneo Jurídico Activo
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img src={libroSeleccionado.imagen} alt={libroSeleccionado.titulo} className="w-full object-contain bg-white" onError={(e) => { e.target.src = 'https://placehold.co/400x500/e2e8f0/475569?text=Portada'; }} />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-amber-700">${libroSeleccionado.precio.toFixed(2)} MXN</div>
                      <a href={libroSeleccionado.url} target="_blank" rel="noopener noreferrer" className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600 transition w-full inline-block text-center">
                        Adquirir ejemplar
                      </a>
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
                  <div className="mb-3">
                    <h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-sm">description</span>
                      Descripción
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{libroSeleccionado.descripcion}</p>
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-sm">format_list_bulleted</span>
                      Contenido destacado
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                      <ul className="space-y-1">
                        {libroSeleccionado.destacados.map((item, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-xs">check_circle</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-end">
                    <button onClick={cerrarDetalle} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

export default Libros;