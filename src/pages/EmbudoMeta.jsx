import React, { useState } from 'react';
import { Edit, Plus, FolderOpen } from 'lucide-react';
import MetricsCard from '../components/dashboard/MetricsCard';
import ChecklistSection from '../components/dashboard/ChecklistSection';
import DriveCarousel from '../components/dashboard/DriveCarousel';
import EditMetricsPopup from '../components/dashboard/EditMetricsPopup';
import AddDriveFolderPopup from '../components/dashboard/AddDriveFolderPopup';

const EmbudoMeta = () => {
  const [sucursalActiva, setSucursalActiva] = useState('monterrey');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDrivePopup, setShowDrivePopup] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('awareness');

  const [metrics, setMetrics] = useState({
    monterrey: {
      leadsMeta: 1350,
      leadsGenerados: 337,
      presupuesto: 135000,
      gasto: 80000
    },
    saltillo: {
      leadsMeta: 850,
      leadsGenerados: 189,
      presupuesto: 85000,
      gasto: 42500
    },
    cdmx: {
      leadsMeta: 620,
      leadsGenerados: 142,
      presupuesto: 72000,
      gasto: 38200
    }
  });

  const [checklists, setChecklists] = useState({
    awareness: [
      { text: 'Creativos de video para redes', completed: true },
      { text: 'Diseño de carrusel Instagram', completed: false }
    ],
    prospeccion: [
      { text: 'Landing page de captación', completed: true },
      { text: 'Formulario de contacto optimizado', completed: false }
    ],
    retargeting: [
      { text: 'Audiencia personalizada activa', completed: true },
      { text: 'Secuencia de emails configurada', completed: false }
    ]
  });

  const [driveFolders, setDriveFolders] = useState({
    awareness: null,
    prospeccion: null,
    retargeting: null
  });

  const sucursales = [
    { id: 'monterrey', label: 'Monterrey' },
    { id: 'saltillo', label: 'Saltillo' },
    { id: 'cdmx', label: 'CDMX' }
  ];

  const metricsActuales = metrics[sucursalActiva];

  const handleSaveMetrics = (newMetrics) => {
    setMetrics(prev => ({
      ...prev,
      [sucursalActiva]: newMetrics
    }));
  };

  const handleChecklistUpdate = (section, action, index, value = null) => {
    setChecklists(prev => {
      const newSection = [...prev[section]];
      
      if (action === 'add') {
        newSection.push({ text: value, completed: false });
      } else if (action === 'toggle') {
        newSection[index].completed = !newSection[index].completed;
      } else if (action === 'delete') {
        newSection.splice(index, 1);
      }
      
      return { ...prev, [section]: newSection };
    });
  };

  const handleAddDriveFolder = (folderData) => {
    setDriveFolders(prev => ({
      ...prev,
      [folderData.categoria]: {
        nombre: folderData.nombre,
        url: folderData.url,
        categoria: folderData.categoria
      }
    }));
  };

  const handleRemoveDriveFolder = (categoria) => {
    setDriveFolders(prev => ({
      ...prev,
      [categoria]: null
    }));
  };

  const handleOpenDrivePopup = (categoria = 'awareness') => {
    setCategoriaSeleccionada(categoria);
    setShowDrivePopup(true);
  };

  const porcentajeLeads = ((metricsActuales.leadsGenerados / metricsActuales.leadsMeta) * 100).toFixed(1);
  const porcentajeGasto = ((metricsActuales.gasto / metricsActuales.presupuesto) * 100).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Selector de sucursales */}
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
        
        {/* Pestañas de sucursales */}
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

        {/* Métricas */}
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

        {/* Leads generados vs meta */}
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

      {/* Checklists */}
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

      {/* Artes del Embudo */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Artes del Embudo</h3>
        </div>
        
        {/* Si no hay ninguna carpeta conectada */}
        {!driveFolders.awareness && !driveFolders.prospeccion && !driveFolders.retargeting ? (
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
        ) : (
          <div className="space-y-4">
            {/* Awareness */}
            {driveFolders.awareness ? (
              <div className="bg-gray-50 rounded-xl p-4">
                <DriveCarousel 
                  folderData={{...driveFolders.awareness, categoria: 'awareness'}}
                  onRemove={handleRemoveDriveFolder}
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <h4 className="font-medium text-gray-700">Awareness</h4>
                  </div>
                  <button
                    onClick={() => handleOpenDrivePopup('awareness')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar carpeta
                  </button>
                </div>
              </div>
            )}

            {/* Prospección */}
            {driveFolders.prospeccion ? (
              <div className="bg-gray-50 rounded-xl p-4">
                <DriveCarousel 
                  folderData={{...driveFolders.prospeccion, categoria: 'prospeccion'}}
                  onRemove={handleRemoveDriveFolder}
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <h4 className="font-medium text-gray-700">Prospección</h4>
                  </div>
                  <button
                    onClick={() => handleOpenDrivePopup('prospeccion')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar carpeta
                  </button>
                </div>
              </div>
            )}

            {/* Retargeting */}
            {driveFolders.retargeting ? (
              <div className="bg-gray-50 rounded-xl p-4">
                <DriveCarousel 
                  folderData={{...driveFolders.retargeting, categoria: 'retargeting'}}
                  onRemove={handleRemoveDriveFolder}
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <h4 className="font-medium text-gray-700">Retargeting</h4>
                  </div>
                  <button
                    onClick={() => handleOpenDrivePopup('retargeting')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar carpeta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popups */}
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