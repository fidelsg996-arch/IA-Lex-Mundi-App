// src/pages/Torneos/phases/GruposPhase.jsx
import React, { useState } from 'react';

const GruposPhase = ({ torneoActivo, usuario, onFinalizarGrupos }) => {
  const [resultados, setResultados] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [argumentosFavor, setArgumentosFavor] = useState(0);
  const [argumentosContra, setArgumentosContra] = useState(0);
  const [partidosJugados, setPartidosJugados] = useState(0);
  const [totalPartidos, setTotalPartidos] = useState(3);
  
  // Simular rivales del grupo
  const rivales = [
    { id: 1, nombre: "Dra. Derecho", avatar: "https://randomuser.me/api/portraits/women/5.jpg", especialidad: "Constitucional" },
    { id: 2, nombre: "Lic. Justicia", avatar: "https://randomuser.me/api/portraits/men/6.jpg", especialidad: "Penal" },
    { id: 3, nombre: "Dr. Legal", avatar: "https://randomuser.me/api/portraits/men/7.jpg", especialidad: "Civil" }
  ];
  
  const jugarPartido = (rival) => {
    // Simular resultado del partido
    const resultado = Math.random() > 0.5 ? "victoria" : "derrota";
    const nuevosResultados = [...resultados, { rival: rival.nombre, resultado }];
    setResultados(nuevosResultados);
    setPartidosJugados(partidosJugados + 1);
    
    if (resultado === "victoria") {
      setPuntos(puntos + 3);
      setArgumentosFavor(argumentosFavor + Math.floor(Math.random() * 10) + 1);
    } else {
      setArgumentosContra(argumentosContra + Math.floor(Math.random() * 10) + 1);
    }
  };
  
  const finalizarGrupos = () => {
    if (partidosJugados < totalPartidos) {
      alert("❌ Debes jugar todos los partidos del grupo");
      return;
    }
    
    const clasificados = puntos >= 4; // 4 puntos mínimo para clasificar
    onFinalizarGrupos(clasificados, puntos, argumentosFavor, argumentosContra);
  };
  
  const partidosRestantes = totalPartidos - partidosJugados;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
          <h1 className="text-2xl font-bold">🏆 Fase de Grupos</h1>
          <p className="opacity-90">Enfrenta a los rivales de tu grupo</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">Puntos</p>
              <p className="text-3xl font-bold text-green-600">{puntos}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">Argumentos a Favor</p>
              <p className="text-3xl font-bold text-blue-600">{argumentosFavor}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">Argumentos en Contra</p>
              <p className="text-3xl font-bold text-red-600">{argumentosContra}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">Partidos</p>
              <p className="text-3xl font-bold text-gray-600">{partidosJugados}/{totalPartidos}</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold">👥 Rivales del Grupo</h2>
            {rivales.map(rival => {
              const yaJugado = resultados.some(r => r.rival === rival.nombre);
              return (
                <div key={rival.id} className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={rival.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                    <div>
                      <p className="font-bold">{rival.nombre}</p>
                      <p className="text-sm text-gray-600">{rival.especialidad}</p>
                    </div>
                  </div>
                  {!yaJugado ? (
                    <button
                      onClick={() => jugarPartido(rival)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Jugar Partido
                    </button>
                  ) : (
                    <span className="text-green-600">
                      {resultados.find(r => r.rival === rival.nombre)?.resultado === "victoria" ? "✅ Victoria" : "❌ Derrota"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          {partidosJugados === totalPartidos && (
            <div className="bg-green-100 rounded-xl p-6 text-center">
              <p className="text-green-700 font-bold mb-4">
                {puntos >= 4 
                  ? "✅ ¡Clasificado a eliminatorias!" 
                  : "❌ No lograste clasificar. ¡Mejor suerte la próxima!"}
              </p>
              <button
                onClick={finalizarGrupos}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-700 transition"
              >
                Continuar a Eliminatorias →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GruposPhase;