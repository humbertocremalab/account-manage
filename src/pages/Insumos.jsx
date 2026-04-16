import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveInsumos, loadInsumos } from '../services/database';
import InsumoCard from '../components/insumos/InsumoCard';
import InsumoPopup from '../components/insumos/InsumoPopup';
import ResumenInsumos from '../components/insumos/ResumenInsumos';

const Insumos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [insumos, setInsumos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [insumoEditando, setInsumoEditando] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const savedInsumos = await loadInsumos(user.uid);
        if (savedInsumos) {
          setInsumos(savedInsumos);
        }
      } catch (error) {
        console.error('Error loading insumos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const saveInsumosToDB = async (updatedInsumos) => {
    if (user) {
      await saveInsumos(user.uid, updatedInsumos);
    }
  };

  const handleAddInsumo = async (nuevoInsumo) => {
    const updatedInsumos = [...insumos, nuevoInsumo];
    setInsumos(updatedInsumos);
    await saveInsumosToDB(updatedInsumos);
  };

  const handleUpdateInsumo = async (insumoActualizado) => {
    const updatedInsumos = insumos.map(i => 
      i.id === insumoActualizado.id ? insumoActualizado : i
    );
    setInsumos(updatedInsumos);
    await saveInsumosToDB(updatedInsumos);
    setInsumoEditando(null);
  };

  const handleDeleteInsumo = async (id) => {
    const updatedInsumos = insumos.filter(i => i.id !== id);
    setInsumos(updatedInsumos);
    await saveInsumosToDB(updatedInsumos);
  };

  const handleRenovarInsumo = async (insumo) => {
    // Abrir popup con fecha de hoy + 90 días como sugerencia
    const nuevaFecha = new Date();
    nuevaFecha.setDate(nuevaFecha.getDate() + 90);
    
    setInsumoEditando({
      ...insumo,
      fechaVencimiento: nuevaFecha.toISOString().split('T')[0]
    });
    setShowPopup(true);
  };

  const handleEditInsumo = (insumo) => {
    setInsumoEditando(insumo);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setInsumoEditando(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Insumos / Materiales</h2>
          <p className="text-gray-600 text-sm">
            Gestiona tus materiales impresos y digitales
          </p>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Insumo
        </button>
      </div>

      {insumos.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No hay insumos registrados
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega materiales como banners, trípticos o folletos
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar primer insumo
          </button>
        </div>
      ) : (
        <>
          <ResumenInsumos insumos={insumos} />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insumos.map(insumo => (
              <InsumoCard
                key={insumo.id}
                insumo={insumo}
                onEdit={handleEditInsumo}
                onDelete={handleDeleteInsumo}
                onRenovar={handleRenovarInsumo}
              />
            ))}
          </div>
        </>
      )}

      <InsumoPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
        onSave={insumoEditando ? handleUpdateInsumo : handleAddInsumo}
        insumo={insumoEditando}
      />
    </div>
  );
};

export default Insumos;