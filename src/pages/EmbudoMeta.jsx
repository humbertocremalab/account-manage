import React, { useState, useEffect } from 'react';
import { Edit, Plus, FolderOpen, Calendar, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveMetrics, loadMetrics, saveChecklists, loadChecklists, saveDriveFolders, loadDriveFolders } from '../services/database';
import MetricsCard from '../components/dashboard/MetricsCard';
import ChecklistSection from '../components/dashboard/ChecklistSection';
import DriveCarousel from '../components/dashboard/DriveCarousel';
import EditMetricsPopup from '../components/dashboard/EditMetricsPopup';
import AddDriveFolderPopup from '../components/dashboard/AddDriveFolderPopup';
import LeadsCalendar from '../components/dashboard/LeadsCalendar';

const EmbudoMeta = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sucursalActiva, setSucursalActiva] = useState('monterrey');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDrivePopup, setShowDrivePopup] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('awareness');
  const [leadsDiarios, setLeadsDiarios] = useState({});
  
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = [2025, 2026, 2027];

  const defaultMetrics = {
    monterrey: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 },
    saltillo: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 },
    cdmx: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 }
  };

  const defaultChecklists = {
    awareness: [],
    prospeccion: [],
    retargeting: []
  };

  const defaultDriveFolders = {
    awareness: null,
    prospeccion: null,
    retargeting: null
  };

  const [metrics, setMetrics] = useState(defaultMetrics);
  const [checklists, setChecklists] = useState(defaultChecklists);
  const [driveFolders, setDriveFolders] = useState(defaultDriveFolders);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const savedMetrics = await loadMetrics(selectedMonth, selectedYear);
        if (savedMetrics) {
          setMetrics(savedMetrics);
        } else if (isAdmin) {
          const exampleMetrics = {
            monterrey: { leadsMeta: 1350, leadsGenerados: 337, presupuesto: 135000, gasto: 80000 },
            saltillo: { leadsMeta: 850, leadsGenerados: 189, presupuesto: 85000, gasto: 42500 },
            cdmx: { leadsMeta: 620, leadsGenerados: 142, presupuesto: 72000, gasto: 38200 }
          };
          setMetrics(exampleMetrics);
          await saveMetrics(selectedMonth, selectedYear, exampleMetrics);
        }

        const savedChecklists = await loadChecklists(selectedMonth, selectedYear);
        if (savedChecklists) {
          setChecklists(savedChecklists);
        } else if (isAdmin) {
          const exampleChecklists = {
            awareness: [
              { text: 'Creativos de video para redes', completed: false },
              { text: 'Diseño de carrusel Instagram', completed: false }
            ],
            prospeccion: [
              { text: 'Landing page de captación', completed: false },
              { text: 'Formulario de contacto optimizado', completed: false }
            ],
            retargeting: [
              { text: 'Audiencia personalizada activa', completed: false },
              { text: 'Secuencia de emails configurada', completed: false }
            ]
          };
          setChecklists(exampleChecklists);
          await saveChecklists(selectedMonth, selectedYear, exampleChecklists);
        }

        const savedFolders = await loadDriveFolders();
        if (savedFolders) {
          setDriveFolders(savedFolders);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [selectedMonth, selectedYear, isAdmin]);

  const handleSaveMetrics = async (newMetrics) => {
    if (!isAdmin) return;
    
    setMetrics(newMetrics);
    await saveMetrics(selectedMonth, selectedYear, newMetrics);
  };

  const handleChecklistUpdate = async (section, action, index, value = null) => {
    if (!isAdmin) return;
    
    const newChecklists = { ...checklists };
    const newSection = [...newChecklists[section]];
    
    if (action === 'add') {
      newSection.push({ text: value, completed: false });
    } else if (action === 'toggle') {
      newSection[index].completed = !newSection[index].completed;
    } else if (action === 'delete') {
      newSection.splice(index, 1);
    }
    
    newChecklists[section] = newSection;
    setChecklists(newChecklists);
    
    await saveChecklists(selectedMonth, selectedYear, newChecklists);
  };

  const handleAddDriveFolder = async (folderData) => {
    if (!isAdmin) return;
    
    const newFolders = {
      ...driveFolders,
      [folderData.categoria]: {
        nombre: folderData.nombre,
        url: folderData.url,
        categoria: folderData.categoria
      }
    };
    setDriveFolders(newFolders);
    await saveDriveFolders(newFolders);
  };

  const handleRemoveDriveFolder = async (categoria) => {
    if (!isAdmin) return;
    
    const newFolders = {
      ...driveFolders,
      [categoria]: null
    };
    setDriveFolders(newFolders);
    await saveDriveFolders(newFolders);
  };

  const handleOpenDrivePopup = (categoria = 'awareness') => {
    if (!isAdmin) return;
    setCategoriaSeleccionada(categoria);
    setShowDrivePopup(true);
  };

  // Función para actualizar leads diarios
  const handleUpdateLeadsDiarios = (date, value) => {
    if (!isAdmin) return;
    
    const updatedLeads = { ...leadsDiarios };
    if (value === '' || value === 0 || value === '0') {
      delete updatedLeads[date];
    } else {
      updatedLeads[date] = parseInt(value) || 0;
    }
    setLeadsDiarios(updatedLeads);
  };

  const sucursales = [
    { id: 'monterrey', label: 'Monterrey' },
    { id: 'saltillo', label: 'Saltillo' },
    { id: 'cdmx', label: 'CDMX' }
  ];

  const metricsActuales = metrics[sucursalActiva] || defaultMetrics.monterrey;
  const porcentajeLeads = metricsActuales.leadsMeta > 0 
    ? ((metricsActuales.leadsGenerados / metricsActuales.leadsMeta) * 100).toFixed(1)
    : '0.0';
  const porcentajeGasto = metricsActuales.presupuesto > 0
    ? ((metricsActuales.gasto / metricsActuales.presupuesto) * 100).toFixed(1)
    : '0.0';

  // Calcular totales de las tres sucursales
  const totalLeadsMeta = (metrics.monterrey?.leadsMeta || 0) + 
                         (metrics.saltillo?.leadsMeta || 0) + 
                         (metrics.cdmx?.leadsMeta || 0);

  const totalLeadsGenerados = (metrics.monterrey?.leadsGenerados || 0) + 
                              (metrics.saltillo?.leadsGenerados || 0) + 
                              (metrics.cdmx?.leadsGenerados || 0);

  const porcentajeTotalLeads = totalLeadsMeta > 0 
    ? ((totalLeadsGenerados / totalLeadsMeta) * 100).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {!isAdmin && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center">
          <Lock className="w-4 h-4 text-yellow-600 mr-2" />
          <span className="text-sm text-yellow-700">Modo solo lectura - No puedes editar</span>
        </div>
      )}

      {/* Selector de mes */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <span className="text-sm text-gray-500 sm:ml-auto">
            Métricas para {months[selectedMonth]} {selectedYear}
          </span>
        </div>
      </div>

      {/* Métricas Meta */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Métricas Meta</h2>
          {isAdmin && (
            <button
              onClick={() => setShowEditPopup(true)}
              className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </button>
          )}
        </div>
        
        {/* Pestañas de sucursales */}
        <div className="flex space-x-2 border-b border-gray-200 mb-4 overflow-x-auto">
          {sucursales.map(sucursal => (
            <button
              key={sucursal.id}
              onClick={() => setSucursalActiva(sucursal.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                sucursalActiva === sucursal.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {sucursal.label}
              {sucursalActiva === sucursal.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tarjetas de métricas por sucursal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <MetricsCard
            title="Leads Meta"
            value={metricsActuales.leadsMeta.toLocaleString()}
            color="blue"
          />
          
          <MetricsCard
            title="Leads Generados"
            value={metricsActuales.leadsGenerados.toLocaleString()}
            subtitle={`${porcentajeLeads}% del meta`}
            color="green"
          />
          
          <MetricsCard
            title="Presupuesto"
            value={`$${metricsActuales.presupuesto.toLocaleString()}`}
            color="purple"
          />
          
          <MetricsCard
            title="Gasto"
            value={`$${metricsActuales.gasto.toLocaleString()}`}
            subtitle={`${porcentajeGasto}% del presupuesto`}
            color="yellow"
          />
        </div>

        {/* Total Leads */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Leads Meta</p>
            <p className="text-2xl font-bold">{totalLeadsMeta.toLocaleString()}</p>
            <p className="text-xs opacity-80 mt-1">3 sucursales</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Leads Generados</p>
            <p className="text-2xl font-bold">{totalLeadsGenerados.toLocaleString()}</p>
            <p className="text-xs opacity-80 mt-1">{porcentajeTotalLeads}% del meta total</p>
          </div>
        </div>

        {/* Leads generados vs meta */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">
            Leads generados vs meta ({sucursales.find(s => s.id === sucursalActiva)?.label})
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800">
              {metricsActuales.leadsGenerados.toLocaleString()} / {metricsActuales.leadsMeta.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              ({porcentajeLeads}%)
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${porcentajeLeads}%` }}
            />
          </div>
        </div>

        {/* Leads Diarios - Calendario */}
        <div className="mt-6">
          <LeadsCalendar 
            leadsDiarios={leadsDiarios}
            onUpdateLeads={handleUpdateLeadsDiarios}
            readOnly={!isAdmin}
          />
        </div>
      </div>

      {/* Checklist del Embudo */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Checklist del Embudo</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChecklistSection
            title="Awareness"
            items={checklists.awareness}
            onAddItem={isAdmin ? (text) => handleChecklistUpdate('awareness', 'add', null, text) : null}
            onToggleItem={isAdmin ? (index) => handleChecklistUpdate('awareness', 'toggle', index) : null}
            onDeleteItem={isAdmin ? (index) => handleChecklistUpdate('awareness', 'delete', index) : null}
            readOnly={!isAdmin}
          />
          
          <ChecklistSection
            title="Prospección"
            items={checklists.prospeccion}
            onAddItem={isAdmin ? (text) => handleChecklistUpdate('prospeccion', 'add', null, text) : null}
            onToggleItem={isAdmin ? (index) => handleChecklistUpdate('prospeccion', 'toggle', index) : null}
            onDeleteItem={isAdmin ? (index) => handleChecklistUpdate('prospeccion', 'delete', index) : null}
            readOnly={!isAdmin}
          />
          
          <ChecklistSection
            title="Retargeting"
            items={checklists.retargeting}
            onAddItem={isAdmin ? (text) => handleChecklistUpdate('retargeting', 'add', null, text) : null}
            onToggleItem={isAdmin ? (index) => handleChecklistUpdate('retargeting', 'toggle', index) : null}
            onDeleteItem={isAdmin ? (index) => handleChecklistUpdate('retargeting', 'delete', index) : null}
            readOnly={!isAdmin}
          />
        </div>
      </div>

      {/* Artes del Embudo */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Artes del Embudo</h3>
        
        <div className="space-y-4">
          {driveFolders.awareness && (
            <div className="bg-gray-50 rounded-xl p-4">
              <DriveCarousel 
                folderData={{...driveFolders.awareness, categoria: 'awareness'}}
                onRemove={isAdmin ? handleRemoveDriveFolder : null}
                readOnly={!isAdmin}
              />
            </div>
          )}
          
          {driveFolders.prospeccion && (
            <div className="bg-gray-50 rounded-xl p-4">
              <DriveCarousel 
                folderData={{...driveFolders.prospeccion, categoria: 'prospeccion'}}
                onRemove={isAdmin ? handleRemoveDriveFolder : null}
                readOnly={!isAdmin}
              />
            </div>
          )}
          
          {driveFolders.retargeting && (
            <div className="bg-gray-50 rounded-xl p-4">
              <DriveCarousel 
                folderData={{...driveFolders.retargeting, categoria: 'retargeting'}}
                onRemove={isAdmin ? handleRemoveDriveFolder : null}
                readOnly={!isAdmin}
              />
            </div>
          )}

          {!driveFolders.awareness && !driveFolders.prospeccion && !driveFolders.retargeting && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">
                No hay carpetas de Drive conectadas
              </p>
              {isAdmin && (
                <>
                  <p className="text-sm text-gray-400 mb-4">
                    Agrega el ID de una carpeta pública de Google Drive
                  </p>
                  <button
                    onClick={() => handleOpenDrivePopup('awareness')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar carpeta
                  </button>
                </>
              )}
            </div>
          )}

          {isAdmin && (driveFolders.awareness || driveFolders.prospeccion || driveFolders.retargeting) && (
            <button
              onClick={() => handleOpenDrivePopup('awareness')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar carpeta Drive
            </button>
          )}
        </div>
      </div>

      {/* Popups */}
      {isAdmin && (
        <>
          <EditMetricsPopup
            isOpen={showEditPopup}
            onClose={() => setShowEditPopup(false)}
            metrics={metrics}
            onSave={handleSaveMetrics}
          />

          <AddDriveFolderPopup
            isOpen={showDrivePopup}
            onClose={() => setShowDrivePopup(false)}
            onAdd={handleAddDriveFolder}
            categoria={categoriaSeleccionada}
          />
        </>
      )}
    </div>
  );
};

export default EmbudoMeta;