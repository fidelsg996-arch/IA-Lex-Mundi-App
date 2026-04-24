import React, { createContext, useState, useContext, useEffect } from 'react';

const ToolsContext = createContext();

export const useTools = () => useContext(ToolsContext);

const ALL_TOOLS = [
  { id: 'panel-principal', name: 'Panel principal', icon: 'dashboard', path: '/panel-principal', defaultEnabled: true },
  { id: 'expedientes', name: 'Expedientes', icon: 'folder_open', path: '/expedientes', defaultEnabled: true },
  { id: 'agenda-laboral', name: 'Agenda laboral', icon: 'event_available', path: '/agenda-laboral', defaultEnabled: true },
  { id: 'calculadora-laboral', name: 'Calculadora laboral', icon: 'calculate', path: '/calculadora-laboral', defaultEnabled: true },
  { id: 'cotizador-legal', name: 'Cotizador legal', icon: 'attach_money', path: '/cotizador-legal', defaultEnabled: true },
  { id: 'analisis-ia', name: 'Análisis IA', icon: 'analytics', path: '/analisis-ia', defaultEnabled: true },
  { id: 'gestor-juridico', name: 'Gestor jurídico', icon: 'gavel', path: '/gestor-juridico', defaultEnabled: true },
  { id: 'guia-tramites', name: 'Guía de trámites', icon: 'menu_book', path: '/guia-tramites', defaultEnabled: true },
  { id: 'legislacion', name: 'Legislación', icon: 'balance', path: '/legislacion', defaultEnabled: true },
  { id: 'quiz-legal', name: 'Quiz legal', icon: 'quiz', path: '/quiz-legal', defaultEnabled: true },
  { id: 'libros', name: 'Libros', icon: 'library_books', path: '/libros', defaultEnabled: true },
  { id: 'cursos', name: 'Cursos', icon: 'school', path: '/cursos', defaultEnabled: true },
  { id: 'diplomados', name: 'Diplomados', icon: 'workspace_premium', path: '/diplomados', defaultEnabled: true },
  { id: 'torneos', name: 'Torneos', icon: 'emoji_events', path: '/torneos', defaultEnabled: true },
  // NUEVAS HERRAMIENTAS
  { id: 'mi-suscripcion', name: 'Mi Suscripción', icon: 'card_membership', path: '/mi-suscripcion', defaultEnabled: true },
  { id: 'mi-billetera', name: 'Mi Billetera', icon: 'account_balance_wallet', path: '/mi-billetera', defaultEnabled: true },
];

export const ToolsProvider = ({ children }) => {
  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('lexmindi_tools');
    if (saved) {
      return JSON.parse(saved);
    }
    return ALL_TOOLS;
  });

  useEffect(() => {
    localStorage.setItem('lexmindi_tools', JSON.stringify(tools));
  }, [tools]);

  const toggleTool = (toolId, enabled) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, enabled } : tool
    ));
  };

  const getEnabledTools = () => tools.filter(tool => tool.enabled !== false);

  return (
    <ToolsContext.Provider value={{ tools, toggleTool, getEnabledTools, ALL_TOOLS }}>
      {children}
    </ToolsContext.Provider>
  );
};