// components/AIAssistant.js - Asistente IA para modificar la app
import React, { useState } from 'react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const executeCommand = async () => {
    if (!command.trim()) return;
    
    setLoading(true);
    setHistory(prev => [...prev, { type: 'user', text: command, time: new Date() }]);
    
    try {
      const res = await fetch('http://localhost:3002/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      const data = await res.json();
      setResponse(data);
      setHistory(prev => [...prev, { type: 'ai', text: data.message, data: data, time: new Date() }]);
      
      if (data.success) {
        // Preguntar si quiere reconstruir
        if (window.confirm('✅ Cambios aplicados. ¿Reconstruir el proyecto ahora?')) {
          await fetch('http://localhost:3002/api/rebuild', { method: 'POST' });
          alert('🔄 Proyecto reconstruido. Recarga la página.');
        }
      }
    } catch (err) {
      setHistory(prev => [...prev, { type: 'ai', text: 'Error: ' + err.message, time: new Date() }]);
    } finally {
      setLoading(false);
      setCommand('');
    }
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h3>🤖 Asistente IA para Desarrollo</h3>
        <p>Escribe comandos para modificar tu app automáticamente</p>
      </div>
      
      <div className="ai-history">
        {history.map((item, idx) => (
          <div key={idx} className={`message ${item.type}`}>
            <div className="message-header">
              <strong>{item.type === 'user' ? '👤 Tú' : '🤖 IA'}</strong>
              <small>{item.time.toLocaleTimeString()}</small>
            </div>
            <div className="message-text">{item.text}</div>
            {item.data?.files && (
              <div className="message-files">
                Archivos modificados: {item.data.files.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="ai-input">
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Ejemplos de comandos:
• Crear modulo contratos
• Agregar campo telefono de tipo text en modulo expedientes
• Agregar columna prioridad para expedientes
• Crear endpoint clientes
• Agregar modulo facturas al menu como Facturación"
          rows={4}
        />
        <button onClick={executeCommand} disabled={loading}>
          {loading ? 'Ejecutando...' : '🚀 Ejecutar Comando'}
        </button>
      </div>
      
      <div className="ai-help">
        <h4>📋 Comandos disponibles:</h4>
        <ul>
          <li><code>Crear modulo [nombre]</code> - Crea un módulo completo</li>
          <li><code>Agregar campo [nombre] de tipo [text|number|date] en modulo [modulo]</code></li>
          <li><code>Agregar columna [nombre] para [modulo]</code></li>
          <li><code>Crear endpoint [nombre]</code> - Crea API en backend</li>
          <li><code>Agregar modulo [nombre] al menu como [nombre_mostrar]</code></li>
        </ul>
      </div>
    </div>
  );
};

export default AIAssistant;