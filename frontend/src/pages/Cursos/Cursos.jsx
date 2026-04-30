import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCursosData } from './hooks/useCursosData';
import ModalAdminLogin from '../../components/ModalAdminLogin';
import ListaCursosPhase from './phases/ListaCursosPhase';
import CursoDetallePhase from './phases/CursoDetallePhase';
import ModuloPhase from './phases/ModuloPhase';
import LeccionPhase from './phases/LeccionPhase';
import ConstanciaPhase from './phases/ConstanciaPhase';
import FormularioCurso from './components/FormularioCurso';

const Cursos = () => {
  const { user } = useAuth();
  const { 
    cursos, 
    loading, 
    guardarCurso, 
    eliminarCurso, 
    actualizarPremioTorneo, 
    cargarCursos,
    guardarProgreso,
    estaCompletada,
    calcularProgresoCurso
  } = useCursosData();
  
  const [vista, setVista] = useState('cursos');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [moduloActual, setModuloActual] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [mostrarConstancia, setMostrarConstancia] = useState(false);

  const verificarCompletada = (cursoId, moduloId, leccionId) => {
    return estaCompletada(cursoId, moduloId, leccionId);
  };

  const marcarCompletada = async (cursoId, moduloId, leccionId, leccionTitulo) => {
    if (!estaCompletada(cursoId, moduloId, leccionId)) {
      await guardarProgreso(cursoId, moduloId, leccionId);
      alert(`✅ ¡Lección "${leccionTitulo}" completada!`);
      await cargarCursos();
    }
  };

  const handleGuardarCurso = async (cursoData, cursoId) => {
    await guardarCurso(cursoData, cursoId);
    await cargarCursos();
  };

  if (loading) return <div className="text-center py-20">Cargando cursos...</div>;

  if (mostrarConstancia && cursoSeleccionado) {
    return <ConstanciaPhase curso={cursoSeleccionado} user={user} onBack={() => setMostrarConstancia(false)} />;
  }

  if (vista === 'cursos') {
    return (
      <>
        <ListaCursosPhase 
          cursos={cursos}
          modoAdmin={modoAdmin}
          onEditar={(curso) => { setEditandoCurso(curso); setShowForm(true); }}
          onEliminar={eliminarCurso}
          onTogglePremio={actualizarPremioTorneo}
          onSeleccionarCurso={(curso) => { setCursoSeleccionado(curso); setVista('curso'); }}
          onAbrirFormNuevo={() => { setEditandoCurso(null); setShowForm(true); }}
          calcularProgreso={calcularProgresoCurso}
        />
        
        {!modoAdmin && (
          <button 
            onClick={() => setShowAdminLogin(true)} 
            className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span className="text-sm font-semibold">Admin</span>
          </button>
        )}
        
        <ModalAdminLogin 
          show={showAdminLogin} 
          onClose={() => setShowAdminLogin(false)}
          onSuccess={() => {
            setModoAdmin(true);
            setShowAdminLogin(false);
            alert('✅ Modo administrador activado');
          }}
        />
        
        <FormularioCurso 
          show={showForm}
          cursoEditado={editandoCurso}
          onClose={() => {
            setShowForm(false);
            setEditandoCurso(null);
          }}
          onSave={handleGuardarCurso}
        />
      </>
    );
  }

  if (vista === 'curso' && cursoSeleccionado) {
    return (
      <CursoDetallePhase 
        curso={cursoSeleccionado}
        onBack={() => { setCursoSeleccionado(null); setVista('cursos'); cargarCursos(); }}
        onSeleccionarModulo={(modulo) => { setModuloActual(modulo); setVista('modulo'); }}
        estaCompletada={verificarCompletada}
        onGenerarConstancia={() => setMostrarConstancia(true)}
      />
    );
  }

  if (vista === 'modulo' && moduloActual && cursoSeleccionado) {
    return (
      <ModuloPhase 
        curso={cursoSeleccionado}
        modulo={moduloActual}
        onBack={() => setVista('curso')}
        onSeleccionarLeccion={(leccion) => { setLeccionActual(leccion); setVista('leccion'); }}
        estaCompletada={verificarCompletada}
      />
    );
  }

  if (vista === 'leccion' && leccionActual && moduloActual && cursoSeleccionado) {
    const completada = verificarCompletada(cursoSeleccionado.id, moduloActual.id, leccionActual.id);
    const leccionesLista = moduloActual.leccionesLista || [];
    const idxActual = leccionesLista.findIndex(l => l.id === leccionActual.id);
    const siguienteLeccion = leccionesLista[idxActual + 1];

    return (
      <LeccionPhase 
        curso={cursoSeleccionado}
        modulo={moduloActual}
        leccion={leccionActual}
        completada={completada}
        onBack={() => setVista('modulo')}
        onMarcarCompletada={() => marcarCompletada(cursoSeleccionado.id, moduloActual.id, leccionActual.id, leccionActual.titulo)}
        siguienteLeccion={siguienteLeccion}
        onSiguienteLeccion={() => setLeccionActual(siguienteLeccion)}
      />
    );
  }

  return null;
};

export default Cursos;