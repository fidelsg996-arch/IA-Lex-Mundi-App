// src/pages/Expedientes.js
import { useState, useEffect } from 'react';

// --- Configuración de IndexedDB ---
const DB_NAME = 'LexMindiDB';
const DB_VERSION = 1;
const STORE_NAME = 'documentos';

let db = null;

const abrirDB = () => {
  return new Promise((resolve, reject) => {
    if (db && db.name === DB_NAME) {
      resolve(db);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const dbActual = event.target.result;
      if (!dbActual.objectStoreNames.contains(STORE_NAME)) {
        dbActual.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const guardarDocumentoEnDB = async (docId, nombre, base64) => {
  const database = await abrirDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const doc = { id: docId, nombre, data: base64 };
    const request = store.put(doc);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const obtenerDocumentoDeDB = async (docId) => {
  const database = await abrirDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(docId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const eliminarDocumentoDeDB = async (docId) => {
  const database = await abrirDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(docId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// --- Componente principal ---
const Expedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    estadoProcesal: 'Activo',
    parteActora: '',
    parteDemandada: '',
    asunto: '',
    cuantia: '',
    fecha: new Date().toISOString().split('T')[0],
    jurisdiccion: 'México',
    juzgado: '',
    secretaria: '',
    actuaria: '',
    mesa: '',
    notas: ''
  });
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Cargar expedientes desde localStorage (solo metadatos)
  useEffect(() => {
    const stored = localStorage.getItem('lexmindi_expedientes');
    if (stored) {
      const expedientesConDocumentos = JSON.parse(stored);
      // Los documentos se cargarán bajo demanda desde IndexedDB
      setExpedientes(expedientesConDocumentos);
    } else {
      const ejemplos = [
        {
          id: 1, numero: '2025-001', estadoProcesal: 'Activo', parteActora: 'María González',
          parteDemandada: 'Empresa XYZ', asunto: 'Despido improcedente', cuantia: '150,000',
          fecha: '2025-01-15', jurisdiccion: 'México', juzgado: 'Juzgado Primero de lo Laboral',
          secretaria: 'Secretaría A', actuaria: 'Lic. Ana Torres', mesa: 'Mesa 3', notas: 'Demanda presentada',
          documentos: [] // En lugar de guardar el PDF, guardamos un array de objetos con { id, nombre }
        },
        {
          id: 2, numero: '2025-002', estadoProcesal: 'En trámite', parteActora: 'Juan Pérez',
          parteDemandada: 'Constructora ABC', asunto: 'Reclamación de cantidad', cuantia: '300,000',
          fecha: '2025-02-10', jurisdiccion: 'México', juzgado: 'Juzgado Civil',
          secretaria: 'Secretaría B', actuaria: 'Lic. Carlos Ruiz', mesa: 'Mesa 1', notas: 'Esperando contestación',
          documentos: []
        },
        {
          id: 3, numero: '2024-089', estadoProcesal: 'Cerrado', parteActora: 'Ana López',
          parteDemandada: 'Carlos López', asunto: 'Divorcio contencioso', cuantia: 'N/A',
          fecha: '2024-11-20', jurisdiccion: 'México', juzgado: 'Juzgado Familiar',
          secretaria: 'Secretaría C', actuaria: 'Lic. Diana Flores', mesa: 'Mesa 2', notas: 'Sentencia favorable',
          documentos: []
        }
      ];
      setExpedientes(ejemplos);
      localStorage.setItem('lexmindi_expedientes', JSON.stringify(ejemplos));
    }
  }, []);

  // Guardar solo metadatos en localStorage (sin los PDFs)
  useEffect(() => {
    if (expedientes.length > 0) {
      const expedientesSinDocs = expedientes.map(exp => ({
        ...exp,
        documentos: exp.documentos ? exp.documentos.map(doc => ({ id: doc.id, nombre: doc.nombre })) : []
      }));
      localStorage.setItem('lexmindi_expedientes', JSON.stringify(expedientesSinDocs));
    }
  }, [expedientes]);

  const generarId = () => Date.now();

  const abrirModalNuevo = () => {
    setEditandoId(null);
    setFormData({
      numero: '', estadoProcesal: 'Activo', parteActora: '', parteDemandada: '',
      asunto: '', cuantia: '', fecha: new Date().toISOString().split('T')[0],
      jurisdiccion: 'México', juzgado: '', secretaria: '', actuaria: '', mesa: '', notas: ''
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (exp) => {
    setEditandoId(exp.id);
    setFormData({
      numero: exp.numero, estadoProcesal: exp.estadoProcesal || 'Activo',
      parteActora: exp.parteActora || '', parteDemandada: exp.parteDemandada || '',
      asunto: exp.asunto, cuantia: exp.cuantia || '', fecha: exp.fecha,
      jurisdiccion: exp.jurisdiccion || 'México', juzgado: exp.juzgado || '',
      secretaria: exp.secretaria || '', actuaria: exp.actuaria || '',
      mesa: exp.mesa || '', notas: exp.notas || ''
    });
    setModalAbierto(true);
  };

  const guardarExpediente = () => {
    if (!formData.numero || !formData.parteActora || !formData.asunto) {
      alert('Completa los campos obligatorios: número, parte actora y asunto');
      return;
    }
    if (editandoId) {
      setExpedientes(expedientes.map(exp =>
        exp.id === editandoId ? { ...formData, id: editandoId, documentos: exp.documentos || [] } : exp
      ));
    } else {
      setExpedientes([...expedientes, { ...formData, id: generarId(), documentos: [] }]);
    }
    setModalAbierto(false);
  };

  const eliminarExpediente = async (id) => {
    if (window.confirm('¿Eliminar este expediente y todos sus documentos?')) {
      const expediente = expedientes.find(exp => exp.id === id);
      if (expediente && expediente.documentos) {
        for (const doc of expediente.documentos) {
          await eliminarDocumentoDeDB(doc.id);
        }
      }
      setExpedientes(expedientes.filter(exp => exp.id !== id));
    }
  };

  const subirDocumento = async (expId, archivo) => {
    if (archivo && archivo.type === 'application/pdf') {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result;
          const docId = `${expId}_${Date.now()}_${archivo.name}`;
          await guardarDocumentoEnDB(docId, archivo.name, base64);
          
          // Actualizar el expediente en el estado
          setExpedientes(prev => prev.map(exp => {
            if (exp.id === expId) {
              const nuevosDocs = [...(exp.documentos || []), { id: docId, nombre: archivo.name }];
              return { ...exp, documentos: nuevosDocs };
            }
            return exp;
          }));
        };
        reader.readAsDataURL(archivo);
      } catch (error) {
        console.error('Error al guardar PDF:', error);
        alert('No se pudo guardar el documento. El archivo es demasiado grande.');
      }
    } else {
      alert('Solo se permiten archivos PDF');
    }
  };

  const eliminarDocumento = async (expId, docId) => {
    if (window.confirm('¿Eliminar este documento permanentemente?')) {
      await eliminarDocumentoDeDB(docId);
      setExpedientes(prev => prev.map(exp => {
        if (exp.id === expId) {
          const nuevosDocs = (exp.documentos || []).filter(doc => doc.id !== docId);
          return { ...exp, documentos: nuevosDocs };
        }
        return exp;
      }));
    }
  };

  const descargarDocumento = async (docId, nombre) => {
    const doc = await obtenerDocumentoDeDB(docId);
    if (doc && doc.data) {
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = nombre;
      link.click();
    } else {
      alert('No se pudo recuperar el documento.');
    }
  };

  const getEstadoColor = (estado) => {
    const lower = estado?.toLowerCase();
    if (lower === 'activo') return 'bg-green-100 text-green-800';
    if (lower === 'en trámite') return 'bg-yellow-100 text-yellow-800';
    if (lower === 'cerrado') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const expedientesFiltrados = expedientes.filter(exp => {
    if (filtroEstado !== 'todos') {
      const lowerEstado = exp.estadoProcesal?.toLowerCase();
      if (filtroEstado === 'activo' && lowerEstado !== 'activo') return false;
      if (filtroEstado === 'en tramite' && lowerEstado !== 'en trámite') return false;
      if (filtroEstado === 'cerrado' && lowerEstado !== 'cerrado') return false;
    }
    if (busqueda) {
      const texto = `${exp.numero} ${exp.parteActora} ${exp.asunto} ${exp.secretaria || ''} ${exp.actuaria || ''}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    }
    return true;
  });

  return (
    <div className="px-4">
      {/* Portada estilo CalculadoraLaboral */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" 
          alt="Gestión de expedientes"
          className="w-full h-32 object-cover opacity-30"
        />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-4xl text-amber-400">folder_open</span>
            <h1 className="text-2xl font-black">Gestor de Expedientes</h1>
          </div>
          <p className="text-gray-200 text-sm">Administra todos los datos judiciales de tus casos, documentos y seguimiento.</p>
        </div>
      </div>

      {/* Botón nuevo expediente */}
      <div className="flex justify-end mb-6">
        <button onClick={abrirModalNuevo} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo expediente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Buscar por número, actor, asunto, secretaría..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
          />
        </div>
        <div>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="en tramite">En trámite</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
      </div>

      {/* Listado de expedientes */}
      {expedientesFiltrados.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-200 shadow-sm">
          No hay expedientes.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {expedientesFiltrados.map(exp => (
            <div key={exp.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">balance</span>
                    <span className="text-lg font-bold text-amber-600">{exp.numero}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getEstadoColor(exp.estadoProcesal)}`}>
                      {exp.estadoProcesal}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{exp.jurisdiccion}</span>
                  </div>
                  <p className="text-gray-800 font-medium mt-1">Actor: {exp.parteActora}</p>
                  <p className="text-gray-700 text-sm">Demandado: {exp.parteDemandada}</p>
                  <p className="text-gray-600 text-sm">{exp.asunto}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mt-2">
                    {exp.cuantia && <span>💰 Cuantía: {exp.cuantia}</span>}
                    {exp.fecha && <span>📅 Fecha: {exp.fecha}</span>}
                    {exp.juzgado && <span>🏛️ Juzgado: {exp.juzgado}</span>}
                    {exp.secretaria && <span>📂 Secretaría: {exp.secretaria}</span>}
                    {exp.actuaria && <span>⚖️ Actuaria: {exp.actuaria}</span>}
                    {exp.mesa && <span>📌 Mesa: {exp.mesa}</span>}
                  </div>
                  {exp.notas && <p className="text-gray-500 text-sm mt-2 italic">📝 {exp.notas}</p>}
                  
                  {/* Documentos */}
                  {exp.documentos && exp.documentos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500">Documentos adjuntos:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {exp.documentos.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                            <span className="material-symbols-outlined text-sm text-amber-600">description</span>
                            <span className="text-xs text-gray-700 truncate max-w-[150px]">{doc.nombre}</span>
                            <button onClick={() => eliminarDocumento(exp.id, doc.id)} className="text-red-500 hover:text-red-700 text-xs">🗑️</button>
                            <button onClick={() => descargarDocumento(doc.id, doc.nombre)} className="text-blue-500 hover:text-blue-700 text-xs">⬇️</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <label className="cursor-pointer bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded hover:bg-amber-200 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">upload_file</span>
                      Subir PDF
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => {
                        if (e.target.files[0]) subirDocumento(exp.id, e.target.files[0]);
                        e.target.value = '';
                      }} />
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirModalEditar(exp)} className="text-blue-500 hover:text-blue-700">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => eliminarExpediente(exp.id)} className="text-red-500 hover:text-red-700">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (sin cambios) */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{editandoId ? 'Editar expediente' : 'Nuevo expediente'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-gray-700">Número de expediente *</label><input type="text" value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Estado procesal</label><input type="text" value={formData.estadoProcesal} onChange={e => setFormData({...formData, estadoProcesal: e.target.value})} className="w-full border rounded p-2" placeholder="Activo, En trámite, Cerrado..." /></div>
              <div><label className="block text-sm font-bold text-gray-700">Parte actora *</label><input type="text" value={formData.parteActora} onChange={e => setFormData({...formData, parteActora: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Parte demandada</label><input type="text" value={formData.parteDemandada} onChange={e => setFormData({...formData, parteDemandada: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Asunto *</label><input type="text" value={formData.asunto} onChange={e => setFormData({...formData, asunto: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Cuantía</label><input type="text" value={formData.cuantia} onChange={e => setFormData({...formData, cuantia: e.target.value})} className="w-full border rounded p-2" placeholder="$ o moneda" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Fecha</label><input type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Jurisdicción</label><input type="text" value={formData.jurisdiccion} onChange={e => setFormData({...formData, jurisdiccion: e.target.value})} className="w-full border rounded p-2" placeholder="Ej: México, Jalisco, España..." /></div>
              <div><label className="block text-sm font-bold text-gray-700">Juzgado / Tribunal</label><input type="text" value={formData.juzgado} onChange={e => setFormData({...formData, juzgado: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Secretaría</label><input type="text" value={formData.secretaria} onChange={e => setFormData({...formData, secretaria: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Actuaria</label><input type="text" value={formData.actuaria} onChange={e => setFormData({...formData, actuaria: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-bold text-gray-700">Mesa</label><input type="text" value={formData.mesa} onChange={e => setFormData({...formData, mesa: e.target.value})} className="w-full border rounded p-2" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700">Notas</label><textarea rows="3" value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} className="w-full border rounded p-2"></textarea></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalAbierto(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={guardarExpediente} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expedientes;