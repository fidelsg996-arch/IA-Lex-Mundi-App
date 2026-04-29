import { useState } from 'react';

const ADMIN_PASSWORD = 'admin123';

const ModalAdminLogin = ({ show, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onSuccess();
      onClose();
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Acceso Admin</h2>
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="w-full p-2 border rounded-lg mb-3"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()} 
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 p-2 border rounded-lg">Cancelar</button>
          <button onClick={handleLogin} className="flex-1 p-2 bg-amber-500 text-white rounded-lg">Entrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdminLogin;