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
  const { user, isAdmin } = useAuth();
  const esNuevo = id === 'nuevo';
  
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
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
  const [leccion, setLeccion] = useState({ titulo: '', contenido: '', video: '' });

  // Cargar curso
  useEffect(() => {
    if (!esNuevo && id) {
      cargarCurso();
    }
  }, [id]);

  const cargarCurso = async () => {
    setCargando(true);
    try {
      const docRef = doc(db, 'cursos', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitulo(data.titulo || '');
        setSubtitulo(data.subtitulo || '');
        setDescripcion(data.descripcion || '');
        setDuracion(data.duracion || '');
        setNivel(data.nivel || 'Intermedio');
        setPrecio(data.precio?.toString() || '');
        setImagen(data.imagen || '');
        setUrl(data.url || '');
        setGratis(data.gratis || false);
        setPremioTorneo(data.premioTorneo || false);
        setModulos(data.modulos || []);
      }
    } catch (error) {
      console.error(error);
    }
    setCargando(false);
  };

  const subirImagen = async (file) => {
    const refStorage = ref(storage, `cursos/${Date.now()}_${file.name}`);
    await uploadBytes(refStorage, file);
    return await getDownloadURL(refStorage);
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
      const urlImg = await subirImagen(file);
      setImagen(urlImg);
      setMensaje('Imagen subida');
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
      imagen: imagen,
      url: url.trim(),
      gratis: gratis || Number(precio) === 0,
      premioTorneo,
      modulos,
      actualizado: new Date().toISOString()
    };

    if (esNuevo) data.creado = new Date().toISOString();

    try {
      if (esNuevo) {
        await addDoc(collection(db, 'cursos'), data);
        alert('Curso creado');
      } else {
        await updateDoc(doc(db, 'cursos', id), data);
        alert('Curso actualizado');
      }
      navigate('/cursos');
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setGuardando(false);
  };

  const eliminarCurso = async () => {
    if (!window.confirm('¿Eliminar este curso?')) return;
    try {
      await deleteDoc(doc(db, 'cursos', id));
      alert('Curso eliminado');
      navigate('/cursos');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const agregarModulo = () => {
    if (!nuevoModulo.trim()) return;
    setModulos([...modulos, { id: Date.now(), titulo: nuevoModulo.trim(), lecciones: [] }]);
    setNuevoModulo('');
    setModalModulo(false);
  };

  const eliminarModulo = (idx) => {
    if (window.confirm('¿Eliminar módulo?')) {
      setModulos(modulos.filter((_, i) => i !== idx));
    }
  };

  const agregarLeccion = () => {
    if (!leccion.titulo.trim()) {
      alert('Título requerido');
      return;
    }
    if (!leccion.contenido.trim()) {
      alert('Contenido requerido');
      return;
    }
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].lecciones.push({
      id: Date.now(),
      titulo: leccion.titulo.trim(),
      contenido: leccion.contenido.trim(),
      video: leccion.video.trim()
    });
    setModulos(nuevosModulos);
    setLeccion({ titulo: '', contenido: '', video: '' });
    setModalLeccion(false);
  };

  const eliminarLeccion = (modIdx, lecIdx) => {
    if (window.confirm('¿Eliminar lección?')) {
      const nuevosModulos = [...modulos];
      nuevosModulos[modIdx].lecciones = nuevosModulos[modIdx].lecciones.filter((_, i) => i !== lecIdx);
      setModulos(nuevosModulos);
    }
  };

  if (cargando) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 p-4 text-white flex justify-between">
          <h1 className="text-xl font-bold">{esNuevo ? 'Crear Curso' : 'Editar Curso'}</h1>
          {!esNuevo && (
            <button onClick={eliminarCurso} className="bg-red-600 px-3 py-1 rounded">Eliminar</button>
          )}
        </div>

        {mensaje && <div className="bg-green-100 p-2 text-center">{mensaje}</div>}

        <div className="p-5 space-y-4">
          {/* Básicos */}
          <input type="text" placeholder="Título *" className="w-full p-2 border rounded" value={titulo} onChange={e => setTitulo(e.target.value)} />
          <input type="text" placeholder="Subtítulo" className="w-full p-2 border rounded" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} />
          <textarea rows="4" placeholder="Descripción" className="w-full p-2 border rounded" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          
          <div className="grid grid-cols-3 gap-3">
            <input type="text" placeholder="Duración (ej: 40h)" className="p-2 border rounded" value={duracion} onChange={e => setDuracion(e.target.value)} />
            <select className="p-2 border rounded" value={nivel} onChange={e => setNivel(e.target.value)}>
              <option>Básico</option><option>Intermedio</option><option>Avanzado</option>
            </select>
            <input type="number" step="0.01" placeholder="Precio MXN" className="p-2 border rounded" value={precio} onChange={e => setPrecio(e.target.value)} />
          </div>
          
          {/* Imagen */}
          <div className="flex gap-2">
            <input type="url" placeholder="URL imagen" className="flex-1 p-2 border rounded" value={imagen} onChange={e => setImagen(e.target.value)} />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="uploadImg" />
            <label htmlFor="uploadImg" className="bg-gray-200 px-4 py-2 rounded cursor-pointer">Subir</label>
          </div>
          {imagen && <img src={imagen} className="h-20 rounded" alt="preview" onError={e => e.target.style.display = 'none'} />}
          
          <input type="url" placeholder="URL del producto" className="w-full p-2 border rounded" value={url} onChange={e => setUrl(e.target.value)} />
          
          <div className="flex gap-4">
            <label><input type="checkbox" checked={gratis} onChange={e => setGratis(e.target.checked)} /> 🎁 GRATIS</label>
            <label><input type="checkbox" checked={premioTorneo} onChange={e => setPremioTorneo(e.target.checked)} /> 🏆 Premio Torneo</label>
          </div>
          
          {/* Módulos */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold">Módulos</h3>
              <button onClick={() => setModalModulo(true)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">+ Módulo</button>
            </div>
            
            {modulos.map((mod, idx) => (
              <div key={mod.id} className="border p-3 rounded mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{mod.titulo}</span>
                  <button onClick={() => eliminarModulo(idx)} className="text-red-500 text-sm">Eliminar</button>
                </div>
                <div className="ml-4 mt-2">
                  <button onClick={() => { setModuloIndex(idx); setModalLeccion(true); }} className="text-blue-600 text-sm">+ Lección</button>
                  {mod.lecciones.map((lec, lecIdx) => (
                    <div key={lec.id} className="bg-gray-50 p-2 mt-2 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">📖 {lec.titulo}</span>
                        <button onClick={() => eliminarLeccion(idx, lecIdx)} className="text-red-400 text-xs">Eliminar</button>
                      </div>
                      <details className="mt-1">
                        <summary className="text-xs text-gray-500 cursor-pointer">Ver contenido</summary>
                        <div className="pl-3 mt-1 text-sm whitespace-pre-wrap">{lec.contenido}</div>
                        {lec.video && <div className="text-xs text-blue-500 mt-1">🎥 {lec.video}</div>}
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Botones */}
          <div className="flex gap-3 pt-3">
            <button onClick={() => navigate('/cursos')} className="flex-1 border py-2 rounded">Cancelar</button>
            <button onClick={guardarCurso} disabled={guardando} className="flex-1 bg-blue-600 text-white py-2 rounded">
              {guardando ? 'Guardando...' : 'Guardar Curso'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal Módulo */}
      {modalModulo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-3">Nuevo Módulo</h3>
            <input type="text" placeholder="Título" className="w-full p-2 border rounded mb-3" value={nuevoModulo} onChange={e => setNuevoModulo(e.target.value)} autoFocus />
            <div className="flex gap-2">
              <button onClick={() => setModalModulo(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancelar</button>
              <button onClick={agregarModulo} className="flex-1 bg-green-600 text-white py-2 rounded">Agregar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Lección */}
      {modalLeccion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-[600px] max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-bold mb-3">Nueva Lección</h3>
            <input type="text" placeholder="Título *" className="w-full p-2 border rounded mb-2" value={leccion.titulo} onChange={e => setLeccion({...leccion, titulo: e.target.value})} />
            <textarea placeholder="Contenido *" rows={6} className="w-full p-2 border rounded mb-2" value={leccion.contenido} onChange={e => setLeccion({...leccion, contenido: e.target.value})} />
            <input type="url" placeholder="URL del video (opcional)" className="w-full p-2 border rounded mb-3" value={leccion.video} onChange={e => setLeccion({...leccion, video: e.target.value})} />
            <div className="flex gap-2">
              <button onClick={() => setModalLeccion(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancelar</button>
              <button onClick={agregarLeccion} className="flex-1 bg-green-600 text-white py-2 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursoDetalle;