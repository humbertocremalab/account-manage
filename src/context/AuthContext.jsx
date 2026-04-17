import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserRole, setUserRole, getAllUsers } from '../services/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('viewer');
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Verificar si es invitado (anónimo)
        if (user.isAnonymous) {
          setRole('viewer');
          setIsGuest(true);
        } else {
          setIsGuest(false);
          // Obtener el rol del usuario desde Firestore
          const userRole = await getUserRole(user.uid);
          setRole(userRole || 'viewer');
        }
      } else {
        setUser(null);
        setRole('viewer');
        setIsGuest(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRole = await getUserRole(userCredential.user.uid);
      setRole(userRole || 'viewer');
      setIsGuest(false);
    } catch (error) {
      throw error;
    }
  };

  const loginAsGuest = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      setRole('viewer');
      setIsGuest(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setRole('viewer');
      setIsGuest(false);
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user || user.isAnonymous) {
      throw new Error('No se puede cambiar contraseña en modo invitado');
    }
    
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = role === 'admin' && !isGuest;
  const isViewer = role === 'viewer' || isGuest;

  const value = {
    user,
    role,
    isAdmin,
    isViewer,
    isGuest,
    login,
    loginAsGuest,
    logout,
    changePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};