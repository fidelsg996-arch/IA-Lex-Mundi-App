import React, { useState, useEffect } from 'react';

const FormularioDiplomado = ({ show, diplomadoEditado, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    duracion: '160 horas',
    precio: 0,
    esPremioTorneo: false,
    modulos: []
  });

  const [modulos, setModulos] = useState([]);
  const [moduloActual, setModuloActual] = useState({ titulo: '', lecciones: [] });
  const [leccionActual, setLeccionActual] = useState({ titulo: '', contenido: '', videoUrl: '' });

  useEffect(() => {
    if (diplomadoEditado) {
      setFormData({
        titulo: diplomadoEditado.titulo || '',
        descripcion: diplomadoEditado.descripcion || '',
        imagen: diplomadoEditado.imagen || '',
        duracion: diplomadoEditado.duracion || '160 horas',
        precio: diplomadoEditado.precio || 0,
        esPremioTorneo: diplomadoEditado.esPremioTorneo || false,
        modulos: diplomadoEditado.modulos || []
      });
      setModulos(diplomadoEditado.modulos || []);
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        imagen: '',
        duracion: '160 horas',
        precio: 0,
        esPremioTorneo: false,
        modulos: []
      });
      setModulos([]);
    }
  }, [diplomadoEditado]);

  const agregarModulo = () => {
    if (moduloActual.titulo.trim()) {
      setModulos([...modulos, { ...moduloActual, id: Date.now() }]);
      setModuloActual({ titulo: '', lecciones: [] });
    }
  };

  const eliminarModulo = (index) => {
    const nuevos = [...modulos];
    nuevos.splice(index, 1);
    setModulos(nuevos);
  };

  const agregarLeccion = () => {
    if (leccionActual.titulo.trim()) {
      setModuloActual({
        ...moduloActual,
        lecciones: [...moduloActual.lecciones, { ...leccionActual, id: Date.now() }]
      });
      setLeccionActual({ titulo: '', contenido: '', videoUrl: '' });
    }
  };

  const eliminarLeccion = (index) => {
    const nuevas = [...moduloActual.lecciones];
    nuevas.splice(index, 1);
    setModuloActual({ ...moduloActual, lecciones: nuevas });
  };

  const handleSubmit = () => {
    if (!formData.titulo) {
      alert('El título es obligatorio');
      return;
    }
    onSave({ ...formData, modulos }, diplomadoEditado?.id);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-800 to-purple-700 p-4 rounded-t-2xl sticky top-0">
          <h2 className="text-xl font-bold text-white">{diplomadoEditado ? 'Editar Diplomado' : 'Nuevo Diplomado'}</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold">Título *</label>
              <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold">Duración</label>
              <input type="text" value={formData.duracion} onChange={(e) => setFormData({...formData, duracion: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold">Descripción</label>
            <textarea rows="3" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold">URL de imagen</label>
              <input type="url" value={formData.imagen} onChange={(e) => setFormData({...formData, imagen: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold">Precio (MXN)</label>
              <input type="number" value={formData.precio} onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value)})} className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.esPremioTorneo} onChange={(e) => setFormData({...formData, esPremioTorneo: e.target.checked})} />
              Marcar como Premio del Torneo
            </label>
          </div>

          {/* Módulos */}
          <div className="border-t pt-4">
            <h3 className="text-md font-bold mb-3">Módulos del Diplomado</h3>
            {modulos.map((modulo, idx) => (
              <div key={modulo.id} className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex justify-between">
                  <span className="font-bold">📚 {modulo.titulo}</span>
                  <button onClick={() => eliminarModulo(idx)} className="text-red-500 text-xs">Eliminar</button>
                </div>
                <div className="pl-4 text-xs text-gray-600">
                  {modulo.lecciones?.length || 0} lecciones
                </div>
              </div>
            ))}

            <div className="bg-purple-50 rounded-lg p-3">
              <h4 className="text-sm font-bold mb-2">Agregar Módulo</h4>
              <input type="text" placeholder="Nombre del módulo" value={moduloActual.titulo} onChange={(e) => setModuloActual({...moduloActual, titulo: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg mb-2" />
              
              {moduloActual.lecciones.length > 0 && (
                <div className="bg-white rounded p-2 mb-2">
                  {moduloActual.lecciones.map((lec, i) => (
                    <div key={lec.id} className="flex justify-between text-xs py-1">
                      <span>📖 {lec.titulo}</span>
                      <button onClick={() => eliminarLeccion(i)} className="text-red-500">✖</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="text" placeholder="Título lección" value={leccionActual.titulo} onChange={(e) => setLeccionActual({...leccionActual, titulo: e.target.value})} className="px-2 py-1 text-sm border rounded" />
                <input type="text" placeholder="URL video" value={leccionActual.videoUrl} onChange={(e) => setLeccionActual({...leccionActual, videoUrl: e.target.value})} className="px-2 py-1 text-sm border rounded" />
              </div>
              <textarea placeholder="Contenido" rows="2" value={leccionActual.contenido} onChange={(e) => setLeccionActual({...leccionActual, contenido: e.target.value})} className="w-full px-2 py-1 text-sm border rounded mb-2" />
              
              <button onClick={agregarLeccion} className="bg-green-500 text-white px-3 py-1 rounded text-xs">+ Agregar Lección</button>
              <button onClick={agregarModulo} className="bg-purple-500 text-white px-3 py-1 rounded text-xs ml-2">+ Guardar Módulo</button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-purple-500 text-white rounded-lg">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default FormularioDiplomado;