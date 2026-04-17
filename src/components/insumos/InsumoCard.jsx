import React from 'react';
import { MapPin, Calendar, Edit, Trash2, RefreshCw } from 'lucide-react';

const InsumoCard = ({ insumo, onEdit, onDelete, onRenovar, readOnly = false }) => {
  const getEstadoConfig = (fechaVencimiento) => {
    if (!fechaVencimiento) {
      return { label: 'Sin fecha', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    
    const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    
    if (diferencia < 0) {
      return { label: 'Vencido', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' };
    } else if (diferencia <= 30) {
      return { label: 'Por vencer', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
    } else {
      return { label: 'Activo', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDiasRestantes = (fechaVencimiento) => {
    if (!fechaVencimiento) return null;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    
    const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    
    if (diferencia < 0) {
      return `Venció hace ${Math.abs(diferencia)} días`;
    } else if (diferencia === 0) {
      return 'Vence hoy';
    } else {
      return `${diferencia} días restantes`;
    }
  };

  const sucursales = {
    monterrey: 'Monterrey',
    saltillo: 'Saltillo',
    cdmx: 'CDMX'
  };

  const estadoConfig = getEstadoConfig(insumo.fechaVencimiento);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">{insumo.nombre}</h4>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {sucursales[insumo.sucursal] || insumo.sucursal}
          </div>
        </div>
         {!readOnly && (
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(insumo)}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(insumo.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoConfig.bgColor} ${estadoConfig.textColor}`}>
            {estadoConfig.label}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Vence: {formatDate(insumo.fechaVencimiento)}</span>
        </div>

        {insumo.fechaVencimiento && (
          <p className="text-xs text-gray-400">{getDiasRestantes(insumo.fechaVencimiento)}</p>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
         {!readOnly && onRenovar && (
        <button
          onClick={() => onRenovar(insumo)}
          className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Renovar
        </button>
         )}
      </div>
    </div>
  );
};

export default InsumoCard;