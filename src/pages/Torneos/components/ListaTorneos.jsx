import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db, storage } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const STORAGE_KEY = 'lexmindi_torneos';

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
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', fecha: '', imagenPortada: '', premioDinero: '', premioTipo: 'dinero', premioId: '', premioNombre: '',
    tipo: 'Individual', status: 'activo'
  });

  useEffect(() => {
    cargarTorneos();
    cargarPremios();
  }, []);

  const cargarTorneos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'torneos'));
      if (!querySnapshot.empty) {
        const torneosData = [];
        querySnapshot.forEach((doc) => {
          torneosData.push({ id: doc.id, ...doc.data() });
        });
        setTorneos(torneosData);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setTorneos(JSON.parse(stored));
        else setTorneos(torneosIniciales);
      }
    } catch (error) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTorneos(JSON.parse(stored));
      else setTorneos(torneosIniciales);
    }
  };

  const cargarPremios = async () => {
    try {
      const cursosSnap = await getDocs(collection(db, 'cursos'));
      const cursosData = [];
      cursosSnap.forEach((doc) => {
        const data = doc.data();
        cursosData.push({ id: doc.id, ...data, tipo: 'curso' });
      });
      setCursos(cursosData);
    } catch (error) {
      console.warn('No se pudieron cargar cursos:', error.message);
      setCursos([]);
    }

    try {
      const diplosSnap = await getDocs(collection(db, 'diplomados'));
      const diplosData = [];
      diplosSnap.forEach((doc) => {
        const data = doc.data();
        diplosData.push({ id: doc.id, ...data, tipo: 'diplomado' });
      });
      setDiplomados(diplosData);
    } catch (error) {
      console.warn('No se pudieron cargar diplomados:', error.message);
      setDiplomados([]);
    }

    try {
      const storedLibros = localStorage.getItem('lexmindi_libros');
      if (storedLibros) {
        const librosData = JSON.parse(storedLibros);
        setLibros(librosData.map(l => ({ ...l, tipo: 'libro' })));
      }
    } catch (error) {
      console.error('Error cargando libros:', error);
      setLibros([]);
    }
  };

  const subirImagen = async (file) => {
    if (!file) return '';
    
    setSubiendoImagen(true);
    try {
      const nombreUnico = `torneos/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, nombreUnico);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
      return '';
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar 2MB');
      return;
    }

    const url = await subirImagen(file);
    if (url) {
      setFormData({ ...formData, imagenPortada: url });
    }
  };

  const guardarTorneo = async () => {
    if (!formData.titulo || !formData.fecha) {
      alert('Completa los campos obligatorios');
      return;
    }

    let premioNombre = '';
    if (formData.premioTipo === 'curso' && formData.premioId) {
      const curso = cursos.find(c => c.id === formData.premioId);
      premioNombre = curso?.titulo || '';
    } else if (formData.premioTipo === 'diplomado' && formData.premioId) {
      const diploma = diplomados.find(d => d.id === formData.premioId);
      premioNombre = diploma?.titulo || '';
    } else if (formData.premioTipo === 'libro' && formData.premioId) {
      const libro = libros.find(l => l.id === formData.premioId);
      premioNombre = libro?.titulo || '';
    }

    const nuevoTorneo = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      imagenPortada: formData.imagenPortada || '',
      premioDinero: parseFloat(formData.premioDinero) || 0,
      premioTipo: formData.premioTipo,
      premioId: formData.premioId || null,
      premioNombre: premioNombre,
      tipo: formData.tipo,
      status: formData.status,
      actualizado: new Date().toISOString()
    };

    if (!nuevoTorneo.imagenPortada && editandoTorneo?.imagenPortada) {
      nuevoTorneo.imagenPortada = editandoTorneo.imagenPortada;
    }

    try {
      if (editandoTorneo) {
        await updateDoc(doc(db, 'torneos', editandoTorneo.id), nuevoTorneo);
        setTorneos(torneos.map(t => t.id === editandoTorneo.id ? { ...nuevoTorneo, id: t.id } : t));
      } else {
        const nuevoId = Date.now().toString();
        await setDoc(doc(db, 'torneos', nuevoId), nuevoTorneo);
        setTorneos([...torneos, { ...nuevoTorneo, id: nuevoId }]);
      }
      setShowForm(false);
      setEditandoTorneo(null);
      alert('✅ Torneo guardado correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar');
    }
  };

  const eliminarTorneo = async (id, e) => {
    e.stopPropagation();
    if (!modoAdmin) return;
    if (window.confirm('¿Eliminar este torneo?')) {
      try {
        await deleteDoc(doc(db, 'torneos', id));
        setTorneos(torneos.filter(t => t.id !== id));
      } catch (error) {
        setTorneos(torneos.filter(t => t.id !== id));
      }
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
      premioId: torneo.premioId || '',
      premioNombre: torneo.premioNombre || '',
      tipo: torneo.tipo || 'Individual',
      status: torneo.status || 'activo'
    });
    setShowForm(true);
  };

  const handleSeleccionarTorneo = (torneo) => {
    localStorage.setItem('torneo_actual', JSON.stringify(torneo));
    onSeleccionarTorneo(torneo);
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
          <div key={torneo.id} className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSeleccionarTorneo(torneo)}>
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
                onClick={(e) => { e.stopPropagation(); handleSeleccionarTorneo(torneo); }}
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
              
              {/* Campo de imagen de portada */}
              <div>
                <label className="block text-xs font-bold mb-1">📸 Imagen de portada</label>
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:bg-gray-50 transition flex-1 ${subiendoImagen ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImagenChange} 
                      className="hidden" 
                      disabled={subiendoImagen}
                    />
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-2xl text-gray-400">cloud_upload</span>
                      <span className="text-xs text-gray-500">
                        {subiendoImagen ? 'Subiendo...' : 'Subir imagen'}
                      </span>
                    </div>
                  </label>
                  
                  {formData.imagenPortada && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                      <img 
                        src={formData.imagenPortada} 
                        alt="Vista previa" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imagenPortada: '' })}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Formatos: JPG, PNG, GIF. Máx. 2MB</p>
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
                    <input type="number" step="0.01" value={formData.premioDinero} onChange={e => setFormData({...formData, premioDinero: e.target.value})} className="w-full p-2 text-sm border rounded" />
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
                    {cursos.length === 0 && <p className="text-xs text-amber-600 mt-1">No hay cursos disponibles</p>}
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
                    {diplomados.length === 0 && <p className="text-xs text-amber-600 mt-1">No hay diplomados disponibles</p>}
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
                    {libros.length === 0 && <p className="text-xs text-amber-600 mt-1">No hay libros disponibles</p>}
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