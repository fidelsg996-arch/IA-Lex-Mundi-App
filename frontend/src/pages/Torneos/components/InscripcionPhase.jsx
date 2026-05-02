import React from 'react';

const InscripcionPhase = ({ torneoActivo, onPagar, onRegresar, participanteInfo }) => {
  const costo = torneoActivo?.costoInscripcion || 10;
  const premio = torneoActivo?.premio?.monto || 0;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">💰 Inscripción al Torneo</h1>
          <p className="opacity-90 mt-1">Confirma tu participación</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img src={participanteInfo?.avatar} className="w-16 h-16 rounded-full object-cover" alt="" />
            <div>
              <p className="font-bold text-lg">{participanteInfo?.nombre}</p>
              <p className="text-sm text-gray-600">{participanteInfo?.especialidad}</p>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span>Costo de inscripción:</span>
              <span className="font-bold text-xl">${costo} MXN</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Premio del torneo:</span>
              <span className="font-bold text-green-600">${premio} MXN</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onRegresar}
              className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Regresar
            </button>
            <button
              onClick={onPagar}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Pagar e Inscribirme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscripcionPhase;