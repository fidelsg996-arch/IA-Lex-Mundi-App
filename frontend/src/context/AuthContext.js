// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const USERS_STORAGE_KEY = 'lexmindi_users';
const CURRENT_USER_KEY = 'lexmindi_current_user';

const DEFAULT_ADMIN = {
  email: 'admin@lexmundi.ia',
  password: 'admin',
  role: 'admin',
  name: 'Administrador',
  plan: 'free',           // ← NUEVO
  createdAt: new Date().toISOString()
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUsers = () => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return [DEFAULT_ADMIN];
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const register = (email, password, name, role = 'user') => {
    const users = getUsers();
    if (users.find(u => u.email === email)) throw new Error('Ya existe un usuario con ese correo');
    const newUser = {
      email,
      password,
      name,
      role,
      plan: 'free',        // ← NUEVO
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return true;
  };

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Credenciales incorrectas');
    const { password: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const getAllUsers = () => getUsers().map(({ password, ...rest }) => rest);
  const updateUserRole = (email, newRole) => {
    const users = getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index === -1) throw new Error('Usuario no encontrado');
    users[index].role = newRole;
    saveUsers(users);
    if (user && user.email === email) {
      setUser({ ...user, role: newRole });
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...user, role: newRole }));
    }
    return true;
  };

  const deleteUser = (email) => {
    if (email === 'admin@lexmundi.ia') throw new Error('No se puede eliminar al administrador principal');
    let users = getUsers();
    users = users.filter(u => u.email !== email);
    saveUsers(users);
    if (user && user.email === email) logout();
    return true;
  };

  // NUEVO: actualizar el plan del usuario actual
  const updateUserPlan = (newPlan) => {
    if (!user) return false;
    const users = getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index === -1) return false;
    users[index].plan = newPlan;
    saveUsers(users);
    const updatedUser = { ...user, plan: newPlan };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return true;
  };

  const isAdmin = () => user?.role === 'admin';

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAdmin,
      loading,
      getAllUsers,
      updateUserRole,
      deleteUser,
      updateUserPlan,    // ← EXPORTAR
    }}>
      {children}
    </AuthContext.Provider>
  );
};