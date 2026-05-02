// src/pages/AdminPanel.js
import { useTools } from '../context/ToolsContext';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { tools, toggleTool } = useTools();
  const { logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-900">Panel de Administración</h1>
        <button 
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
      <p className="text-gray-600 mb-8">Aquí puedes habilitar o deshabilitar las herramientas del ecosistema. Los cambios se guardan automáticamente.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => (
          <div key={tool.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500">{tool.icon}</span>
              <span className="font-medium text-gray-800">{tool.name}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={tool.enabled !== false}
                onChange={(e) => toggleTool(tool.id, e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;