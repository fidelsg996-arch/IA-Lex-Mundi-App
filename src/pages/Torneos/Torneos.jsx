import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import RegistroTorneo from './components/RegistroTorneo';
import PagoTorneo from './components/PagoTorneo';
import Clasificacion from './components/Clasificacion';
import Grupos from './components/Grupos';
import Eliminatorias from './components/Eliminatorias';
import ResultadoDuelo from './components/ResultadoDuelo';
import BuscadorRival from './components/BuscadorRival';

const STORAGE_KEY = 'lexmindi_torneos';

const torneosIniciales = [
  { id: 1, titulo: 'Torneo de Derecho Civil', descripcion: 'Competencia sobre Derecho Civil, contratos y obligaciones', fecha: '2025-06-15', premio: 10000, tipo: 'Individual', status: 'activo', participantes: 0 },
  { id: 2, titulo: 'Torneo de Derecho Penal', descripcion: 'Competencia sobre Derecho Penal, delitos y procedimientos', fecha: '2025-07-20', premio: 15000, tipo: 'Equipos', status: 'activo', participantes: 0 },
  { id: 3, titulo: 'Torneo de Derecho Laboral', descripcion: 'Competencia sobre Derecho Laboral y seguridad social', fecha: '2025-08-10', premio: 12000, tipo: 'Individual', status: 'finalizado', participantes: 0 }
];

