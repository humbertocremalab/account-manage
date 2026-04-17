import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Target, 
  Calendar, 
  Package, 
  Zap, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, isAdmin } = useAuth();

  const menuItems = [
    { id: 'embudo', label: 'Embudo Meta', icon: Target, path: '/embudo-meta' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, path: '/eventos' },
    { id: 'insumos', label: 'Insumos', icon: Package, path: '/insumos' },
    { id: 'express', label: 'Express', icon: Zap, path: '/express' },
    { id: 'reporte', label: 'Reporte', icon: BarChart3, path: '/reporte' }
  ];

  return (
    <div 
      className={`bg-white border-r border-gray-200 h-screen flex-col transition-all duration-300 hidden md:flex ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header con logo y botón colapsar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-gray-800">Account</h1>
            <h1 className="text-xl font-bold text-gray-800">Manager</h1>
          </div>
        )}
        {collapsed && (
          <div className="w-full text-center">
            <span className="text-xl font-bold text-blue-600">AM</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
            title={collapsed ? item.label : ''}
          >
            <item.icon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}

        {/* Item de Usuarios - SOLO VISIBLE PARA ADMIN */}
        {isAdmin && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
            title={collapsed ? 'Usuarios' : ''}
          >
            <Users className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
            {!collapsed && <span className="text-sm font-medium">Usuarios</span>}
          </NavLink>
        )}
      </nav>

      {/* Footer - Cerrar sesión */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Cerrar sesión' : ''}
        >
          <LogOut className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
          {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;