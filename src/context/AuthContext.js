import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Lista de emails administradores
const ADMIN_EMAILS = ['admin@lexmundi.ia', 'fidelsg996@gmail.com', 'admin.legal@gmail.com'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, name, role = 'user') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const newUser = { uid, email, name, role, plan: 'free', createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'usuarios', uid), newUser);
    return true;
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const users = [];
    querySnapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
    return users;
  };

  const updateUserRole = async (uid, newRole) => {
    const userRef = doc(db, 'usuarios', uid);
    await updateDoc(userRef, { role: newRole });
    return true;
  };

  const deleteUser = async (uid) => {
    const userRef = doc(db, 'usuarios', uid);
    await updateDoc(userRef, { activo: false });
    return true;
  };

  const updateUserPlan = async (newPlan) => {
    if (!user) return false;
    const userRef = doc(db, 'usuarios', user.uid);
    await updateDoc(userRef, { plan: newPlan });
    setUser({ ...user, plan: newPlan });
    return true;
  };

  const isAdmin = () => {
    if (user?.email && ADMIN_EMAILS.includes(user.email)) return true;
    if (user?.role === 'admin') return true;
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'usuarios', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ uid: firebaseUser.uid, ...userSnap.data(), email: firebaseUser.email });
        } else {
          const esAdmin = ADMIN_EMAILS.includes(firebaseUser.email);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, plan: 'free', role: esAdmin ? 'admin' : 'user' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAdmin, loading, getAllUsers, updateUserRole, deleteUser, updateUserPlan }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};