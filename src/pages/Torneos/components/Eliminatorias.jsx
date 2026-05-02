import { useState } from 'react';
import SalaDuelo from './SalaDuelo';
import PantallaCampeon from './PantallaCampeon';

const Eliminatorias = ({ torneo, participante, onVolver, setParticipante, onDueloFinalizado }) => {
  const [enCompetencia, setEnCompetencia] = useState(false);
  const [mostrarCampeon, setMostrarCampeon] = useState(false);
  const rondas = ['16vos', '8vos', '4tos', 'Semifinal', 'Final'];
  const rondaActual = participante.ronda || '16vos';
  const indiceActual = rondas.indexOf(rondaActual);
  const siguienteRonda = indiceActual + 1 < rondas.length ? rondas[indiceActual + 1] : null;

  const handleCompetenciaFinalizada = (puntos, gano, puntosRival, nombreRival) => {
    setEnCompetencia(false);
    
    if (gano) {
      if (siguienteRonda) {
        const updated = { ...participante, ronda: siguienteRonda };
        setParticipante(updated);
        localStorage.setItem(participante.id, JSON.stringify(updated));
        alert(`✅ ¡Ganaste! Avanzas a ${siguienteRonda}`);
      } else {
        // ¡ES EL CAMPEÓN!
        setMostrarCampeon(true);
        return;
      }
    } else {
      alert('❌ Perdiste el duelo. ¡Suerte en el próximo torneo!');
      onVolver();
    }
    
    onDueloFinalizado(puntos, gano, puntosRival, nombreRival);
  };

  if (mostrarCampeon) {
    return (
      <PantallaCampeon
        torneo={torneo}
        participante={participante}
        premio={torneo?.premio || 0}
      />
    );
  }

  if (enCompetencia) {
    return <SalaDuelo torneo={torneo} participante={participante} fase="eliminatorias" onCompetenciaFinalizada={handleCompetenciaFinalizada} onVolver={() => setEnCompetencia(false)} />;
  }

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <button onClick={onVolver} className="text-gray-500 mb-4 hover:text-gray-700 float-left">← Volver</button>
        <h1 className="text-2xl font-bold mb-4 text-center">Fase {rondaActual}</h1>
        <div className="bg-purple-50 p-4 rounded-lg mb-4 text-center">
          <p className="text-lg font-bold text-purple-800">Ronda: {rondaActual} de final</p>
          <p className="text-sm text-gray-600 mt-2">
            {siguienteRonda 
              ? `Gana este duelo para avanzar a ${siguienteRonda}` 
              : '🏆 ¡ES LA FINAL! Gana este duelo para ser CAMPEÓN 🏆'}
          </p>
          <p className="text-sm text-gray-600 mt-2">🏆 Premio: ${torneo?.premio?.toLocaleString()} MXN</p>
          <p className="text-sm text-gray-600 mt-2">⏱️ 20 segundos por pregunta | 15 preguntas</p>
          <p className="text-sm text-gray-600">🎯 10 puntos = victoria automática</p>
        </div>
        <button onClick={() => setEnCompetencia(true)} className="w-full bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition">
          Realizar Duelo de {rondaActual}
        </button>
      </div>
    </div>
  );
};

export default Eliminatorias;