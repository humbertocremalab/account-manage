import React, { useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';

const GastosList = ({ gastos, onAddGasto, onDeleteGasto }) => {
  const [nuevoGasto, setNuevoGasto] = useState({ concepto: '', monto: '' });

  const handleAdd = () => {
    if (nuevoGasto.concepto.trim() && nuevoGasto.monto) {
      onAddGasto({
        concepto: nuevoGasto.concepto,
        monto: parseFloat(nuevoGasto.monto)
      });
      setNuevoGasto({ concepto: '', monto: '' });
    }
  };

  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-green-600" />
          Gastos / Actividades
        </h3>
        <span className="text-sm font-semibold text-gray-800">
          ${totalGastos.toLocaleString()}
        </span>
      </div>

      <div className="space-y-2 mb-3 max-h-[300px] overflow-y-auto">
        {gastos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Sin gastos</p>
        ) : (
          gastos.map((gasto, index) => (
            <div key={index} className="flex items-center justify-between group py-1">
              <span className="text-sm text-gray-700">{gasto.concepto}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">
                  ${gasto.monto.toLocaleString()}
                </span>
                <button
                  onClick={() => onDeleteGasto(index)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={nuevoGasto.concepto}
          onChange={(e) => setNuevoGasto({ ...nuevoGasto, concepto: e.target.value })}
          placeholder="Actividad..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={nuevoGasto.monto}
              onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
              placeholder="0"
              min="0"
              step="100"
              className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GastosList;