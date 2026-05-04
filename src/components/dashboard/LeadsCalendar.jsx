import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Lock, X } from 'lucide-react';

const LeadsCalendar = ({ leadsDiarios = {}, onUpdateLeads, readOnly = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [leadValue, setLeadValue] = useState('');

  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
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
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    Object.keys(leadsDiarios).forEach(key => {
      if (key.startsWith(prefix)) {
        total += parseInt(leadsDiarios[key]) || 0;
      }
    });
    return total;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Crear array de días
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4">
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <h4 className="text-sm font-semibold text-gray-800">
            Leads Diarios
          </h4>
          {readOnly && <Lock className="w-3 h-3 text-gray-400" />}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <span className="text-xs font-medium text-gray-700 min-w-[100px] text-center">
            {months[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Total del mes - compacto */}
      <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100 text-center">
        <p className="text-[10px] text-blue-600 uppercase">Total del mes</p>
        <p className="text-lg font-bold text-blue-700">{getTotalMonthLeads().toLocaleString()}</p>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula del calendario - más compacta */}
      <div className="grid grid-cols-7 gap-0.5">
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
              className={`aspect-square rounded-md flex flex-col items-center justify-center text-[10px] transition-colors relative
                ${isToday ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : 'hover:bg-gray-50'}
                ${hasLeads ? 'bg-green-50 ring-1 ring-green-300 ring-inset' : ''}
                ${!readOnly ? 'cursor-pointer' : 'cursor-default'}
              `}
              title={`${day} ${months[currentMonth]} - ${hasLeads ? leadsDiarios[dateKey] + ' leads' : 'Sin leads'}`}
            >
              <span className={`font-medium ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
                {day}
              </span>
              {hasLeads && (
                <span className="text-[9px] font-bold text-green-600 leading-none">
                  {leadsDiarios[dateKey]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda compacta */}
      <div className="flex items-center justify-center space-x-3 mt-2 text-[10px] text-gray-400">
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-blue-100 ring-2 ring-blue-500 ring-inset rounded-sm" />
          <span>Hoy</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-green-50 ring-1 ring-green-300 ring-inset rounded-sm" />
          <span>Leads</span>
        </div>
        {!readOnly && (
          <span className="text-blue-500">Click +</span>
        )}
      </div>

      {/* Modal compacto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[280px]">
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">
                {leadValue ? 'Editar' : 'Agregar'} Leads
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 space-y-3">
              <p className="text-xs text-gray-500">
                {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                }) : ''}
              </p>
              
              <input
                type="number"
                value={leadValue}
                onChange={(e) => setLeadValue(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Número de leads"
                min="0"
                autoFocus
              />
              
              <div className="flex space-x-2">
                {leadValue ? (
                  <button
                    onClick={handleDeleteLead}
                    className="flex-1 px-3 py-2 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Eliminar
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-3 py-2 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={handleSaveLead}
                  className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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