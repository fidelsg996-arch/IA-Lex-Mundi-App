// src/Layout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTools } from './context/ToolsContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { getEnabledTools } = useTools();
  const navigate = useNavigate();
  const enabledTools = getEnabledTools();

  const handleLogout = () => {
    logout();
    navigate('/acceso');
  };

  const renderMenuItem = (tool, index) => {
    if (index === 5) {
      return (
        <div key="sep1" className="mt-6 mb-2">
          <div className="text-center text-xs font-bold text-amber-400 uppercase tracking-wider">— HERRAMIENTAS IA —</div>
          <div className="border-t border-white/10 my-2"></div>
        </div>
      );
    }
    if (index === 9) {
      return (
        <div key="sep2" className="mt-6 mb-2">
          <div className="text-center text-xs font-bold text-amber-400 uppercase tracking-wider">— FORMACIÓN —</div>
          <div className="border-t border-white/10 my-2"></div>
        </div>
      );
    }
    return (
      <Link
        key={tool.id}
        to={tool.path}
        className="flex items-center gap-3 px-4 py-2 text-base md:text-lg text-gray-200 hover:bg-slate-700 rounded-lg transition-colors"
        onClick={() => setSidebarOpen(false)}
      >
        <span className="material-symbols-outlined text-2xl text-amber-400">{tool.icon}</span>
        <span className="font-medium">{tool.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-30 w-72 lg:w-80 min-h-screen bg-slate-800 text-white shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
      `}>
        <div className="p-4 lg:p-5 border-b border-white/10 text-center">
          <h2 className="text-xl lg:text-2xl font-bold text-amber-400">IA Lex Mundi</h2>
          <p className="text-xs lg:text-sm text-gray-300">International Law</p>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {enabledTools.map((tool, idx) => renderMenuItem(tool, idx))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-300 truncate max-w-[150px]">{user?.email}</span>
            {isAdmin() && <span className="text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-400">Admin</span>}
          </div>
          <div className="mb-2">
            <span className="text-xs text-gray-300">Plan: </span>
            <span className="text-xs font-semibold text-yellow-400 uppercase">{user?.plan || 'free'}</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-300 hover:text-red-200 w-full text-left">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Botón para abrir menú en móvil */}
        <div className="lg:hidden fixed top-4 left-4 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-slate-800 text-white p-2 rounded-lg shadow-lg"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <main className="p-3 md:p-4 lg:p-6 flex-1 pt-16 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;