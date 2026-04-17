import React, { useState, useEffect } from 'react';
import { Users, Shield, Eye, Trash2, RefreshCw, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, setUserRole, deleteUserRole } from '../services/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const Usuarios = () => {
  const { user, isAdmin, changePassword } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'viewer' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      
      // Asignar rol en Firestore
      await setUserRole(userCredential.user.uid, newUser.role, newUser.email);
      
      setSuccess(`Usuario ${newUser.email} creado como ${newUser.role}`);
      setShowAddModal(false);
      setNewUser({ email: '', password: '', role: 'viewer' });
      loadUsers();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setError('Error: ' + error.message);
      }
    }
  };

  const handleChangeRole = async (userId, newRole, email) => {
    try {
      await setUserRole(userId, newRole, email);
      loadUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await deleteUserRole(userId);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordData.new !== passwordData.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordData.new.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      await changePassword(passwordData.current, passwordData.new);
      setSuccess('Contraseña actualizada correctamente');
      setShowPasswordModal(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setError('Contraseña actual incorrecta');
      } else {
        setError('Error: ' + error.message);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Acceso Restringido</h2>
        <p className="text-gray-600">Solo los administradores pueden ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Gestión de Usuarios</h2>
          <p className="text-gray-600 text-sm">
            Administra quién puede acceder y editar
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Key className="w-4 h-4 mr-2" />
            Cambiar contraseña
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Agregar Usuario
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última actualización</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.uid}>
                    <td className="px-6 py-4 text-sm text-gray-800">{u.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.uid, e.target.value, u.email)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.uid)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Agregar Usuario */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Agregar Nuevo Usuario</h3>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  minLength="6"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="viewer">Viewer (Solo lectura)</option>
                  <option value="admin">Admin (Acceso completo)</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Cambiar Contraseña</h3>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  minLength="6"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;