// src/pages/Cursos/Cursos.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Cursos = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const modoAdmin = isAdmin();
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cursos'));
      const cursosData = [];
      querySnapshot.forEach((doc) => {
        cursosData.push({ id: doc.id, ...doc.data() });
      });
      setCursos(cursosData);
    } catch (error) {
      console.error('Error cargando cursos:', error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarCurso = async (id, e) => {
    e.stopPropagation();
    if (!modoAdmin) return;
    if (window.confirm('¿Eliminar este curso?')) {
      await deleteDoc(doc(db, 'cursos', id));
      cargarCursos();
    }
  };

  const abrirCurso = (id) => {
    navigate(`/cursos/${id}`);
  };

  const nuevoCurso = () => {
    navigate('/cursos/nuevo');
  };

  if (cargando) return <div className="text-center py-20">Cargando cursos...</div>;

  return (
    <div className="px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700"></div>
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-blue-400">school</span>
              <h1 className="text-2xl font-black">Cursos Especializados</h1>
            </div>
            {modoAdmin && (
              <button onClick={nuevoCurso} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600">
                <span className="material-symbols-outlined text-sm">add</span> Nuevo Curso
              </button>
            )}
          </div>
          <p className="text-gray-200 text-sm">Formación jurídica práctica para profesionales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {cursos.map(curso => (
          <div key={curso.id} className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => abrirCurso(curso.id)}>
            <div className="h-36 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
              {curso.imagenPortada && <img src={curso.imagenPortada} alt={curso.titulo} className="w-full h-full object-cover" />}
              {!curso.imagenPortada && <div className="flex items-center justify-center h-full"><span className="material-symbols-outlined text-5xl text-blue-500">school</span></div>}
              {curso.esPremioTorneo && <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">🏆 Premio Torneo</div>}
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {curso.gratis ? 'GRATIS' : `$${parseFloat(curso.precio || 0).toFixed(2)} MXN`}
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <h2 className="text-sm font-bold text-gray-800 line-clamp-2 flex-1">{curso.titulo}</h2>
                {modoAdmin && (
                  <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate(`/cursos/${curso.id}/editar`); 
                      }} 
                      className="text-blue-500 hover:text-blue-700" 
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      onClick={(e) => eliminarCurso(curso.id, e)} 
                      className="text-red-500 hover:text-red-700" 
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{curso.descripcion}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-2">
                <span>⏱️ {curso.duracion || 'N/E'}</span>
                {/* ✅ LÍNEA CORREGIDA - AHORA USA 'modulos' (plural) */}
                <span>📚 {curso.modulos?.length || curso.modulo?.length || 0} módulos</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cursos.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl">
          <span className="material-symbols-outlined text-6xl text-gray-300">school</span>
          <p className="text-gray-500 mt-2">No hay cursos disponibles</p>
          {modoAdmin && (
            <button onClick={nuevoCurso} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
              Crear primer curso
            </button>
          )}
        </div>
      )}

      {modoAdmin && (
        <div className="fixed bottom-4 right-4 z-50 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          <span className="text-sm font-semibold">Administrador</span>
        </div>
      )}

      <style>{`.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default Cursos;