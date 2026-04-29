import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDiplomadosData } from './hooks/useDiplomadosData';
import ModalAdminLogin from './components/ModalAdminLogin';
import ListaDiplomadosPhase from './phases/ListaDiplomadosPhase';
import DiplomadoDetallePhase from './phases/DiplomadoDetallePhase';
import ModuloPhase from './phases/ModuloPhase';
import LeccionPhase from './phases/LeccionPhase';
import ConstanciaPhase from './phases/ConstanciaPhase';
import FormularioDiplomado from './components/FormularioDiplomado';

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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editandoDiplomado, setEditandoDiplomado] = useState(null);
  const [mostrarConstancia, setMostrarConstancia] = useState(false);

  const marcarCompletada = async (did, mid, lid, titulo) => {
    if (!estaCompletada(did, mid, lid)) {
      const exito = await guardarProgreso(did, mid, lid);
      if (exito) {
        alert(`✅ ¡Lección "${titulo}" completada!`);
        await cargarDiplomados();
      } else {
        alert("❌ Error al guardar el progreso");
      }
    }
  };

  const handleGuardarDiplomado = async (diplomadoData, diplomadoId) => {
    await guardarDiplomado(diplomadoData, diplomadoId);
    await cargarDiplomados();
  };

  if (loading) return <div className="text-center py-20">Cargando diplomados...</div>;

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
          calcularProgreso={calcularProgresoDiplomado}
        />
        {!modoAdmin && (
          <button onClick={() => setShowAdminLogin(true)} className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg z-50">
            Admin
          </button>
        )}
        <ModalAdminLogin show={showAdminLogin} onClose={() => setShowAdminLogin(false)} onSuccess={() => { setModoAdmin(true); setShowAdminLogin(false); alert('✅ Modo administrador activado'); }} />
        <FormularioDiplomado show={showForm} diplomadoEditado={editandoDiplomado} onClose={() => { setShowForm(false); setEditandoDiplomado(null); }} onSave={handleGuardarDiplomado} />
      </>
    );
  }

  if (vista === 'curso' && diplomadoSeleccionado) {
    return (
      <DiplomadoDetallePhase 
        diplomado={diplomadoSeleccionado}
        onBack={() => { setDiplomadoSeleccionado(null); setVista('cursos'); cargarDiplomados(); }}
        onSeleccionarModulo={(m) => { setModuloActual(m); setVista('modulo'); }}
        estaCompletada={estaCompletada}
        onGenerarConstancia={() => setMostrarConstancia(true)}
        calcularProgresoDiplomado={calcularProgresoDiplomado}
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
        estaCompletada={estaCompletada}
      />
    );
  }

  if (vista === 'leccion' && leccionActual && moduloActual && diplomadoSeleccionado) {
    const completada = estaCompletada(diplomadoSeleccionado.id, moduloActual.id, leccionActual.id);
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