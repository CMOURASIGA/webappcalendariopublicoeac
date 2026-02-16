
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, EventType, ViewMode } from './types';
import { fetchPublicEvents } from './services/eventService';
import CalendarGrid from './components/CalendarGrid';
import ListView from './components/ListView';
import DaySidebar from './components/DaySidebar';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicEvents(currentDate.getFullYear(), currentDate.getMonth());
      setEvents(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
    setIsSidebarOpen(false);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsSidebarOpen(true);
  };

  const formattedMonth = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900 selection:bg-blue-100">
      {/* HEADER EAC - ESTILO REFINADO */}
      <header className="bg-[#112760] text-white shadow-2xl sticky top-0 z-[60] border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
          {/* Logo Sem Fundo Extra */}
          <div className="flex items-center z-10">
            <img 
              src="https://imgur.com/c5XQ7TW.png" 
              alt="Logo EAC" 
              className="h-12 w-auto object-contain drop-shadow-md" 
            />
          </div>
          
          {/* Título Centralizado */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-base md:text-xl font-black uppercase tracking-[0.25em] text-center drop-shadow-sm px-4">
              Calendário de Eventos
            </h1>
          </div>

          {/* Seletor de Modo (Direita) */}
          <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10 z-10 backdrop-blur-md">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${viewMode === 'calendar' ? 'bg-white text-[#112760] shadow-xl scale-105' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              Grade
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-[#112760] shadow-xl scale-105' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              Lista
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* NAVEGAÇÃO DE MÊS - UX OTIMIZADA */}
        <div className="flex items-center justify-between mb-12 bg-white p-4 md:p-6 rounded-[32px] shadow-sm border border-slate-100">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-4 bg-slate-50 text-[#112760] rounded-2xl hover:bg-[#112760] hover:text-white transition-all duration-300 shadow-sm active:scale-90"
            title="Mês Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="text-xl md:text-4xl font-black text-[#1e293b] uppercase tracking-tighter capitalize leading-none">
              {formattedMonth}
            </h2>
          </div>

          <button 
            onClick={() => changeMonth(1)}
            className="p-4 bg-slate-50 text-[#112760] rounded-2xl hover:bg-[#112760] hover:text-white transition-all duration-300 shadow-sm active:scale-90"
            title="Próximo Mês"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="w-14 h-14 border-[6px] border-[#112760]/10 border-t-[#112760] rounded-full animate-spin"></div>
            <span className="mt-6 font-black text-slate-400 uppercase text-[11px] tracking-[0.3em]">Carregando Agenda</span>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            {viewMode === 'calendar' ? (
              <CalendarGrid 
                currentDate={currentDate} 
                events={events} 
                onDayClick={handleDayClick}
                selectedDay={selectedDay}
              />
            ) : (
              <ListView events={events} />
            )}
          </div>
        )}
      </main>

      {/* DRAWER LATERAL DE DETALHES */}
      <DaySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => {setIsSidebarOpen(false); setSelectedDay(null);}}
        date={selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null}
        events={selectedDay ? events.filter(e => e.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`) : []}
      />

      <footer className="py-12 text-center text-slate-400">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">EAC • Todos os direitos reservados • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
