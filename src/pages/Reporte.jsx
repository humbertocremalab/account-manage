import React, { useState, useEffect } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllDataForReport } from '../services/database';

const Reporte = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.getMonth();
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return new Date().getFullYear();
  });

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = [2025, 2026, 2027];

  const sucursales = ['monterrey', 'saltillo', 'cdmx'];
  const sucursalLabels = {
    monterrey: 'Monterrey',
    saltillo: 'Saltillo',
    cdmx: 'CDMX'
  };

  useEffect(() => {
    const loadReportData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await getAllDataForReport(user.uid);
        setReportData(data);
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [user]);

  const getMetricasSucursal = (sucursal) => {
    if (!reportData?.metrics) {
      return { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 };
    }
    return reportData.metrics[sucursal] || { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 };
  };

  const getEventosPorSucursal = (sucursal) => {
    if (!reportData?.eventos) return 0;
    // Por ahora contamos todos los eventos, podemos filtrar por sucursal después
    return reportData.eventos.length;
  };

  const getInsumosPorSucursal = (sucursal) => {
    if (!reportData?.insumos) return 0;
    return reportData.insumos.filter(i => i.sucursal === sucursal && 
      (i.estado === 'activo' || i.estado === 'por_vencer')
    ).length;
  };

  const getTareasCompletadas = () => {
    if (!reportData?.tareasExpress) return { total: 0, completadas: 0 };
    const total = reportData.tareasExpress.length;
    const completadas = reportData.tareasExpress.filter(t => t.estado === 'completada').length;
    return { total, completadas };
  };

  const generateCSV = () => {
    if (!reportData) return;

    let csv = 'Reporte Mensual - Account Manager\n';
    csv += `Periodo: ${months[selectedMonth]} ${selectedYear}\n\n`;

    // Métricas por sucursal
    csv += 'METRICAS POR SUCURSAL\n';
    csv += 'Métrica,Monterrey,Saltillo,CDMX\n';
    
    sucursales.forEach(sucursal => {
      const m = getMetricasSucursal(sucursal);
      const porcentajeLeads = m.leadsMeta > 0 ? ((m.leadsGenerados / m.leadsMeta) * 100).toFixed(1) : '0.0';
      const porcentajeGasto = m.presupuesto > 0 ? ((m.gasto / m.presupuesto) * 100).toFixed(1) : '0.0';
      
      if (sucursal === 'monterrey') {
        csv += `Leads Meta,${m.leadsMeta},`;
        sucursales.slice(1).forEach(s => {
          const sm = getMetricasSucursal(s);
          csv += `${sm.leadsMeta},`;
        });
        csv += '\n';
        
        csv += `Leads Generados,${m.leadsGenerados},`;
        sucursales.slice(1).forEach(s => {
          const sm = getMetricasSucursal(s);
          csv += `${sm.leadsGenerados},`;
        });
        csv += '\n';
        
        csv += `Avance Leads,${porcentajeLeads}%,`;
        sucursales.slice(1).forEach(s => {
          const sm = getMetricasSucursal(s);
          const p = sm.leadsMeta > 0 ? ((sm.leadsGenerados / sm.leadsMeta) * 100).toFixed(1) : '0.0';
          csv += `${p}%,`;
        });
        csv += '\n';
        
        csv += `Presupuesto,$${m.presupuesto},`;
        sucursales.slice(1).forEach(s => {
          const sm = getMetricasSucursal(s);
          csv += `$${sm.presupuesto},`;
        });
        csv += '\n';
        
        csv += `Gasto,$${m.gasto},`;
        sucursales.slice(1).forEach(s => {
          const sm = getMetricasSucursal(s);
          csv += `$${sm.gasto},`;
        });
        csv += '\n';
        
        csv += `% Gasto,${porcentajeGasto}%,`;
        sucursales.slice(1).forEach(s => {
          const sm = getMetricasSucursal(s);
          const p = sm.presupuesto > 0 ? ((sm.gasto / sm.presupuesto) * 100).toFixed(1) : '0.0';
          csv += `${p}%,`;
        });
        csv += '\n';
      }
    });

    // Resumen general
    csv += '\nRESUMEN GENERAL\n';
    csv += 'Indicador,Valor\n';
    csv += `Total Eventos,${reportData.eventos?.length || 0}\n`;
    
    const insumosActivos = reportData.insumos?.filter(i => i.estado === 'activo').length || 0;
    const insumosPorVencer = reportData.insumos?.filter(i => i.estado === 'por_vencer').length || 0;
    const insumosVencidos = reportData.insumos?.filter(i => i.estado === 'vencido').length || 0;
    csv += `Insumos Activos,${insumosActivos}\n`;
    csv += `Insumos Por Vencer,${insumosPorVencer}\n`;
    csv += `Insumos Vencidos,${insumosVencidos}\n`;
    
    const tareas = getTareasCompletadas();
    csv += `Tareas Express Completadas,${tareas.completadas}/${tareas.total}\n`;

    // Checklists
    csv += '\nCHECKLIST DEL EMBUDO\n';
    const awareness = reportData.checklists?.awareness || [];
    const prospeccion = reportData.checklists?.prospeccion || [];
    const retargeting = reportData.checklists?.retargeting || [];
    
    const awarenessCompleted = awareness.filter(i => i.completed).length;
    const prospeccionCompleted = prospeccion.filter(i => i.completed).length;
    const retargetingCompleted = retargeting.filter(i => i.completed).length;
    
    csv += `Awareness,${awarenessCompleted}/${awareness.length}\n`;
    csv += `Prospección,${prospeccionCompleted}/${prospeccion.length}\n`;
    csv += `Retargeting,${retargetingCompleted}/${retargeting.length}\n`;

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_${months[selectedMonth]}_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tareasStats = getTareasCompletadas();
  const totalLeadsMeta = sucursales.reduce((sum, s) => sum + getMetricasSucursal(s).leadsMeta, 0);
  const totalLeadsGenerados = sucursales.reduce((sum, s) => sum + getMetricasSucursal(s).leadsGenerados, 0);
  const totalPresupuesto = sucursales.reduce((sum, s) => sum + getMetricasSucursal(s).presupuesto, 0);
  const totalGasto = sucursales.reduce((sum, s) => sum + getMetricasSucursal(s).gasto, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Reporte Mensual</h2>
      <p className="text-gray-600 text-sm mb-6">
        Resumen de todas las áreas por mes
      </p>

      {/* Selector de mes y año */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <Calendar className="w-5 h-5 text-gray-600" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button
            onClick={generateCSV}
            className="ml-auto flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Excel (.csv)
          </button>
        </div>

        {/* KPIs Generales */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600 mb-1">Total Leads Meta</p>
            <p className="text-2xl font-bold text-blue-700">{totalLeadsMeta.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-xs text-green-600 mb-1">Total Leads Generados</p>
            <p className="text-2xl font-bold text-green-700">{totalLeadsGenerados.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs text-purple-600 mb-1">Total Presupuesto</p>
            <p className="text-2xl font-bold text-purple-700">${totalPresupuesto.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-xs text-yellow-600 mb-1">Total Gasto</p>
            <p className="text-2xl font-bold text-yellow-700">${totalGasto.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabla de métricas por sucursal */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Métricas por Sucursal</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Métrica</th>
              {sucursales.map(s => (
                <th key={s} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {sucursalLabels[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">Leads Meta</td>
              {sucursales.map(s => (
                <td key={s} className="px-6 py-4 text-sm text-gray-800">
                  {getMetricasSucursal(s).leadsMeta.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">Leads Generados</td>
              {sucursales.map(s => (
                <td key={s} className="px-6 py-4 text-sm text-gray-800">
                  {getMetricasSucursal(s).leadsGenerados.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">Avance Leads</td>
              {sucursales.map(s => {
                const m = getMetricasSucursal(s);
                const p = m.leadsMeta > 0 ? ((m.leadsGenerados / m.leadsMeta) * 100).toFixed(1) : '0.0';
                return (
                  <td key={s} className="px-6 py-4 text-sm">
                    <span className={`font-medium ${parseFloat(p) >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {p}%
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">Presupuesto</td>
              {sucursales.map(s => (
                <td key={s} className="px-6 py-4 text-sm text-gray-800">
                  ${getMetricasSucursal(s).presupuesto.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">Gasto</td>
              {sucursales.map(s => (
                <td key={s} className="px-6 py-4 text-sm text-gray-800">
                  ${getMetricasSucursal(s).gasto.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">% Gasto</td>
              {sucursales.map(s => {
                const m = getMetricasSucursal(s);
                const p = m.presupuesto > 0 ? ((m.gasto / m.presupuesto) * 100).toFixed(1) : '0.0';
                return (
                  <td key={s} className="px-6 py-4 text-sm">
                    <span className={`font-medium ${parseFloat(p) > 80 ? 'text-red-600' : 'text-gray-800'}`}>
                      {p}%
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Resumen adicional */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Eventos</h4>
          <p className="text-3xl font-bold text-gray-800">{reportData?.eventos?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total de eventos</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Insumos</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Activos:</span>
              <span className="font-medium text-green-600">
                {reportData?.insumos?.filter(i => i.estado === 'activo').length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Por vencer:</span>
              <span className="font-medium text-yellow-600">
                {reportData?.insumos?.filter(i => i.estado === 'por_vencer').length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Vencidos:</span>
              <span className="font-medium text-red-600">
                {reportData?.insumos?.filter(i => i.estado === 'vencido').length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Tareas Express</h4>
          <p className="text-3xl font-bold text-gray-800">
            {tareasStats.completadas}/{tareasStats.total}
          </p>
          <p className="text-sm text-gray-500 mt-1">Tareas completadas</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${tareasStats.total > 0 ? (tareasStats.completadas / tareasStats.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reporte;