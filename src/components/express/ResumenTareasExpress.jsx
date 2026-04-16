import React from 'react';
import { Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ResumenTareasExpress = ({ tareas }) => {
  const getEstadisticas = () => {
    const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
    const enProgreso = tareas.filter(t => t.estado === 'en_progreso').length;
    const completadas = tareas.filter(t => t.estado === 'completada').length;
    
    return { pendientes, enProgreso, completadas, total: tareas.length };
  };

  const stats = getEstadisticas();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
        <Zap className="w-4 h-4 mr-2 text-yellow-600" />
        Resumen de Tareas Express
      </h3>
      
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-600">{stats.pendientes}</p>
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendientes
          </p>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{stats.enProgreso}</p>
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1 text-yellow-600" />
            En progreso
          </p>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.completadas}</p>
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
            Completadas
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumenTareasExpress;