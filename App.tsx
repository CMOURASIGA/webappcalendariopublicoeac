
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, EventType, ViewMode, EVENT_DOT_COLORS } from './types';
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

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

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

  const changeYear = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
    setIsSidebarOpen(false);
  };

  const setMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
    setIsSidebarOpen(false);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsSidebarOpen(true);
  };

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900 selection:bg-blue-100">
      {/* HEADER EAC */}
      <header className="bg-[#112760] text-white shadow-2xl sticky top-0 z-[60] border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative">
          {/* Logo e Nome da Paróquia */}
          <div className="flex items-center z-10 space-x-3 md:space-x-4">
            <img 
              src="https://imgur.com/c5XQ7TW.png" 
              alt="Logo EAC" 
              className="h-10 md:h-12 w-auto object-contain drop-shadow-md" 
            />
            <div className="hidden sm:flex flex-col border-l border-white/20 pl-3 md:pl-4">
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">EAC</span>
              <span className="text-[12px] md:text-[14px] font-black uppercase tracking-tight leading-none whitespace-nowrap">Porciúncula de Sant'Anna</span>
            </div>
          </div>
          
          {/* Título Centralizado */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
            <h1 className="text-[10px] sm:text-sm md:text-xl font-black uppercase tracking-[0.15em] md:tracking-[0.25em] text-center drop-shadow-sm leading-tight">
              Calendário de Eventos
            </h1>
          </div>

          {/* Seletor de Modo */}
          <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10 z-10 backdrop-blur-md ml-auto sm:ml-0">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-3 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${viewMode === 'calendar' ? 'bg-white text-[#112760] shadow-xl' : 'text-white/70 hover:text-white'}`}
            >
              Grade
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-[#112760] shadow-xl' : 'text-white/70 hover:text-white'}`}
            >
              Lista
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* NAVEGAÇÃO DE DATA */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-6 md:p-8 mb-6 overflow-hidden">
          <div className="flex items-center justify-center space-x-8 mb-8">
            <button onClick={() => changeYear(-1)} className="p-3 text-[#112760] hover:bg-slate-50 rounded-full transition-all active:scale-75">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-4xl md:text-5xl font-black text-[#112760] tracking-tighter tabular-nums">{currentYear}</h2>
            <button onClick={() => changeYear(1)} className="p-3 text-[#112760] hover:bg-slate-50 rounded-full transition-all active:scale-75">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setMonth(index)}
                className={`py-3 md:py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 ${currentMonth === index ? 'bg-[#112760] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-[#112760]'}`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* LEGENDA DE CORES */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-10 px-4">
          {Object.entries(EVENT_DOT_COLORS).map(([type, colorClass]) => (
            <div key={type} className="flex items-center space-x-2.5 bg-white py-2 px-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <span className={`w-3.5 h-3.5 rounded-full ${colorClass} shadow-sm`}></span>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">{type}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="w-14 h-14 border-[6px] border-[#112760]/10 border-t-[#112760] rounded-full animate-spin"></div>
            <span className="mt-6 font-black text-slate-400 uppercase text-[11px] tracking-[0.3em]">Sincronizando Agenda</span>
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

      <DaySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => {setIsSidebarOpen(false); setSelectedDay(null);}}
        date={selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null}
        events={selectedDay ? events.filter(e => e.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`) : []}
      />

      <footer className="py-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">EAC • {currentYear}</p>
      </footer>
    </div>
  );
};

export default App;
