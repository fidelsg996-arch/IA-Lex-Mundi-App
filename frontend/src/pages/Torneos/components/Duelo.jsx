// src/pages/Torneos/components/Duelo.jsx
import React, { useState, useEffect } from 'react';

const Duelo = ({ preguntas, onFinalizar, rival, usuario, preguntasPorDuelo = 10 }) => {
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respondio, setRespondio] = useState(false);
  const [tiempo, setTiempo] = useState(30);
  const [finalizado, setFinalizado] = useState(false);
  const [modoMuerteSubita, setModoMuerteSubita] = useState(false);
  const [preguntasDuelo, setPreguntasDuelo] = useState([]);
  
  useEffect(() => {
    if (preguntas && preguntas.length > 0) {
      const shuffled = [...preguntas].sort(() => 0.5 - Math.random());
      setPreguntasDuelo(shuffled.slice(0, preguntasPorDuelo));
    }
  }, [preguntas, preguntasPorDuelo]);
  
  useEffect(() => {
    if (tiempo > 0 && !respondio && !finalizado && preguntasDuelo.length > 0) {
      const timer = setTimeout(() => setTiempo(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tiempo === 0 && !respondio && !finalizado) {
      if (modoMuerteSubita) {
        alert("⏰ Tiempo agotado. ¡Has perdido!");
        setFinalizado(true);
        setTimeout(() => onFinalizar(false, puntuacion), 500);
      } else {
        responder(null);
      }
    }
  }, [tiempo, respondio, preguntasDuelo]);
  
  const responder = (seleccion) => {
    if (respondio || finalizado || preguntaIndex >= preguntasDuelo.length) return;
    const pregunta = preguntasDuelo[preguntaIndex];
    if (!pregunta) return;
    const esCorrecta = seleccion === pregunta.correcta;
    
    if (modoMuerteSubita) {
      if (!esCorrecta) {
        alert("❌ ¡Has fallado! Has perdido el duelo.");
        setFinalizado(true);
        setTimeout(() => onFinalizar(false, puntuacion), 500);
      } else {
        setRespondio(true);
        setTimeout(() => {
          const rivalAcierta = Math.random() > 0.4;
          if (!rivalAcierta) {
            alert("🎉 ¡El rival ha fallado! ¡Has ganado!");
            setFinalizado(true);
            setTimeout(() => onFinalizar(true, puntuacion), 500);
          } else {
            setRespondio(false);
            setTiempo(30);
          }
        }, 1000);
      }
      return;
    }
    
    if (esCorrecta) setPuntuacion(prev => prev + 10);
    setRespondio(true);
    
    setTimeout(() => {
      if (preguntaIndex + 1 < preguntasDuelo.length) {
        setPreguntaIndex(prev => prev + 1);
        setRespondio(false);
        setTiempo(30);
      } else {
        if (puntuacion === 0 && !modoMuerteSubita) {
          alert("⚖️ ¡EMPATE! Muerte súbita. El primero que falle pierde.");
          setModoMuerteSubita(true);
          setRespondio(false);
          setTiempo(30);
          setPreguntaIndex(0);
        } else {
          setFinalizado(true);
          setTimeout(() => onFinalizar(puntuacion > 0, puntuacion), 500);
        }
      }
    }, 1000);
  };
  
  if (preguntasDuelo.length === 0) return <div className="text-center py-20">Cargando preguntas...</div>;
  
  if (finalizado) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl">⚖️ Duelo Finalizado ⚖️</p>
        <p className="text-xl mt-4">Tu puntuación: {puntuacion}</p>
        <p className={`text-2xl mt-4 ${puntuacion > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {puntuacion > 0 ? "🎉 ¡Fallo a tu favor!" : "😔 Fallo en contra"}
        </p>
      </div>
    );
  }
  
  const pregunta = preguntasDuelo[preguntaIndex];
  if (!pregunta) return <div className="text-center py-20">Cargando pregunta...</div>;
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex justify-between">
            <span>{modoMuerteSubita ? '⚔️ MUERTE SÚBITA ⚔️' : `Pregunta ${preguntaIndex + 1}/${preguntasDuelo.length}`}</span>
            <span>⏱️ {tiempo}s</span>
          </div>
          {modoMuerteSubita && (
            <p className="text-sm mt-1">El primero que falle pierde</p>
          )}
          <div className="w-full bg-white/30 rounded-full h-2 mt-2">
            <div className="bg-green-400 h-2 rounded-full transition-all" style={{ width: `${(tiempo / 30) * 100}%` }}></div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">⚖️</div>
              <p className="font-bold mt-2">{usuario?.nombre || "Tú"}</p>
              <p className="text-xl font-bold text-blue-600">{puntuacion}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">📜</div>
              <p className="font-bold mt-2">{rival?.usuarioNombre || "Rival"}</p>
              <p className="text-xl font-bold text-red-600">0</p>
            </div>
          </div>
          <h3 className="text-xl font-bold text-center mb-6">{pregunta.texto}</h3>
          <div className="space-y-3">
            {pregunta.opciones?.map((op, idx) => (
              <button
                key={idx}
                onClick={() => responder(idx)}
                disabled={respondio}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                {op}
              </button>
            ))}
          </div>
          {modoMuerteSubita && (
            <p className="text-center text-sm text-red-500 mt-4 font-bold">
              ⚠️ ¡CUIDADO! Un error significa la derrota inmediata
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Duelo;