import React from 'react';
import { NavLink } from 'react-router-dom';
import { Target, Calendar, Package, Zap, BarChart3, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { isAdmin, logout } = useAuth();

  const navItems = [
    { id: 'embudo', label: 'Embudo', icon: Target, path: '/embudo-meta' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, path: '/eventos' },
    { id: 'insumos', label: 'Insumos', icon: Package, path: '/insumos' },
    { id: 'express', label: 'Express', icon: Zap, path: '/express' },
    { id: 'reporte', label: 'Reporte', icon: BarChart3, path: '/reporte' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-2 transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        {/* Usuarios - Solo admin */}
        {isAdmin && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-2 transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Usuarios</span>
          </NavLink>
        )}
        
        {/* Botón Cerrar Sesión */}
        <button
          onClick={logout}
          className="flex flex-col items-center py-2 px-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Salir</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;