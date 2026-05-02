import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db, storage } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const STORAGE_KEY_TORNEOS = 'lexmindi_torneos';
const STORAGE_KEY_LIBROS = 'lexmindi_libros';
const STORAGE_KEY_CURSOS = 'lexmindi_cursos';
const STORAGE_KEY_DIPLOMADOS = 'lexmindi_diplomados';

const torneosIniciales = [
  { 
    id: 1, 
    titulo: 'Torneo de Derecho Civil', 
    descripcion: 'Competencia sobre Derecho Civil, contratos y obligaciones', 
    fecha: '2025-06-15', 
    imagenPortada: '',
    premioDinero: 10000,
    premioTipo: 'dinero',
    premioId: null,
    premioNombre: null,
    tipo: 'Individual', 
    status: 'activo', 
    participantes: 0 
  },
  { 
    id: 2, 
    titulo: 'Torneo de Derecho Penal', 
    descripcion: 'Competencia sobre Derecho Penal, delitos y procedimientos', 
    fecha: '2025-07-20', 
    imagenPortada: '',
    premioDinero: 15000,
    premioTipo: 'dinero',
    premioId: null,
    premioNombre: null,
    tipo: 'Equipos', 
    status: 'activo', 
    participantes: 0 
  }
];

const ListaTorneos = ({ onSeleccionarTorneo, modoAdmin: modoAdminProp }) => {
  const { isAdmin } = useAuth();
  const modoAdmin = modoAdminProp !== undefined ? modoAdminProp : isAdmin();
  
  const [torneos, setTorneos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [diplomados, setDiplomados] = useState([]);
  const [libros, setLibros] = useState([]);
  const [editandoTorneo, setEditandoTorneo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', fecha: '', imagenPortada: '', premioDinero: '', premioTipo: 'dinero', premioId: '', premioNombre: '',
    tipo: 'Individual', status: 'activo'
  });

  // Cargar torneos desde localStorage (y Firestore como respaldo)
  const cargarTorneos = () => {
    const stored = localStorage.getItem(STORAGE_KEY_TORNEOS);
    if (stored) {
      setTorneos(JSON.parse(stored));
    } else {
      setTorneos(torneosIniciales);
      localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(torneosIniciales));
    }
  };

  // Cargar premios desde localStorage (cursos, diplomados, libros)
  const cargarPremios = () => {
    // Cargar cursos
    const storedCursos = localStorage.getItem(STORAGE_KEY_CURSOS);
    if (storedCursos) {
      const cursosData = JSON.parse(storedCursos);
      setCursos(cursosData);
      console.log('Cursos cargados desde localStorage:', cursosData.length);
    } else {
      // Datos de ejemplo si no hay cursos
      const cursosEjemplo = [
        { id: 1, titulo: 'Derecho Civil', descripcion: 'Curso completo de Derecho Civil', duracion: '40 horas', precio: 1500, gratis: false, esPremioTorneo: true },
        { id: 2, titulo: 'Derecho Penal', descripcion: 'Fundamentos del Derecho Penal', duracion: '35 horas', precio: 1200, gratis: false, esPremioTorneo: true }
      ];
      setCursos(cursosEjemplo);
      console.log('Cursos de ejemplo cargados');
    }

    // Cargar diplomados
    const storedDiplomados = localStorage.getItem(STORAGE_KEY_DIPLOMADOS);
    if (storedDiplomados) {
      const diplosData = JSON.parse(storedDiplomados);
      setDiplomados(diplosData);
      console.log('Diplomados cargados desde localStorage:', diplosData.length);
    } else {
      // Datos de ejemplo si no hay diplomados
      const diplosEjemplo = [
        { id: 1, titulo: 'Diplomado en Derecho Corporativo', descripcion: 'Especialización en derecho empresarial', duracion: '160 horas', precio: 5000, gratis: false, esPremioTorneo: true }
      ];
      setDiplomados(diplosEjemplo);
      console.log('Diplomados de ejemplo cargados');
    }

    // Cargar libros
    const storedLibros = localStorage.getItem(STORAGE_KEY_LIBROS);
    if (storedLibros) {
      const librosData = JSON.parse(storedLibros);
      setLibros(librosData);
      console.log('Libros cargados desde localStorage:', librosData.length);
    } else {
      // Datos de ejemplo si no hay libros
      const librosEjemplo = [
        { id: 1, titulo: 'Colección de Guías y Modelos', subtitulo: 'Tomos 1-8', precio: 8000, gratis: false, esPremioTorneo: true },
        { id: 2, titulo: 'Guía de Arrendamiento', subtitulo: 'Tomo 2', precio: 350, gratis: false, esPremioTorneo: true }
      ];
      setLibros(librosEjemplo);
      console.log('Libros de ejemplo cargados');
    }
  };

  // Guardar torneos en localStorage
  const guardarTorneosStorage = (nuevosTorneos) => {
    localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(nuevosTorneos));
    setTorneos(nuevosTorneos);
  };

  useEffect(() => {
    cargarTorneos();
    cargarPremios();
  }, []);

  const subirImagen = async (file) => {
    if (!file) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `torneo_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `torneos/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen');
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ La imagen no debe superar 5MB');
      return;
    }
    
    setGuardando(true);
    const url = await subirImagen(file);
    if (url) {
      setFormData({ ...formData, imagenPortada: url });
      alert('✅ Imagen subida correctamente');
    }
    setGuardando(false);
  };

  const guardarTorneo = () => {
    if (!formData.titulo || !formData.fecha) {
      alert('Completa los campos obligatorios');
      return;
    }

    // Obtener nombre del premio seleccionado
    let premioNombre = '';
    if (formData.premioTipo === 'curso' && formData.premioId) {
      const curso = cursos.find(c => c.id === parseInt(formData.premioId));
      premioNombre = curso?.titulo || '';
    } else if (formData.premioTipo === 'diplomado' && formData.premioId) {
      const diploma = diplomados.find(d => d.id === parseInt(formData.premioId));
      premioNombre = diploma?.titulo || '';
    } else if (formData.premioTipo === 'libro' && formData.premioId) {
      const libro = libros.find(l => l.id === parseInt(formData.premioId));
      premioNombre = libro?.titulo || '';
    }

    let nuevosTorneos;
    if (editandoTorneo) {
      nuevosTorneos = torneos.map(t => 
        t.id === editandoTorneo.id 
          ? { 
              ...t, 
              ...formData, 
              premioDinero: parseFloat(formData.premioDinero) || 0,
              premioNombre,
              actualizado: new Date().toISOString()
            } 
          : t
      );
    } else {
      const nuevoId = Date.now();
      nuevosTorneos = [...torneos, { 
        id: nuevoId, 
        ...formData, 
        premioDinero: parseFloat(formData.premioDinero) || 0,
        premioNombre,
        participantes: 0,
        creado: new Date().toISOString()
      }];
    }

    guardarTorneosStorage(nuevosTorneos);
    setShowForm(false);
    setEditandoTorneo(null);
    alert('✅ Torneo guardado correctamente');
  };

  const eliminarTorneo = (id, e) => {
    e.stopPropagation();
    if (!modoAdmin) return;
    if (window.confirm('¿Eliminar este torneo?')) {
      const nuevosTorneos = torneos.filter(t => t.id !== id);
      guardarTorneosStorage(nuevosTorneos);
    }
  };

  const abrirFormNuevo = () => {
    setEditandoTorneo(null);
    setFormData({
      titulo: '', descripcion: '', fecha: '', imagenPortada: '', premioDinero: '', premioTipo: 'dinero', premioId: '', premioNombre: '',
      tipo: 'Individual', status: 'activo'
    });
    setShowForm(true);
  };

  const abrirFormEditar = (torneo) => {
    setEditandoTorneo(torneo);
    setFormData({
      titulo: torneo.titulo,
      descripcion: torneo.descripcion,
      fecha: torneo.fecha,
      imagenPortada: torneo.imagenPortada || '',
      premioDinero: torneo.premioDinero?.toString() || '',
      premioTipo: torneo.premioTipo || 'dinero',
      premioId: torneo.premioId?.toString() || '',
      premioNombre: torneo.premioNombre || '',
      tipo: torneo.tipo || 'Individual',
      status: torneo.status || 'activo'
    });
    setShowForm(true);
  };

  const obtenerNombrePremio = (torneo) => {
    if (torneo.premioTipo === 'dinero') {
      return `💰 $${torneo.premioDinero?.toLocaleString()} MXN`;
    }
    if (torneo.premioTipo === 'curso') {
      return `🎓 Curso: ${torneo.premioNombre || 'Curso'}`;
    }
    if (torneo.premioTipo === 'diplomado') {
      return `🎖️ Diplomado: ${torneo.premioNombre || 'Diplomado'}`;
    }
    if (torneo.premioTipo === 'libro') {
      return `📚 Libro: ${torneo.premioNombre || 'Libro'}`;
    }
    return `💰 $${torneo.premioDinero?.toLocaleString()} MXN`;
  };

  return (
    <div className="px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-700"></div>
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-red-400">sports_esports</span>
              <h1 className="text-2xl font-black">Torneos Jurídicos</h1>
            </div>
            {modoAdmin && (
              <button onClick={abrirFormNuevo} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-red-600">
                <span className="material-symbols-outlined text-sm">add</span> Nuevo Torneo
              </button>
            )}
          </div>
          <p className="text-gray-200 text-sm">Compite y demuestra tus conocimientos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {torneos.map(torneo => (
          <div key={torneo.id} className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSeleccionarTorneo(torneo)}>
            <div className="h-32 bg-gradient-to-br from-red-50 to-orange-100 relative overflow-hidden">
              {torneo.imagenPortada ? (
                <img src={torneo.imagenPortada} alt={torneo.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {torneo.premioTipo === 'dinero' && <span className="material-symbols-outlined text-5xl text-red-400">payments</span>}
                  {torneo.premioTipo === 'curso' && <span className="material-symbols-outlined text-5xl text-red-400">school</span>}
                  {torneo.premioTipo === 'diplomado' && <span className="material-symbols-outlined text-5xl text-red-400">workspace_premium</span>}
                  {torneo.premioTipo === 'libro' && <span className="material-symbols-outlined text-5xl text-red-400">menu_book</span>}
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <h2 className="text-sm font-bold text-gray-800 line-clamp-2 flex-1">{torneo.titulo}</h2>
                {modoAdmin && (
                  <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); abrirFormEditar(torneo); }} className="text-blue-500 hover:text-blue-700" title="Editar">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={(e) => eliminarTorneo(torneo.id, e)} className="text-red-500 hover:text-red-700" title="Eliminar">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{torneo.descripcion}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-2">
                <span className="flex items-center gap-1">📅 {torneo.fecha}</span>
                <span className="flex items-center gap-1">👥 {torneo.participantes || 0} inscritos</span>
              </div>
              <div className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1">
                🏆 Premio: {obtenerNombrePremio(torneo)}
              </div>
              <button
                onClick={() => onSeleccionarTorneo(torneo)}
                disabled={torneo.status !== 'activo'}
                className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold transition ${
                  torneo.status === 'activo' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {torneo.status === 'activo' ? 'Inscribirse' : 'Finalizado'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición/creación */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-800 to-red-700 p-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">{editandoTorneo ? 'Editar Torneo' : 'Nuevo Torneo'}</h2>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Título *</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full p-2 text-sm border rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Descripción</label>
                <textarea rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-2 text-sm border rounded"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Fecha *</label>
                  <input type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} className="w-full p-2 text-sm border rounded" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Tipo</label>
                  <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full p-2 text-sm border rounded">
                    <option value="Individual">Individual</option>
                    <option value="Equipos">Equipos</option>
                  </select>
                </div>
              </div>
              
              {/* Imagen de portada */}
              <div>
                <label className="block text-xs font-bold mb-1">Imagen de portada</label>
                <div className="flex gap-2 flex-wrap">
                  <input 
                    type="url" 
                    placeholder="https://... o sube una imagen" 
                    value={formData.imagenPortada} 
                    onChange={e => setFormData({...formData, imagenPortada: e.target.value})} 
                    className="flex-1 p-2 text-sm border rounded" 
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imagenUpload"
                    disabled={guardando}
                  />
                  <label 
                    htmlFor="imagenUpload" 
                    className="cursor-pointer bg-gray-100 text-center py-2 px-4 rounded-lg border hover:bg-gray-200 transition text-sm"
                  >
                    {guardando ? '⏳ Subiendo...' : '📁 Subir imagen'}
                  </label>
                </div>
                {formData.imagenPortada && (
                  <div className="mt-2">
                    <img src={formData.imagenPortada} alt="Preview" className="h-16 w-24 object-cover rounded border" />
                  </div>
                )}
              </div>
              
              {/* Selección de premio */}
              <div className="border-t pt-3 mt-2">
                <label className="block text-xs font-bold mb-2">🏆 Tipo de premio</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, premioTipo: 'dinero', premioId: '', premioNombre: ''})}
                    className={`p-2 text-xs rounded-lg border ${formData.premioTipo === 'dinero' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    💰 Dinero
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, premioTipo: 'curso', premioId: '', premioNombre: ''})}
                    className={`p-2 text-xs rounded-lg border ${formData.premioTipo === 'curso' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    🎓 Curso
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, premioTipo: 'diplomado', premioId: '', premioNombre: ''})}
                    className={`p-2 text-xs rounded-lg border ${formData.premioTipo === 'diplomado' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    🎖️ Diplomado
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, premioTipo: 'libro', premioId: '', premioNombre: ''})}
                    className={`p-2 text-xs rounded-lg border ${formData.premioTipo === 'libro' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    📚 Libro
                  </button>
                </div>

                {formData.premioTipo === 'dinero' && (
                  <div>
                    <label className="block text-xs font-bold mb-1">Monto del premio (MXN)</label>
                    <input type="number" step="0.01" value={formData.premioDinero} onChange={e => setFormData({...formData, premioDinero: e.target.value})} className="w-full p-2 text-sm border rounded" placeholder="0.00" />
                  </div>
                )}

                {formData.premioTipo === 'curso' && (
                  <div>
                    <label className="block text-xs font-bold mb-1">Seleccionar Curso</label>
                    <select value={formData.premioId} onChange={e => setFormData({...formData, premioId: e.target.value, premioNombre: e.target.options[e.target.selectedIndex]?.text})} className="w-full p-2 text-sm border rounded">
                      <option value="">-- Seleccionar curso --</option>
                      {cursos.map(curso => (
                        <option key={curso.id} value={curso.id}>
                          {curso.titulo} {curso.gratis ? ' (GRATIS)' : curso.precio ? ` - $${curso.precio}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.premioTipo === 'diplomado' && (
                  <div>
                    <label className="block text-xs font-bold mb-1">Seleccionar Diplomado</label>
                    <select value={formData.premioId} onChange={e => setFormData({...formData, premioId: e.target.value, premioNombre: e.target.options[e.target.selectedIndex]?.text})} className="w-full p-2 text-sm border rounded">
                      <option value="">-- Seleccionar diplomado --</option>
                      {diplomados.map(diplo => (
                        <option key={diplo.id} value={diplo.id}>
                          {diplo.titulo} {diplo.gratis ? ' (GRATIS)' : diplo.precio ? ` - $${diplo.precio}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.premioTipo === 'libro' && (
                  <div>
                    <label className="block text-xs font-bold mb-1">Seleccionar Libro</label>
                    <select value={formData.premioId} onChange={e => setFormData({...formData, premioId: e.target.value, premioNombre: e.target.options[e.target.selectedIndex]?.text})} className="w-full p-2 text-sm border rounded">
                      <option value="">-- Seleccionar libro --</option>
                      {libros.map(libro => (
                        <option key={libro.id} value={libro.id}>
                          {libro.titulo} {libro.gratis || libro.precio === 0 ? ' (GRATIS)' : libro.precio ? ` - $${libro.precio}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Estado</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 text-sm border rounded">
                  <option value="activo">Activo</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={guardarTorneo} className="px-4 py-2 bg-red-500 text-white rounded-lg">Guardar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default ListaTorneos;