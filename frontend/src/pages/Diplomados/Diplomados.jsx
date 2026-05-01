import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDiplomadosData } from './hooks/useDiplomadosData';
import ListaDiplomadosPhase from './components/ListaDiplomadosPhase';
import DiplomadoDetallePhase from './phases/DiplomadoDetallePhase';
import ModuloPhase from './phases/ModuloPhase';
import LeccionPhase from './phases/LeccionPhase';
import ConstanciaPhase from './phases/ConstanciaPhase';
import FormularioDiplomado from './components/FormularioDiplomado';

const Diplomados = () => {
  const { user, isAdmin } = useAuth();
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
  const [showForm, setShowForm] = useState(false);
  const [editandoDiplomado, setEditandoDiplomado] = useState(null);
  const [mostrarConstancia, setMostrarConstancia] = useState(false);

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
        estructura: diplomadoData.estructura || []
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
        {/* Portada */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
            alt="Diplomados"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-purple-300">workspace_premium</span>
              <div>
                <h1 className="text-2xl font-black">Diplomados</h1>
                <p className="text-gray-200 text-sm">Programas de especialización con certificación oficial</p>
              </div>
            </div>
          </div>
        </div>

        <ListaDiplomadosPhase 
          diplomados={diplomados}
          modoAdmin={isAdmin()}
          onEditar={(d) => { setEditandoDiplomado(d); setShowForm(true); }}
          onEliminar={eliminarDiplomado}
          onTogglePremio={actualizarPremioTorneo}
          onSeleccionarDiplomado={(d) => { setDiplomadoSeleccionado(d); setVista('curso'); }}
          onAbrirFormNuevo={() => { setEditandoDiplomado(null); setShowForm(true); }}
          calcularProgreso={calcularProgresoDiplomado || (() => 0)}
        />
        
        {/* Indicador de Admin flotante */}
        {isAdmin() && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
            <div className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span className="text-sm font-semibold">Administrador</span>
            </div>
          </div>
        )}
        
        <FormularioDiplomado 
          show={showForm}
          diplomadoEditado={editandoDiplomado}
          onClose={() => {
            setShowForm(false);
            setEditandoDiplomado(null);
          }}
          onSave={handleGuardarDiplomado}
        />
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