import { useState, useEffect } from 'react';

const FormularioCurso = ({ show, cursoEditado, onClose, onSave }) => {
  const CLOUD_NAME = "di50h82ha";
  const UPLOAD_PRESET = "curso_portada"; // ← CAMBIA ESTO si usaste otro nombre en Cloudinary
  
  const [formData, setFormData] = useState({
    titulo: '', subtitulo: '', descripcion: '', precio: '0',
    esGratis: false, esPremioTorneo: false, duracion: '10 horas',
    totalLecciones: '0 lecciones', totalModulos: '0 módulos',
    incluyeConstancia: 'Constancia incluida', imagenUrl: '', modulos: []
  });
  
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cursoEditado) {
      setFormData({
        titulo: cursoEditado.titulo || '',
        subtitulo: cursoEditado.subtitulo || '',
        descripcion: cursoEditado.descripcion || '',
        precio: cursoEditado.precio?.toString() || '0',
        esGratis: cursoEditado.esGratis || false,
        esPremioTorneo: cursoEditado.esPremioTorneo || false,
        duracion: cursoEditado.duracion || '10 horas',
        totalLecciones: cursoEditado.totalLecciones || '0 lecciones',
        totalModulos: cursoEditado.totalModulos || '0 módulos',
        incluyeConstancia: cursoEditado.incluyeConstancia || 'Constancia incluida',
        imagenUrl: cursoEditado.imagenUrl || '',
        modulos: cursoEditado.modulos ? JSON.parse(JSON.stringify(cursoEditado.modulos)) : []
      });
      setImagenPreview(cursoEditado.imagenUrl || '');
    } else {
      setFormData({
        titulo: '', subtitulo: '', descripcion: '', precio: '0',
        esGratis: false, esPremioTorneo: false, duracion: '10 horas',
        totalLecciones: '0 lecciones', totalModulos: '0 módulos',
        incluyeConstancia: 'Constancia incluida', imagenUrl: '', modulos: []
      });
      setImagenPreview('');
    }
    setImagenFile(null);
    setError('');
  }, [cursoEditado]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten imágenes');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar los 2MB');
        return;
      }
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const subirImagenCloudinary = async (file) => {
    setSubiendo(true);
    const formDataCloud = new FormData();
    formDataCloud.append('file', file);
    formDataCloud.append('upload_preset', UPLOAD_PRESET); // ← AHORA USA LA CONSTANTE
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formDataCloud
      });
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || 'Error al subir');
      }
    } catch (err) {
      console.error('Error Cloudinary:', err);
      setError('Error al subir la imagen: ' + err.message);
      return null;
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.titulo) {
      alert('Completa el título');
      return;
    }
    
    setSaving(true);
    setError('');
    const cursoId = cursoEditado ? cursoEditado.id : Date.now().toString();
    
    try {
      let imagenUrl = formData.imagenUrl;
      if (imagenFile) {
        const cloudinaryUrl = await subirImagenCloudinary(imagenFile);
        if (cloudinaryUrl) {
          imagenUrl = cloudinaryUrl;
        } else {
          setSaving(false);
          return;
        }
      }
      
      const nuevoCurso = {
        ...formData,
        imagenUrl: imagenUrl,
        totalLecciones: formData.modulos.reduce((acc, m) => acc + (m.leccionesLista?.length || 0), 0) + ' lecciones',
        totalModulos: formData.modulos.length + ' módulos',
      };
      
      await onSave(nuevoCurso, cursoId);
      onClose();
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const agregarModulo = () => {
    const nuevoId = formData.modulos.length + 1;
    setFormData({
      ...formData,
      modulos: [...formData.modulos, {
        id: nuevoId, titulo: `Módulo ${nuevoId}`, categoria: 'General', leccionesLista: []
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
    const idx = formData.modulos.findIndex(m => m.id === moduloId);
    if (idx !== -1) {
      const nuevoId = (formData.modulos[idx].leccionesLista?.length || 0) + 1;
      const nuevas = [...(formData.modulos[idx].leccionesLista || []), {
        id: nuevoId, titulo: `Lección ${nuevoId}`,
        contenido: 'Contenido de la lección', ejemplo: 'Ejemplo práctico', caso: 'Caso ilustrativo'
      }];
      const nuevosModulos = [...formData.modulos];
      nuevosModulos[idx].leccionesLista = nuevas;
      setFormData({ ...formData, modulos: nuevosModulos });
    }
  };

  const eliminarLeccion = (moduloId, leccionId) => {
    const idx = formData.modulos.findIndex(m => m.id === moduloId);
    if (idx !== -1) {
      const nuevas = (formData.modulos[idx].leccionesLista || []).filter(l => l.id !== leccionId);
      const nuevosModulos = [...formData.modulos];
      nuevosModulos[idx].leccionesLista = nuevas;
      setFormData({ ...formData, modulos: nuevosModulos });
    }
  };

  const actualizarLeccion = (moduloId, leccionId, campo, valor) => {
    const idx = formData.modulos.findIndex(m => m.id === moduloId);
    if (idx !== -1) {
      const lecIdx = (formData.modulos[idx].leccionesLista || []).findIndex(l => l.id === leccionId);
      if (lecIdx !== -1) {
        const nuevosModulos = [...formData.modulos];
        nuevosModulos[idx].leccionesLista[lecIdx][campo] = valor;
        setFormData({ ...formData, modulos: nuevosModulos });
      }
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 sticky top-0">
          <h2 className="text-xl font-bold text-white">{cursoEditado ? 'Editar Curso' : 'Nuevo Curso'}</h2>
        </div>
        
        <div className="p-5 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
          
          <div className="border rounded-lg p-3 bg-gray-50">
            <label className="block text-sm font-bold mb-2">Imagen de portada (Cloudinary)</label>
            {imagenPreview ? (
              <div className="mb-3 relative inline-block">
                <img src={imagenPreview} alt="Vista previa" className="w-32 h-32 object-cover rounded-lg border-2 border-amber-300" />
                <button type="button" onClick={() => { setImagenFile(null); setImagenPreview(''); setFormData({...formData, imagenUrl: ''}); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
              </div>
            ) : (
              <div className="mb-3 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border">Sin imagen</div>
            )}
            <input type="file" accept="image/*" onChange={handleImagenChange} className="text-sm" />
            <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB) - Subida a Cloudinary</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Título *" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="p-2 border rounded" />
            <input type="text" placeholder="Subtítulo" value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} className="p-2 border rounded" />
          </div>
          <textarea placeholder="Descripción" rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-2 border rounded" />
          
          <div className="grid grid-cols-3 gap-3">
            <input type="number" placeholder="Precio" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} className="p-2 border rounded" />
            <input type="text" placeholder="Duración" value={formData.duracion} onChange={e => setFormData({...formData, duracion: e.target.value})} className="p-2 border rounded" />
            <input type="text" placeholder="Incluye" value={formData.incluyeConstancia} onChange={e => setFormData({...formData, incluyeConstancia: e.target.value})} className="p-2 border rounded" />
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.esGratis} onChange={e => setFormData({...formData, esGratis: e.target.checked})} /> Gratis</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.esPremioTorneo} onChange={e => setFormData({...formData, esPremioTorneo: e.target.checked})} /> Premio Torneo</label>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">📚 Módulos ({formData.modulos.length})</h3>
              <button onClick={agregarModulo} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">+ Agregar Módulo</button>
            </div>
            
            {formData.modulos.map((modulo, idx) => (
              <div key={modulo.id} className="border rounded-xl p-3 mb-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2 flex-1">
                    <input type="text" className="font-bold text-sm border rounded px-2 py-1 w-1/2" value={modulo.titulo} onChange={e => { const n = [...formData.modulos]; n[idx].titulo = e.target.value; setFormData({...formData, modulos: n}); }} />
                    <input type="text" className="text-sm border rounded px-2 py-1 w-1/2" placeholder="Categoría" value={modulo.categoria} onChange={e => { const n = [...formData.modulos]; n[idx].categoria = e.target.value; setFormData({...formData, modulos: n}); }} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => agregarLeccion(modulo.id)} className="text-green-600 text-sm">+ Lección</button>
                    <button onClick={() => eliminarModulo(modulo.id)} className="text-red-500 text-sm">Eliminar</button>
                  </div>
                </div>
                {(modulo.leccionesLista || []).map((leccion, lecIdx) => (
                  <div key={leccion.id} className="bg-white rounded-lg p-2 mt-2 border">
                    <input type="text" className="font-semibold text-sm w-full mb-1 p-1 border rounded" value={leccion.titulo} onChange={e => actualizarLeccion(modulo.id, leccion.id, 'titulo', e.target.value)} />
                    <textarea className="text-xs w-full p-1 border rounded mb-1" rows="2" placeholder="Contenido" value={leccion.contenido} onChange={e => actualizarLeccion(modulo.id, leccion.id, 'contenido', e.target.value)} />
                    <div className="grid grid-cols-2 gap-1">
                      <textarea className="text-xs p-1 border rounded" rows="1" placeholder="Ejemplo" value={leccion.ejemplo} onChange={e => actualizarLeccion(modulo.id, leccion.id, 'ejemplo', e.target.value)} />
                      <textarea className="text-xs p-1 border rounded" rows="1" placeholder="Caso" value={leccion.caso} onChange={e => actualizarLeccion(modulo.id, leccion.id, 'caso', e.target.value)} />
                    </div>
                    <button onClick={() => eliminarLeccion(modulo.id, leccion.id)} className="text-red-400 text-xs mt-1">🗑️ Lección</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button onClick={handleSubmit} disabled={saving || subiendo} className="px-4 py-2 bg-amber-500 text-white rounded-lg disabled:opacity-50">
            {saving || subiendo ? 'Guardando...' : 'Guardar Curso'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioCurso;