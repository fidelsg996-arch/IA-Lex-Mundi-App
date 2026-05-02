import { useState } from 'react';

const SolicitarRetiro = ({ monto, onClose }) => {
  const [clabe, setClabe] = useState('');

  const enviarSolicitud = () => {
    // Guardar en Firestore
    alert(`Solicitud enviada. Recibirás ${monto} MXN en 5-10 días hábiles.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-md">
        <h2 className="text-xl font-bold mb-4">Retirar ${monto} MXN</h2>
        <input
          type="text"
          placeholder="CLABE interbancaria (18 dígitos)"
          className="border p-2 rounded w-full mb-4"
          value={clabe}
          onChange={(e) => setClabe(e.target.value)}
        />
        <button onClick={enviarSolicitud} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Solicitar retiro
        </button>
      </div>
    </div>
  );
};