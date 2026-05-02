import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_EMAIL = 'admin@lexmundi.ia';

const Diplomados = () => {
  const { user } = useAuth();
  const [modoAdmin, setModoAdmin] = useState(false);
  const [diplomados, setDiplomados] = useState([
    { id: 1, titulo: 'Diplomado en Derecho Corporativo', descripcion: 'Especialización en derecho empresarial', duracion: '160 horas', precio: 5000 },
    { id: 2, titulo: 'Diplomado en Juicios Orales', descripcion: 'Técnicas y estrategias para juicios orales', duracion: '120 horas', precio: 4500 }
  ]);

  useEffect(() => {
    setModoAdmin(user?.email === ADMIN_EMAIL);
  }, [user]);

  const eliminarDiplomado = (id) => {
    if (window.confirm('¿Eliminar este diplomado?')) {
      setDiplomados(diplomados.filter(d => d.id !== id));
    }
  };

  return (
    <div className="px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
          alt="Diplomados" 
          className="w-full h-32 object-cover opacity-30"
        />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-purple-400">workspace_premium</span>
              <h1 className="text-2xl font-black">Diplomados</h1>
            </div>
            {modoAdmin && (
              <button className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-purple-600">
                <span className="material-symbols-outlined text-sm">add</span> Nuevo Diplomado
              </button>
            )}
          </div>
          <p className="text-gray-200 text-sm">Programas de especialización con certificación oficial</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {diplomados.map(dip => (
          <div key={dip.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-36 bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-purple-500">workspace_premium</span>
            </div>
            <div className="p-3">
              <h2 className="text-sm font-bold text-gray-800 mb-1">{dip.titulo}</h2>
              <p className="text-gray-600 text-xs mb-2 line-clamp-2">{dip.descripcion}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {dip.duracion}
                </div>
                <div className="flex items-center gap-2">
                  {modoAdmin && (
                    <>
                      <button className="text-blue-500 hover:text-blue-700" title="Editar">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => eliminarDiplomado(dip.id)} className="text-red-500 hover:text-red-700" title="Eliminar">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modoAdmin && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <div className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span className="text-sm font-semibold">Administrador</span>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Diplomados;