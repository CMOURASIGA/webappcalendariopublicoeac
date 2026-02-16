
import React from 'react';
import { CalendarEvent, EVENT_DOT_COLORS } from '../types';

interface CalendarViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ currentDate, events }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  return (
    <div className="bg-white rounded-[25px] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
        {weekDays.map(day => (
          <div key={day} className="py-5 text-center text-[10px] font-black text-gray-400 tracking-widest">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-32 border-b border-r border-gray-50 bg-gray-50/20"></div>;
          }

          const dayEvents = getEventsForDay(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div 
              key={day} 
              className={`h-32 border-b border-r border-gray-50 p-2 transition-all hover:bg-blue-50/30 group relative ${
                idx % 7 === 6 ? 'border-r-0' : ''
              }`}
            >
              <div className="flex justify-start items-center mb-2">
                <span className={`text-[12px] font-black w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                  isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 group-hover:text-blue-600'
                }`}>
                  {day}
                </span>
              </div>
              
              <div className="space-y-1.5 overflow-y-auto max-h-[80px] scrollbar-hide">
                {dayEvents.map(event => (
                  <div 
                    key={event.id}
                    className="flex items-center px-2 py-1 rounded-md bg-white border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 shrink-0 ${EVENT_DOT_COLORS[event.type]}`}></span>
                    <span className="text-[9px] font-black text-gray-600 truncate uppercase tracking-tight">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
