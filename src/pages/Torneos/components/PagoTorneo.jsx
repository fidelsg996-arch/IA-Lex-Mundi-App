import { useState } from 'react';

const PagoTorneo = ({ torneo, participante, onPagoExitoso, onVolver }) => {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: '',
    metodo: 'tarjeta'
  });
  const [codigoOxxo, setCodigoOxxo] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Validación SIMPLE: solo 16 dígitos
  const validarNumero = (num) => {
    const numeroLimpio = num.replace(/\s/g, '');
    if (numeroLimpio.length !== 16) return false;
    if (!/^\d+$/.test(numeroLimpio)) return false;
    return true;
  };

  // Validación SIMPLE: solo formato MM/AA (cualquier número)
  const validarExpiracion = (exp) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
    return true;
  };

  const formatearNumero = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatearExpiracion = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const generarCodigoOxxo = () => {
    const codigo = Math.random().toString(36).substring(2, 15).toUpperCase();
    setCodigoOxxo(codigo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.metodo === 'oxxo') {
      if (!codigoOxxo) {
        setError('Primero genera el código de pago');
        return;
      }
      setPaso(2);
      setProcesando(true);
      setTimeout(() => {
        setProcesando(false);
        setPaso(3);
      }, 2000);
      return;
    }

    if (!formData.nombre.trim()) {
      setError('Nombre en la tarjeta es obligatorio');
      return;
    }
    if (!validarNumero(formData.numero)) {
      setError('La tarjeta debe tener 16 dígitos');
      return;
    }
    if (!validarExpiracion(formData.expiracion)) {
      setError('Formato inválido. Use MM/AA (ejemplo: 12/28)');
      return;
    }
    if (!formData.cvv.trim() || formData.cvv.length < 3 || !/^\d+$/.test(formData.cvv)) {
      setError('CVV debe tener 3 o 4 dígitos');
      return;
    }

    setPaso(2);
    setProcesando(true);
    setTimeout(() => {
      setProcesando(false);
      setPaso(3);
    }, 2500);
  };

  const confirmarPago = () => {
    alert(`✅ Pago de $${torneo.costo} MXN confirmado. ¡Bienvenido al torneo!`);
    onPagoExitoso();
  };

  if (paso === 2) {
    return (
      <div className="px-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Procesando pago</h2>
          <p className="text-gray-500">No cierres esta ventana</p>
          <p className="text-sm text-gray-400 mt-4">{formData.metodo === 'oxxo' ? 'Verificando pago en OXXO...' : 'Verificando datos de la tarjeta...'}</p>
        </div>
      </div>
    );
  }

  if (paso === 3) {
    return (
      <div className="px-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">Pago aprobado</h2>
          <p className="text-gray-600 mb-4">Tu inscripción ha sido confirmada</p>
          <div className="bg-green-50 rounded-lg p-3 mb-6">
            <p className="text-sm font-bold text-green-800">${torneo.costo} MXN</p>
            <p className="text-xs text-green-600">Transacción: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>
          <button onClick={confirmarPago} className="w-full bg-green-500 text-white py-2 rounded-lg font-bold">Continuar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <button onClick={onVolver} className="text-gray-500 mb-4 hover:text-gray-700">← Volver</button>
        <h1 className="text-2xl font-bold mb-4">Pago de inscripción</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Torneo</span>
            <span className="font-medium">{torneo.titulo}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Participante</span>
            <span className="font-medium">{participante.nombre}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-2xl font-bold text-red-600 float-right">${torneo.costo} MXN</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-2">
            <button 
              type="button" 
              onClick={() => {
                setFormData({...formData, metodo: 'tarjeta'});
                setError('');
              }} 
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${formData.metodo === 'tarjeta' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              💳 Tarjeta
            </button>
            <button 
              type="button" 
              onClick={() => {
                setFormData({...formData, metodo: 'oxxo'});
                setCodigoOxxo('');
                setError('');
              }} 
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${formData.metodo === 'oxxo' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              🏪 OXXO
            </button>
          </div>

          {formData.metodo === 'tarjeta' ? (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Nombre del titular</label>
                <input 
                  type="text" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value.toUpperCase()})} 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="COMO APARECE EN LA TARJETA" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Número de tarjeta</label>
                <input 
                  type="text" 
                  value={formData.numero} 
                  onChange={(e) => setFormData({...formData, numero: formatearNumero(e.target.value)})} 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="1234 5678 9012 3456" 
                  maxLength="19"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Fecha expiración</label>
                  <input 
                    type="text" 
                    value={formData.expiracion} 
                    onChange={(e) => setFormData({...formData, expiracion: formatearExpiracion(e.target.value)})} 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    placeholder="MM/AA" 
                    maxLength="5" 
                  />
                  <p className="text-xs text-gray-400 mt-1">Ejemplo: 12/28</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">CVV</label>
                  <input 
                    type="password" 
                    value={formData.cvv} 
                    onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/[^0-9]/g, '')})} 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    placeholder="123" 
                    maxLength="4" 
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-800 mb-2">Genera tu código de pago en tiendas OXXO</p>
              {codigoOxxo ? (
                <>
                  <p className="text-xl font-bold text-blue-800 tracking-wider mb-2">{codigoOxxo}</p>
                  <p className="text-xs text-blue-600 mb-3">Presenta este código en cualquier tienda OXXO</p>
                  <button 
                    type="button" 
                    onClick={() => {
                      navigator.clipboard.writeText(codigoOxxo);
                      alert('Código copiado al portapapeles');
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    📋 Copiar código
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  onClick={generarCodigoOxxo} 
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium"
                >
                  Generar código OXXO
                </button>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button 
            type="submit" 
            className="w-full bg-red-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition"
          >
            {formData.metodo === 'oxxo' ? 'Confirmar pago OXXO' : `Pagar $${torneo.costo} MXN`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PagoTorneo;