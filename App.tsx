
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarEvent, EventType, ViewMode, EVENT_DOT_COLORS, EVENT_TYPE_LABELS } from './types';
import { fetchPublicEvents } from './services/eventService';
import CalendarGrid from './components/CalendarGrid';
import ListView from './components/ListView';
import DaySidebar from './components/DaySidebar';

const AUTO_REFRESH_INTERVAL_MS = 30 * 60_000;

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isFetchingRef = useRef(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const loadEvents = useCallback(async (silent = false, showError = true) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!silent) {
      setLoading(true);
      setErrorMessage(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await fetchPublicEvents(currentDate.getFullYear(), currentDate.getMonth());
      setEvents(data);
      setErrorMessage(null);
      setLastSyncAt(new Date());
    } catch (error) {
      if (!silent && showError) {
        setEvents([]);
        setErrorMessage(error instanceof Error ? error.message : 'Erro inesperado ao buscar eventos.');
      } else if (showError) {
        setErrorMessage(error instanceof Error ? error.message : 'Erro inesperado ao atualizar eventos.');
      }
      console.error('Erro ao buscar eventos:', error);
    } finally {
      isFetchingRef.current = false;

      if (!silent) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, [currentDate]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadEvents(true, false);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadEvents]);

  const handleManualRefresh = () => {
    void loadEvents(true, true);
  };

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

  const handleEventDetailsClick = (event: CalendarEvent) => {
    const [, , dayString] = event.date.split('-');
    const day = Number(dayString);

    if (!Number.isNaN(day)) {
      setSelectedDay(day);
      setIsSidebarOpen(true);
    }
  };

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const lastSyncLabel = lastSyncAt
    ? lastSyncAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900 selection:bg-blue-100">
      {/* HEADER EAC - Layout dedicado para Mobile vs Desktop */}
      <header className="bg-[#112760] text-white shadow-2xl sticky top-0 z-[60] border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 sm:py-0 min-h-[5rem] sm:h-24 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          
          {/* 1. Logo e Nome da Paróquia */}
          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            <img 
              src="https://imgur.com/c5XQ7TW.png" 
              alt="Logo EAC" 
              className="h-10 md:h-14 w-auto object-contain drop-shadow-md" 
            />
            <div className="flex flex-col border-l border-white/20 pl-3 md:pl-4">
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">EAC</span>
              <span className="text-[12px] md:text-[16px] font-black uppercase tracking-tight leading-none whitespace-nowrap">Porciúncula de Sant'Anna</span>
            </div>
          </div>
          
          {/* 2. Título Centralizado (Adaptável) */}
          <div className="flex-1 flex justify-center w-full sm:w-auto px-2">
            <h1 className="text-[14px] md:text-xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center drop-shadow-sm leading-tight border-b-2 border-white/10 sm:border-0 pb-1 sm:pb-0">
              Calendário de Eventos
            </h1>
          </div>

          {/* 3. Seletor de Modo (Grade/Lista) */}
          <div className="flex bg-[#1e3a8a]/50 p-1.5 rounded-full border border-white/10 shrink-0 backdrop-blur-md">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-5 md:px-8 py-2.5 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${viewMode === 'calendar' ? 'bg-white text-[#112760] shadow-xl' : 'text-white/60 hover:text-white'}`}
            >
              Grade
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-5 md:px-8 py-2.5 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-[#112760] shadow-xl' : 'text-white/60 hover:text-white'}`}
            >
              Lista
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* NAVEGAÇÃO DE DATA */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm border border-slate-100 p-6 md:p-10 mb-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Auto-refresh a cada 30 min • Última atualização: {lastSyncLabel}
            </p>
            <button
              onClick={handleManualRefresh}
              disabled={loading || isRefreshing}
              className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#112760] text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0b1f52] transition-colors"
            >
              {isRefreshing ? 'Atualizando...' : 'Atualizar agora'}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 md:space-x-12 mb-8 md:mb-10">
            <button onClick={() => changeYear(-1)} className="p-3 md:p-4 text-[#112760] hover:bg-slate-50 rounded-full transition-all active:scale-75">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-4xl md:text-6xl font-black text-[#112760] tracking-tighter tabular-nums">{currentYear}</h2>
            <button onClick={() => changeYear(1)} className="p-3 md:p-4 text-[#112760] hover:bg-slate-50 rounded-full transition-all active:scale-75">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-3">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setMonth(index)}
                className={`py-3 md:py-5 rounded-2xl md:rounded-3xl text-[10px] md:text-[12px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 ${currentMonth === index ? 'bg-[#112760] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-[#112760]'}`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* LEGENDA DE CORES */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-10 md:mb-14 px-4">
          {(Object.entries(EVENT_DOT_COLORS) as [EventType, string][]).map(([type, colorClass]) => (
            <div key={type} className="flex items-center space-x-3 bg-white py-2.5 px-4 md:px-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
              <span className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full ${colorClass} shadow-sm ring-2 ring-slate-50`}></span>
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">{EVENT_TYPE_LABELS[type]}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] md:h-[500px]">
            <div className="w-12 h-12 md:w-16 md:h-16 border-[5px] md:border-[7px] border-[#112760]/10 border-t-[#112760] rounded-full animate-spin"></div>
            <span className="mt-8 font-black text-slate-400 uppercase text-[10px] md:text-[12px] tracking-[0.4em] animate-pulse">Sincronizando Agenda</span>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border border-red-200 rounded-[32px] p-6 md:p-8 text-red-800">
            <h3 className="text-sm md:text-base font-black uppercase tracking-[0.12em] mb-3">Falha na sincronização com a planilha</h3>
            <p className="text-sm leading-relaxed">{errorMessage}</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {viewMode === 'calendar' ? (
              <CalendarGrid 
                currentDate={currentDate} 
                events={events} 
                onDayClick={handleDayClick}
                selectedDay={selectedDay}
              />
            ) : (
              <ListView events={events} onEventDetailsClick={handleEventDetailsClick} />
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

      <footer className="py-12 md:py-16 text-center">
        <div className="w-12 h-0.5 bg-slate-100 mx-auto mb-6 rounded-full"></div>
        <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-slate-300">EAC • {currentYear}</p>
      </footer>
    </div>
  );
};

export default App;
