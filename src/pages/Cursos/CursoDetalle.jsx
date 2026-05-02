// src/pages/Cursos/CursoDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CursoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const modoAdmin = isAdmin();
  const esNuevo = id === 'nuevo';
  const esEdicion = id?.endsWith('/editar');
  const idReal = esEdicion ? id.replace('/editar', '') : id;
  
  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(esNuevo || esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', subtitulo: '', descripcion: '', duracion: '', nivel: 'Intermedio', precio: '',
    imagenPortada: '', url: '', gratis: false, esPremioTorneo: false,
    modulo: [], examenFinal: { preguntas: [] }, constancia: '', certificacion: ''
  });
  const [showModuloForm, setShowModuloForm] = useState(false);
  const [showLeccionForm, setShowLeccionForm] = useState(false);
  const [nuevoModulo, setNuevoModulo] = useState({ titulo: '' });
  const [nuevaLeccion, setNuevaLeccion] = useState({ titulo: '', contenido: '', video: '', recursos: [] });
  const [moduloEditando, setModuloEditando] = useState(null);

  useEffect(() => {
    if (!esNuevo && !esEdicion) {
      cargarCurso();
    } else if (esNuevo) {
      setCargando(false);
      setEditando(true);
    } else if (esEdicion && !esNuevo) {
      cargarCurso();
      setEditando(true);
    }
  }, [id]);

  const cargarCurso = async () => {
    try {
      const docRef = doc(db, 'cursos', idReal);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurso({ id: docSnap.id, ...data });
        setFormData(data);
      } else {
        navigate('/cursos');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  // Subir imagen a Firebase Storage
  const subirImagen = async (file) => {
    if (!file) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `curso_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `cursos/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen');
      return null;
    }
  };

  // Manejar subida de imagen desde archivo local
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

  // ✅ GUARDAR CURSO - CORREGIDO: REDIRIGE A /cursos
  const guardarCurso = async () => {
    if (!formData.titulo) {
      alert('El título es obligatorio');
      return;
    }

    setGuardando(true);

    const dataToSave = {
      ...formData,
      precio: parseFloat(formData.precio) || 0,
      actualizado: new Date().toISOString(),
      creado: curso?.creado || new Date().toISOString()
    };

    try {
      if (esNuevo) {
        const nuevoId = Date.now().toString();
        await setDoc(doc(db, 'cursos', nuevoId), dataToSave);
        alert('✅ Curso creado correctamente');
        navigate('/cursos');
      } else {
        await updateDoc(doc(db, 'cursos', idReal), dataToSave);
        setCurso({ id: idReal, ...dataToSave });
        alert('✅ Curso actualizado correctamente');
        navigate('/cursos');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const agregarModulo = () => {
    if (!nuevoModulo.titulo) return;
    const nuevoModuloObj = {
      id: Date.now(),
      titulo: nuevoModulo.titulo,
      lecciones: [],
      examenParcial: { preguntas: [] }
    };
    setFormData({ ...formData, modulo: [...(formData.modulo || []), nuevoModuloObj] });
    setNuevoModulo({ titulo: '' });
    setShowModuloForm(false);
  };

  const agregarLeccion = () => {
    if (!nuevaLeccion.titulo) return;
    const nuevaLeccionObj = {
      id: Date.now(),
      titulo: nuevaLeccion.titulo,
      contenido: nuevaLeccion.contenido,
      video: nuevaLeccion.video,
      recursos: nuevaLeccion.recursos
    };
    const moduloActualizado = [...(formData.modulo || [])];
    if (moduloActualizado[moduloEditando]) {
      moduloActualizado[moduloEditando].lecciones.push(nuevaLeccionObj);
      setFormData({ ...formData, modulo: moduloActualizado });
    }
    setNuevaLeccion({ titulo: '', contenido: '', video: '', recursos: [] });
    setShowLeccionForm(false);
  };

  const eliminarModulo = (idx) => {
    if (window.confirm('¿Eliminar este módulo y todas sus lecciones?')) {
      const nuevosModulos = formData.modulo.filter((_, i) => i !== idx);
      setFormData({ ...formData, modulo: nuevosModulos });
    }
  };

  const eliminarLeccion = (moduloIdx, leccionIdx) => {
    if (window.confirm('¿Eliminar esta lección?')) {
      const nuevosModulos = [...formData.modulo];
      nuevosModulos[moduloIdx].lecciones = nuevosModulos[moduloIdx].lecciones.filter((_, i) => i !== leccionIdx);
      setFormData({ ...formData, modulo: nuevosModulos });
    }
  };

  if (cargando) return <div className="text-center py-20">Cargando cursos...</div>;

  // ✅ VISTA PÚBLICA (para estudiantes)
  if (!modoAdmin && !editando && curso) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {curso.imagenPortada && <img src={curso.imagenPortada} alt={curso.titulo} className="w-full h-64 object-cover" />}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{curso.titulo}</h1>
                {curso.subtitulo && <p className="text-gray-500 mt-1">{curso.subtitulo}</p>}
              </div>
              {modoAdmin && (
                <button onClick={() => setEditando(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
                  Editar Curso
                </button>
              )}
            </div>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">⏱️ {curso.duracion}</span>
              <span className="flex items-center gap-1">📊 {curso.nivel}</span>
              <span className="flex items-center gap-1">
                {curso.gratis ? '🎁 GRATIS' : `💰 $${parseFloat(curso.precio || 0).toFixed(2)} MXN`}
              </span>
            </div>
            <p className="mt-4 text-gray-700 leading-relaxed">{curso.descripcion}</p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">📚 Módulos del Curso</h2>
            {curso.modulo && curso.modulo.length > 0 ? (
              curso.modulo.map((modulo, idx) => (
                <div key={modulo.id} className="border rounded-lg mb-4 overflow-hidden">
                  <div className="bg-gray-100 p-3 font-semibold">Módulo {idx + 1}: {modulo.titulo}</div>
                  <div className="p-3">
                    {modulo.lecciones && modulo.lecciones.map((leccion, lecIdx) => (
                      <div key={leccion.id} className="py-2 border-b last:border-0">
                        <details className="group">
                          <summary className="cursor-pointer font-medium hover:text-blue-600">📖 {leccion.titulo}</summary>
                          <div className="mt-2 pl-4 text-gray-600 whitespace-pre-wrap">{leccion.contenido}</div>
                          {leccion.video && (
                            <div className="mt-3">
                              <iframe 
                                src={leccion.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')} 
                                className="w-full h-64 rounded" 
                                allowFullScreen
                                title={leccion.titulo}
                              ></iframe>
                            </div>
                          )}
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Próximamente más contenido...</p>
            )}
            
            {(curso.constancia || curso.certificacion) && (
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">📜 Certificaciones</h3>
                <div className="flex gap-4">
                  {curso.constancia && <a href={curso.constancia} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">📄 Descargar Constancia</a>}
                  {curso.certificacion && <a href={curso.certificacion} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">🎓 Descargar Certificado</a>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ VISTA DE EDICIÓN (ADMIN)
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 p-4">
          <h1 className="text-xl font-bold text-white">
            {esNuevo ? 'Crear Nuevo Curso' : editando ? `Editando: ${curso?.titulo}` : curso?.titulo}
          </h1>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Título y Subtítulo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Título *</label>
              <input 
                type="text" 
                value={formData.titulo} 
                onChange={e => setFormData({...formData, titulo: e.target.value})} 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                disabled={!editando} 
                placeholder="Ej: Derecho Civil Avanzado"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo</label>
              <input 
                type="text" 
                value={formData.subtitulo} 
                onChange={e => setFormData({...formData, subtitulo: e.target.value})} 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                disabled={!editando} 
                placeholder="Ej: Especialización práctica"
              />
            </div>
          </div>
          
          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
            <textarea 
              rows="3" 
              value={formData.descripcion} 
              onChange={e => setFormData({...formData, descripcion: e.target.value})} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              disabled={!editando}
              placeholder="Describe el contenido del curso..."
            ></textarea>
          </div>
          
          {/* Duración, Nivel, Precio */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Duración</label>
              <input 
                type="text" 
                value={formData.duracion} 
                onChange={e => setFormData({...formData, duracion: e.target.value})} 
                className="w-full p-2 border rounded-lg" 
                disabled={!editando}
                placeholder="Ej: 40 horas"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nivel</label>
              <select 
                value={formData.nivel} 
                onChange={e => setFormData({...formData, nivel: e.target.value})} 
                className="w-full p-2 border rounded-lg" 
                disabled={!editando}
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Experto">Experto</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Precio (MXN)</label>
              <input 
                type="number" 
                step="0.01" 
                value={formData.precio} 
                onChange={e => setFormData({...formData, precio: e.target.value})} 
                className="w-full p-2 border rounded-lg" 
                disabled={!editando}
                placeholder="0.00"
              />
            </div>
          </div>
          
          {/* Imagen de portada */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Imagen de portada</label>
            <div className="flex gap-2 flex-wrap">
              <input 
                type="url" 
                placeholder="https://... o sube una imagen" 
                value={formData.imagenPortada} 
                onChange={e => setFormData({...formData, imagenPortada: e.target.value})} 
                className="flex-1 p-2 text-sm border rounded-lg" 
                disabled={!editando} 
              />
              {editando && (
                <>
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
                </>
              )}
            </div>
            {formData.imagenPortada && (
              <div className="mt-2 flex items-center gap-3">
                <img src={formData.imagenPortada} alt="Preview" className="h-16 w-24 object-cover rounded border" />
                <span className="text-xs text-gray-400 truncate flex-1">{formData.imagenPortada}</span>
              </div>
            )}
          </div>
          
          {/* URL del producto */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">URL del producto</label>
            <input 
              type="url" 
              value={formData.url} 
              onChange={e => setFormData({...formData, url: e.target.value})} 
              className="w-full p-2 border rounded-lg" 
              disabled={!editando}
              placeholder="https://..."
            />
          </div>
          
          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.gratis} 
                onChange={() => setFormData({...formData, gratis: !formData.gratis})} 
                disabled={!editando} 
                className="w-4 h-4"
              /> 
              🎁 GRATIS
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.esPremioTorneo} 
                onChange={() => setFormData({...formData, esPremioTorneo: !formData.esPremioTorneo})} 
                disabled={!editando} 
                className="w-4 h-4"
              /> 
              🏆 Premio del Torneo
            </label>
          </div>
          
          {/* Módulos */}
          {editando && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">📚 Módulos del Curso</h3>
                <button 
                  onClick={() => setShowModuloForm(true)} 
                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                >
                  + Agregar Módulo
                </button>
              </div>
              
              {formData.modulo && formData.modulo.length > 0 ? (
                formData.modulo.map((modulo, idx) => (
                  <div key={modulo.id} className="bg-gray-50 rounded-lg p-3 mb-3 border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-700">📘 {modulo.titulo}</span>
                      <button 
                        onClick={() => eliminarModulo(idx)} 
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Eliminar módulo
                      </button>
                    </div>
                    <div className="ml-4 mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600">Lecciones:</span>
                        <button 
                          onClick={() => { setModuloEditando(idx); setShowLeccionForm(true); }} 
                          className="text-blue-500 text-xs hover:text-blue-700"
                        >
                          + Agregar Lección
                        </button>
                      </div>
                      {modulo.lecciones && modulo.lecciones.length > 0 ? (
                        modulo.lecciones.map((leccion, lecIdx) => (
                          <div key={leccion.id} className="bg-white rounded p-2 mb-1 text-sm border">
                            <details>
                              <summary className="cursor-pointer font-medium">📖 {leccion.titulo}</summary>
                              <div className="mt-2 pl-4 text-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto text-xs">
                                {leccion.contenido}
                              </div>
                              <button 
                                onClick={() => eliminarLeccion(idx, lecIdx)} 
                                className="text-red-400 text-xs mt-2 hover:text-red-600"
                              >
                                Eliminar lección
                              </button>
                            </details>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic p-2">No hay lecciones aún</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic text-center py-4">No hay módulos. Haz clic en "+ Agregar Módulo"</p>
              )}
              
              {/* Certificados */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">URL Constancia</label>
                  <input 
                    type="url" 
                    value={formData.constancia} 
                    onChange={e => setFormData({...formData, constancia: e.target.value})} 
                    className="w-full p-2 border rounded-lg" 
                    disabled={!editando}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">URL Certificación</label>
                  <input 
                    type="url" 
                    value={formData.certificacion} 
                    onChange={e => setFormData({...formData, certificacion: e.target.value})} 
                    className="w-full p-2 border rounded-lg" 
                    disabled={!editando}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Botones de acción */}
          {!editando && curso && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              {modoAdmin && (
                <button 
                  onClick={() => setEditando(true)} 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Editar Curso
                </button>
              )}
            </div>
          )}
          
          {editando && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => esNuevo ? navigate('/cursos') : setEditando(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                disabled={guardando}
              >
                Cancelar
              </button>
              <button 
                onClick={guardarCurso} 
                disabled={guardando} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar Curso'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para agregar módulo */}
      {showModuloForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Agregar Módulo</h2>
            <input 
              type="text" 
              placeholder="Título del módulo" 
              value={nuevoModulo.titulo} 
              onChange={e => setNuevoModulo({...nuevoModulo, titulo: e.target.value})} 
              className="w-full p-2 border rounded-lg mb-4" 
            />
            <div className="flex gap-3">
              <button onClick={() => setShowModuloForm(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancelar</button>
              <button onClick={agregarModulo} className="flex-1 bg-green-500 text-white py-2 rounded-lg">Agregar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para agregar lección */}
      {showLeccionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Agregar Lección</h2>
            <input 
              type="text" 
              placeholder="Título de la lección (ej: Introducción)" 
              value={nuevaLeccion.titulo} 
              onChange={e => setNuevaLeccion({...nuevaLeccion, titulo: e.target.value})} 
              className="w-full p-2 border rounded-lg mb-3" 
            />
            <label className="block text-xs font-bold text-gray-700 mb-1">Contenido de la lección</label>
            <textarea 
              placeholder="Desarrolla aquí el contenido completo de la lección. Soporta hasta 500,000 caracteres." 
              rows="12" 
              value={nuevaLeccion.contenido} 
              onChange={e => setNuevaLeccion({...nuevaLeccion, contenido: e.target.value})} 
              className="w-full p-3 border rounded-lg font-mono text-sm mb-2"
            ></textarea>
            <p className="text-xs text-gray-400 mb-3">Caracteres: {nuevaLeccion.contenido.length.toLocaleString()} / 500,000</p>
            <input 
              type="url" 
              placeholder="URL del video (YouTube/Vimeo - opcional)" 
              value={nuevaLeccion.video} 
              onChange={e => setNuevaLeccion({...nuevaLeccion, video: e.target.value})} 
              className="w-full p-2 border rounded-lg mb-4" 
            />
            <div className="flex gap-3">
              <button onClick={() => setShowLeccionForm(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancelar</button>
              <button onClick={agregarLeccion} className="flex-1 bg-green-500 text-white py-2 rounded-lg">Guardar Lección</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursoDetalle;