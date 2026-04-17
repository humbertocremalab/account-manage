import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Users, Eye, LogIn } from 'lucide-react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

const Login = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/embudo-meta');
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Intenta más tarde');
      } else {
        setError('Error al iniciar sesión: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      navigate('/embudo-meta');
    } catch (error) {
      console.error('Error entering as guest:', error);
      setError('Error al entrar como invitado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Account Manager</h1>
          <p className="text-gray-600 mt-2">Selecciona cómo quieres acceder</p>
        </div>

        {!showAdminLogin ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowAdminLogin(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg"
            >
              <User className="w-5 h-5 mr-2" />
              Ingresar como Admin
            </button>
            
            <button
              onClick={handleGuestAccess}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-lg border border-gray-300"
            >
              {loading ? (
                'Cargando...'
              ) : (
                <>
                  <Eye className="w-5 h-5 mr-2" />
                  Ingresar como Invitado
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-6">
              Los invitados solo pueden ver la información, no pueden editar nada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdminLogin(false);
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;