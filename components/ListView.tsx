
import React from 'react';
import { CalendarEvent, EVENT_COLORS, EVENT_TYPE_LABELS } from '../types';

interface ListViewProps {
  events: CalendarEvent[];
  onEventDetailsClick: (event: CalendarEvent) => void;
}

const normalizeStatus = (status?: string): string => {
  return String(status || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
};

const getStatusClasses = (status?: string): string => {
  const normalized = normalizeStatus(status);

  if (normalized.includes('confirmado')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (normalized.includes('pendente')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (normalized.includes('cancelado')) return 'bg-red-100 text-red-800 border-red-200';
  if (normalized.includes('adiado') || normalized.includes('remarcado')) return 'bg-orange-100 text-orange-800 border-orange-200';

  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const getStatusLabel = (status?: string): string => {
  const trimmed = String(status || '').trim();
  return trimmed || 'Não informado';
};

const ListView: React.FC<ListViewProps> = ({ events, onEventDetailsClick }) => {
  // Agrupar eventos por data
  const grouped = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(grouped).sort();

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-[40px] p-24 text-center border border-slate-100 shadow-xl">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Agenda vazia para este período</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {sortedDates.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        
        return (
          <div key={dateStr} className="flex flex-col md:flex-row gap-6 md:gap-10 group">
            {/* Indicador de Data em Linha */}
            <div className="md:w-40 shrink-0">
              <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 text-center transition-all duration-500 group-hover:bg-[#112760] group-hover:text-white group-hover:shadow-2xl group-hover:scale-105 group-hover:rotate-1">
                <span className="block text-4xl font-black leading-none">{day}</span>
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] mt-3 opacity-50 group-hover:opacity-80">
                  {dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </span>
              </div>
            </div>
            
            {/* Eventos do Dia */}
            <div className="flex-1 space-y-5">
              {grouped[dateStr].map(event => (
                <div key={event.id} className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-50 flex flex-col md:flex-row md:items-center justify-between transition-all duration-300 hover:shadow-2xl hover:border-blue-100 hover:bg-white active:scale-[0.99]">
                  <div className="flex items-center gap-6">
                    {/* Hora Minimalista */}
                    <div className="hidden md:flex flex-col items-center justify-center text-[#112760] font-black text-sm w-16 border-r border-slate-100 pr-6">
                      {event.startTime || '--:--'}
                    </div>
                    
                    <div>
                      <h4 className="text-xl md:text-2xl font-black text-slate-800 leading-tight mb-3">{event.title}</h4>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm border ${EVENT_COLORS[event.type]}`}>
                          {EVENT_TYPE_LABELS[event.type]}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${getStatusClasses(event.status)}`}>
                          Situação: {getStatusLabel(event.status)}
                        </span>
                        {event.location && (
                          <span className="text-[11px] text-slate-400 font-bold uppercase flex items-center bg-slate-50 px-3 py-1 rounded-lg">
                            <svg className="w-3.5 h-3.5 mr-2 text-[#112760]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 md:mt-0">
                    <button
                      onClick={() => onEventDetailsClick(event)}
                      className="w-full md:w-auto px-8 py-4 bg-slate-50 hover:bg-[#112760] hover:text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-sm active:scale-95"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;
