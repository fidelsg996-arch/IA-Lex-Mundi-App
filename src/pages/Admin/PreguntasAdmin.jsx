import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const PreguntasAdmin = () => {
  const { isAdmin } = useAuth();
  const [preguntas, setPreguntas] = useState([]);
  const [coleccion, setColeccion] = useState('preguntas_clasificacion');
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    texto: '',
    opciones: ['', '', '', ''],
    correcta: 0
  });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const colecciones = [
    { id: 'preguntas_clasificacion', nombre: '📚 Clasificación' },
    { id: 'preguntas_grupos', nombre: '👥 Grupos' },
    { id: 'preguntas_eliminatorias', nombre: '⚔️ Eliminatorias' },
    { id: 'preguntas_final', nombre: '🏆 Final' }
  ];

  const cargarPreguntas = async () => {
    setCargando(true);
    try {
      const querySnapshot = await getDocs(collection(db, coleccion));
      const preguntasData = [];
      querySnapshot.forEach((doc) => {
        preguntasData.push({ id: doc.id, ...doc.data() });
      });
      setPreguntas(preguntasData);
      setMensaje(`✅ ${preguntasData.length} preguntas cargadas`);
    } catch (error) {
      setMensaje(`❌ Error: ${error.message}`);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarPreguntas();
  }, [coleccion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    const preguntaData = {
      texto: formData.texto,
      opciones: formData.opciones,
      correcta: parseInt(formData.correcta),
      actualizado: new Date().toISOString()
    };

    try {
      if (editando) {
        await updateDoc(doc(db, coleccion, editando.id), preguntaData);
        setMensaje(`✅ Pregunta actualizada`);
      } else {
        preguntaData.creada = new Date().toISOString();
        await addDoc(collection(db, coleccion), preguntaData);
        setMensaje(`✅ Pregunta creada`);
      }
      
      setFormData({ texto: '', opciones: ['', '', '', ''], correcta: 0 });
      setEditando(null);
      cargarPreguntas();
    } catch (error) {
      setMensaje(`❌ Error: ${error.message}`);
    }
    setCargando(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta pregunta permanentemente?')) return;
    setCargando(true);
    try {
      await deleteDoc(doc(db, coleccion, id));
      setMensaje(`✅ Pregunta eliminada`);
      cargarPreguntas();
    } catch (error) {
      setMensaje(`❌ Error: ${error.message}`);
    }
    setCargando(false);
  };

  const handleEdit = (pregunta) => {
    setEditando(pregunta);
    setFormData({
      texto: pregunta.texto,
      opciones: pregunta.opciones || ['', '', '', ''],
      correcta: pregunta.correcta || 0
    });
  };

  const handleSubidaMasiva = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const preguntasJSON = JSON.parse(event.target.result);
        setCargando(true);
        let subidas = 0;
        
        for (const pregunta of preguntasJSON) {
          await addDoc(collection(db, coleccion), {
            ...pregunta,
            creada: new Date().toISOString()
          });
          subidas++;
        }
        
        setMensaje(`✅ ${subidas} preguntas subidas masivamente`);
        cargarPreguntas();
      } catch (error) {
        setMensaje(`❌ Error en JSON: ${error.message}`);
      }
      setCargando(false);
    };
    reader.readAsText(file);
  };

  const handleExportar = () => {
    const dataStr = JSON.stringify(preguntas, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${coleccion}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMensaje(`📥 Exportadas ${preguntas.length} preguntas`);
  };

  if (!isAdmin()) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">Acceso denegado</h1>
        <p className="text-gray-600 mt-2">Solo administradores</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-gradient-to-r from-red-800 to-red-700 rounded-2xl p-5 text-white mb-6">
        <h1 className="text-2xl font-black">📋 Banco de Preguntas</h1>
        <p className="text-red-200">Gestiona las preguntas del CNPCyF por fase</p>
      </div>

      {mensaje && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-center">
          {mensaje}
        </div>
      )}

      {/* Selector de colección */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <label className="block text-sm font-bold mb-2">Seleccionar Fase</label>
        <div className="flex flex-wrap gap-3">
          {colecciones.map(col => (
            <button
              key={col.id}
              onClick={() => setColeccion(col.id)}
              className={`px-4 py-2 rounded-lg transition ${
                coleccion === col.id 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {col.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Botones de acciones masivas */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-3">
        <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
          📤 Subir JSON
          <input type="file" accept=".json" onChange={handleSubidaMasiva} className="hidden" />
        </label>
        <button onClick={handleExportar} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          📥 Exportar JSON
        </button>
        <button onClick={cargarPreguntas} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
          🔄 Recargar
        </button>
      </div>

      {/* Formulario crear/editar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editando ? '✏️ Editar Pregunta' : '➕ Nueva Pregunta'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Texto de la pregunta *</label>
            <textarea
              value={formData.texto}
              onChange={e => setFormData({...formData, texto: e.target.value})}
              className="w-full p-3 border rounded-lg"
              rows="3"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.opciones.map((opcion, idx) => (
              <div key={idx}>
                <label className="block text-sm font-bold mb-1">
                  Opción {String.fromCharCode(65 + idx)} *
                </label>
                <input
                  type="text"
                  value={opcion}
                  onChange={e => {
                    const nuevas = [...formData.opciones];
                    nuevas[idx] = e.target.value;
                    setFormData({...formData, opciones: nuevas});
                  }}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">Respuesta correcta *</label>
            <select
              value={formData.correcta}
              onChange={e => setFormData({...formData, correcta: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
            >
              <option value="0">Opción A</option>
              <option value="1">Opción B</option>
              <option value="2">Opción C</option>
              <option value="3">Opción D</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700" disabled={cargando}>
              {cargando ? 'Guardando...' : (editando ? 'Actualizar' : 'Crear')}
            </button>
            {editando && (
              <button type="button" onClick={() => { setEditando(null); setFormData({ texto: '', opciones: ['', '', '', ''], correcta: 0 }); }} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de preguntas */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-bold">📝 Lista de preguntas ({preguntas.length})</h2>
        </div>
        
        {cargando && <div className="p-8 text-center">Cargando...</div>}
        
        <div className="divide-y">
          {preguntas.map((pregunta, idx) => (
            <div key={pregunta.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-sm text-gray-500">#{idx + 1}</span>
                  <p className="font-medium mt-1">{pregunta.texto}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    {pregunta.opciones?.map((opt, i) => (
                      <div key={i} className={pregunta.correcta === i ? 'text-green-600 font-bold' : 'text-gray-600'}>
                        {String.fromCharCode(65 + i)}: {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(pregunta)} className="text-blue-500 hover:text-blue-700" title="Editar">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(pregunta.id)} className="text-red-500 hover:text-red-700" title="Eliminar">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreguntasAdmin;