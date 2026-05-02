import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ListaTorneos from './components/ListaTorneos';
import RegistroTorneo from './components/RegistroTorneo';
import PagoTorneo from './components/PagoTorneo';
import Clasificacion from './components/Clasificacion';
import Grupos from './components/Grupos';
import Eliminatorias from './components/Eliminatorias';
import ResultadoDuelo from './components/ResultadoDuelo';
import BuscadorRival from './components/BuscadorRival';

const Torneos = () => {
  const { user, isAdmin } = useAuth();
  const modoAdmin = isAdmin();
  const [vista, setVista] = useState('lista');
  const [torneoActual, setTorneoActual] = useState(null);
  const [participante, setParticipante] = useState(null);
  const [resultadoDuelo, setResultadoDuelo] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [esCampeon, setEsCampeon] = useState(false);
  const [premioGanado, setPremioGanado] = useState(0);

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

  // ✅ FUNCIÓN CORREGIDA - Recibe esCampeon
  const handleDueloFinalizado = (puntos, gano, puntosRival, nombreRival, campeon = false, premio = 0) => {
    if (campeon) {
      // Guardar datos del campeón en localStorage
      const campeonData = {
        torneo: torneoActual,
        participante: participante,
        premio: premio,
        puntos: puntos,
        puntosRival: puntosRival,
        nombreRival: nombreRival,
        fecha: new Date().toISOString()
      };
      localStorage.setItem('campeon_actual', JSON.stringify(campeonData));
      setEsCampeon(true);
      setPremioGanado(premio);
    }
    
    setResultadoDuelo({ puntos, gano, puntosRival, nombreRival, esCampeon: campeon, premio: premio });
    setMostrarResultado(true);
  };

  // Función para reiniciar después de ver resultado
  const handleContinuar = () => {
    setMostrarResultado(false);
    setResultadoDuelo(null);
    setEsCampeon(false);
    setPremioGanado(0);
    
    // Si era campeón, redirigir a reclamar premio
    if (esCampeon) {
      window.location.href = '/reclamar-premio';
    }
  };

  if (mostrarResultado && resultadoDuelo) {
    return (
      <ResultadoDuelo
        puntuacionUsuario={resultadoDuelo.puntos}
        puntuacionRival={resultadoDuelo.puntosRival}
        nombreRival={resultadoDuelo.nombreRival}
        fase={vista}
        torneo={torneoActual}
        esCampeon={resultadoDuelo.esCampeon || false}
        premio={resultadoDuelo.premio || 0}
        onContinuar={handleContinuar}
        onVerBracket={() => {
          setMostrarResultado(false);
          setMostrarBuscador(true);
        }}
      />
    );
  }

  if (mostrarBuscador) {
    return (
      <BuscadorRival
        torneo={torneoActual}
        fase={vista}
        onBuscarRival={() => {
          setMostrarBuscador(false);
        }}
        onVolver={() => {
          setMostrarBuscador(false);
          setVista('lista');
        }}
      />
    );
  }

  if (vista === 'lista') return <ListaTorneos onSeleccionarTorneo={seleccionarTorneo} modoAdmin={modoAdmin} />;
  if (vista === 'registro') return <RegistroTorneo torneo={torneoActual} onRegistrar={registrarParticipante} onVolver={() => setVista('lista')} />;
  if (vista === 'pago') return <PagoTorneo torneo={torneoActual} participante={participante} onPagoExitoso={pagoExitoso} onVolver={() => setVista('lista')} />;
  if (vista === 'clasificacion') return <Clasificacion torneo={torneoActual} participante={participante} onAvanzarGrupos={avanzarGrupos} onVolver={() => setVista('lista')} setParticipante={setParticipante} onDueloFinalizado={handleDueloFinalizado} />;
  if (vista === 'grupos') return <Grupos torneo={torneoActual} participante={participante} onAvanzarEliminatorias={avanzarEliminatorias} onVolver={() => setVista('lista')} setParticipante={setParticipante} onDueloFinalizado={handleDueloFinalizado} />;
  if (vista === 'eliminatorias') return <Eliminatorias torneo={torneoActual} participante={participante} onVolver={() => setVista('lista')} setParticipante={setParticipante} onDueloFinalizado={handleDueloFinalizado} />;

  return null;
};

export default Torneos;