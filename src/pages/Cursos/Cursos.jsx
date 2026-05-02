import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_EMAIL = 'admin@lexmundi.ia';

const Cursos = () => {
  const { user } = useAuth();
  const [modoAdmin, setModoAdmin] = useState(false);
  const [cursos, setCursos] = useState([
    { id: 1, titulo: 'Derecho Civil', descripcion: 'Curso completo de Derecho Civil', duracion: '40 horas', nivel: 'Intermedio', precio: 1500, gratis: false },
    { id: 2, titulo: 'Derecho Penal', descripcion: 'Fundamentos del Derecho Penal', duracion: '35 horas', nivel: 'Básico', precio: 1200, gratis: false },
    { id: 3, titulo: 'Derecho Laboral', descripcion: 'Especialización en Derecho Laboral', duracion: '50 horas', nivel: 'Avanzado', precio: 1800, gratis: false }
  ]);

  useEffect(() => {
    setModoAdmin(user?.email === ADMIN_EMAIL);
  }, [user]);

  const eliminarCurso = (id) => {
    if (window.confirm('¿Eliminar este curso?')) {
      setCursos(cursos.filter(c => c.id !== id));
    }
  };

  return (
    <div className="px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
          alt="Cursos" 
          className="w-full h-32 object-cover opacity-30"
        />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-blue-400">school</span>
              <h1 className="text-2xl font-black">Cursos Especializados</h1>
            </div>
            {modoAdmin && (
              <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600">
                <span className="material-symbols-outlined text-sm">add</span> Nuevo Curso
              </button>
            )}
          </div>
          <p className="text-gray-200 text-sm">Formación jurídica práctica para profesionales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {cursos.map(curso => (
          <div key={curso.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-36 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-blue-500">school</span>
            </div>
            <div className="p-3">
              <h2 className="text-sm font-bold text-gray-800 mb-1">{curso.titulo}</h2>
              <p className="text-gray-600 text-xs mb-2 line-clamp-2">{curso.descripcion}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {curso.duracion}
                </div>
                <div className="flex items-center gap-2">
                  {modoAdmin && (
                    <>
                      <button className="text-blue-500 hover:text-blue-700" title="Editar">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => eliminarCurso(curso.id)} className="text-red-500 hover:text-red-700" title="Eliminar">
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

export default Cursos;