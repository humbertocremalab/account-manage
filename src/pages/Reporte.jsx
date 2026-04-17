import React, { useState, useEffect, useRef } from 'react';
import { Calendar, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllDataForReport } from '../services/database';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Reporte = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [generatingPDF, setGeneratingPDF] = useState(false);
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
      console.log('Cargando reporte para:', user.uid, selectedMonth, selectedYear);
      
      try {
        const data = await getAllDataForReport(user.uid, selectedMonth, selectedYear);
        console.log('Datos del reporte:', data);
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

  const generatePDF = async () => {
    if (!reportRef.current) {
      console.error('Report ref is null');
      return;
    }
    
    setGeneratingPDF(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      let heightLeft = imgHeight;
      
      while (heightLeft > pageHeight - 20) {
        heightLeft -= (pageHeight - 20);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, -(imgHeight - heightLeft) + 10, imgWidth, imgHeight);
      }
      
      pdf.save(`Reporte_${months[selectedMonth]}_${selectedYear}.pdf`);
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Intenta de nuevo.');
    } finally {
      setGeneratingPDF(false);
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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reporte Mensual</h2>
        <p className="text-gray-600 text-sm">
          Resumen de todas las áreas por mes
        </p>
      </div>

      {/* Selector de mes y año */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              style={{ backgroundColor: '#ffffff' }}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              style={{ backgroundColor: '#ffffff' }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generatePDF}
            disabled={generatingPDF}
            className="flex items-center px-4 py-2 text-white rounded-lg transition-colors text-sm"
            style={{ backgroundColor: generatingPDF ? '#9CA3AF' : '#DC2626' }}
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Descargar PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contenido del reporte */}
      <div 
        ref={reportRef} 
        style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '2px solid #2563EB', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '4px' }}>Account Manager</h3>
              <p style={{ color: '#4B5563', fontSize: '16px' }}>
                Reporte Mensual - {months[selectedMonth]} {selectedYear}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                Generado: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#EFF6FF', borderRadius: '8px', padding: '16px', border: '1px solid #DBEAFE' }}>
            <p style={{ fontSize: '12px', color: '#2563EB', marginBottom: '4px' }}>Total Leads Meta</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D4ED8' }}>{totalLeadsMeta.toLocaleString()}</p>
          </div>
          <div style={{ backgroundColor: '#F0FDF4', borderRadius: '8px', padding: '16px', border: '1px solid #DCFCE7' }}>
            <p style={{ fontSize: '12px', color: '#16A34A', marginBottom: '4px' }}>Total Leads Generados</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803D' }}>{totalLeadsGenerados.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: '#22C55E', marginTop: '4px' }}>
              {totalLeadsMeta > 0 ? ((totalLeadsGenerados / totalLeadsMeta) * 100).toFixed(1) : '0.0'}% del meta
            </p>
          </div>
          <div style={{ backgroundColor: '#F5F3FF', borderRadius: '8px', padding: '16px', border: '1px solid #EDE9FE' }}>
            <p style={{ fontSize: '12px', color: '#7C3AED', marginBottom: '4px' }}>Total Presupuesto</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6D28D9' }}>${totalPresupuesto.toLocaleString()}</p>
          </div>
          <div style={{ backgroundColor: '#FEFCE8', borderRadius: '8px', padding: '16px', border: '1px solid #FEF08A' }}>
            <p style={{ fontSize: '12px', color: '#CA8A04', marginBottom: '4px' }}>Total Gasto</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#A16207' }}>${totalGasto.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: '#EAB308', marginTop: '4px' }}>
              {totalPresupuesto > 0 ? ((totalGasto / totalPresupuesto) * 100).toFixed(1) : '0.0'}% del presupuesto
            </p>
          </div>
        </div>

        {/* Tabla de métricas */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '12px', fontSize: '16px' }}>Métricas por Sucursal</h4>
          <table style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}>Métrica</th>
                {sucursales.map(s => (
                  <th key={s} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}>
                    {sucursalLabels[s]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', fontWeight: '500', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>Leads Meta</td>
                {sucursales.map(s => (
                  <td key={s} style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', borderBottom: '1px solid #E5E7EB' }}>
                    {getMetricasSucursal(s).leadsMeta.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', fontWeight: '500', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>Leads Generados</td>
                {sucursales.map(s => (
                  <td key={s} style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', borderBottom: '1px solid #E5E7EB' }}>
                    {getMetricasSucursal(s).leadsGenerados.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', fontWeight: '500', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>Avance</td>
                {sucursales.map(s => {
                  const m = getMetricasSucursal(s);
                  const p = m.leadsMeta > 0 ? ((m.leadsGenerados / m.leadsMeta) * 100).toFixed(1) : '0.0';
                  return (
                    <td key={s} style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
                      <span style={{ fontWeight: '500', color: parseFloat(p) >= 50 ? '#16A34A' : '#CA8A04' }}>
                        {p}%
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', fontWeight: '500', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>Presupuesto</td>
                {sucursales.map(s => (
                  <td key={s} style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', borderBottom: '1px solid #E5E7EB' }}>
                    ${getMetricasSucursal(s).presupuesto.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', fontWeight: '500', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>Gasto</td>
                {sucursales.map(s => (
                  <td key={s} style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', borderBottom: '1px solid #E5E7EB' }}>
                    ${getMetricasSucursal(s).gasto.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937', fontWeight: '500', backgroundColor: '#F9FAFB' }}>% Gasto</td>
                {sucursales.map(s => {
                  const m = getMetricasSucursal(s);
                  const p = m.presupuesto > 0 ? ((m.gasto / m.presupuesto) * 100).toFixed(1) : '0.0';
                  return (
                    <td key={s} style={{ padding: '12px 16px', fontSize: '14px' }}>
                      <span style={{ fontWeight: '500', color: parseFloat(p) > 80 ? '#DC2626' : '#1F2937' }}>
                        {p}%
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', border: '1px solid #E5E7EB' }}>
            <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '8px', fontSize: '14px' }}>Eventos</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }}>{reportData?.eventos?.length || 0}</p>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Total de eventos</p>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', border: '1px solid #E5E7EB' }}>
            <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '8px', fontSize: '14px' }}>Insumos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#4B5563' }}>Activos:</span>
                <span style={{ fontWeight: '500', color: '#16A34A' }}>
                  {reportData?.insumos?.filter(i => i.estado === 'activo').length || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#4B5563' }}>Por vencer:</span>
                <span style={{ fontWeight: '500', color: '#CA8A04' }}>
                  {reportData?.insumos?.filter(i => i.estado === 'por_vencer').length || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#4B5563' }}>Vencidos:</span>
                <span style={{ fontWeight: '500', color: '#DC2626' }}>
                  {reportData?.insumos?.filter(i => i.estado === 'vencido').length || 0}
                </span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', border: '1px solid #E5E7EB' }}>
            <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '8px', fontSize: '14px' }}>Tareas Express</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }}>
              {tareasStats.completadas}/{tareasStats.total}
            </p>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Tareas completadas</p>
            <div style={{ marginTop: '8px', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  backgroundColor: '#16A34A', 
                  borderRadius: '9999px',
                  width: `${tareasStats.total > 0 ? (tareasStats.completadas / tareasStats.total) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', border: '1px solid #E5E7EB' }}>
            <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '8px', fontSize: '14px' }}>Checklist Embudo</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#4B5563' }}>Awareness:</span>
                <span style={{ fontWeight: '500' }}>{awarenessCompleted}/{awareness.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#4B5563' }}>Prospección:</span>
                <span style={{ fontWeight: '500' }}>{prospeccionCompleted}/{prospeccion.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#4B5563' }}>Retargeting:</span>
                <span style={{ fontWeight: '500' }}>{retargetingCompleted}/{retargeting.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Account Manager - Reporte generado automáticamente</p>
        </div>
      </div>
    </div>
  );
};

export default Reporte;