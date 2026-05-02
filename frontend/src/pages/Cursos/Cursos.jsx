import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCursosData } from './hooks/useCursosData';
import ListaCursosPhase from './components/ListaCursosPhase';
import CursoDetallePhase from './phases/CursoDetallePhase';
import ModuloPhase from './phases/ModuloPhase';
import LeccionPhase from './phases/LeccionPhase';
import ConstanciaPhase from './phases/ConstanciaPhase';
import FormularioCurso from './components/FormularioCurso';

const Cursos = () => {
  const { user, isAdmin } = useAuth();
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

  const handleGuardarCurso = async (cursoData) => {
    try {
      const cursoParaGuardar = {
        id: cursoData.id || Date.now(),
        titulo: cursoData.titulo || '',
        descripcion: cursoData.descripcion || '',
        imagen: cursoData.imagen || '',
        nivel: cursoData.nivel || 'Intermedio',
        duracion: cursoData.duracion || '',
        precio: cursoData.precio || 0,
        esPremioTorneo: cursoData.esPremioTorneo || false,
        estructura: cursoData.estructura || []
      };
      
      await guardarCurso(cursoParaGuardar, cursoData.id);
      await cargarCursos();
      setShowForm(false);
      setEditandoCurso(null);
    } catch (error) {
      console.error('Error al guardar curso:', error);
      alert('Error al guardar el curso. Revisa la consola.');
    }
  };

  if (loading) return <div className="text-center py-20">Cargando cursos...</div>;
  if (!user) return <div className="text-center py-20">Cargando...</div>;

  if (mostrarConstancia && cursoSeleccionado) {
    return <ConstanciaPhase curso={cursoSeleccionado} user={user} onBack={() => setMostrarConstancia(false)} />;
  }

  if (vista === 'cursos') {
    return (
      <>
        {/* Portada */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
          <img 
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"
            alt="Cursos especializados"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-blue-300">school</span>
              <div>
                <h1 className="text-2xl font-black">Cursos Especializados</h1>
                <p className="text-gray-200 text-sm">Formación jurídica práctica para profesionales</p>
              </div>
            </div>
          </div>
        </div>

        <ListaCursosPhase 
          cursos={cursos}
          modoAdmin={isAdmin()}
          onEditar={(curso) => { setEditandoCurso(curso); setShowForm(true); }}
          onEliminar={eliminarCurso}
          onTogglePremio={actualizarPremioTorneo}
          onSeleccionarCurso={(curso) => { setCursoSeleccionado(curso); setVista('curso'); }}
          onAbrirFormNuevo={() => { setEditandoCurso(null); setShowForm(true); }}
          calcularProgreso={calcularProgresoCurso || (() => 0)}
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

  // ... resto del código igual
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