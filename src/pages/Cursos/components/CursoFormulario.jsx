// src/pages/Cursos/components/CursoFormulario.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { db, storage } from '../../../firebase';
import { doc, getDoc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CursoFormulario = ({ cursoExistente, onCancelar }) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    duracion: '',
    nivel: 'Intermedio',
    precio: '',
    imagen: '',
    url: '',
    gratis: false,
    premioTorneo: false,
    modulos: []
  });
  
  const [modalModulo, setModalModulo] = useState(false);
  const [modalLeccion, setModalLeccion] = useState(false);
  const [nuevoModulo, setNuevoModulo] = useState('');
  const [moduloIndex, setModuloIndex] = useState(null);
  const [leccion, setLeccion] = useState({ titulo: '', contenido: '', video: '', ejemplo: '', caso: '' });

  useEffect(() => {
    if (cursoExistente) {
      setFormData({
        titulo: cursoExistente.titulo || '',
        subtitulo: cursoExistente.subtitulo || '',
        descripcion: cursoExistente.descripcion || '',
        duracion: cursoExistente.duracion || '',
        nivel: cursoExistente.nivel || 'Intermedio',
        precio: cursoExistente.precio?.toString() || '',
        imagen: cursoExistente.imagenPortada || cursoExistente.imagen || '',
        url: cursoExistente.url || '',
        gratis: cursoExistente.esGratis || cursoExistente.gratis || false,
        premioTorneo: cursoExistente.esPremioTorneo || cursoExistente.premioTorneo || false,
        modulos: cursoExistente.modulos || []
      });
    }
  }, [cursoExistente]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      setFormData(prev => ({ ...prev, imagen: urlImg }));
      setMensaje('Imagen subida correctamente');
      setTimeout(() => setMensaje(''), 2000);
    } catch (error) {
      alert('Error al subir');
    }
    setGuardando(false);
  };

  const agregarModulo = () => {
    if (!nuevoModulo.trim()) {
      alert('Ingresa un título para el módulo');
      return;
    }
    setFormData(prev => ({
      ...prev,
      modulos: [...prev.modulos, { id: Date.now(), titulo: nuevoModulo.trim(), lecciones: [] }]
    }));
    setNuevoModulo('');
    setModalModulo(false);
  };

  const eliminarModulo = (idx) => {
    if (window.confirm('¿Eliminar este módulo?')) {
      setFormData(prev => ({
        ...prev,
        modulos: prev.modulos.filter((_, i) => i !== idx)
      }));
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
    const nuevosModulos = [...formData.modulos];
    if (!nuevosModulos[moduloIndex].lecciones) {
      nuevosModulos[moduloIndex].lecciones = [];
    }
    nuevosModulos[moduloIndex].lecciones.push({
      id: Date.now(),
      titulo: leccion.titulo.trim(),
      contenido: leccion.contenido.trim(),
      video: leccion.video || '',
      ejemplo: leccion.ejemplo || '',
      caso: leccion.caso || ''
    });
    setFormData(prev => ({ ...prev, modulos: nuevosModulos }));
    setLeccion({ titulo: '', contenido: '', video: '', ejemplo: '', caso: '' });
    setModalLeccion(false);
  };

  const eliminarLeccion = (modIdx, lecIdx) => {
    if (window.confirm('¿Eliminar esta lección?')) {
      const nuevosModulos = [...formData.modulos];
      nuevosModulos[modIdx].lecciones = nuevosModulos[modIdx].lecciones.filter((_, i) => i !== lecIdx);
      setFormData(prev => ({ ...prev, modulos: nuevosModulos }));
    }
  };

  const guardarCurso = async () => {
    if (!formData.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }
    setGuardando(true);
    const data = {
      titulo: formData.titulo.trim(),
      subtitulo: formData.subtitulo.trim(),
      descripcion: formData.descripcion.trim(),
      duracion: formData.duracion.trim(),
      nivel: formData.nivel,
      precio: Number(formData.precio) || 0,
      imagenPortada: formData.imagen,
      url: formData.url.trim(),
      esGratis: formData.gratis || Number(formData.precio) === 0,
      esPremioTorneo: formData.premioTorneo,
      modulos: formData.modulos,
      actualizado: new Date().toISOString()
    };
    try {
      if (cursoExistente) {
        await updateDoc(doc(db, 'cursos', cursoExistente.id), data);
        alert('✅ Curso actualizado exitosamente');
      } else {
        data.creado = new Date().toISOString();
        await addDoc(collection(db, 'cursos'), data);
        alert('✅ Curso creado exitosamente');
      }
      navigate('/cursos');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
    setGuardando(false);
  };

  const eliminarCurso = async () => {
    if (!window.confirm('¿Eliminar este curso permanentemente?')) return;
    if (!cursoExistente) return;
    setGuardando(true);
    try {
      await deleteDoc(doc(db, 'cursos', cursoExistente.id));
      alert('✅ Curso eliminado');
      navigate('/cursos');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setGuardando(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 p-4 text-white flex justify-between">
          <h1 className="text-xl font-bold">{cursoExistente ? 'Editar Curso' : 'Nuevo Curso'}</h1>
          {cursoExistente && (
            <button onClick={eliminarCurso} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
          )}
        </div>

        {mensaje && <div className="bg-green-100 p-2 text-center text-green-700">{mensaje}</div>}

        <div className="p-5 space-y-4">
          <div><label className="block font-bold text-sm mb-1">Título *</label><input type="text" name="titulo" className="w-full p-2 border rounded" value={formData.titulo} onChange={handleChange} /></div>
          <div><label className="block font-bold text-sm mb-1">Subtítulo</label><input type="text" name="subtitulo" className="w-full p-2 border rounded" value={formData.subtitulo} onChange={handleChange} /></div>
          <div><label className="block font-bold text-sm mb-1">Descripción</label><textarea rows="4" name="descripcion" className="w-full p-2 border rounded" value={formData.descripcion} onChange={handleChange} /></div>
          
          <div className="grid grid-cols-3 gap-3">
            <input type="text" name="duracion" placeholder="Duración" className="p-2 border rounded" value={formData.duracion} onChange={handleChange} />
            <select name="nivel" className="p-2 border rounded" value={formData.nivel} onChange={handleChange}>
              <option>Básico</option><option>Intermedio</option><option>Avanzado</option>
            </select>
            <input type="number" name="precio" placeholder="Precio MXN" className="p-2 border rounded" value={formData.precio} onChange={handleChange} />
          </div>

          <div>
            <label className="block font-bold text-sm mb-1">Imagen de portada</label>
            <div className="flex gap-2">
              <input type="url" name="imagen" placeholder="URL de imagen" className="flex-1 p-2 border rounded" value={formData.imagen} onChange={handleChange} />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="uploadImg" />
              <label htmlFor="uploadImg" className="bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">Subir imagen</label>
            </div>
            {formData.imagen && <img src={formData.imagen} className="h-16 mt-2 rounded object-cover" alt="Preview" />}
          </div>

          <div><label className="block font-bold text-sm mb-1">URL del producto</label><input type="url" name="url" className="w-full p-2 border rounded" value={formData.url} onChange={handleChange} /></div>

          <div className="flex gap-4">
            <label><input type="checkbox" name="gratis" checked={formData.gratis} onChange={handleChange} /> 🎁 GRATIS</label>
            <label><input type="checkbox" name="premioTorneo" checked={formData.premioTorneo} onChange={handleChange} /> 🏆 Premio del Torneo</label>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">📚 Módulos del Curso</h3>
              <button onClick={() => setModalModulo(true)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">+ Agregar Módulo</button>
            </div>
            
            {formData.modulos.length === 0 && <p className="text-gray-400 text-center py-4">No hay módulos. Haz clic en "+ Agregar Módulo"</p>}
            
            {formData.modulos.map((mod, idx) => (
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

          <div className="flex gap-3 pt-3">
            <button onClick={onCancelar} className="flex-1 border py-2 rounded hover:bg-gray-100">Cancelar</button>
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

export default CursoFormulario;