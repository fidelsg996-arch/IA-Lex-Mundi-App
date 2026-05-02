// src/pages/Torneos/phases/EliminatoriasPhase.jsx
import React, { useState } from 'react';

const EliminatoriasPhase = ({ torneoActivo, usuario, clasificados, puntosGrupo, argumentosFavor, argumentosContra, onFinalizarTorneo }) => {
  const [etapa, setEtapa] = useState('cuartos');
  const [rivalActual, setRivalActual] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [ganador, setGanador] = useState(null);
  
  // Rivales simulados para eliminatorias
  const rivalesCuartos = [
    { id: 1, nombre: "Equipo Alpha", fuerza: 70 },
    { id: 2, nombre: "Equipo Beta", fuerza: 65 },
    { id: 3, nombre: "Equipo Gamma", fuerza: 75 },
    { id: 4, nombre: "Equipo Delta", fuerza: 60 }
  ];
  
  const jugarPartido = (rival) => {
    setRivalActual(rival);
    // Simular resultado basado en puntos y fuerza
    const fuerzaUsuario = puntosGrupo * 10 + argumentosFavor;
    const fuerzaRival = rival.fuerza * 2;
    const esVictoria = fuerzaUsuario > fuerzaRival;
    
    setTimeout(() => {
      setResultado(esVictoria ? "victoria" : "derrota");
      if (esVictoria) {
        if (etapa === 'cuartos') {
          setEtapa('semis');
          setResultado(null);
          setRivalActual(null);
        } else if (etapa === 'semis') {
          setEtapa('final');
          setResultado(null);
          setRivalActual(null);
        } else if (etapa === 'final') {
          setGanador(usuario);
          onFinalizarTorneo(usuario);
        }
      } else {
        setResultado("derrota");
        setTimeout(() => {
          alert("❌ Has sido eliminado del torneo");
          window.location.reload();
        }, 2000);
      }
    }, 2000);
  };
  
  const obtenerRival = () => {
    if (etapa === 'cuartos') return rivalesCuartos[Math.floor(Math.random() * rivalesCuartos.length)];
    if (etapa === 'semis') return { id: 5, nombre: "Equipo Épsilon", fuerza: 80 };
    if (etapa === 'final') return { id: 6, nombre: "Equipo Omega", fuerza: 90 };
    return null;
  };
  
  if (resultado === "victoria" && !rivalActual) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Avanzando a la siguiente ronda...</h2>
        </div>
      </div>
    );
  }
  
  if (resultado === "derrota") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Procesando resultado...</h2>
        </div>
      </div>
    );
  }
  
  const rival = obtenerRival();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-white">
          <h1 className="text-2xl font-bold">
            🏆 Fase de {etapa === 'cuartos' ? 'Cuartos de Final' : etapa === 'semis' ? 'Semifinal' : 'Final'}
          </h1>
          <p className="opacity-90">Enfrenta a tu rival para avanzar</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-4xl">⚖️</span>
              </div>
              <h3 className="font-bold text-xl">{usuario?.nombre || "Tú"}</h3>
              <p className="text-gray-600">Puntos: {puntosGrupo} | Argumentos: {argumentosFavor}</p>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-4xl">👨‍⚖️</span>
              </div>
              <h3 className="font-bold text-xl">{rival?.nombre}</h3>
              <p className="text-gray-600">Fuerza: {rival?.fuerza}%</p>
            </div>
          </div>
          
          <button
            onClick={() => jugarPartido(rival)}
            className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-700 transition"
          >
            ⚖️ Iniciar Duelo Judicial ⚖️
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminatoriasPhase;