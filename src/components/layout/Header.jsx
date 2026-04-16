import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">AM</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Account Manager</h1>
            <p className="text-sm text-gray-600">v1.0.0</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="w-4 h-4" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;