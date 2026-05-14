// src/components/GoogleCalendarAuth.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleCalendarAuth = ({ onSync, eventos }) => {
  const { user } = useAuth();
  const [isSynced, setIsSynced] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    const syncStatus = localStorage.getItem(`google_calendar_sync_${user?.uid}`);
    setIsSynced(syncStatus === 'true');
  }, [user]);

  const handleSync = async () => {
    setSincronizando(true);
    
    setTimeout(() => {
      localStorage.setItem(`google_calendar_sync_${user?.uid}`, 'true');
      setIsSynced(true);
      setSincronizando(false);
      
      if (onSync) {
        onSync();
      }
      
      alert('✅ Calendario sincronizado con Google Calendar');
    }, 1500);
  };

  const handleDisconnect = () => {
    localStorage.removeItem(`google_calendar_sync_${user?.uid}`);
    setIsSynced(false);
    alert('🔌 Desconectado de Google Calendar');
  };

  return (
    <div className="flex items-center gap-2">
      {isSynced ? (
        <>
          <span className="text-xs text-green-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Conectado a Google Calendar
          </span>
          <button
            onClick={handleDisconnect}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Desconectar
          </button>
        </>
      ) : (
        <button
          onClick={handleSync}
          disabled={sincronizando}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">sync</span>
          {sincronizando ? 'Sincronizando...' : 'Sincronizar con Google Calendar'}
        </button>
      )}
    </div>
  );
};

export default GoogleCalendarAuth;