import React from 'react';
import { Calendar, User, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TareaExpressCard = ({ tarea, onEdit, onDelete, onToggleComplete, onUpdateProgreso }) => {
  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'completada':
        return { 
          label: 'Completada', 
          icon: CheckCircle, 
          bgColor: 'bg-green-50', 
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'en_progreso':
        return { 
          label: 'En progreso', 
          icon: Clock, 
          bgColor: 'bg-yellow-50', 
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700'
        };
      default:
        return { 
          label: 'Pendiente', 
          icon: AlertCircle, 
          bgColor: 'bg-gray-50', 
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    });
  };

  const isVencida = () => {
    if (!tarea.fechaVencimiento || tarea.estado === 'completada') return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(tarea.fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    return vencimiento < hoy;
  };

  const estadoConfig = getEstadoConfig(tarea.estado);
  const EstadoIcon = estadoConfig.icon;
  const vencida = isVencida();

  return (
    <div className={`bg-white rounded-xl border ${estadoConfig.borderColor} p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className={`font-semibold text-gray-800 ${tarea.estado === 'completada' ? 'line-through opacity-60' : ''}`}>
              {tarea.titulo}
            </h4>
            {vencida && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Vencida
              </span>
            )}
          </div>
          {tarea.responsable && (
            <div className="flex items-center text-xs text-gray-500">
              <User className="w-3 h-3 mr-1" />
              {tarea.responsable}
            </div>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onToggleComplete(tarea)}
            className={`p-1.5 rounded transition-colors ${
              tarea.estado === 'completada' 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:text-green-600 hover:bg-gray-50'
            }`}
            title={tarea.estado === 'completada' ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(tarea)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(tarea.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Entrada: {formatDate(tarea.fechaEntrada)}</span>
        </div>
        {tarea.fechaVencimiento && (
          <div className={`flex items-center ${vencida ? 'text-red-600' : ''}`}>
            <Calendar className="w-3 h-3 mr-1" />
            <span>Vence: {formatDate(tarea.fechaVencimiento)}</span>
          </div>
        )}
      </div>

      {tarea.estado === 'en_progreso' && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">Progreso</span>
            <span className="font-medium">{tarea.progreso || 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${tarea.progreso || 0}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={tarea.progreso || 0}
            onChange={(e) => onUpdateProgreso(tarea.id, parseInt(e.target.value))}
            className="w-full mt-2"
          />
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoConfig.bgColor} ${estadoConfig.textColor}`}>
          <EstadoIcon className="w-3 h-3 mr-1" />
          {estadoConfig.label}
        </span>
      </div>
    </div>
  );
};

export default TareaExpressCard;