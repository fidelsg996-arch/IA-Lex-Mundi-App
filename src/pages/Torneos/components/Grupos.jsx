import { useState, useEffect } from 'react';
import SalaDuelo from './SalaDuelo';

const Grupos = ({ torneo, participante, onAvanzarEliminatorias, onVolver, setParticipante, onDueloFinalizado }) => {
  const [competenciasCompletadas, setCompetenciasCompletadas] = useState(participante.duelosGrupo || 0);
  const [puntajeTotal, setPuntajeTotal] = useState(participante.puntajeGrupo || 0);
  const [victorias, setVictorias] = useState(participante.victoriasGrupo || 0);
  const [enCompetencia, setEnCompetencia] = useState(false);
  const [dueloActual, setDueloActual] = useState((participante.duelosGrupo || 0) + 1);
  const [grupo, setGrupo] = useState(participante.grupo || null);

  useEffect(() => {
    if (!grupo) {
      const grupoAsignado = Math.floor(Math.random() * 32) + 1;
      setGrupo(grupoAsignado);
      setParticipante({ ...participante, grupo: grupoAsignado });
    }
  }, [grupo, participante, setParticipante]);

  const handleCompetenciaFinalizada = (puntos, gano, puntosRival, nombreRival) => {
    const nuevasComp = competenciasCompletadas + 1;
    const nuevoPuntaje = puntajeTotal + puntos;
    const nuevasVictorias = victorias + (gano ? 1 : 0);
    
    setCompetenciasCompletadas(nuevasComp);
    setPuntajeTotal(nuevoPuntaje);
    setVictorias(nuevasVictorias);
    setEnCompetencia(false);
    
    const updated = { ...participante, duelosGrupo: nuevasComp, puntajeGrupo: nuevoPuntaje, victoriasGrupo: nuevasVictorias };
    setParticipante(updated);
    localStorage.setItem(participante.id, JSON.stringify(updated));
    
    onDueloFinalizado(puntos, gano, puntosRival, nombreRival);
    
    if (nuevasComp >= 3) {
      if (nuevasVictorias >= 2) {
        alert(`✅ ¡Ganaste el GRUPO ${grupo}! Avanzas a 16vos de final.`);
        onAvanzarEliminatorias();
      } else {
        alert(`❌ No clasificaste. Victorias: ${nuevasVictorias}`);
        onVolver();
      }
    } else {
      setDueloActual(dueloActual + 1);
    }
  };

  if (enCompetencia) {
    return <SalaDuelo torneo={torneo} participante={participante} fase="grupos" onCompetenciaFinalizada={handleCompetenciaFinalizada} onVolver={() => setEnCompetencia(false)} />;
  }

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <button onClick={onVolver} className="text-gray-500 mb-4 hover:text-gray-700 float-left">← Volver</button>
        <h1 className="text-2xl font-bold mb-4 text-center">Fase de Grupos</h1>
        <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
          <p className="text-lg font-bold text-green-800">Grupo: {grupo || 'Asignando...'}</p>
          <p className="text-sm text-gray-600 mt-2">Duelos restantes: {3 - competenciasCompletadas}</p>
          <p className="text-sm text-gray-600">Puntaje acumulado: {puntajeTotal} pts</p>
          <p className="text-sm text-gray-600">Victorias: {victorias}</p>
          <p className="text-sm text-gray-600 mt-2">⏱️ 20 segundos por pregunta | 15 preguntas</p>
          <p className="text-sm text-gray-600">🎯 10 puntos = victoria automática</p>
        </div>
        <button onClick={() => setEnCompetencia(true)} className="w-full bg-red-500 text-white py-2 rounded-lg font-bold">Realizar Duelo {dueloActual}/3</button>
      </div>
    </div>
  );
};

export default Grupos;