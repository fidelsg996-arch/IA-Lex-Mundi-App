// src/pages/MiBilletera.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBilletera } from '../context/BilleteraContext';

const MiBilletera = () => {
  const { user, isAdmin } = useAuth();  // ✅ Usa isAdmin del contexto
  const { saldo, transacciones, recargarSaldo, transferir, retirar, recargaAdmin } = useBilletera();

  const [mostrarModalRecarga, setMostrarModalRecarga] = useState(false);
  const [mostrarModalTransferir, setMostrarModalTransferir] = useState(false);
  const [mostrarModalRetirar, setMostrarModalRetirar] = useState(false);
  const [mostrarModalAdminRecarga, setMostrarModalAdminRecarga] = useState(false);
  const [monto, setMonto] = useState(0);
  const [montoAdmin, setMontoAdmin] = useState(0);
  const [emailDestino, setEmailDestino] = useState('');
  const [concepto, setConcepto] = useState('');
  const [procesando, setProcesando] = useState(false);

  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
  });

  const esAdmin = isAdmin();  // ✅ Usa la función del contexto

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-MX');
  };

  const handleRecarga = () => {
    if (!user) {
      alert('❌ Debes iniciar sesión para recargar saldo');
      return;
    }
    
    if (monto <= 0) {
      alert('❌ Monto inválido');
      return;
    }
    if (!datosPago.numeroTarjeta || !datosPago.fechaExpiracion || !datosPago.cvv) {
      alert('❌ Completa todos los datos de la tarjeta');
      return;
    }
    
    const tarjetaLimpia = datosPago.numeroTarjeta.replace(/\D/g, '');
    if (tarjetaLimpia.length !== 16) {
      alert('❌ Número de tarjeta debe tener 16 dígitos');
      return;
    }
    
    const fechaRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!fechaRegex.test(datosPago.fechaExpiracion)) {
      alert('❌ Formato de fecha inválido. Usa MM/AA (ej: 12/25)');
      return;
    }
    
    if (datosPago.cvv.length !== 3) {
      alert('❌ CVV debe tener 3 dígitos');
      return;
    }
    
    setProcesando(true);
    setTimeout(() => {
      const exito = recargarSaldo(monto, 'Tarjeta terminada en ' + datosPago.numeroTarjeta.slice(-4));
      if (exito) {
        alert(`✅ Se acreditaron $${monto} MXN a tu billetera`);
        setMostrarModalRecarga(false);
        setMonto(0);
        setDatosPago({ numeroTarjeta: '', fechaExpiracion: '', cvv: '' });
      } else {
        alert('❌ Error en la recarga');
      }
      setProcesando(false);
    }, 2000);
  };

  const handleTransferir = () => {
    if (!user) {
      alert('❌ Debes iniciar sesión para transferir saldo');
      return;
    }
    
    if (monto <= 0) {
      alert('❌ Monto inválido');
      return;
    }
    if (!emailDestino.trim()) {
      alert('❌ Ingresa el email del destinatario');
      return;
    }
    if (emailDestino === user?.email) {
      alert('❌ No puedes transferirte a ti mismo');
      return;
    }
    if (monto > saldo) {
      alert('❌ Saldo insuficiente');
      return;
    }
    
    setProcesando(true);
    setTimeout(() => {
      const exito = transferir(emailDestino, monto, concepto || 'Transferencia');
      if (exito) {
        alert(`✅ Transferencia de $${monto} MXN a ${emailDestino} exitosa`);
        setMostrarModalTransferir(false);
        setMonto(0);
        setEmailDestino('');
        setConcepto('');
      } else {
        alert('❌ Error en la transferencia');
      }
      setProcesando(false);
    }, 1500);
  };

  const handleRetirar = () => {
    if (!user) {
      alert('❌ Debes iniciar sesión para retirar saldo');
      return;
    }
    
    if (monto <= 0) {
      alert('❌ Monto inválido');
      return;
    }
    if (monto > saldo) {
      alert('❌ Saldo insuficiente');
      return;
    }
    if (monto < 100) {
      alert('❌ El monto mínimo de retiro es $100 MXN');
      return;
    }
    
    setProcesando(true);
    setTimeout(() => {
      const exito = retirar(monto);
      if (exito) {
        alert(`✅ Solicitud de retiro de $${monto} MXN registrada`);
        setMostrarModalRetirar(false);
        setMonto(0);
      } else {
        alert('❌ Error en el retiro');
      }
      setProcesando(false);
    }, 1500);
  };

  const handleRecargaAdmin = () => {
    if (!user || !esAdmin) {
      alert('❌ Acceso denegado');
      return;
    }
    
    if (montoAdmin <= 0) {
      alert('❌ Monto inválido');
      return;
    }
    
    setProcesando(true);
    setTimeout(() => {
      const exito = recargaAdmin(montoAdmin);
      if (exito) {
        alert(`✅ Se acreditaron $${montoAdmin} MXN a la billetera (Recarga Administrativa)`);
        setMostrarModalAdminRecarga(false);
        setMontoAdmin(0);
      } else {
        alert('❌ Error en la recarga administrativa');
      }
      setProcesando(false);
    }, 1000);
  };

  const totalRecargado = transacciones
    .filter(t => t.tipo === 'Recarga' || t.tipo === 'Recarga Admin')
    .reduce((sum, t) => sum + t.monto, 0);
  const totalGastado = transacciones
    .filter(t => t.tipo === 'Pago' || t.tipo === 'Transferencia enviada' || t.tipo === 'Retiro')
    .reduce((sum, t) => sum + Math.abs(t.monto), 0);

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Mi Billetera</h1>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Gestiona tu saldo, recarga, transfiere o retira dinero</p>

      {/* Tarjeta de saldo */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-4 md:p-6 text-white mb-6 md:mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs md:text-sm opacity-90">Saldo disponible</p>
            <p className="text-3xl md:text-5xl font-bold mt-2">${saldo.toLocaleString()} MXN</p>
          </div>
          {esAdmin && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">👑 ADMIN</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-6">
          <button onClick={() => setMostrarModalRecarga(true)} className="bg-white text-blue-700 px-4 md:px-6 py-2 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-100">+ Recargar</button>
          <button onClick={() => setMostrarModalTransferir(true)} className="bg-blue-500 border border-white text-white px-4 md:px-6 py-2 rounded-lg font-semibold text-sm md:text-base hover:bg-blue-400">Transferir</button>
          <button onClick={() => setMostrarModalRetirar(true)} className="bg-gray-800 text-white px-4 md:px-6 py-2 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-700">Retirar</button>
          {esAdmin && (
            <button onClick={() => setMostrarModalAdminRecarga(true)} className="bg-yellow-500 text-black px-4 md:px-6 py-2 rounded-lg font-semibold text-sm md:text-base hover:bg-yellow-400">
              👑 Recarga Admin
            </button>
          )}
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-md p-3 md:p-4 text-center">
          <p className="text-gray-500 text-xs md:text-sm">Total recargado</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">${totalRecargado.toLocaleString()} MXN</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3 md:p-4 text-center">
          <p className="text-gray-500 text-xs md:text-sm">Total gastado</p>
          <p className="text-xl md:text-2xl font-bold text-red-600">${totalGastado.toLocaleString()} MXN</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3 md:p-4 text-center">
          <p className="text-gray-500 text-xs md:text-sm">Transacciones</p>
          <p className="text-xl md:text-2xl font-bold text-blue-600">{transacciones.length}</p>
        </div>
      </div>

      {/* Historial */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Historial de movimientos</h2>
        {transacciones.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay movimientos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[600px] md:min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {transacciones.slice().reverse().map(t => (
                  <tr key={t.id}>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{formatearFecha(t.fecha)}</td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.tipo === 'Recarga' ? 'bg-green-100 text-green-800' : 
                        t.tipo === 'Recarga Admin' ? 'bg-yellow-100 text-yellow-800' :
                        t.tipo === 'Transferencia recibida' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                      <span className={t.monto > 0 ? 'text-green-600' : 'text-red-600'}>
                        {t.monto > 0 ? '+' : '-'} ${Math.abs(t.monto).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{t.descripcion || t.metodo || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALES - se mantienen igual */}
      {mostrarModalRecarga && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Recargar saldo</h2>
            <p className="text-center text-gray-600 mb-4">Saldo actual: ${saldo.toLocaleString()} MXN</p>
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
              {[50, 100, 200].map(m => <button key={m} onClick={() => setMonto(m)} className="p-2 md:p-3 border rounded-xl hover:bg-gray-100">${m}</button>)}
            </div>
            <input type="number" value={monto} onChange={(e) => setMonto(parseInt(e.target.value) || 0)} placeholder="Otro monto" className="w-full p-2 md:p-3 border rounded-xl mb-4" />
            <div className="border-t pt-4 mt-2">
              <p className="font-semibold mb-3">Datos de pago (simulación)</p>
              <input type="text" placeholder="Número de tarjeta (16 dígitos)" value={datosPago.numeroTarjeta} onChange={(e) => setDatosPago({...datosPago, numeroTarjeta: e.target.value.replace(/\D/g, '').slice(0,16)})} maxLength={16} className="w-full p-2 md:p-3 border rounded-xl mb-3" />
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <input type="text" placeholder="MM/AA" value={datosPago.fechaExpiracion} onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 4) value = value.slice(0, 4);
                  if (value.length >= 2) {
                    const mes = parseInt(value.slice(0, 2));
                    if (mes > 12 && mes <= 99) {
                      alert("❌ El mes debe ser entre 01 y 12");
                      return;
                    }
                  }
                  if (value.length >= 3) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                  }
                  setDatosPago({...datosPago, fechaExpiracion: value});
                }} maxLength={5} className="w-full p-2 md:p-3 border rounded-xl" />
                <input type="text" placeholder="CVV" value={datosPago.cvv} onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '').slice(0, 3);
                  setDatosPago({...datosPago, cvv: value});
                }} maxLength={3} className="w-full p-2 md:p-3 border rounded-xl" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setMostrarModalRecarga(false)} className="flex-1 bg-gray-200 py-2 md:py-3 rounded-xl">Cancelar</button>
              <button onClick={handleRecarga} disabled={procesando || monto <= 0} className="flex-1 bg-green-500 text-white py-2 md:py-3 rounded-xl font-bold disabled:opacity-50">{procesando ? 'Procesando...' : 'Pagar y recargar'}</button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalTransferir && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Transferir saldo</h2>
            <p className="text-center text-gray-600 mb-4">Saldo disponible: ${saldo.toLocaleString()} MXN</p>
            <input type="email" value={emailDestino} onChange={(e) => setEmailDestino(e.target.value)} placeholder="Email del destinatario" className="w-full p-2 md:p-3 border rounded-xl mb-3" />
            <input type="number" value={monto} onChange={(e) => setMonto(parseInt(e.target.value) || 0)} placeholder="Monto a transferir" className="w-full p-2 md:p-3 border rounded-xl mb-3" />
            <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Concepto (opcional)" className="w-full p-2 md:p-3 border rounded-xl mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setMostrarModalTransferir(false)} className="flex-1 bg-gray-200 py-2 md:py-3 rounded-xl">Cancelar</button>
              <button onClick={handleTransferir} disabled={procesando || monto <= 0 || monto > saldo} className="flex-1 bg-blue-500 text-white py-2 md:py-3 rounded-xl font-bold disabled:opacity-50">{procesando ? 'Procesando...' : 'Transferir'}</button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalRetirar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Retirar saldo</h2>
            <p className="text-center text-gray-600 mb-4">Saldo disponible: ${saldo.toLocaleString()} MXN</p>
            <p className="text-sm text-gray-500 mb-2">Monto a retirar (mínimo $100)</p>
            <input type="number" value={monto} onChange={(e) => setMonto(parseInt(e.target.value) || 0)} placeholder="Monto" className="w-full p-2 md:p-3 border rounded-xl mb-4" />
            <div className="text-xs md:text-sm text-gray-500 mb-4">
              <p>Los retiros se procesan en 24-48 horas a tu cuenta bancaria registrada.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMostrarModalRetirar(false)} className="flex-1 bg-gray-200 py-2 md:py-3 rounded-xl">Cancelar</button>
              <button onClick={handleRetirar} disabled={procesando || monto < 100 || monto > saldo} className="flex-1 bg-yellow-600 text-white py-2 md:py-3 rounded-xl font-bold disabled:opacity-50">{procesando ? 'Procesando...' : 'Solicitar retiro'}</button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalAdminRecarga && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-2">👑 Recarga Administrativa</h2>
            <p className="text-center text-gray-600 mb-4">Añade saldo directamente (sin pago real)</p>
            <p className="text-center text-sm text-green-600 mb-4">Saldo actual: ${saldo.toLocaleString()} MXN</p>
            <input type="number" value={montoAdmin} onChange={(e) => setMontoAdmin(parseInt(e.target.value) || 0)} placeholder="Monto a añadir" className="w-full p-2 md:p-3 border rounded-xl mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setMostrarModalAdminRecarga(false)} className="flex-1 bg-gray-200 py-2 md:py-3 rounded-xl">Cancelar</button>
              <button onClick={handleRecargaAdmin} disabled={procesando || montoAdmin <= 0} className="flex-1 bg-yellow-500 text-black py-2 md:py-3 rounded-xl font-bold disabled:opacity-50">{procesando ? 'Procesando...' : 'Recargar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiBilletera;