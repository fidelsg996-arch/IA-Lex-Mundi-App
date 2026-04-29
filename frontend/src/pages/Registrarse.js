// src/pages/Registrarse.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Registrarse = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/panel-principal');
    } catch (err) {
      setError('Error al registrar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Registrarse</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre completo" className="w-full p-3 border rounded-lg mb-3" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-3" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" className="w-full p-3 border rounded-lg mb-3" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmar contraseña" className="w-full p-3 border rounded-lg mb-4" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-amber-500 text-white p-3 rounded-lg font-semibold hover:bg-amber-600">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="text-center mt-4">¿Ya tienes cuenta? <Link to="/acceso" className="text-amber-500">Inicia sesión</Link></p>
      </div>
    </div>
  );
};
export default Registrarse;