import React from 'react';
import { Package, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const ResumenInsumos = ({ insumos }) => {
  const getEstadisticas = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    let activos = 0;
    let porVencer = 0;
    let vencidos = 0;
    
    insumos.forEach(insumo => {
      if (!insumo.fechaVencimiento) {
        activos++;
        return;
      }
      
      const vencimiento = new Date(insumo.fechaVencimiento);
      vencimiento.setHours(0, 0, 0, 0);
      const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
      
      if (diferencia < 0) {
        vencidos++;
      } else if (diferencia <= 30) {
        porVencer++;
      } else {
        activos++;
      }
    });
    
    return { activos, porVencer, vencidos, total: insumos.length };
  };

  const stats = getEstadisticas();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
        <Package className="w-4 h-4 mr-2 text-blue-600" />
        Resumen de Insumos
      </h3>
      
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
            Activos
          </p>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{stats.porVencer}</p>
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <AlertTriangle className="w-3 h-3 mr-1 text-yellow-600" />
            Por vencer
          </p>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <AlertCircle className="w-3 h-3 mr-1 text-red-600" />
            Vencidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumenInsumos;