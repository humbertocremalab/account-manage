import React, { useState, useEffect } from 'react';
import { Edit, Plus, FolderOpen, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveMetrics, loadMetrics, saveChecklists, loadChecklists, saveDriveFolders, loadDriveFolders } from '../services/database';
import MetricsCard from '../components/dashboard/MetricsCard';
import ChecklistSection from '../components/dashboard/ChecklistSection';
import DriveCarousel from '../components/dashboard/DriveCarousel';
import EditMetricsPopup from '../components/dashboard/EditMetricsPopup';
import AddDriveFolderPopup from '../components/dashboard/AddDriveFolderPopup';

const EmbudoMeta = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sucursalActiva, setSucursalActiva] = useState('monterrey');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDrivePopup, setShowDrivePopup] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('awareness');
  
  // Selector de mes y año
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

  // Cargar datos cuando cambia el mes
  useEffect(() => {
    const loadAllData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Cargar métricas del mes seleccionado
        const savedMetrics = await loadMetrics(selectedMonth, selectedYear);
        if (savedMetrics) {
          setMetrics(savedMetrics);
        } else {
          // Si no hay datos para este mes, iniciar con ejemplo o vacío
          const exampleMetrics = {
            monterrey: { leadsMeta: 1350, leadsGenerados: 0, presupuesto: 135000, gasto: 0 },
            saltillo: { leadsMeta: 850, leadsGenerados: 0, presupuesto: 85000, gasto: 0 },
            cdmx: { leadsMeta: 620, leadsGenerados: 0, presupuesto: 72000, gasto: 0 }
          };
          setMetrics(exampleMetrics);
          await saveMetrics(user.uid, selectedMonth, selectedYear, exampleMetrics);
        }

        // Cargar checklists del mes seleccionado
        const savedChecklists = await loadChecklists(user.uid, selectedMonth, selectedYear);
        if (savedChecklists) {
          setChecklists(savedChecklists);
        } else {
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
          await saveChecklists(user.uid, selectedMonth, selectedYear, exampleChecklists);
        }

        // Cargar drive folders (no dependen del mes)
        const savedFolders = await loadDriveFolders(user.uid);
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
  }, [user, selectedMonth, selectedYear]);

  const handleSaveMetrics = async (newMetrics) => {
    const updatedMetrics = {
      ...metrics,
      [sucursalActiva]: newMetrics
    };
    setMetrics(updatedMetrics);
    if (user) {
      await saveMetrics(selectedMonth, selectedYear, updatedMetrics);
    }
  };

  const handleChecklistUpdate = async (section, action, index, value = null) => {
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
    
    if (user) {
      await saveChecklists(selectedMonth, selectedYear, newChecklists);
    }
  };

  const handleAddDriveFolder = async (folderData) => {
    const newFolders = {
      ...driveFolders,
      [folderData.categoria]: {
        nombre: folderData.nombre,
        url: folderData.url,
        categoria: folderData.categoria
      }
    };
    setDriveFolders(newFolders);
    
    if (user) {
      await saveDriveFolders(newFolders);
    }
  };

  const handleRemoveDriveFolder = async (categoria) => {
    const newFolders = {
      ...driveFolders,
      [categoria]: null
    };
    setDriveFolders(newFolders);
    
    if (user) {
      await saveDriveFolders(newFolders);
    }
  };

  const handleOpenDrivePopup = (categoria = 'awareness') => {
    setCategoriaSeleccionada(categoria);
    setShowDrivePopup(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Selector de mes y año */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
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

          <span className="text-sm text-gray-500 ml-auto">
            Métricas para {months[selectedMonth]} {selectedYear}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Métricas Meta</h2>
          <button
            onClick={() => setShowEditPopup(true)}
            className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
        </div>
        
        <div className="flex space-x-2 border-b border-gray-200 mb-4">
          {sucursales.map(sucursal => (
            <button
              key={sucursal.id}
              onClick={() => setSucursalActiva(sucursal.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Leads generados vs meta</p>
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
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Checklist del Embudo</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <ChecklistSection
            title="Awareness"
            items={checklists.awareness}
            onAddItem={(text) => handleChecklistUpdate('awareness', 'add', null, text)}
            onToggleItem={(index) => handleChecklistUpdate('awareness', 'toggle', index)}
            onDeleteItem={(index) => handleChecklistUpdate('awareness', 'delete', index)}
          />
          
          <ChecklistSection
            title="Prospección"
            items={checklists.prospeccion}
            onAddItem={(text) => handleChecklistUpdate('prospeccion', 'add', null, text)}
            onToggleItem={(index) => handleChecklistUpdate('prospeccion', 'toggle', index)}
            onDeleteItem={(index) => handleChecklistUpdate('prospeccion', 'delete', index)}
          />
          
          <ChecklistSection
            title="Retargeting"
            items={checklists.retargeting}
            onAddItem={(text) => handleChecklistUpdate('retargeting', 'add', null, text)}
            onToggleItem={(index) => handleChecklistUpdate('retargeting', 'toggle', index)}
            onDeleteItem={(index) => handleChecklistUpdate('retargeting', 'delete', index)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Artes del Embudo</h3>
        
        <div className="space-y-4">
          {driveFolders.awareness && (
            <div className="bg-gray-50 rounded-xl p-4">
              <DriveCarousel 
                folderData={{...driveFolders.awareness, categoria: 'awareness'}}
                onRemove={handleRemoveDriveFolder}
              />
            </div>
          )}
          
          {driveFolders.prospeccion && (
            <div className="bg-gray-50 rounded-xl p-4">
              <DriveCarousel 
                folderData={{...driveFolders.prospeccion, categoria: 'prospeccion'}}
                onRemove={handleRemoveDriveFolder}
              />
            </div>
          )}
          
          {driveFolders.retargeting && (
            <div className="bg-gray-50 rounded-xl p-4">
              <DriveCarousel 
                folderData={{...driveFolders.retargeting, categoria: 'retargeting'}}
                onRemove={handleRemoveDriveFolder}
              />
            </div>
          )}

          {!driveFolders.awareness && !driveFolders.prospeccion && !driveFolders.retargeting && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">
                No hay carpetas de Drive conectadas
              </p>
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
            </div>
          )}

          {(driveFolders.awareness || driveFolders.prospeccion || driveFolders.retargeting) && (
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

      <EditMetricsPopup
        isOpen={showEditPopup}
        onClose={() => setShowEditPopup(false)}
        metrics={metricsActuales}
        onSave={handleSaveMetrics}
        sucursal={sucursales.find(s => s.id === sucursalActiva)?.label}
      />

      <AddDriveFolderPopup
        isOpen={showDrivePopup}
        onClose={() => setShowDrivePopup(false)}
        onAdd={handleAddDriveFolder}
        categoria={categoriaSeleccionada}
      />
    </div>
  );
};

export default EmbudoMeta;