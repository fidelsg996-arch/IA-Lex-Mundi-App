// src/context/BilleteraContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BilleteraContext = createContext();

export const useBilletera = () => {
  const context = useContext(BilleteraContext);
  if (!context) {
    throw new Error('useBilletera debe usarse dentro de BilleteraProvider');
  }
  return context;
};

export const BilleteraProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.email || 'anonymous';

  const [saldo, setSaldo] = useState(1000);
  const [transacciones, setTransacciones] = useState([]);

  // Cargar datos del localStorage
  useEffect(() => {
    const storedSaldo = localStorage.getItem(`saldo_${userId}`);
    const storedTransacciones = localStorage.getItem(`transacciones_${userId}`);
    if (storedSaldo !== null) setSaldo(parseFloat(storedSaldo));
    if (storedTransacciones !== null) setTransacciones(JSON.parse(storedTransacciones));
  }, [userId]);

  // Guardar datos automáticamente
  useEffect(() => {
    localStorage.setItem(`saldo_${userId}`, saldo);
    localStorage.setItem(`transacciones_${userId}`, JSON.stringify(transacciones));
  }, [saldo, transacciones, userId]);

  const agregarTransaccion = (tipo, monto, descripcion, metodo) => {
    setTransacciones(prev => [{
      id: Date.now(),
      tipo,
      monto: monto > 0 ? monto : monto,
      fecha: new Date().toISOString(),
      descripcion,
      metodo
    }, ...prev]);
  };

  const recargarSaldo = (monto, metodo) => {
    if (monto <= 0) return false;
    setSaldo(prev => prev + monto);
    agregarTransaccion('Recarga', monto, `Recarga de $${monto}`, metodo);
    return true;
  };

  const realizarPago = (monto, descripcion) => {
    if (monto <= 0) return false;
    if (saldo < monto) return false;
    setSaldo(prev => prev - monto);
    agregarTransaccion('Pago', -monto, descripcion, 'Billetera');
    return true;
  };

  const transferir = (emailDestino, monto, concepto) => {
    if (monto <= 0 || saldo < monto) return false;
    setSaldo(prev => prev - monto);
    agregarTransaccion('Transferencia enviada', -monto, `A ${emailDestino}: ${concepto}`, 'Transferencia');
    return true;
  };

  const retirar = (monto) => {
    if (monto < 100 || monto > saldo) return false;
    setSaldo(prev => prev - monto);
    agregarTransaccion('Retiro', -monto, `Solicitud de retiro de $${monto}`, 'Transferencia bancaria');
    return true;
  };

  const value = {
    saldo,
    transacciones,
    recargarSaldo,
    realizarPago,
    transferir,
    retirar
  };

  return (
    <BilleteraContext.Provider value={value}>
      {children}
    </BilleteraContext.Provider>
  );
};