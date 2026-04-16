import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';

const Reporte = () => {
  const [selectedMonth, setSelectedMonth] = useState('abril');
  const [selectedYear, setSelectedYear] = useState('2026');

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const generateCSV = () => {
    // Implementar generación de CSV
    console.log('Generando reporte...');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reporte Mensual</h2>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <Calendar className="w-5 h-5 text-gray-600" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {months.map(month => (
              <option key={month} value={month}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <button
          onClick={generateCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Excel (.csv)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Métrica</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monterrey</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saltillo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CDMX</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800">Leads Meta</td>
              <td className="px-6 py-4 text-sm text-gray-800">1350</td>
              <td className="px-6 py-4 text-sm text-gray-800">0</td>
              <td className="px-6 py-4 text-sm text-gray-800">0</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800">Leads Generados</td>
              <td className="px-6 py-4 text-sm text-gray-800">337</td>
              <td className="px-6 py-4 text-sm text-gray-800">0</td>
              <td className="px-6 py-4 text-sm text-gray-800">0</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800">Avance Leads</td>
              <td className="px-6 py-4 text-sm text-gray-800">25%</td>
              <td className="px-6 py-4 text-sm text-gray-800">0%</td>
              <td className="px-6 py-4 text-sm text-gray-800">0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reporte;