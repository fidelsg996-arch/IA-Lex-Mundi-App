import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const PreguntasAdmin = () => {
  const { isAdmin } = useAuth();
  const [faseSeleccionada, setFaseSeleccionada] = useState('clasificacion');
  const [preguntas, setPreguntas] = useState([]);
  const [formData, setFormData] = useState({
    texto: '',
    opcion1: '',
    opcion2: '',
    opcion3: '',
    opcion4: '',
    correcta: 0,
    materia: 'Procesal',
    dificultad: 'Alta'
  });

  const fases = [
    { id: 'clasificacion', nombre: 'Clasificación', coleccion: 'preguntas_clasificacion' },
    { id: 'grupos', nombre: 'Grupos', coleccion: 'preguntas_grupos' },
    { id: 'eliminatorias', nombre: 'Eliminatorias', coleccion: 'preguntas_eliminatorias' },
    { id: 'final', nombre: 'Final', coleccion: 'preguntas_final' }
  ];

  const materias = ['Procesal', 'Procesal Civil', 'Procesal Penal', 'Procesal Familiar', 'Procesal Laboral', 'Procesal Fiscal'];

  const cargarPreguntas = async () => {
    const fase = fases.find(f => f.id === faseSeleccionada);
    if (!fase) return;
    const snapshot = await getDocs(collection(db, fase.coleccion));
    const preg = [];
    snapshot.forEach(doc => preg.push({ id: doc.id, ...doc.data() }));
    setPreguntas(preg);
  };

  useEffect(() => {
    if (isAdmin()) cargarPreguntas();
  }, [faseSeleccionada, isAdmin]);

  const agregarPregunta = async () => {
    const fase = fases.find(f => f.id === faseSeleccionada);
    const nuevaPregunta = {
      texto: formData.texto,
      opciones: [formData.opcion1, formData.opcion2, formData.opcion3, formData.opcion4],
      correcta: parseInt(formData.correcta),
      materia: formData.materia,
      dificultad: formData.dificultad
    };
    await addDoc(collection(db, fase.coleccion), nuevaPregunta);
    setFormData({ texto: '', opcion1: '', opcion2: '', opcion3: '', opcion4: '', correcta: 0, materia: 'Procesal', dificultad: 'Alta' });
    cargarPreguntas();
    alert('✅ Pregunta agregada');
  };

  const eliminarPregunta = async (id) => {
    const fase = fases.find(f => f.id === faseSeleccionada);
    await deleteDoc(doc(db, fase.coleccion, id));
    cargarPreguntas();
    alert('🗑️ Pregunta eliminada');
  };

  if (!isAdmin()) return <div className="text-center py-20 text-red-500">Acceso denegado</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-6">📚 Admin - Banco de Preguntas</h1>

      <div className="flex gap-4 mb-6">
        {fases.map(f => (
          <button key={f.id} onClick={() => setFaseSeleccionada(f.id)} className={`px-4 py-2 rounded-lg ${faseSeleccionada === f.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {f.nombre}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">➕ Agregar nueva pregunta a {fases.find(f => f.id === faseSeleccionada)?.nombre}</h2>
        <div className="grid grid-cols-1 gap-4">
          <textarea value={formData.texto} onChange={e => setFormData({...formData, texto: e.target.value})} placeholder="Texto de la pregunta" className="w-full p-3 border rounded-lg" rows="2" />
          <div className="grid grid-cols-2 gap-3">
            <input value={formData.opcion1} onChange={e => setFormData({...formData, opcion1: e.target.value})} placeholder="Opción 1" className="p-2 border rounded" />
            <input value={formData.opcion2} onChange={e => setFormData({...formData, opcion2: e.target.value})} placeholder="Opción 2" className="p-2 border rounded" />
            <input value={formData.opcion3} onChange={e => setFormData({...formData, opcion3: e.target.value})} placeholder="Opción 3" className="p-2 border rounded" />
            <input value={formData.opcion4} onChange={e => setFormData({...formData, opcion4: e.target.value})} placeholder="Opción 4" className="p-2 border rounded" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <select value={formData.correcta} onChange={e => setFormData({...formData, correcta: e.target.value})} className="p-2 border rounded">
              <option value="0">Correcta: Opción 1</option>
              <option value="1">Correcta: Opción 2</option>
              <option value="2">Correcta: Opción 3</option>
              <option value="3">Correcta: Opción 4</option>
            </select>
            <select value={formData.materia} onChange={e => setFormData({...formData, materia: e.target.value})} className="p-2 border rounded">
              {materias.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={formData.dificultad} onChange={e => setFormData({...formData, dificultad: e.target.value})} className="p-2 border rounded">
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
          <button onClick={agregarPregunta} className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">➕ Agregar pregunta</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">📋 Preguntas de {fases.find(f => f.id === faseSeleccionada)?.nombre}</h2>
        <div className="space-y-4">
          {preguntas.map(p => (
            <div key={p.id} className="border rounded-lg p-4">
              <p className="font-bold">{p.texto}</p>
              <div className="text-sm text-gray-600 mt-1">
                {p.opciones?.map((opt, idx) => (
                  <div key={idx} className={idx === p.correcta ? "text-green-600 font-bold" : ""}> {idx + 1}. {opt} {idx === p.correcta && "✓"}</div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{p.materia}</span>
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">{p.dificultad}</span>
              </div>
              <button onClick={() => eliminarPregunta(p.id)} className="text-red-500 text-sm mt-2 hover:text-red-700">🗑️ Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreguntasAdmin;
