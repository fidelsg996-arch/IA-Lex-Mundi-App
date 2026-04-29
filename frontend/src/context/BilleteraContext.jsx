// src/context/BilleteraContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const BilleteraContext = createContext();

export const useBilletera = () => useContext(BilleteraContext);

export const BilleteraProvider = ({ children }) => {
  const { user } = useAuth();
  const [saldo, setSaldo] = useState(0);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Firestore
  const cargarDatos = async () => {
    if (!user) {
      setSaldo(0);
      setTransacciones([]);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'billetera', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSaldo(data.saldo || 0);
        setTransacciones(data.transacciones || []);
      } else {
        setSaldo(0);
        setTransacciones([]);
      }
    } catch (error) {
      console.error('Error cargando billetera:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar en Firestore
  const guardarDatos = async (nuevoSaldo, nuevasTransacciones) => {
    if (!user) return false;
    try {
      const userRef = doc(db, 'billetera', user.uid);
      await setDoc(userRef, {
        saldo: nuevoSaldo,
        transacciones: nuevasTransacciones,
        ultimaActualizacion: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error guardando billetera:', error);
      return false;
    }
  };

  // Recarga normal (simulación de pago)
  const recargarSaldo = async (monto, metodo) => {
    if (!user) return false;
    
    const nuevoSaldo = saldo + monto;
    const nuevaTransaccion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      tipo: 'Recarga',
      monto: monto,
      metodo: metodo,
      descripcion: `Recarga de $${monto} MXN`
    };
    const nuevasTransacciones = [nuevaTransaccion, ...transacciones];
    
    const exito = await guardarDatos(nuevoSaldo, nuevasTransacciones);
    if (exito) {
      setSaldo(nuevoSaldo);
      setTransacciones(nuevasTransacciones);
      return true;
    }
    return false;
  };

  // RECARGA ADMINISTRADOR (sin pago real)
  const recargaAdmin = async (monto) => {
    if (!user) return false;
    
    const nuevoSaldo = saldo + monto;
    const nuevaTransaccion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      tipo: 'Recarga Admin',
      monto: monto,
      descripcion: `Recarga administrativa de $${monto} MXN`,
      metodo: 'Administrador'
    };
    const nuevasTransacciones = [nuevaTransaccion, ...transacciones];
    
    const exito = await guardarDatos(nuevoSaldo, nuevasTransacciones);
    if (exito) {
      setSaldo(nuevoSaldo);
      setTransacciones(nuevasTransacciones);
      return true;
    }
    return false;
  };

  // Transferir saldo a otro usuario
  const transferir = async (emailDestino, monto, concepto) => {
    if (!user) return false;
    if (monto > saldo) return false;
    
    const nuevoSaldo = saldo - monto;
    const nuevaTransaccion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      tipo: 'Transferencia enviada',
      monto: -monto,
      destinatario: emailDestino,
      descripcion: concepto || `Transferencia a ${emailDestino}`
    };
    const nuevasTransacciones = [nuevaTransaccion, ...transacciones];
    
    const exito = await guardarDatos(nuevoSaldo, nuevasTransacciones);
    if (exito) {
      setSaldo(nuevoSaldo);
      setTransacciones(nuevasTransacciones);
      return true;
    }
    return false;
  };

  // Retirar saldo (simulación)
  const retirar = async (monto) => {
    if (!user) return false;
    if (monto > saldo) return false;
    
    const nuevoSaldo = saldo - monto;
    const nuevaTransaccion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      tipo: 'Retiro',
      monto: -monto,
      descripcion: `Retiro de $${monto} MXN a cuenta bancaria`
    };
    const nuevasTransacciones = [nuevaTransaccion, ...transacciones];
    
    const exito = await guardarDatos(nuevoSaldo, nuevasTransacciones);
    if (exito) {
      setSaldo(nuevoSaldo);
      setTransacciones(nuevasTransacciones);
      return true;
    }
    return false;
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  return (
    <BilleteraContext.Provider value={{
      saldo,
      transacciones,
      loading,
      recargarSaldo,
      recargaAdmin,
      transferir,
      retirar,
      cargarDatos
    }}>
      {children}
    </BilleteraContext.Provider>
  );
};