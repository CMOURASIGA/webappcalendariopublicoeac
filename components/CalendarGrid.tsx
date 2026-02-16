
import React from 'react';
import { CalendarEvent, EVENT_DOT_COLORS } from '../types';

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
          <div key={day} className="py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-28 md:h-40 bg-slate-50/30 border-b border-r border-slate-50 last:border-r-0"></div>;
          }

          const dayEvents = getDayEvents(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          const isSelected = selectedDay === day;

          return (
            <button 
              key={day} 
              onClick={() => onDayClick(day)}
              className={`h-28 md:h-40 border-b border-r border-slate-50 p-2 md:p-6 transition-all duration-300 group relative text-left flex flex-col items-center md:items-start ${idx % 7 === 6 ? 'border-r-0' : ''} ${isSelected ? 'bg-blue-50/60 z-10' : 'hover:bg-slate-50/80 hover:translate-y-[-2px]'}`}
            >
              <div className="flex justify-between w-full items-start">
                <span className={`text-base md:text-xl font-black w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                  isToday ? 'bg-[#112760] text-white shadow-xl shadow-blue-200 scale-105' : 'text-slate-400 group-hover:text-[#112760]'
                } ${isSelected && !isToday ? 'bg-blue-100 text-[#112760]' : ''}`}>
                  {day}
                </span>
                
                {isSelected && (
                   <div className="w-2 h-2 bg-[#112760] rounded-full animate-ping"></div>
                )}
              </div>

              {/* Indicadores de Eventos */}
              <div className="mt-auto flex flex-wrap justify-center md:justify-start gap-1.5 w-full">
                {dayEvents.slice(0, 5).map((event) => (
                  <span 
                    key={event.id} 
                    className={`w-2 h-2 rounded-full ${EVENT_DOT_COLORS[event.type]} shadow-sm ring-1 ring-white`}
                    title={event.title}
                  ></span>
                ))}
                {dayEvents.length > 5 && (
                  <span className="text-[9px] font-black text-slate-300 leading-none">+{dayEvents.length - 5}</span>
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