const Torneos = () => {
  const { user, isAdmin } = useAuth();
  const modoAdmin = isAdmin();
  
  const [torneos, setTorneos] = useState([]);
  const [vista, setVista] = useState('lista');
  const [torneoActual, setTorneoActual] = useState(null);
  const [participante, setParticipante] = useState(null);
  const [resultadoDuelo, setResultadoDuelo] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  
  // Estado para el formulario de edición (igual que en Libros)
  const [editandoTorneo, setEditandoTorneo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', fecha: '', premio: '', tipo: 'Individual', status: 'activo'
  });

  // Cargar torneos
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTorneos(JSON.parse(stored));
    } else {
      setTorneos(torneosIniciales);
    }
  }, []);

  useEffect(() => {
    if (torneos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(torneos));
    }
  }, [torneos]);

  // ✅ Funciones de edición (exactamente como en Libros)
  const abrirFormNuevo = () => {
    if (!modoAdmin) return;
    setEditandoTorneo(null);
    setFormData({ titulo: '', descripcion: '', fecha: '', premio: '', tipo: 'Individual', status: 'activo' });
    setShowForm(true);
  };

  const abrirFormEditar = (torneo) => {
    if (!modoAdmin) return;
    setEditandoTorneo(torneo);
    setFormData({
      titulo: torneo.titulo,
      descripcion: torneo.descripcion,
      fecha: torneo.fecha,
      premio: torneo.premio.toString(),
      tipo: torneo.tipo,
      status: torneo.status
    });
    setShowForm(true);
  };

  const guardarTorneo = () => {
    if (!modoAdmin) return;
    if (!formData.titulo || !formData.fecha) {
      alert('Completa los campos obligatorios');
      return;
    }

    const nuevoTorneo = {
      id: editandoTorneo ? editandoTorneo.id : Date.now(),
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      premio: parseFloat(formData.premio) || 0,
      tipo: formData.tipo,
      status: formData.status,
      participantes: editandoTorneo ? (editandoTorneo.participantes || 0) : 0
    };

    if (editandoTorneo) {
      setTorneos(torneos.map(t => t.id === editandoTorneo.id ? nuevoTorneo : t));
    } else {
      setTorneos([...torneos, nuevoTorneo]);
    }
    setShowForm(false);
    setEditandoTorneo(null);
  };

  const eliminarTorneo = (id) => {
    if (!modoAdmin) return;
    if (window.confirm('¿Eliminar este torneo?')) {
      setTorneos(torneos.filter(t => t.id !== id));
    }
  };

  const seleccionarTorneo = (torneo) => {
    if (!user) { alert('Debes iniciar sesión'); return; }
    setTorneoActual(torneo);
    setVista('registro');
  };

  const registrarParticipante = (datos) => {
    if (!user) return;
    const nuevoParticipante = {
      id: `torneo_${torneoActual.id}_${user.uid}`,
      torneoId: torneoActual.id,
      usuarioId: user.uid,
      nombre: datos.nombre,
      telefono: datos.telefono,
      email: datos.email || user.email,
      pagado: false,
      fase: 'registrado'
    };
    localStorage.setItem(nuevoParticipante.id, JSON.stringify(nuevoParticipante));
    setParticipante(nuevoParticipante);
    setVista('pago');
  };

  const pagoExitoso = () => {
    const updated = { ...participante, pagado: true, fase: 'clasificacion' };
    localStorage.setItem(participante.id, JSON.stringify(updated));
    setParticipante(updated);
    setTorneos(torneos.map(t => t.id === torneoActual.id ? { ...t, participantes: (t.participantes || 0) + 1 } : t));
    setVista('clasificacion');
  };

  const avanzarGrupos = () => {
    const updated = { ...participante, fase: 'grupos', duelosGrupo: 0, puntajeGrupo: 0, victoriasGrupo: 0 };
    localStorage.setItem(participante.id, JSON.stringify(updated));
    setParticipante(updated);
    setVista('grupos');
  };

  const avanzarEliminatorias = () => {
    const updated = { ...participante, fase: 'eliminatorias', ronda: '16vos' };
    localStorage.setItem(participante.id, JSON.stringify(updated));
    setParticipante(updated);
    setVista('eliminatorias');
  };

  const handleDueloFinalizado = (puntos, gano, puntosRival, nombreRival) => {
    setResultadoDuelo({ puntos, gano, puntosRival, nombreRival });
    setMostrarResultado(true);
  };

  // ✅ VISTA DE LISTA (como Libros)
  if (vista === 'lista') {
    return (
      <div className="px-4">
        {/* Header */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-700"></div>
          <div className="relative z-10 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-red-400">sports_esports</span>
                <h1 className="text-2xl font-black">Torneos Jurídicos</h1>
              </div>
              {modoAdmin && (
                <button onClick={abrirFormNuevo} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-red-600">
                  <span className="material-symbols-outlined text-sm">add</span> Nuevo Torneo
                </button>
              )}
            </div>
            <p className="text-gray-200 text-sm">Compite y demuestra tus conocimientos</p>
          </div>
        </div>

        {/* Grid de torneos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {torneos.map((torneo) => (
            <div key={torneo.id} className={`bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow ${torneo.status === 'activo' ? 'border-green-300' : 'border-gray-200'}`}>
              <div className="h-32 bg-gradient-to-br from-red-50 to-orange-100 relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                  ${torneo.premio.toLocaleString()} MXN
                </div>
                <span className="material-symbols-outlined text-5xl text-red-400">emoji_events</span>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-sm font-bold text-gray-800 line-clamp-2 flex-1">{torneo.titulo}</h2>
                  
                  {/* ✅ BOTONES DE ADMIN - IGUAL QUE EN LIBROS */}
                  {modoAdmin && (
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); abrirFormEditar(torneo); }} 
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); eliminarTorneo(torneo.id); }} 
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{torneo.descripcion}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    {torneo.fecha}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">groups</span>
                    {torneo.participantes || 0} participantes
                  </div>
                </div>
                <button
                  onClick={() => seleccionarTorneo(torneo)}
                  disabled={torneo.status !== 'activo'}
                  className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold transition ${
                    torneo.status === 'activo' 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {torneo.status === 'activo' ? 'Inscribirse' : 'Finalizado'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ MODAL DE EDICIÓN - IGUAL QUE EN LIBROS */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-red-800 to-red-700 p-4 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">{editandoTorneo ? 'Editar Torneo' : 'Nuevo Torneo'}</h2>
              </div>
              <div className="p-5 space-y-3">
                <input type="text" placeholder="Título *" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full p-2 border rounded" />
                <textarea placeholder="Descripción" rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} className="w-full p-2 border rounded" />
                  <input type="number" placeholder="Premio MXN" value={formData.premio} onChange={e => setFormData({...formData, premio: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full p-2 border rounded">
                  <option value="Individual">Individual</option>
                  <option value="Equipos">Equipos</option>
                </select>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded">
                  <option value="activo">Activo</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 p-4 border-t">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button onClick={guardarTorneo} className="px-4 py-2 bg-red-500 text-white rounded-lg">Guardar</button>
              </div>
            </div>
          </div>
        )}

        {modoAdmin && (
          <div className="fixed bottom-4 right-4 z-50 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span className="text-sm font-semibold">Administrador</span>
          </div>
        )}

        <style>{`
          .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        `}</style>
      </div>
    );
  }

  // Resto de vistas (registro, pago, duelos, etc.)
  if (vista === 'registro') return <RegistroTorneo torneo={torneoActual} onRegistrar={registrarParticipante} onVolver={() => setVista('lista')} />;
  if (vista === 'pago') return <PagoTorneo torneo={torneoActual} participante={participante} onPagoExitoso={pagoExitoso} onVolver={() => setVista('lista')} />;
  if (vista === 'clasificacion') return <Clasificacion torneo={torneoActual} participante={participante} onAvanzarGrupos={avanzarGrupos} onVolver={() => setVista('lista')} setParticipante={setParticipante} onDueloFinalizado={handleDueloFinalizado} />;
  if (vista === 'grupos') return <Grupos torneo={torneoActual} participante={participante} onAvanzarEliminatorias={avanzarEliminatorias} onVolver={() => setVista('lista')} setParticipante={setParticipante} onDueloFinalizado={handleDueloFinalizado} />;
  if (vista === 'eliminatorias') return <Eliminatorias torneo={torneoActual} participante={participante} onVolver={() => setVista('lista')} setParticipante={setParticipante} onDueloFinalizado={handleDueloFinalizado} />;
  
  if (mostrarResultado && resultadoDuelo) {
    return <ResultadoDuelo puntuacionUsuario={resultadoDuelo.puntos} puntuacionRival={resultadoDuelo.puntosRival} nombreRival={resultadoDuelo.nombreRival} fase={vista} torneo={torneoActual} onContinuar={() => { setMostrarResultado(false); setResultadoDuelo(null); }} onVerBracket={() => { setMostrarResultado(false); setMostrarBuscador(true); }} />;
  }
  
  if (mostrarBuscador) {
    return <BuscadorRival torneo={torneoActual} fase={vista} onBuscarRival={() => setMostrarBuscador(false)} onVolver={() => { setMostrarBuscador(false); setVista('lista'); }} />;
  }

  return null;
};

export default Torneos;