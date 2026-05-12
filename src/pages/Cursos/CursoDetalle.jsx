// src/pages/Cursos/CursoDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase';
import { doc, getDoc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CursoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  
  // Determinar el tipo de vista
  const idLimpio = id?.replace('/editar', '');
  const esNuevo = id === 'nuevo';
  const esEdicion = id?.includes('/editar') || (!esNuevo && idLimpio);
  const idDocumento = esNuevo ? null : idLimpio;
  
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [inscrito, setInscrito] = useState(false);
  
  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [nivel, setNivel] = useState('Intermedio');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [url, setUrl] = useState('');
  const [gratis, setGratis] = useState(false);
  const [premioTorneo, setPremioTorneo] = useState(false);
  const [modulos, setModulos] = useState([]);
  
  // Modales
  const [modalModulo, setModalModulo] = useState(false);
  const [modalLeccion, setModalLeccion] = useState(false);
  const [nuevoModulo, setNuevoModulo] = useState('');
  const [moduloIndex, setModuloIndex] = useState(null);
  const [leccion, setLeccion] = useState({ titulo: '', contenido: '', video: '', ejemplo: '', caso: '' });

  // Cargar curso si es edición
  useEffect(() => {
    if (idDocumento) {
      cargarCurso();
    }
    // Verificar inscripción si es vista pública
    if (!esNuevo && !esEdicion && idDocumento && user) {
      verificarInscripcion();
    }
  }, [idDocumento, user]);

  const verificarInscripcion = async () => {
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      const userDoc = await getDoc(userRef);
      const misCursos = userDoc.data()?.misCursos || [];
      const estaInscrito = misCursos.some(c => c.id === idDocumento || c === idDocumento);
      setInscrito(estaInscrito);
    } catch (error) {
      console.error('Error verificando inscripción:', error);
    }
  };

  const cargarCurso = async () => {
    setCargando(true);
    try {
      const docRef = doc(db, 'cursos', idDocumento);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitulo(data.titulo || '');
        setSubtitulo(data.subtitulo || '');
        setDescripcion(data.descripcion || '');
        setDuracion(data.duracion || '');
        setNivel(data.nivel || 'Intermedio');
        setPrecio(data.precio?.toString() || '');
        setImagen(data.imagenPortada || data.imagen || '');
        setUrl(data.url || '');
        setGratis(data.esGratis || data.gratis || false);
        setPremioTorneo(data.esPremioTorneo || data.premioTorneo || false);
        
        // Cargar módulos
        let modulosData = [];
        if (data.modulos && Array.isArray(data.modulos)) {
          modulosData = data.modulos.map((mod, idx) => ({
            id: mod.id || idx,
            titulo: mod.titulo || '',
            lecciones: (mod.leccionesLista || mod.lecciones || []).map((lec, lecIdx) => ({
              id: lec.id || lecIdx,
              titulo: lec.titulo || '',
              contenido: lec.contenido || '',
              video: lec.video || '',
              ejemplo: lec.ejemplo || '',
              caso: lec.caso || ''
            }))
          }));
        }
        setModulos(modulosData);
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al cargar el curso');
    }
    setCargando(false);
  };

  const inscribirse = async () => {
    if (!user) {
      alert('Debes iniciar sesión para inscribirte');
      navigate('/login');
      return;
    }

    try {
      const userRef = doc(db, 'usuarios', user.uid);
      const cursoData = {
        id: idDocumento,
        titulo: titulo,
        fechaInscripcion: new Date().toISOString(),
        progreso: 0
      };
      
      await updateDoc(userRef, {
        misCursos: [...(await getDoc(userRef)).data()?.misCursos || [], cursoData]
      });
      
      setInscrito(true);
      alert('✅ Te has inscrito correctamente');
    } catch (error) {
      console.error('Error al inscribirse:', error);
      alert('Error al inscribirse: ' + error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Solo imágenes');
      return;
    }
    setGuardando(true);
    try {
      const storageRef = ref(storage, `cursos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const urlImg = await getDownloadURL(storageRef);
      setImagen(urlImg);
      setMensaje('Imagen subida correctamente');
      setTimeout(() => setMensaje(''), 2000);
    } catch (error) {
      alert('Error al subir');
    }
    setGuardando(false);
  };

  const guardarCurso = async () => {
    if (!titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    setGuardando(true);
    
    const data = {
      titulo: titulo.trim(),
      subtitulo: subtitulo.trim(),
      descripcion: descripcion.trim(),
      duracion: duracion.trim(),
      nivel,
      precio: Number(precio) || 0,
      imagenPortada: imagen,
      url: url.trim(),
      esGratis: gratis || Number(precio) === 0,
      esPremioTorneo: premioTorneo,
      modulos: modulos.map(mod => ({
        id: mod.id,
        titulo: mod.titulo,
        leccionesLista: (mod.lecciones || []).map(lec => ({
          id: lec.id,
          titulo: lec.titulo,
          contenido: lec.contenido,
          video: lec.video || '',
          ejemplo: lec.ejemplo || '',
          caso: lec.caso || ''
        }))
      })),
      actualizado: new Date().toISOString()
    };

    if (esNuevo) {
      data.creado = new Date().toISOString();
    }

    try {
      if (esNuevo) {
        await addDoc(collection(db, 'cursos'), data);
        alert('Curso creado exitosamente');
      } else {
        await updateDoc(doc(db, 'cursos', idDocumento), data);
        alert('Curso actualizado exitosamente');
      }
      navigate('/cursos');
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
    setGuardando(false);
  };

  const eliminarCurso = async () => {
    if (!window.confirm('¿Eliminar este curso permanentemente?')) return;
    setGuardando(true);
    try {
      await deleteDoc(doc(db, 'cursos', idDocumento));
      alert('Curso eliminado');
      navigate('/cursos');
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setGuardando(false);
  };

  const agregarModulo = () => {
    if (!nuevoModulo.trim()) {
      alert('Ingresa un título para el módulo');
      return;
    }
    setModulos([...modulos, { id: Date.now(), titulo: nuevoModulo.trim(), lecciones: [] }]);
    setNuevoModulo('');
    setModalModulo(false);
  };

  const eliminarModulo = (idx) => {
    if (window.confirm('¿Eliminar este módulo?')) {
      setModulos(modulos.filter((_, i) => i !== idx));
    }
  };

  const agregarLeccion = () => {
    if (!leccion.titulo.trim()) {
      alert('Ingresa un título para la lección');
      return;
    }
    if (!leccion.contenido.trim()) {
      alert('Ingresa el contenido de la lección');
      return;
    }
    const nuevosModulos = [...modulos];
    if (!nuevosModulos[moduloIndex].lecciones) {
      nuevosModulos[moduloIndex].lecciones = [];
    }
    nuevosModulos[moduloIndex].lecciones.push({
      id: Date.now(),
      titulo: leccion.titulo.trim(),
      contenido: leccion.contenido.trim(),
      video: leccion.video.trim(),
      ejemplo: leccion.ejemplo || '',
      caso: leccion.caso || ''
    });
    setModulos(nuevosModulos);
    setLeccion({ titulo: '', contenido: '', video: '', ejemplo: '', caso: '' });
    setModalLeccion(false);
  };

  const eliminarLeccion = (modIdx, lecIdx) => {
    if (window.confirm('¿Eliminar esta lección?')) {
      const nuevosModulos = [...modulos];
      nuevosModulos[modIdx].lecciones = nuevosModulos[modIdx].lecciones.filter((_, i) => i !== lecIdx);
      setModulos(nuevosModulos);
    }
  };

  // ==============================================
  // VISTA DE DETALLE (SOLO PARA USUARIOS NORMALES)
  // ==============================================
  if (!isAdmin && !esNuevo && !esEdicion && idDocumento) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {imagen && <img src={imagen} className="w-full h-64 object-cover" alt={titulo} />}
          <div className="p-6">
            <h1 className="text-3xl font-bold">{titulo}</h1>
            {subtitulo && <p className="text-gray-500 mt-1">{subtitulo}</p>}
            <div className="flex gap-4 mt-3 text-sm">
              <span>⏱️ {duracion || 'N/E'}</span>
              <span>📊 {nivel}</span>
              <span>{gratis || Number(precio) === 0 ? '🎁 GRATIS' : `💰 $${precio} MXN`}</span>
            </div>
            <div className="mt-4 text-gray-700 whitespace-pre-wrap">{descripcion}</div>
            
            {modulos && modulos.length > 0 && modulos.map((mod, idx) => (
              <div key={mod.id} className="border rounded-lg mt-4">
                <div className="bg-gray-100 p-3 font-semibold">Módulo {idx + 1}: {mod.titulo}</div>
                <div className="p-3">
                  {mod.lecciones && mod.lecciones.map((lec) => (
                    <details key={lec.id} className="border-b py-2">
                      <summary className="cursor-pointer font-medium">📖 {lec.titulo}</summary>
                      <div className="mt-2 pl-4 text-gray-600">
                        <p>{lec.contenido}</p>
                        {lec.ejemplo && <p className="mt-2"><strong>💡 Ejemplo:</strong> {lec.ejemplo}</p>}
                        {lec.caso && <p className="mt-2"><strong>⚖️ Caso:</strong> {lec.caso}</p>}
                      </div>
                      {lec.video && (
                        <iframe 
                          className="w-full h-64 mt-2" 
                          src={lec.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')} 
                          title={lec.titulo}
                          frameBorder="0"
                          allowFullScreen
                        />
                      )}
                    </details>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex gap-3 mt-6">
              {!inscrito && (gratis || Number(precio) === 0) && (
                <button onClick={inscribirse} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
                  📝 Inscribirme Gratis
                </button>
              )}
              {inscrito && (
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                  ▶️ Continuar aprendiendo
                </button>
              )}
              <button onClick={() => navigate('/cursos')} className="bg-gray-200 px-6 py-2 rounded-lg">
                ← Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // FORMULARIO DE EDICIÓN/CREACIÓN (ADMIN)
  // ==============================================
  if (cargando) return <div className="text-center py-20">Cargando curso...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 p-4 text-white flex justify-between">
          <h1 className="text-xl font-bold">{esNuevo ? 'Nuevo Curso' : 'Editar Curso'}</h1>
          {!esNuevo && (
            <button onClick={eliminarCurso} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
          )}
        </div>

        {mensaje && <div className="bg-green-100 p-2 text-center text-green-700">{mensaje}</div>}

        <div className="p-5 space-y-4">
          {/* Título */}
          <div>
            <label className="block font-bold text-sm mb-1">Título *</label>
            <input type="text" className="w-full p-2 border rounded" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej: Derecho Civil Avanzado" />
          </div>

          {/* Subtítulo */}
          <div>
            <label className="block font-bold text-sm mb-1">Subtítulo</label>
            <input type="text" className="w-full p-2 border rounded" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} placeholder="Ej: Especialización práctica" />
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-bold text-sm mb-1">Descripción</label>
            <textarea rows="4" className="w-full p-2 border rounded" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Describe el contenido del curso..." />
          </div>

          {/* Duración, Nivel, Precio */}
          <div className="grid grid-cols-3 gap-3">
            <input type="text" placeholder="Duración (ej: 40h)" className="p-2 border rounded" value={duracion} onChange={e => setDuracion(e.target.value)} />
            <select className="p-2 border rounded" value={nivel} onChange={e => setNivel(e.target.value)}>
              <option>Básico</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
            <input type="number" step="0.01" placeholder="Precio MXN" className="p-2 border rounded" value={precio} onChange={e => setPrecio(e.target.value)} />
          </div>

          {/* Imagen */}
          <div>
            <label className="block font-bold text-sm mb-1">Imagen de portada</label>
            <div className="flex gap-2">
              <input type="url" placeholder="URL de imagen" className="flex-1 p-2 border rounded" value={imagen} onChange={e => setImagen(e.target.value)} />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="uploadImg" />
              <label htmlFor="uploadImg" className="bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">Subir imagen</label>
            </div>
            {imagen && <img src={imagen} className="h-16 mt-2 rounded object-cover" alt="Preview" />}
          </div>

          {/* URL del producto */}
          <div>
            <label className="block font-bold text-sm mb-1">URL del producto (para comprar)</label>
            <input type="url" placeholder="https://..." className="w-full p-2 border rounded" value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={gratis} onChange={e => setGratis(e.target.checked)} /> 🎁 GRATIS
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={premioTorneo} onChange={e => setPremioTorneo(e.target.checked)} /> 🏆 Premio del Torneo
            </label>
          </div>

          {/* Módulos */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">📚 Módulos del Curso</h3>
              <button onClick={() => setModalModulo(true)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">+ Agregar Módulo</button>
            </div>
            
            {modulos.length === 0 && <p className="text-gray-400 text-center py-4">No hay módulos. Haz clic en "+ Agregar Módulo"</p>}
            
            {modulos.map((mod, idx) => (
              <div key={mod.id} className="border p-3 rounded mb-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">📘 {mod.titulo}</span>
                  <button onClick={() => eliminarModulo(idx)} className="text-red-500 text-sm hover:text-red-700">Eliminar</button>
                </div>
                <div className="ml-4 mt-2">
                  <button onClick={() => { setModuloIndex(idx); setModalLeccion(true); }} className="text-blue-600 text-sm mb-2 hover:text-blue-800">+ Agregar Lección</button>
                  {mod.lecciones && mod.lecciones.map((lec, lecIdx) => (
                    <div key={lec.id} className="bg-gray-50 p-2 mt-2 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">📖 {lec.titulo}</span>
                        <button onClick={() => eliminarLeccion(idx, lecIdx)} className="text-red-400 text-xs hover:text-red-600">Eliminar</button>
                      </div>
                      <details>
                        <summary className="text-xs cursor-pointer">Ver contenido</summary>
                        <div className="pl-3 mt-1 text-sm">{lec.contenido?.substring(0, 100)}...</div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-3">
            <button onClick={() => navigate('/cursos')} className="flex-1 border py-2 rounded hover:bg-gray-100">Cancelar</button>
            <button onClick={guardarCurso} disabled={guardando} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {guardando ? 'Guardando...' : 'Guardar Curso'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar módulo */}
      {modalModulo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalModulo(false)}>
          <div className="bg-white p-5 rounded-lg w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3">Nuevo Módulo</h3>
            <input type="text" placeholder="Título del módulo" className="w-full p-2 border rounded mb-3" value={nuevoModulo} onChange={e => setNuevoModulo(e.target.value)} autoFocus />
            <div className="flex gap-2">
              <button onClick={() => setModalModulo(false)} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={agregarModulo} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar lección */}
      {modalLeccion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalLeccion(false)}>
          <div className="bg-white p-5 rounded-lg w-[600px] max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3">Nueva Lección</h3>
            <input type="text" placeholder="Título de la lección *" className="w-full p-2 border rounded mb-2" value={leccion.titulo} onChange={e => setLeccion({...leccion, titulo: e.target.value})} />
            <textarea placeholder="Contenido de la lección *" rows={6} className="w-full p-2 border rounded mb-2" value={leccion.contenido} onChange={e => setLeccion({...leccion, contenido: e.target.value})} />
            <input type="text" placeholder="Ejemplo práctico (opcional)" className="w-full p-2 border rounded mb-2" value={leccion.ejemplo} onChange={e => setLeccion({...leccion, ejemplo: e.target.value})} />
            <input type="text" placeholder="Caso práctico (opcional)" className="w-full p-2 border rounded mb-2" value={leccion.caso} onChange={e => setLeccion({...leccion, caso: e.target.value})} />
            <input type="url" placeholder="URL del video (opcional)" className="w-full p-2 border rounded mb-3" value={leccion.video} onChange={e => setLeccion({...leccion, video: e.target.value})} />
            <div className="flex gap-2">
              <button onClick={() => setModalLeccion(false)} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={agregarLeccion} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursoDetalle;