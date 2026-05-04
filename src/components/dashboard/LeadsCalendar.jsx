import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Lock } from 'lucide-react';

const LeadsCalendar = ({ leadsDiarios = {}, onUpdateLeads, readOnly = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [leadValue, setLeadValue] = useState('');

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    if (readOnly) return;
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateKey);
    setLeadValue(leadsDiarios[dateKey] || '');
    setShowAddModal(true);
  };

  const handleSaveLead = () => {
    if (!onUpdateLeads || !selectedDate) return;
    onUpdateLeads(selectedDate, leadValue);
    setShowAddModal(false);
    setSelectedDate(null);
    setLeadValue('');
  };

  const handleDeleteLead = () => {
    if (!onUpdateLeads || !selectedDate) return;
    onUpdateLeads(selectedDate, '');
    setShowAddModal(false);
    setSelectedDate(null);
    setLeadValue('');
  };

  const getTotalMonthLeads = () => {
    let total = 0;
    Object.keys(leadsDiarios).forEach(key => {
      if (key.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)) {
        total += parseInt(leadsDiarios[key]) || 0;
      }
    });
    return total;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Crear array de días para el calendario
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">
          Leads Diarios
          {readOnly && <Lock className="w-3 h-3 inline ml-2 text-gray-400" />}
        </h4>
        <div className="flex items-center space-x-3">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
            {months[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Total del mes */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-600">Total Leads del Mes</p>
        <p className="text-xl font-bold text-blue-700">{getTotalMonthLeads().toLocaleString()}</p>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasLeads = leadsDiarios[dateKey] && leadsDiarios[dateKey] > 0;
          const isToday = dateKey === todayKey;
          
          return (
            <button
              key={dateKey}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded-lg text-xs flex flex-col items-center justify-center transition-colors relative
                ${isToday ? 'bg-blue-100 border-2 border-blue-500' : 'border border-gray-200'}
                ${hasLeads ? 'bg-green-50 border-green-300' : ''}
                ${!readOnly ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className={`font-medium ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                {day}
              </span>
              {hasLeads && (
                <span className="text-[10px] font-bold text-green-600 mt-0.5">
                  {leadsDiarios[dateKey]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 border-2 border-blue-500 rounded mr-1" />
          Hoy
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-50 border border-green-300 rounded mr-1" />
          Con leads
        </div>
        {!readOnly && (
          <div className="flex items-center">
            <Plus className="w-3 h-3 mr-1" />
            Click para agregar
          </div>
        )}
      </div>

      {/* Modal para agregar/editar leads */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {leadValue ? 'Editar Leads' : 'Agregar Leads'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('es-ES', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                }) : ''}
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Leads
                </label>
                <input
                  type="number"
                  value={leadValue}
                  onChange={(e) => setLeadValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                {leadValue && (
                  <button
                    onClick={handleDeleteLead}
                    className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </button>
                )}
                <button
                  onClick={handleSaveLead}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsCalendar;