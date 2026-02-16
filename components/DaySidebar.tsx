
import React from 'react';
import { CalendarEvent, EVENT_COLORS } from '../types';

interface DaySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: CalendarEvent[];
}

const DaySidebar: React.FC<DaySidebarProps> = ({ isOpen, onClose, date, events }) => {
  return (
    <>
      {/* Overlay com Blur Suave */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[70] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Painel Lateral / Bottom Sheet no Mobile */}
      <aside 
        className={`fixed right-0 bottom-0 md:top-0 h-[85vh] md:h-full w-full md:w-[500px] bg-white z-[80] shadow-[0_0_100px_rgba(0,0,0,0.2)] transform transition-transform duration-500 ease-in-out flex flex-col rounded-t-[40px] md:rounded-t-none md:rounded-l-[40px] overflow-hidden ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
      >
        {/* Header do Painel - Azul Marinho do Logo */}
        <div className="p-8 pb-10 border-b border-white/10 flex items-center justify-between bg-[#112760] text-white">
          <div className="animate-in slide-in-from-left-4 duration-700">
            <h3 className="text-2xl font-black uppercase tracking-tight">
              {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
            </h3>
            <p className="text-xs opacity-70 font-black uppercase tracking-[0.2em] mt-2">
              {date?.toLocaleDateString('pt-BR', { weekday: 'long' })}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-[20px] transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Lista de Eventos no Dia */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/30">
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 px-10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
                 <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">Nenhuma atividade registrada para esta data</p>
            </div>
          ) : (
            events.map((event, idx) => (
              <div 
                key={event.id} 
                className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-backwards"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${EVENT_COLORS[event.type]}`}>
                    {event.type}
                  </span>
                  <div className="flex items-center text-[#112760] font-black text-xs bg-blue-50 px-3 py-1.5 rounded-xl">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {event.startTime || 'TBD'}
                  </div>
                </div>
                
                <h4 className="text-xl md:text-2xl font-black text-slate-800 mb-4 leading-tight">{event.title}</h4>
                
                {event.location && (
                  <div className="flex items-start text-sm text-slate-500 mb-6 bg-slate-50 p-4 rounded-2xl">
                    <svg className="w-5 h-5 mr-3 text-[#112760] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    <span className="font-bold leading-tight">{event.location}</span>
                  </div>
                )}
                
                <p className="text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100 italic">
                  {event.description || "Esta atividade faz parte do cronograma oficial do EAC. Entre em contato com seu círculo para mais informações."}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Botão de Fechar no Final */}
        <div className="p-8 border-t border-slate-100 bg-white">
          <button 
            onClick={onClose} 
            className="w-full bg-[#112760] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-95 transition-all duration-300"
          >
            Fechar Agenda
          </button>
        </div>
      </aside>
    </>
  );
};

export default DaySidebar;
