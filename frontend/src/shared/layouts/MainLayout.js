// shared/layouts/MainLayout.js
import React, { useState } from 'react';
import { authService } from '../../core/services/authService';
import './MainLayout.css';

const MainLayout = ({ children, user, onLogout, activeTab, onTabChange, menuItems }) => {
  return (
    <div className="app-dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>⚖️ IA Lex Mundi</h2>
          <p>Derecho Internacional</p>
        </div>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={activeTab === item.id ? 'active' : ''} 
              onClick={() => onTabChange(item.id)}
            >
              <span>{item.icon}</span> {item.name}
            </li>
          ))}
        </ul>
        <div className="user-info">
          <p>👋 Hola, <strong>{user?.name?.split(' ')[0] || user?.email}</strong></p>
          <button onClick={onLogout} className="logout-btn-sidebar">
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-header">
          <h1>
            {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
          </h1>
          <div className="user-welcome">
            Bienvenido, <strong>{user?.name || user?.email}</strong>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;