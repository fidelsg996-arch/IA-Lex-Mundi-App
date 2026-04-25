import React from 'react';
import { useNavigate } from 'react-router-dom';

const PanelPrincipal = () => {
  const navigate = useNavigate();

  const paginas = [
    { id: 1, nombre: 'Diplomados', ruta: '/diplomados', icono: '🎓', descripcion: 'Gestiona diplomados, módulos y certificaciones', color: 'from-blue-500 to-blue-600' },
    { id: 2, nombre: 'Torneos', ruta: '/torneos', icono: '🏆', descripcion: 'Participa en torneos jurídicos y duelos', color: 'from-yellow-500 to-yellow-600' },
    { id: 3, nombre: 'Cursos', ruta: '/cursos', icono: '📚', descripcion: 'Accede a cursos especializados en derecho', color: 'from-green-500 to-green-600' },
    { id: 4, nombre: 'Mi Suscripción', ruta: '/mi-suscripcion', icono: '💳', descripcion: 'Gestiona tu suscripción y planes', color: 'from-purple-500 to-purple-600' },
    { id: 5, nombre: 'Libros', ruta: '/libros', icono: '📖', descripcion: 'Biblioteca digital especializada', color: 'from-red-500 to-red-600' },
    { id: 6, nombre: 'Legislación', ruta: '/legislacion', icono: '⚖️', descripcion: 'Leyes, códigos y jurisprudencia', color: 'from-indigo-500 to-indigo-600' },
    { id: 7, nombre: 'Billetera Electrónica', ruta: '/mi-billetera', icono: '💳', descripcion: 'Gestiona tus pagos y transacciones', color: 'from-teal-500 to-teal-600' },
    { id: 8, nombre: 'Expedientes', ruta: '/expedientes', icono: '📁', descripcion: 'Gestión de expedientes judiciales', color: 'from-orange-500 to-orange-600' },
    { id: 9, nombre: 'Calculadora Laboral', ruta: '/calculadora-laboral', icono: '🧮', descripcion: 'Cálculos de liquidaciones y finiquitos', color: 'from-emerald-500 to-emerald-600' },
    { id: 10, nombre: 'Cotizador Legal', ruta: '/cotizador-legal', icono: '💰', descripcion: 'Cotización de honorarios y servicios', color: 'from-teal-500 to-teal-600' },
    { id: 11, nombre: 'Gestor Jurídico', ruta: '/gestor-juridico', icono: '📋', descripcion: 'Gestión de documentos y procesos', color: 'from-cyan-500 to-cyan-600' },
    { id: 12, nombre: 'Guía de Trámites', ruta: '/guia-tramites', icono: '📖', descripcion: 'Guías y procedimientos legales', color: 'from-pink-500 to-pink-600' },
    { id: 13, nombre: 'Agenda Laboral', ruta: '/agenda-laboral', icono: '📅', descripcion: 'Calendario y plazos judiciales', color: 'from-violet-500 to-violet-600' },
    { id: 14, nombre: 'Analizador IA', ruta: '/analizador-ia', icono: '🤖', descripcion: 'Análisis de casos con inteligencia artificial', color: 'from-rose-500 to-rose-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">IA Lex Mundi</h1>
          <p className="text-indigo-100 mt-1">Plataforma Internacional de Derecho</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Módulos del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginas.map((pagina) => (
            <div
              key={pagina.id}
              onClick={() => navigate(pagina.ruta)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${pagina.color} p-4`}>
                <div className="text-5xl mb-2">{pagina.icono}</div>
                <h3 className="text-xl font-bold text-white">{pagina.nombre}</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">{pagina.descripcion}</p>
                <div className="mt-4 text-indigo-500 text-sm font-semibold flex items-center gap-1">
                  Acceder →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanelPrincipal;
