import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, UserPlus, Mail, Key, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isRegistering) {
        // Registro de nuevo usuario
        await createUserWithEmailAndPassword(auth, email, password);
        // Después del registro, iniciar sesión automáticamente
        await login(email, password);
        navigate('/embudo-meta');
      } else {
        // Login normal
        await login(email, password);
        navigate('/embudo-meta');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado. Inicia sesión.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Intenta nuevamente.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Account Manager</h1>
          <p className="text-gray-600 mt-2">
            {isRegistering ? 'Crea tu cuenta para ver reportes' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              'Cargando...'
            ) : (
              <>
                {isRegistering ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crear cuenta
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isRegistering ? (
              '¿Ya tienes cuenta? Inicia sesión'
            ) : (
              '¿No tienes cuenta? Regístrate (acceso solo lectura)'
            )}
          </button>
        </div>

        {!isRegistering && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Las cuentas nuevas tienen acceso de solo lectura.
            Contacta al administrador para permisos de edición.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;