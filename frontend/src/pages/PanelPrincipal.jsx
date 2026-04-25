import React from 'react';
import { useNavigate } from 'react-router-dom';

const PanelPrincipal = () => {
  const navigate = useNavigate();

  const paginas = [
    { 
      id: 1,
      nombre: 'Diplomados', 
      ruta: '/diplomados', 
      icono: '🎓', 
      descripcion: 'Gestiona diplomados, módulos y certificaciones',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 2,
      nombre: 'Torneos', 
      ruta: '/torneos', 
      icono: '🏆', 
      descripcion: 'Participa en torneos jurídicos y duelos',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      id: 3,
      nombre: 'Litigantes', 
      ruta: '/litigantes', 
      icono: '⚖️', 
      descripcion: 'Administra litigantes y estadísticas',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 4,
      nombre: 'Perfil', 
      ruta: '/perfil', 
      icono: '👤', 
      descripcion: 'Configuración de cuenta y preferencias',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 5,
      nombre: 'Dashboard', 
      ruta: '/dashboard', 
      icono: '📊', 
      descripcion: 'Estadísticas y métricas generales',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      id: 6,
      nombre: 'Configuración', 
      ruta: '/configuracion', 
      icono: '⚙️', 
      descripcion: 'Ajustes del sistema',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">IA Lex Mundi</h1>
          <p className="text-indigo-100 mt-1">Plataforma Internacional de Derecho</p>
        </div>
      </div>

      {/* Grid de páginas */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Módulos del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginas.map((pagina) => (
            <div
              key={pagina.id}
              onClick={() => navigate(pagina.ruta)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden group"
            >
              <div className={`bg-gradient-to-r ${pagina.color} p-4`}>
                <div className="text-5xl mb-2">{pagina.icono}</div>
                <h3 className="text-xl font-bold text-white">{pagina.nombre}</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">{pagina.descripcion}</p>
                <div className="mt-4 text-indigo-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Acceder
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="text-2xl font-bold text-indigo-600">12</div>
            <div className="text-sm text-gray-500">Diplomados Activos</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="text-2xl font-bold text-indigo-600">3</div>
            <div className="text-sm text-gray-500">Torneos en Curso</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="text-2xl font-bold text-indigo-600">48</div>
            <div className="text-sm text-gray-500">Litigantes Registrados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelPrincipal;
