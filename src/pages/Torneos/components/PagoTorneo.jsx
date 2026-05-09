import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useBilletera } from '../../../context/BilleteraContext';

const PagoTorneo = ({ torneo, participante, onPagoExitoso, onVolver }) => {
  const { user } = useAuth();
  const { saldo, realizarPago } = useBilletera();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarFormularioTarjeta, setMostrarFormularioTarjeta] = useState(false);
  
  const [datosTarjeta, setDatosTarjeta] = useState({
    nombreTitular: '',
    numeroTarjeta: '',
    expiracion: '',
    cvv: ''
  });

  const precio = 10;

  const handlePagoConBilletera = async () => {
    // Validar saldo
    if (saldo < precio) {
      setError(`❌ Saldo insuficiente. Necesitas $${precio} MXN. Recarga desde Mi Billetera.`);
      return;
    }

    // Evitar doble clic
    if (procesando) return;
    
    setProcesando(true);
    setError('');
    
    try {
      console.log('💰 Iniciando pago con billetera...');
      const exito = await realizarPago(precio, `Inscripción torneo: ${torneo?.titulo}`);
      console.log('💰 Resultado del pago:', exito);
      
      // IMPORTANTE: Resetear estado ANTES de mostrar alert
      setProcesando(false);
      
      if (exito) {
        alert(`✅ Pago exitoso! Se descontaron $${precio} MXN de tu billetera`);
        onPagoExitoso();
      } else {
        setError('❌ Error en el pago. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error en pago:', err);
      setError('❌ Error al procesar el pago');
      setProcesando(false);
    }
  };

  const handlePagoConTarjeta = () => {
    setMostrarFormularioTarjeta(true);
    setError('');
  };

  const handleSimularTarjeta = () => {
    const { nombreTitular, numeroTarjeta, expiracion, cvv } = datosTarjeta;
    
    if (!nombreTitular.trim()) {
      setError('❌ El nombre del titular es requerido');
      return;
    }
    
    if (nombreTitular.length < 3) {
      setError('❌ Ingrese el nombre completo como aparece en la tarjeta');
      return;
    }
    
    if (!numeroTarjeta) {
      setError('❌ El número de tarjeta es requerido');
      return;
    }

    const numeroLimpio = numeroTarjeta.replace(/\s/g, '');
    if (numeroLimpio.length !== 16) {
      setError('❌ Número de tarjeta debe tener 16 dígitos');
      return;
    }

    if (!expiracion) {
      setError('❌ La fecha de expiración es requerida');
      return;
    }

    const fechaRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!fechaRegex.test(expiracion)) {
      setError('❌ Formato de fecha inválido. Usa MM/AA');
      return;
    }

    const año = parseInt(expiracion.split('/')[1]);
    const añoActual = new Date().getFullYear() % 100;
    if (año < añoActual) {
      setError('❌ Tarjeta expirada. Verifica la fecha');
      return;
    }

    if (!cvv) {
      setError('❌ El CVV es requerido');
      return;
    }
    
    if (cvv.length !== 3) {
      setError('❌ CVV debe tener 3 dígitos');
      return;
    }

    // Evitar doble clic
    if (procesando) return;
    
    setProcesando(true);
    setError('');
    
    // Simular pago con tarjeta
    setTimeout(() => {
      setProcesando(false);
      alert(`✅ Pago simulado exitoso! Tarjeta terminada en ${numeroLimpio.slice(-4)}`);
      onPagoExitoso();
    }, 1500);
  };

  const formatearNumeroTarjeta = (valor) => {
    const soloNumeros = valor.replace(/\D/g, '');
    const grupos = soloNumeros.match(/.{1,4}/g) || [];
    return grupos.join(' ').substring(0, 19);
  };

  const formatearFechaExpiracion = (valor) => {
    const soloNumeros = valor.replace(/\D/g, '');
    if (soloNumeros.length >= 2) {
      const mes = soloNumeros.substring(0, 2);
      if (parseInt(mes) > 12) return mes.substring(0, 1) + '/' + mes.substring(1, 2);
      return `${mes}/${soloNumeros.substring(2, 4)}`;
    }
    return soloNumeros;
  };

  const cancelarTarjeta = () => {
    setMostrarFormularioTarjeta(false);
    setError('');
    setProcesando(false);
    setDatosTarjeta({ nombreTitular: '', numeroTarjeta: '', expiracion: '', cvv: '' });
  };

  const volverAlInicio = () => {
    setProcesando(false);
    setError('');
    onVolver();
  };

  if (mostrarFormularioTarjeta) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-5 text-white">
            <h2 className="text-2xl font-bold">Pago con Tarjeta</h2>
            <p className="text-red-200 text-sm mt-1">{torneo?.titulo}</p>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-red-600">${precio} MXN</p>
              <p className="text-sm text-gray-500 mt-1">(Pago simulado - modo prueba)</p>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {/* NOMBRE DEL TITULAR */}
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">
                  Nombre del titular <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="COMO APARECE EN LA TARJETA"
                  value={datosTarjeta.nombreTitular}
                  onChange={(e) => setDatosTarjeta({...datosTarjeta, nombreTitular: e.target.value.toUpperCase()})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
                  autoComplete="cc-name"
                  disabled={procesando}
                />
              </div>
              
              {/* NÚMERO DE TARJETA */}
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">
                  Número de tarjeta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={datosTarjeta.numeroTarjeta}
                  onChange={(e) => {
                    const formateado = formatearNumeroTarjeta(e.target.value);
                    setDatosTarjeta({...datosTarjeta, numeroTarjeta: formateado});
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  maxLength={19}
                  autoComplete="cc-number"
                  disabled={procesando}
                />
              </div>
              
              {/* FECHA Y CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">
                    Fecha expiración <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={datosTarjeta.expiracion}
                    onChange={(e) => {
                      const formateado = formatearFechaExpiracion(e.target.value);
                      setDatosTarjeta({...datosTarjeta, expiracion: formateado});
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    maxLength={5}
                    autoComplete="cc-exp"
                    disabled={procesando}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="123"
                    value={datosTarjeta.cvv}
                    onChange={(e) => setDatosTarjeta({...datosTarjeta, cvv: e.target.value.replace(/\D/g, '').slice(0,3)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    maxLength={3}
                    autoComplete="cc-csc"
                    disabled={procesando}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={cancelarTarjeta} 
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold transition"
                disabled={procesando}
              >
                Volver
              </button>
              <button 
                onClick={handleSimularTarjeta} 
                disabled={procesando} 
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
              >
                {procesando ? 'Procesando...' : 'Pagar con tarjeta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-5 text-white">
          <h2 className="text-2xl font-bold">Pago de inscripción</h2>
          <p className="text-green-200 text-sm mt-1">{torneo?.titulo}</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-green-600">${precio} MXN</p>
            <p className="text-sm text-gray-500 mt-1">Saldo disponible: ${saldo?.toLocaleString() || 0} MXN</p>
            <p className="text-xs text-gray-400 mt-2">Participante: {participante?.nombre || user?.displayName}</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={handlePagoConBilletera} 
              disabled={procesando || saldo < precio} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
            >
              {procesando ? 'Procesando...' : `💰 Pagar con Billetera ($${precio})`}
            </button>
            
            <button 
              onClick={handlePagoConTarjeta} 
              disabled={procesando}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-900 transition disabled:opacity-50"
            >
              💳 Pagar con Tarjeta
            </button>
          </div>

          <div className="mt-6">
            <button 
              onClick={volverAlInicio} 
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition font-semibold"
              disabled={procesando}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoTorneo;