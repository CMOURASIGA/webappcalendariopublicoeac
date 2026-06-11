
import React from 'react';
import { CalendarEvent, EVENT_DOT_COLORS, EventType } from '../types';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (day: number) => void;
  selectedDay: number | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, onDayClick, selectedDay }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getDayEvents = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden ring-1 ring-slate-100">
      <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
        {weekDays.map(day => (
          <div key={day} className="py-3 md:py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span className="md:hidden">{day.charAt(0)}</span>
            <span className="hidden md:inline">{day}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-20 md:h-40 bg-slate-50/30 border-b border-r border-slate-50 last:border-r-0"></div>;
          }

          const dayEvents = getDayEvents(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          const isSelected = selectedDay === day;

          // Lógica de marcadores por tipo + contador
          const uniqueTypes = Array.from(new Set(dayEvents.map(e => e.type))) as EventType[];
          const displayedTypes = uniqueTypes.slice(0, 4);
          const remainingCount = dayEvents.length - displayedTypes.length;

          return (
            <button 
              key={day} 
              onClick={() => onDayClick(day)}
              className={`h-20 md:h-40 border-b border-r border-slate-50 p-2 md:p-6 transition-all duration-300 group relative text-left flex flex-col items-start ${idx % 7 === 6 ? 'border-r-0' : ''} ${isSelected ? 'bg-blue-50/70 z-10 ring-1 ring-blue-200' : dayEvents.length > 0 ? 'bg-slate-50/70 hover:bg-slate-100/80' : 'hover:bg-slate-50/80'}`}
            >
              <div className="flex justify-between w-full items-start">
                <span className={`text-sm md:text-xl font-black w-7 h-7 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl transition-all duration-500 ${
                  isToday ? 'bg-[#112760] text-white shadow-xl shadow-blue-200 scale-105' : 'text-slate-400 group-hover:text-[#112760]'
                } ${isSelected && !isToday ? 'bg-blue-100 text-[#112760]' : ''}`}>
                  {day}
                </span>
                
                <div className="flex items-center gap-2">
                  {dayEvents.length > 0 && (
                    <span className="px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg bg-[#112760] text-white text-[8px] md:text-[10px] font-black tracking-wider shadow-sm min-w-[1.25rem] text-center">
                      {dayEvents.length}
                    </span>
                  )}
                  {isSelected && (
                    <div className="hidden md:block w-2 h-2 bg-[#112760] rounded-full animate-ping"></div>
                  )}
                </div>
              </div>

              {/* Indicadores de Eventos (mobile simplificado + desktop completo) */}
              <div className="mt-auto flex items-center flex-wrap justify-start gap-1 w-full">
                {displayedTypes.map((type, indicatorIndex) => (
                  <span 
                    key={`${type}-${indicatorIndex}`} 
                    className={`w-3.5 h-1.5 md:w-7 md:h-3.5 rounded-md ${EVENT_DOT_COLORS[type]} shadow-sm ring-1 ring-white ${indicatorIndex > 1 ? 'hidden md:inline-flex' : ''}`}
                  ></span>
                ))}
                {remainingCount > 0 && (
                  <span className="text-[8px] md:text-[11px] font-black text-[#112760] ml-0.5 whitespace-nowrap">
                    +{remainingCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
