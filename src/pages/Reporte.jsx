import React, { useState, useEffect, useRef } from 'react';
import { Download, Calendar, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllDataForReport } from '../services/database';
import html2canvas from 'html2canvas';

const Reporte = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [generatingImage, setGeneratingImage] = useState(false);
  const reportRef = useRef(null);

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
        const data = await getAllDataForReport(user.uid, selectedMonth, selectedYear);
        console.log('Report data loaded:', data);
        setReportData(data);
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [user, selectedMonth, selectedYear]);

  const getMetricasSucursal = (sucursal) => {
    if (!reportData?.metrics) {
      return { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 };
    }
    return reportData.metrics[sucursal] || { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 };
  };

  const getTareasCompletadas = () => {
    if (!reportData?.tareasExpress) return { total: 0, completadas: 0 };
    const total = reportData.tareasExpress.length;
    const completadas = reportData.tareasExpress.filter(t => t.estado === 'completada').length;
    return { total, completadas };
  };

  const generateImage = async () => {
    if (!reportRef.current) {
      console.error('Report ref is null');
      return;
    }
    
    setGeneratingImage(true);
    console.log('Generating image...');
    
    try {
      // Pequeño delay para asegurar que todo esté renderizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: true,
        allowTaint: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          console.log('Document cloned for capture');
        }
      });
      
      console.log('Canvas created:', canvas.width, 'x', canvas.height);
      
      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `Reporte_${months[selectedMonth]}_${selectedYear}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          console.log('Image downloaded successfully');
        } else {
          console.error('Failed to create blob');
          // Fallback: usar dataURL
          const link = document.createElement('a');
          link.download = `Reporte_${months[selectedMonth]}_${selectedYear}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error al generar la imagen: ' + error.message);
    } finally {
      setGeneratingImage(false);
    }
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
  
  const awareness = reportData?.checklists?.awareness || [];
  const prospeccion = reportData?.checklists?.prospeccion || [];
  const retargeting = reportData?.checklists?.retargeting || [];
  
  const awarenessCompleted = awareness.filter(i => i.completed).length;
  const prospeccionCompleted = prospeccion.filter(i => i.completed).length;
  const retargetingCompleted = retargeting.filter(i => i.completed).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Reporte Mensual</h2>
      <p className="text-gray-600 text-sm mb-6">
        Resumen de todas las áreas por mes
      </p>

      {/* Selector de mes y año */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
          </div>

          <button
            onClick={generateImage}
            disabled={generatingImage}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {generatingImage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generando...
              </>
            ) : (
              <>
                <Image className="w-4 h-4 mr-2" />
                Descargar Imagen (.png)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contenido del reporte (se capturará como imagen) */}
      <div 
        ref={reportRef} 
        className="bg-white rounded-xl p-6" 
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header del reporte */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800">Account Manager</h3>
          <p className="text-gray-600">
            Reporte Mensual - {months[selectedMonth]} {selectedYear}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Generado: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* KPIs Generales */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">Total Leads Meta</p>
            <p className="text-2xl font-bold text-blue-700">{totalLeadsMeta.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-xs text-green-600 mb-1">Total Leads Generados</p>
            <p className="text-2xl font-bold text-green-700">{totalLeadsGenerados.toLocaleString()}</p>
            <p className="text-xs text-green-500 mt-1">
              {totalLeadsMeta > 0 ? ((totalLeadsGenerados / totalLeadsMeta) * 100).toFixed(1) : '0.0'}% del meta
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <p className="text-xs text-purple-600 mb-1">Total Presupuesto</p>
            <p className="text-2xl font-bold text-purple-700">${totalPresupuesto.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <p className="text-xs text-yellow-600 mb-1">Total Gasto</p>
            <p className="text-2xl font-bold text-yellow-700">${totalGasto.toLocaleString()}</p>
            <p className="text-xs text-yellow-500 mt-1">
              {totalPresupuesto > 0 ? ((totalGasto / totalPresupuesto) * 100).toFixed(1) : '0.0'}% del presupuesto
            </p>
          </div>
        </div>

        {/* Tabla de métricas por sucursal */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Métricas por Sucursal</h4>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">Métrica</th>
                {sucursales.map(s => (
                  <th key={s} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">
                    {sucursalLabels[s]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium bg-gray-50">Leads Meta</td>
                {sucursales.map(s => (
                  <td key={s} className="px-4 py-3 text-sm text-gray-800">
                    {getMetricasSucursal(s).leadsMeta.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium bg-gray-50">Leads Generados</td>
                {sucursales.map(s => (
                  <td key={s} className="px-4 py-3 text-sm text-gray-800">
                    {getMetricasSucursal(s).leadsGenerados.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium bg-gray-50">Avance</td>
                {sucursales.map(s => {
                  const m = getMetricasSucursal(s);
                  const p = m.leadsMeta > 0 ? ((m.leadsGenerados / m.leadsMeta) * 100).toFixed(1) : '0.0';
                  return (
                    <td key={s} className="px-4 py-3 text-sm">
                      <span className={`font-medium ${parseFloat(p) >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {p}%
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium bg-gray-50">Presupuesto</td>
                {sucursales.map(s => (
                  <td key={s} className="px-4 py-3 text-sm text-gray-800">
                    ${getMetricasSucursal(s).presupuesto.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium bg-gray-50">Gasto</td>
                {sucursales.map(s => (
                  <td key={s} className="px-4 py-3 text-sm text-gray-800">
                    ${getMetricasSucursal(s).gasto.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium bg-gray-50">% Gasto</td>
                {sucursales.map(s => {
                  const m = getMetricasSucursal(s);
                  const p = m.presupuesto > 0 ? ((m.gasto / m.presupuesto) * 100).toFixed(1) : '0.0';
                  return (
                    <td key={s} className="px-4 py-3 text-sm">
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
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Eventos</h4>
            <p className="text-2xl font-bold text-gray-800">{reportData?.eventos?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total de eventos</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Insumos</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Activos:</span>
                <span className="font-medium text-green-600">
                  {reportData?.insumos?.filter(i => i.estado === 'activo').length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Por vencer:</span>
                <span className="font-medium text-yellow-600">
                  {reportData?.insumos?.filter(i => i.estado === 'por_vencer').length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vencidos:</span>
                <span className="font-medium text-red-600">
                  {reportData?.insumos?.filter(i => i.estado === 'vencido').length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Tareas Express</h4>
            <p className="text-2xl font-bold text-gray-800">
              {tareasStats.completadas}/{tareasStats.total}
            </p>
            <p className="text-xs text-gray-500 mt-1">Tareas completadas</p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${tareasStats.total > 0 ? (tareasStats.completadas / tareasStats.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Checklist Embudo</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Awareness:</span>
                <span className="font-medium">{awarenessCompleted}/{awareness.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prospección:</span>
                <span className="font-medium">{prospeccionCompleted}/{prospeccion.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Retargeting:</span>
                <span className="font-medium">{retargetingCompleted}/{retargeting.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">Account Manager - Reporte generado automáticamente</p>
        </div>
      </div>
    </div>
  );
};

export default Reporte;