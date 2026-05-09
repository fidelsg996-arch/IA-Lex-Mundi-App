import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';
import SalaDuelo from './SalaDuelo';

const Eliminatorias = ({ torneo, participante, onVolver, setParticipante, onDueloFinalizado }) => {
  const { user } = useAuth();
  const { realizarPago, saldo } = useBilletera();
  const [rondaActual, setRondaActual] = useState('16vos');
  const [mostrarDuelo, setMostrarDuelo] = useState(false);
  const [dueloEnCurso, setDueloEnCurso] = useState(null);
  const [rondaCompletada, setRondaCompletada] = useState(false);
  const [pagandoReingreso, setPagandoReingreso] = useState(false);
  const [pagandoRonda, setPagandoRonda] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [historial, setHistorial] = useState([]);

  const esSuscriptor = user?.plan === 'pro' || user?.plan === 'premium';

  // ✅ PRECIOS POR RONDA - $10 MXN cada ronda
  const PRECIOS_RONDA = {
    '16vos': 10,
    '8vos': 10,
    '4tos': 10,
    'semis': 10,
    'final': 10
  };

  // Configuración de rondas
  const rondas = {
    '16vos': { nombre: '16vos', nombreCompleto: 'Dieciseisavos de final', siguiente: '8vos', premio: torneo?.premioDinero * 0.05 || 500 },
    '8vos': { nombre: '8vos', nombreCompleto: 'Octavos de final', siguiente: '4tos', premio: torneo?.premioDinero * 0.1 || 1000 },
    '4tos': { nombre: '4tos', nombreCompleto: 'Cuartos de final', siguiente: 'semis', premio: torneo?.premioDinero * 0.15 || 1500 },
    'semis': { nombre: 'SEMIFINAL', nombreCompleto: 'Semifinal', siguiente: 'final', premio: torneo?.premioDinero * 0.2 || 2000 },
    'final': { nombre: 'FINAL', nombreCompleto: 'Final', siguiente: 'campeon', premio: torneo?.premioDinero * 0.5 || 5000 }
  };

  const getNombreRonda = (ronda) => {
    const nombres = {
      '16vos': '16vos',
      '8vos': '8vos',
      '4tos': '4tos',
      'semis': 'Semifinal',
      'final': 'Final'
    };
    return nombres[ronda] || ronda;
  };

  useEffect(() => {
    cargarProgreso();
  }, []);

  const cargarProgreso = () => {
    const stored = localStorage.getItem(`eliminatorias_${torneo.id}_${participante.usuarioId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setRondaActual(data.rondaActual || '16vos');
      setHistorial(data.historial || []);
      if (data.rondaCompletada) setRondaCompletada(true);
    }
  };

  const guardarProgreso = (nuevaRonda, nuevoHistorial, completada = false) => {
    const data = {
      rondaActual: nuevaRonda,
      historial: nuevoHistorial,
      rondaCompletada: completada
    };
    localStorage.setItem(`eliminatorias_${torneo.id}_${participante.usuarioId}`, JSON.stringify(data));
  };

  const yaPagoRonda = () => {
    const pagos = localStorage.getItem(`pagos_ronda_${torneo.id}_${participante.usuarioId}`);
    if (pagos) {
      const pagosArray = JSON.parse(pagos);
      return pagosArray.includes(rondaActual);
    }
    return false;
  };

  const guardarPagoRonda = () => {
    const pagos = localStorage.getItem(`pagos_ronda_${torneo.id}_${participante.usuarioId}`);
    let pagosArray = pagos ? JSON.parse(pagos) : [];
    if (!pagosArray.includes(rondaActual)) {
      pagosArray.push(rondaActual);
      localStorage.setItem(`pagos_ronda_${torneo.id}_${participante.usuarioId}`, JSON.stringify(pagosArray));
    }
  };

  const obtenerRival = (ronda) => {
    const rivales = {
      '16vos': 'Carlos Méndez',
      '8vos': 'Laura Fernández',
      '4tos': 'Roberto Sánchez',
      'semis': 'Patricia Gómez',
      'final': 'Javier López'
    };
    return rivales[ronda] || 'Oponente';
  };

  const iniciarDuelo = async () => {
    if (esSuscriptor) {
      iniciarDueloDirecto();
      return;
    }
    if (yaPagoRonda()) {
      iniciarDueloDirecto();
      return;
    }
    setMostrarModalPago(true);
  };

  const iniciarDueloDirecto = () => {
    const rival = obtenerRival(rondaActual);
    setDueloEnCurso({ ronda: rondaActual, rival });
    setMostrarDuelo(true);
    setRondaCompletada(false);
  };

  const procesarPagoRonda = async () => {
    const precioRonda = PRECIOS_RONDA[rondaActual];
    
    if (saldo < precioRonda) {
      alert(`❌ Saldo insuficiente. Necesitas $${precioRonda} MXN para competir en ${rondas[rondaActual].nombreCompleto}`);
      setMostrarModalPago(false);
      return;
    }
    
    setPagandoRonda(true);
    
    try {
      const exito = await realizarPago(precioRonda, `Pago ronda ${rondas[rondaActual].nombreCompleto} - ${torneo?.titulo}`);
      if (exito) {
        guardarPagoRonda();
        alert(`✅ Pago de $${precioRonda} MXN realizado. ¡Buena suerte!`);
        setMostrarModalPago(false);
        iniciarDueloDirecto();
      } else {
        alert('❌ Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al procesar el pago');
    } finally {
      setPagandoRonda(false);
    }
  };

  const finalizarDuelo = async (puntos, gano, puntosRival, nombreRival) => {
    setMostrarDuelo(false);
    
    if (!gano && !rondaCompletada) {
      const reingreso = await ofrecerReingreso();
      if (reingreso) return;
    }
    
    const nuevoHistorial = [...historial, {
      ronda: rondaActual,
      rival: nombreRival || obtenerRival(rondaActual),
      gano: gano,
      puntos: puntos,
      puntosRival: puntosRival,
      fecha: new Date().toISOString()
    }];
    
    if (gano) {
      const config = rondas[rondaActual];
      const siguienteRonda = config.siguiente;
      
      if (siguienteRonda === 'campeon') {
        const premioGanado = config.premio || torneo?.premioDinero || 0;
        
        const campeonData = {
          torneo: torneo,
          participante: participante,
          premio: premioGanado,
          puntos: puntos,
          puntosRival: puntosRival,
          nombreRival: nombreRival,
          fecha: new Date().toISOString()
        };
        localStorage.setItem('campeon_actual', JSON.stringify(campeonData));
        
        const updatedParticipante = { 
          ...participante, 
          fase: 'campeon', 
          premioObtenido: premioGanado,
          esCampeon: true
        };
        localStorage.setItem(participante.id, JSON.stringify(updatedParticipante));
        setParticipante(updatedParticipante);
        
        if (onDueloFinalizado) {
          onDueloFinalizado(puntos, true, puntosRival, nombreRival, true, premioGanado);
        }
        
        setTimeout(() => {
          window.location.href = '/reclamar-premio';
        }, 500);
        
        return;
      }
      
      setRondaActual(siguienteRonda);
      setHistorial(nuevoHistorial);
      guardarProgreso(siguienteRonda, nuevoHistorial, false);
      alert(`✅ ¡Victoria! Avanzas a ${rondas[siguienteRonda].nombreCompleto}`);
    } else {
      guardarProgreso(rondaActual, nuevoHistorial, true);
      alert(`❌ Has perdido. ${nombreRival || obtenerRival(rondaActual)} te ha superado.`);
      onVolver();
    }
  };

  const ofrecerReingreso = async () => {
    const precioReingreso = 10;
    return new Promise((resolve) => {
      const confirmar = window.confirm(
        `💀 Has perdido el duelo de ${rondas[rondaActual].nombreCompleto}.\n\n` +
        `¿Quieres reingresar pagando $${precioReingreso} MXN?\n` +
        `(Los reingresos te permiten seguir compitiendo en el torneo)`
      );
      if (confirmar) {
        setPagandoReingreso(true);
        realizarPago(precioReingreso, `Reingreso ${rondas[rondaActual].nombreCompleto} torneo: ${torneo.titulo}`)
          .then((exito) => {
            setPagandoReingreso(false);
            if (exito) {
              alert(`✅ Reingreso exitoso. Puedes intentar de nuevo el duelo.`);
              resolve(true);
            } else {
              alert(`❌ No se pudo procesar el pago.`);
              resolve(false);
            }
          });
      } else {
        resolve(false);
      }
    });
  };

  if (mostrarDuelo) {
    return <SalaDuelo 
      torneo={torneo}
      participante={participante}
      fase={rondaActual === 'final' ? 'final' : 'eliminatorias'}
      onCompetenciaFinalizada={finalizarDuelo}
      onVolver={() => setMostrarDuelo(false)}
    />;
  }

  if (pagandoReingreso || pagandoRonda) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Procesando pago...</p>
        </div>
      </div>
    );
  }

  const config = rondas[rondaActual];
  const premioRonda = config.premio?.toLocaleString() || 0;
  const esFinal = rondaActual === 'final';
  const precioRonda = PRECIOS_RONDA[rondaActual];
  const yaPago = esSuscriptor || yaPagoRonda();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 to-orange-700 p-6 text-white text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-2">🏆 FASE ELIMINATORIA</h2>
          <p className="text-xl md:text-2xl font-semibold text-orange-200">Ronda: {config.nombre}</p>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 rounded-2xl p-6 mb-8 text-center border-2 border-amber-300">
            <div className="text-5xl mb-3">⚔️</div>
            {esFinal ? (
              <>
                <p className="text-xl md:text-2xl font-bold text-amber-800 mb-2">¡Gana este duelo final!</p>
                <p className="text-base text-amber-700">PARA SER EL CAMPEÓN DEL TORNEO</p>
              </>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-bold text-amber-800 mb-2">¡Gana este duelo para avanzar!</p>
                <p className="text-base text-amber-700">Victoria = Avanzas a la siguiente ronda</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <p className="text-sm font-semibold text-blue-700 mb-1">💰 Costo para competir</p>
              <p className="text-2xl font-bold text-blue-600">
                {esSuscriptor ? 'GRATIS (Suscriptor)' : `$${precioRonda} MXN`}
              </p>
              {!esSuscriptor && !yaPago && (
                <p className="text-xs text-blue-500 mt-1">Pago único por esta ronda</p>
              )}
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <p className="text-sm font-semibold text-green-700 mb-1">🏆 Premio por ganar</p>
              <p className="text-2xl font-bold text-green-600">${premioRonda} MXN</p>
              <p className="text-xs text-green-500 mt-1">Se acredita al ganar el duelo</p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">⏱️</span>
                <span className="text-base font-bold">20 segundos</span>
                <span className="text-xs text-gray-500">por pregunta</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">📋</span>
                <span className="text-base font-bold">15 preguntas</span>
                <span className="text-xs text-gray-500">por duelo</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🎯</span>
                <span className="text-base font-bold">10 puntos</span>
                <span className="text-xs text-gray-500">= victoria automática</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🏆</span>
                <span className="text-base font-bold">Eliminación</span>
                <span className="text-xs text-gray-500">directa</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={iniciarDuelo}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-12 rounded-2xl text-xl md:text-2xl transition-all transform hover:scale-105 shadow-lg"
            >
              {yaPago ? '🎮 Realizar Duelo' : `💰 Pagar $${precioRonda} y competir`}
            </button>
          </div>

          {historial.filter(h => h.gano).length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Rondas Superadas
              </h3>
              <div className="space-y-3">
                {historial.filter(h => h.gano).map((h, idx) => (
                  <div key={idx} className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <p className="font-semibold text-lg">{getNombreRonda(h.ronda)}</p>
                        <p className="text-sm text-gray-600">vs {h.rival}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">🏆 Victoria</p>
                        <p className="text-sm text-gray-500">{h.puntos} - {h.puntosRival} pts</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {mostrarModalPago && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="text-5xl mb-4">💰</div>
            <h2 className="text-2xl font-bold mb-2">Pago para competir</h2>
            <p className="text-lg text-gray-600 mb-4">
              Para participar en {rondas[rondaActual].nombreCompleto} necesitas pagar
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-3xl font-bold text-blue-600">${PRECIOS_RONDA[rondaActual]} MXN</p>
              <p className="text-sm text-gray-500 mt-1">Saldo disponible: ${saldo.toLocaleString()} MXN</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMostrarModalPago(false)} className="flex-1 bg-gray-200 py-3 rounded-lg">Cancelar</button>
              <button onClick={procesarPagoRonda} className="flex-1 bg-blue-600 text-white py-3 rounded-lg">Pagar y continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eliminatorias;
