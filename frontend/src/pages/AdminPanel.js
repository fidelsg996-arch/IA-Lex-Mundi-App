// src/pages/AdminPanel.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTools } from '../context/ToolsContext';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { tools, toggleTool } = useTools();
  const { getAllUsers, updateUserRole, deleteUser, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/acceso');
  };

  useEffect(() => {
    if (isAdmin()) {
      setUsers(getAllUsers());
    }
  }, [getAllUsers, isAdmin]);

  const handleRoleChange = async (email, newRole) => {
    try {
      await updateUserRole(email, newRole);
      setUsers(getAllUsers());
      setMessage(`Rol de ${email} actualizado a ${newRole}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteUser = async (email) => {
    if (window.confirm(`¿Eliminar usuario ${email}?`)) {
      try {
        await deleteUser(email);
        setUsers(getAllUsers());
        setMessage(`Usuario ${email} eliminado`);
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage(err.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-900">Panel de Administración</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}
      
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gestión de Herramientas</h2>
        <p className="text-gray-600 mb-4">Habilita o deshabilita herramientas visibles en el menú lateral.</p>
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

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gestión de Usuarios</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.email}>
                  <td className="px-6 py-4 text-sm text-gray-900">{u.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.email, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={u.email === 'admin@lexmundi.ia' && user?.email !== 'admin@lexmundi.ia'}
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(u.email)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      disabled={u.email === 'admin@lexmundi.ia'}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;