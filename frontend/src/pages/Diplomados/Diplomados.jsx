import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDiplomadosData } from './hooks/useDiplomadosData';
import ListaDiplomadosPhase from './components/ListaDiplomadosPhase';
import DiplomadoDetallePhase from './phases/DiplomadoDetallePhase';
import ModuloPhase from './phases/ModuloPhase';
import LeccionPhase from './phases/LeccionPhase';
import ConstanciaPhase from './phases/ConstanciaPhase';

const ADMIN_EMAIL = 'admin@lexmundi.ia';

const Diplomados = () => {
  const { user } = useAuth();
  const { 
    diplomados, 
    loading, 
    guardarDiplomado, 
    eliminarDiplomado, 
    actualizarPremioTorneo, 
    cargarDiplomados,
    guardarProgreso,
    estaCompletada,
    calcularProgresoDiplomado
  } = useDiplomadosData();
  
  const [vista, setVista] = useState('cursos');
  const [diplomadoSeleccionado, setDiplomadoSeleccionado] = useState(null);
  const [moduloActual, setModuloActual] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editandoDiplomado, setEditandoDiplomado] = useState(null);
  const [mostrarConstancia, setMostrarConstancia] = useState(false);

  // Detectar si el usuario es admin
  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      setModoAdmin(true);
    } else {
      setModoAdmin(false);
    }
  }, [user]);

  const verificarCompletada = (diplomadoId, moduloId, leccionId) => {
    return estaCompletada(diplomadoId, moduloId, leccionId);
  };

  const marcarCompletada = async (diplomadoId, moduloId, leccionId, leccionTitulo) => {
    if (!estaCompletada(diplomadoId, moduloId, leccionId)) {
      await guardarProgreso(diplomadoId, moduloId, leccionId);
      alert(`✅ ¡Lección "${leccionTitulo}" completada!`);
      await cargarDiplomados();
    }
  };

  const handleGuardarDiplomado = async (diplomadoData) => {
    try {
      const diplomadoParaGuardar = {
        id: diplomadoData.id || Date.now(),
        titulo: diplomadoData.titulo || '',
        descripcion: diplomadoData.descripcion || '',
        imagen: diplomadoData.imagen || '',
        duracion: diplomadoData.duracion || '160 horas',
        precio: diplomadoData.precio || 0,
        esPremioTorneo: diplomadoData.esPremioTorneo || false,
        modulos: diplomadoData.modulos || []
      };
      
      await guardarDiplomado(diplomadoParaGuardar, diplomadoData.id);
      await cargarDiplomados();
      setShowForm(false);
      setEditandoDiplomado(null);
    } catch (error) {
      console.error('Error al guardar diplomado:', error);
      alert('Error al guardar el diplomado');
    }
  };

  if (loading) return <div className="text-center py-20">Cargando diplomados...</div>;
  if (!user) return <div className="text-center py-20">Cargando...</div>;

  if (mostrarConstancia && diplomadoSeleccionado) {
    return <ConstanciaPhase diplomado={diplomadoSeleccionado} user={user} onBack={() => setMostrarConstancia(false)} />;
  }

  if (vista === 'cursos') {
    return (
      <>
        <ListaDiplomadosPhase 
          diplomados={diplomados}
          modoAdmin={modoAdmin}
          onEditar={(d) => { setEditandoDiplomado(d); setShowForm(true); }}
          onEliminar={eliminarDiplomado}
          onTogglePremio={actualizarPremioTorneo}
          onSeleccionarDiplomado={(d) => { setDiplomadoSeleccionado(d); setVista('curso'); }}
          onAbrirFormNuevo={() => { setEditandoDiplomado(null); setShowForm(true); }}
          calcularProgreso={calcularProgresoDiplomado || (() => 0)}
        />
        
        {/* Indicador de Admin */}
        {modoAdmin && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
            <div className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span className="text-sm font-semibold">Administrador</span>
            </div>
          </div>
        )}
        
        {/* Formulario de Diplomado simplificado */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-800 to-purple-700 p-4 rounded-t-2xl sticky top-0">
                <h2 className="text-xl font-bold text-white">{editandoDiplomado ? 'Editar Diplomado' : 'Nuevo Diplomado'}</h2>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold">Título *</label>
                  <input type="text" value={editandoDiplomado?.titulo || ''} onChange={(e) => setEditandoDiplomado({...editandoDiplomado, titulo: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold">Descripción</label>
                  <textarea rows="3" value={editandoDiplomado?.descripcion || ''} onChange={(e) => setEditandoDiplomado({...editandoDiplomado, descripcion: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold">URL de imagen</label>
                    <input type="url" value={editandoDiplomado?.imagen || ''} onChange={(e) => setEditandoDiplomado({...editandoDiplomado, imagen: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold">Duración</label>
                    <input type="text" value={editandoDiplomado?.duracion || '160 horas'} onChange={(e) => setEditandoDiplomado({...editandoDiplomado, duracion: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-lg" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold">Precio (MXN)</label>
                    <input type="number" value={editandoDiplomado?.precio || 0} onChange={(e) => setEditandoDiplomado({...editandoDiplomado, precio: parseFloat(e.target.value)})} className="w-full px-3 py-2 text-sm border rounded-lg" />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={editandoDiplomado?.esPremioTorneo || false} onChange={(e) => setEditandoDiplomado({...editandoDiplomado, esPremioTorneo: e.target.checked})} />
                      Premio del Torneo
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-4 border-t">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button onClick={() => handleGuardarDiplomado(editandoDiplomado)} className="px-4 py-2 bg-purple-500 text-white rounded-lg">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (vista === 'curso' && diplomadoSeleccionado) {
    return (
      <DiplomadoDetallePhase 
        diplomado={diplomadoSeleccionado}
        onBack={() => { setDiplomadoSeleccionado(null); setVista('cursos'); cargarDiplomados(); }}
        onSeleccionarModulo={(m) => { setModuloActual(m); setVista('modulo'); }}
        estaCompletada={verificarCompletada}
        onGenerarConstancia={() => setMostrarConstancia(true)}
      />
    );
  }

  if (vista === 'modulo' && moduloActual && diplomadoSeleccionado) {
    return (
      <ModuloPhase 
        diplomado={diplomadoSeleccionado}
        modulo={moduloActual}
        onBack={() => setVista('curso')}
        onSeleccionarLeccion={(l) => { setLeccionActual(l); setVista('leccion'); }}
        estaCompletada={verificarCompletada}
      />
    );
  }

  if (vista === 'leccion' && leccionActual && moduloActual && diplomadoSeleccionado) {
    const completada = verificarCompletada(diplomadoSeleccionado.id, moduloActual.id, leccionActual.id);
    const leccionesLista = moduloActual.leccionesLista || [];
    const idxActual = leccionesLista.findIndex(l => l.id === leccionActual.id);
    const siguienteLeccion = leccionesLista[idxActual + 1];

    return (
      <LeccionPhase 
        diplomado={diplomadoSeleccionado}
        modulo={moduloActual}
        leccion={leccionActual}
        completada={completada}
        onBack={() => setVista('modulo')}
        onMarcarCompletada={() => marcarCompletada(diplomadoSeleccionado.id, moduloActual.id, leccionActual.id, leccionActual.titulo)}
        siguienteLeccion={siguienteLeccion}
        onSiguienteLeccion={() => setLeccionActual(siguienteLeccion)}
      />
    );
  }

  return null;
};

export default Diplomados;