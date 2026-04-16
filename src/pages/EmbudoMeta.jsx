import React, { useState } from 'react';
import MetricsCard from '../components/dashboard/MetricsCard';
import ChecklistSection from '../components/dashboard/ChecklistSection';
import DriveCarousel from '../components/dashboard/DriveCarousel';

const EmbudoMeta = () => {
  const [metrics, setMetrics] = useState({
    leadsMeta: 1350,
    leadsGenerados: 337,
    presupuesto: 135000,
    gasto: 80000
  });

  const [checklists, setChecklists] = useState({
    awareness: [
      { text: 'Creativos de video para redes', completed: true },
      { text: 'Diseño de carrusel Instagram', completed: false }
    ],
    prospeccion: [
      { text: 'Landing page de captación', completed: true },
      { text: 'Formulario de contacto optimizado', completed: true }
    ],
    retargeting: [
      { text: 'Audiencia personalizada activa', completed: true },
      { text: 'Secuencia de emails configurada', completed: false }
    ]
  });

  const [driveFolders, setDriveFolders] = useState({
    awareness: '',
    prospeccion: '',
    retargeting: ''
  });

  const updateMetrics = (field, value) => {
    setMetrics(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
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

  const porcentajeLeads = ((metrics.leadsGenerados / metrics.leadsMeta) * 100).toFixed(1);
  const porcentajeGasto = ((metrics.gasto / metrics.presupuesto) * 100).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header con métricas */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Métricas Meta</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leads Meta
            </label>
            <input
              type="number"
              value={metrics.leadsMeta}
              onChange={(e) => updateMetrics('leadsMeta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <MetricsCard
            title="Leads Generados"
            value={metrics.leadsGenerados}
            subtitle={`${porcentajeLeads}% del meta`}
            color="blue"
          />
          
          <MetricsCard
            title="Avance Leads"
            value={`${porcentajeLeads}%`}
            subtitle={`${metrics.leadsGenerados} / ${metrics.leadsMeta}`}
            color="green"
          />
          
          <MetricsCard
            title="Presupuesto"
            value={`$${metrics.presupuesto.toLocaleString()}`}
            color="purple"
          />
          
          <MetricsCard
            title="Gasto"
            value={`$${metrics.gasto.toLocaleString()}`}
            subtitle={`${porcentajeGasto}% del presupuesto`}
            color="yellow"
          />
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

      {/* Artes del Embudo - Carruseles de Drive */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Artes del Embudo</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <DriveCarousel
            title="Awareness"
            folderUrl={driveFolders.awareness}
            onFolderConnect={(url) => setDriveFolders(prev => ({ ...prev, awareness: url }))}
          />
          
          <DriveCarousel
            title="Prospección"
            folderUrl={driveFolders.prospeccion}
            onFolderConnect={(url) => setDriveFolders(prev => ({ ...prev, prospeccion: url }))}
          />
          
          <DriveCarousel
            title="Retargeting"
            folderUrl={driveFolders.retargeting}
            onFolderConnect={(url) => setDriveFolders(prev => ({ ...prev, retargeting: url }))}
          />
        </div>
      </div>
    </div>
  );
};

export default EmbudoMeta;