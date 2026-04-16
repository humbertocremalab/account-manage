import React, { useState } from 'react';
import { Package, Plus, Calendar as CalendarIcon } from 'lucide-react';

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Insumos / Materiales</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Insumo
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {insumos.map((insumo, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
            {/* Tarjeta de insumo */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insumos;