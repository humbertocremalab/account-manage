import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Target, 
  Calendar, 
  Package, 
  Zap, 
  BarChart3 
} from 'lucide-react';

const tabs = [
  { id: 'embudo', label: 'Embudo Meta', icon: Target, path: '/embudo-meta' },
  { id: 'eventos', label: 'Eventos', icon: Calendar, path: '/eventos' },
  { id: 'insumos', label: 'Insumos', icon: Package, path: '/insumos' },
  { id: 'express', label: 'Tareas Express', icon: Zap, path: '/express' },
  { id: 'reporte', label: 'Reporte', icon: BarChart3, path: '/reporte' }
];

const TabNavigation = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <nav className="flex space-x-1 px-4 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;