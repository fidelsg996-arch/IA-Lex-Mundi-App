// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registrar usuario en Firebase Auth y Firestore
  const register = async (email, password, name, role = 'user') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const newUser = {
        uid,
        email,
        name,
        role,
        plan: 'free',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'usuarios', uid), newUser);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    await signOut(auth);
  };

  // Obtener todos los usuarios (para admin)
  const getAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  };

  // Actualizar rol de usuario
  const updateUserRole = async (uid, newRole) => {
    try {
      const userRef = doc(db, 'usuarios', uid);
      await updateDoc(userRef, { role: newRole });
      return true;
    } catch (error) {
      console.error('Error actualizando rol:', error);
      throw error;
    }
  };

  // Eliminar usuario (deshabilitar)
  const deleteUser = async (uid) => {
    try {
      const userRef = doc(db, 'usuarios', uid);
      await updateDoc(userRef, { activo: false });
      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  };

  // Actualizar el plan del usuario
  const updateUserPlan = async (newPlan) => {
    if (!user) return false;
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, { plan: newPlan });
      
      setUser({ ...user, plan: newPlan });
      return true;
    } catch (error) {
      console.error('Error actualizando plan:', error);
      return false;
    }
  };

  // Verificar si es admin
  const isAdmin = () => user?.role === 'admin';

  // Cargar datos del usuario desde Firestore cuando cambia la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'usuarios', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...userSnap.data() });
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, plan: 'free', role: 'user' });
          }
        } catch (error) {
          console.error('Error cargando usuario:', error);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, plan: 'free', role: 'user' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      updateUserPlan,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};