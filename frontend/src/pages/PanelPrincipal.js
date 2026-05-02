import React from 'react';
import { useNavigate } from 'react-router-dom';

const PanelPrincipal = () => {
  const navigate = useNavigate();

  const paginas = [
    { id: 1, nombre: 'Diplomados', ruta: '/diplomados', descripcion: 'Gestiona diplomados, módulos y certificaciones', imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, nombre: 'Torneos', ruta: '/torneos', descripcion: 'Participa en torneos jurídicos y duelos', imagen: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, nombre: 'Cursos', ruta: '/cursos', descripcion: 'Accede a cursos especializados en derecho', imagen: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop' },
    { id: 4, nombre: 'Mi Suscripción', ruta: '/mi-suscripcion', descripcion: 'Gestiona tu suscripción y planes', imagen: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 5, nombre: 'Libros', ruta: '/libros', descripcion: 'Biblioteca digital especializada', imagen: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop' },
    { id: 6, nombre: 'Legislación', ruta: '/legislacion', descripcion: 'Leyes, códigos y jurisprudencia', imagen: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop' },
    { id: 7, nombre: 'Billetera Electrónica', ruta: '/mi-billetera', descripcion: 'Gestiona tus pagos y transacciones', imagen: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop' },
    { id: 8, nombre: 'Expedientes', ruta: '/expedientes', descripcion: 'Gestión de expedientes judiciales', imagen: '/expedientes.jpg' },
    { id: 9, nombre: 'Calculadora Laboral', ruta: '/calculadora-laboral', descripcion: 'Cálculos de liquidaciones y finiquitos', imagen: 'https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 10, nombre: 'Cotizador Legal', ruta: '/cotizador-legal', descripcion: 'Cotización de honorarios y servicios', imagen: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop' },
    { id: 11, nombre: 'Gestor Jurídico', ruta: '/gestor-juridico', descripcion: 'Gestión de documentos y procesos', imagen: 'https://images.pexels.com/photos/48148/document-agreement-documents-sign-48148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 12, nombre: 'Guía de Trámites', ruta: '/guia-tramites', descripcion: 'Guías y procedimientos legales', imagen: 'https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 13, nombre: 'Agenda Laboral', ruta: '/agenda-laboral', descripcion: 'Calendario y plazos judiciales', imagen: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2070&auto=format&fit=crop' },
    { id: 14, nombre: 'Analizador IA', ruta: '/analisis-ia', descripcion: 'Análisis de casos con inteligencia artificial', imagen: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop' }
  ];

  return (
    <div className="px-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-800"></div>
        <div className="relative z-10 p-6 text-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-indigo-300">dashboard</span>
            <div>
              <h1 className="text-3xl font-black">IA Lex Mundi</h1>
              <p className="text-indigo-200 text-sm mt-1">Plataforma Internacional de Derecho</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-indigo-500">apps</span>
          <h2 className="text-xl font-bold text-gray-800">Módulos del Sistema</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-500 text-sm">grid_view</span>
          <span className="text-xs text-gray-600">{paginas.length} módulos disponibles</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {paginas.map((pagina) => (
          <div key={pagina.id} onClick={() => navigate(pagina.ruta)} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
            <div className="h-36 relative overflow-hidden bg-gray-100">
              <img src={pagina.imagen} alt={pagina.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{pagina.nombre}</h3>
              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{pagina.descripcion}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 mt-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">touch_app</span>
                  <span>Click para acceder</span>
                </div>
                <button className="text-indigo-600 text-xs font-medium hover:text-indigo-800 flex items-center gap-0.5">Ingresar<span className="material-symbols-outlined text-xs">arrow_forward</span></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; } .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default PanelPrincipal;