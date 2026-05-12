import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const FormularioCurso = ({ cursoId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    etiquetas: '',
    precio: '',
    duracion: '',
    nivel: 'principiante',
    imagen: '',
    instructor: '',
    requisitos: '',
    objetivos: '',
    contenido: []
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (cursoId) {
      cargarCurso();
    }
  }, [cursoId]);

  const cargarCurso = async () => {
    try {
      setCargandoDatos(true);
      const cursoRef = doc(db, 'cursos', cursoId);
      const cursoDoc = await getDoc(cursoRef);
      
      if (cursoDoc.exists()) {
        const data = cursoDoc.data();
        setFormData({
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          categoria: data.categoria || '',
          etiquetas: Array.isArray(data.etiquetas) ? data.etiquetas.join(', ') : '',
          precio: data.precio || '',
          duracion: data.duracion || '',
          nivel: data.nivel || 'principiante',
          imagen: data.imagen || '',
          instructor: data.instructor || '',
          requisitos: data.requisitos || '',
          objetivos: data.objetivos || '',
          contenido: data.contenido || []
        });
      }
    } catch (error) {
      console.error('Error cargando curso:', error);
      alert('Error al cargar los datos del curso');
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      alert('❌ El título del curso es obligatorio');
      return false;
    }
    if (!formData.descripcion.trim()) {
      alert('❌ La descripción del curso es obligatoria');
      return false;
    }
    if (!formData.categoria) {
      alert('❌ La categoría es obligatoria');
      return false;
    }
    if (!formData.duracion) {
      alert('❌ La duración del curso es obligatoria');
      return false;
    }
    return true;
  };

  const guardarCurso = async () => {
    if (!validarFormulario()) return;
    
    setCargando(true);
    
    try {
      // Procesar etiquetas (convertir string a array)
      const etiquetasArray = formData.etiquetas
        ? formData.etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      const cursoData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        etiquetas: etiquetasArray,
        precio: parseFloat(formData.precio) || 0,
        duracion: formData.duracion,
        nivel: formData.nivel,
        imagen: formData.imagen || null,
        instructor: formData.instructor || user?.displayName || 'Administrador',
        requisitos: formData.requisitos || '',
        objetivos: formData.objetivos || '',
        contenido: formData.contenido || [],
        actualizado: new Date().toISOString(),
        actualizadoPor: user?.uid
      };
      
      if (cursoId) {
        // Actualizar curso existente
        const cursoRef = doc(db, 'cursos', cursoId);
        await updateDoc(cursoRef, cursoData);
        alert('✅ Curso actualizado correctamente');
      } else {
        // Crear nuevo curso
        cursoData.creado = new Date().toISOString();
        cursoData.creadoPor = user?.uid;
        const nuevoCursoRef = doc(db, 'cursos');
        await setDoc(nuevoCursoRef, cursoData);
        alert('✅ Curso creado correctamente');
      }
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error guardando curso:', error);
      alert('❌ Error al guardar el curso: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {cursoId ? 'Editar Curso' : 'Crear Nuevo Curso'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del curso *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Introducción a la IA"
          />
        </div>
        
        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción detallada del curso..."
          />
        </div>
        
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar categoría</option>
            <option value="tecnologia">Tecnología</option>
            <option value="negocios">Negocios</option>
            <option value="diseno">Diseño</option>
            <option value="marketing">Marketing</option>
            <option value="idiomas">Idiomas</option>
            <option value="desarrollo">Desarrollo Personal</option>
          </select>
        </div>
        
        {/* Nivel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel
          </label>
          <select
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
        
        {/* Duración */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración *
          </label>
          <input
            type="text"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 10 horas, 2 semanas"
          />
        </div>
        
        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (MXN)
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0 = Gratis"
            min="0"
            step="10"
          />
        </div>
        
        {/* Etiquetas */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            name="etiquetas"
            value={formData.etiquetas}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: IA, Machine Learning, Python"
          />
          <p className="text-xs text-gray-500 mt-1">Separa las etiquetas con comas</p>
        </div>
        
        {/* URL de imagen */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de la imagen
          </label>
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        
        {/* Requisitos */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requisitos previos
          </label>
          <textarea
            name="requisitos"
            value={formData.requisitos}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Qué conocimientos necesita el alumno..."
          />
        </div>
        
        {/* Objetivos */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objetivos del curso
          </label>
          <textarea
            name="objetivos"
            value={formData.objetivos}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Qué aprenderán los alumnos..."
          />
        </div>
        
        {/* Instructor */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructor
          </label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del instructor"
          />
        </div>
      </div>
      
      {/* Botones */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={guardarCurso}
          disabled={cargando}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {cargando ? 'Guardando...' : (cursoId ? 'Actualizar Curso' : 'Crear Curso')}
        </button>
      </div>
    </div>
  );
};

export default FormularioCurso;