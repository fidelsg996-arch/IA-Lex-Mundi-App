import { useState, useEffect } from 'react';

const ListaTorneos = ({ modoAdmin, onSeleccionarTorneo }) => {
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('torneos_data');
    if (saved) setTorneos(JSON.parse(saved));
    else {
      const defaultTorneos = [
        { id: 1, titulo: 'Torneo de Derecho Civil', fecha: '2024-12-15', premio: 10000, premioDescripcion: 'Certificado de campeón + trofeo', inscritos: 45, maxInscritos: 128, costo: 200 },
        { id: 2, titulo: 'Torneo de Juicios Orales', fecha: '2025-01-20', premio: 15000, premioDescripcion: 'Certificado de campeón + medalla de oro', inscritos: 32, maxInscritos: 128, costo: 250 }
      ];
      setTorneos(defaultTorneos);
      localStorage.setItem('torneos_data', JSON.stringify(defaultTorneos));
    }
  }, []);

  const agregarTorneo = () => {
    const nuevo = { 
      id: Date.now(), 
      titulo: 'Nuevo Torneo', 
      fecha: new Date().toISOString().split('T')[0], 
      premio: 0,
      premioDescripcion: '',
      inscritos: 0, 
      maxInscritos: 128, 
      costo: 100 
    };
    const nuevos = [...torneos, nuevo];
    setTorneos(nuevos);
    localStorage.setItem('torneos_data', JSON.stringify(nuevos));
  };

  const eliminarTorneo = (id) => {
    if (window.confirm('¿Eliminar torneo?')) {
      const nuevos = torneos.filter(t => t.id !== id);
      setTorneos(nuevos);
      localStorage.setItem('torneos_data', JSON.stringify(nuevos));
    }
  };

  return (
    <div className="px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-700"></div>
        <img src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop" alt="Torneos" className="w-full h-32 object-cover opacity-30" />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-4xl text-red-400">emoji_events</span><h1 className="text-2xl font-black">Torneos Jurídicos</h1></div>
            {modoAdmin && <button onClick={agregarTorneo} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm">➕ Nuevo Torneo</button>}
          </div>
          <p className="text-gray-200 text-sm">Competiciones y desafíos legales</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {torneos.map(torneo => (
          <div key={torneo.id} className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSeleccionarTorneo(torneo)}>
            <div className="h-36 bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-red-500">emoji_events</span>
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg">{torneo.titulo}</h2>
              <div className="space-y-1 text-sm text-gray-500">
                <p>📅 {new Date(torneo.fecha).toLocaleDateString()}</p>
                <p>🏆 Premio: ${torneo.premio.toLocaleString()} MXN</p>
                <p>💵 Costo: ${torneo.costo} MXN</p>
                <p>👥 {torneo.inscritos}/{torneo.maxInscritos}</p>
              </div>
              {modoAdmin && <div className="flex justify-end gap-2 mt-2" onClick={(e) => e.stopPropagation()}><button className="text-blue-500 text-xs">✏️</button><button onClick={() => eliminarTorneo(torneo.id)} className="text-red-500 text-xs">🗑️</button></div>}
            </div>
          </div>
        ))}
      </div>
      {modoAdmin && <div className="fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg">👑 Administrador</div>}
    </div>
  );
};

export default ListaTorneos;