// src/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="relative flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="w-32"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className="text-xl font-bold tracking-tighter text-amber-600 uppercase">IA LEX MUNDI INTERNATIONAL LAW</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/registrarse" className="bg-amber-500 text-white font-bold px-6 py-2 rounded-lg transition-transform hover:scale-95 inline-block">Registrarse</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 z-10">
            <span className="text-amber-600 tracking-[0.2em] uppercase text-xs mb-4 block font-semibold">IA LEX MUNDI INTERNATIONAL LAW</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-gray-900">
              El derecho en tus <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">manos, la IA de tu lado</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-md mb-8 leading-relaxed">
              Evoluciona tu práctica legal con inteligencia artificial de grado soberano. Precisión técnica y análisis jurisprudencial instantáneo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/herramientas" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all inline-block">Probar herramientas</Link>
              <Link to="/descargar-android" className="bg-gray-100 hover:bg-gray-200 transition-colors px-8 py-4 rounded-xl border border-gray-300 flex items-center gap-2 text-gray-700 inline-block">
                <span className="material-symbols-outlined">android</span>
                Descargar Android
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -inset-4 bg-amber-500/10 blur-[100px] rounded-full"></div>
            <img alt="Legal Dashboard Interface" className="relative z-10 rounded-2xl shadow-2xl border border-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEUmAcNBJqaSTt8RLUblEmdeDlRl8xwJ9YJgyUo3GwJ_08i0nUlUZ3bCpqYDV97uVNzl-aAmMscjfdLSl5sZL_cX4THQrDSVcU6sEwM13s6ILmW19J1C4qpJRW7K0poPLdKKtj57A74TzEBkf2vop28gyYq1JohhWmfmwCXs1sHPxBKQWh81QoU8XPeCbHY5RIPjb-_N3dlh1g2v5Y4hHzRBgAE8W5hKIzZJOfUHSnSY2vp1HhFx8NXv1kC7RYU_qz_pF6Dj-bhLk"/>
          </div>
        </section>

        {/* Playground Legal - Nuevos módulos rápidos */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-2 text-gray-900">Módulos de análisis rápido</h2>
                <p className="text-amber-600 uppercase text-xs tracking-widest font-semibold">Playground Legal</p>
              </div>
              <Link to="/modulos" className="text-amber-600 text-sm font-semibold flex items-center gap-1 hover:underline">Ver todos <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Gestor Jurídico */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <span className="material-symbols-outlined">gavel</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Gestor Jurídico</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">Organiza y administra tus casos, documentos y plazos procesales.</p>
                <Link to="/gestor-juridico" className="text-amber-600 font-bold text-xs uppercase tracking-tighter group-hover:underline inline-block">Acceder →</Link>
              </div>
              {/* Guía de Trámites */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Guía de Trámites</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">Paso a paso para realizar gestiones ante organismos públicos y privados.</p>
                <Link to="/guia-tramites" className="text-amber-600 font-bold text-xs uppercase tracking-tighter group-hover:underline inline-block">Explorar →</Link>
              </div>
              {/* Cotizador Legal */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <span className="material-symbols-outlined">calculate</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Cotizador Legal</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">Calcula honorarios, costas procesales y montos de indemnización.</p>
                <Link to="/cotizador-legal" className="text-amber-600 font-bold text-xs uppercase tracking-tighter group-hover:underline inline-block">Calcular →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosistema Total - Nuevos módulos en orden solicitado */}
        <section className="py-20 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase text-gray-900">Ecosistema Total</h2>
            <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { icon: "dashboard", name: "Panel principal", link: "/panel-principal" },
              { icon: "folder_open", name: "Expedientes", link: "/expedientes" },
              { icon: "event_available", name: "Agenda laboral", link: "/agenda-laboral" },
              { icon: "calculate", name: "Calculadora laboral", link: "/calculadora-laboral" },
              { icon: "attach_money", name: "Cotizador legal", link: "/cotizador-legal" },
              { icon: "analytics", name: "Análisis IA", link: "/analisis-ia" },
              { icon: "gavel", name: "Gestor jurídico", link: "/gestor-juridico" },
              { icon: "menu_book", name: "Guía de trámites", link: "/guia-tramites" },
              { icon: "balance", name: "Legislación", link: "/legislacion" },
              { icon: "quiz", name: "Quiz legal", link: "/quiz-legal" },
              { icon: "library_books", name: "Libros", link: "/libros" },
              { icon: "school", name: "Cursos", link: "/cursos" },
              { icon: "workspace_premium", name: "Diplomados", link: "/diplomados" },
              { icon: "sports_motorsports", name: "Torneos", link: "/torneos" }
            ].map((modulo, idx) => (
              <Link key={idx} to={modulo.link} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all text-center group">
                <span className="material-symbols-outlined text-amber-500 text-3xl mb-2 group-hover:scale-110 transition-transform">{modulo.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{modulo.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Planes de Acceso (sin cambios) */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-gray-900">Planes de Acceso</h2>
              <p className="text-amber-600 uppercase text-xs tracking-widest font-semibold">Inversión en excelencia jurídica</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Plan Estudiante */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <span className="text-amber-600 font-bold text-xs uppercase mb-2">Academia</span>
                <h3 className="text-2xl font-bold mb-1 text-gray-900">Estudiante</h3>
                <div className="text-5xl font-black mb-6 text-gray-900">$0 <span className="text-base font-normal text-gray-500">/siempre</span></div>
                <ul className="space-y-3 mb-8 flex-grow text-gray-600">
                  <li className="flex items-center gap-2">✓ 5 Consultas mensuales</li>
                  <li className="flex items-center gap-2">✓ Acceso a Normativa</li>
                  <li className="flex items-center gap-2 text-gray-400">✗ Análisis de Contratos</li>
                </ul>
                <Link to="/suscripcion/free" className="w-full py-3 border border-gray-300 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors text-gray-700">Suscribirse Free</Link>
              </div>
              {/* Plan Pro */}
              <div className="bg-white p-8 rounded-2xl border-2 border-amber-500 shadow-lg flex flex-col relative scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-bold text-[10px] uppercase px-4 py-1 rounded-full tracking-widest">Recomendado</div>
                <span className="text-amber-600 font-bold text-xs uppercase mb-2">Profesional</span>
                <h3 className="text-2xl font-bold mb-1 text-gray-900">Abogado Pro</h3>
                <div className="text-5xl font-black mb-6 text-gray-900">$9.99 <span className="text-base font-normal text-gray-500">/mes</span></div>
                <ul className="space-y-3 mb-8 flex-grow text-gray-600">
                  <li>✓ Consultas Ilimitadas</li>
                  <li>✓ Analizador de Contratos</li>
                  <li>✓ Detector de Demanda</li>
                  <li>✓ Soporte Prioritario</li>
                </ul>
                <Link to="/suscripcion/pro" className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-lg shadow-md text-center">Suscribirse Pro</Link>
              </div>
              {/* Plan Premium */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <span className="text-amber-600 font-bold text-xs uppercase mb-2">Corporativo</span>
                <h3 className="text-2xl font-bold mb-1 text-gray-900">Bufete Premium</h3>
                <div className="text-5xl font-black mb-6 text-gray-900">$29.99 <span className="text-base font-normal text-gray-500">/mes</span></div>
                <ul className="space-y-3 mb-8 flex-grow text-gray-600">
                  <li>✓ Hasta 10 Usuarios</li>
                  <li>✓ Dashboard de Gestión</li>
                  <li>✓ API Legal Directa</li>
                  <li>✓ Firma Digital Ilimitada</li>
                </ul>
                <Link to="/suscripcion/premium" className="w-full py-3 border border-gray-300 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors text-gray-700">Suscribirse Premium</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Enlaces jurídicos estándar */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-wider text-gray-500">
          <div>© 2025 IA LEX MUNDI INTERNATIONAL LAW. TODOS LOS DERECHOS RESERVADOS.</div>
          <div className="flex gap-8 flex-wrap justify-center">
            <Link to="/aviso-legal" className="hover:text-amber-600 transition">Aviso Legal</Link>
            <Link to="/politica-privacidad" className="hover:text-amber-600 transition">Política de Privacidad</Link>
            <Link to="/terminos-uso" className="hover:text-amber-600 transition">Términos de Uso</Link>
            <Link to="/contacto" className="hover:text-amber-600 transition">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;