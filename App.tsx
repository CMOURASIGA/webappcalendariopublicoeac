
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CalendarEvent, EventType, ViewMode, EVENT_DOT_COLORS, EVENT_TYPE_LABELS } from './types';
import { fetchPublicEvents } from './services/eventService';
import CalendarGrid from './components/CalendarGrid';
import ListView from './components/ListView';
import DaySidebar from './components/DaySidebar';
import HelpModal from './components/HelpModal';

const AUTO_REFRESH_INTERVAL_MS = 30 * 60_000;
const ALL_EVENT_TYPES = Object.keys(EVENT_DOT_COLORS) as EventType[];

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<EventType>>(() => new Set(ALL_EVENT_TYPES));
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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

  const changeMonthByOffset = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => selectedTypes.has(event.type));
  }, [events, selectedTypes]);

  const toggleTypeFilter = (type: EventType) => {
    setSelectedTypes((previous) => {
      const next = new Set(previous);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const clearTypeFilters = () => {
    setSelectedTypes(new Set(ALL_EVENT_TYPES));
  };

  const lastSyncLabel = lastSyncAt
    ? lastSyncAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const currentMonthLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900 selection:bg-blue-100">
      <header className="bg-[#112760] text-white shadow-2xl sticky top-0 z-[60] border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5 md:space-x-4 min-w-0">
              <img
                src="https://imgur.com/c5XQ7TW.png"
                alt="Logo EAC"
                className="h-9 md:h-12 w-auto object-contain drop-shadow-md shrink-0"
              />
              <div className="flex flex-col border-l border-white/20 pl-2.5 md:pl-4 min-w-0">
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.16em] opacity-70 leading-none mb-1">EAC</span>
                <span className="text-[11px] md:text-[15px] font-black uppercase tracking-tight leading-none truncate">Porciúncula de Sant'Anna</span>
              </div>
            </div>

            <button
              onClick={() => setIsHelpOpen((previous) => !previous)}
              className="px-4 md:px-6 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-full border border-white/25 bg-white/10 hover:bg-white/20 transition-colors shrink-0"
            >
              {isHelpOpen ? 'Voltar' : 'Ajuda'}
            </button>
          </div>

          <div className="mt-3 md:mt-4 flex items-center justify-between gap-3">
            <h1 className="text-[12px] md:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.3em] leading-tight border-b border-white/15 pb-1 flex-1 min-w-0 truncate">
              {isHelpOpen ? 'Ajuda do Calendário' : 'Calendário de Eventos'}
            </h1>

            <div className={`flex bg-[#1e3a8a]/50 p-1 rounded-full border border-white/10 shrink-0 backdrop-blur-md ${isHelpOpen ? 'opacity-40 pointer-events-none' : ''}`}>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 md:px-6 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${viewMode === 'calendar' ? 'bg-white text-[#112760] shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                Grade
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 md:px-6 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-[#112760] shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-3 md:px-6 py-5 md:py-10">
        {isHelpOpen ? (
          <HelpModal />
        ) : (
          <>
        
          <div className="bg-white rounded-[26px] md:rounded-[40px] shadow-sm border border-slate-100 p-4 md:p-8 mb-5 md:mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-6">
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                Auto-refresh 30 min • Última atualização: {lastSyncLabel}
              </p>
              <button
                onClick={handleManualRefresh}
                disabled={loading || isRefreshing}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#112760] text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0b1f52] transition-colors"
              >
                {isRefreshing ? 'Atualizando...' : 'Atualizar agora'}
              </button>
            </div>

            <div className="md:hidden flex items-center justify-between mb-4 bg-slate-50 rounded-2xl p-2.5">
              <button
                onClick={() => changeMonthByOffset(-1)}
                className="p-2 text-[#112760] rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Mês anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{currentYear}</p>
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#112760]">{currentMonthLabel}</p>
              </div>
              <button
                onClick={() => changeMonthByOffset(1)}
                className="p-2 text-[#112760] rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Próximo mês"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="hidden md:flex items-center justify-center space-x-8 md:space-x-12 mb-8 md:mb-10">
              <button onClick={() => changeYear(-1)} className="p-3 md:p-4 text-[#112760] hover:bg-slate-50 rounded-full transition-all active:scale-75">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-4xl md:text-6xl font-black text-[#112760] tracking-tighter tabular-nums">{currentYear}</h2>
              <button onClick={() => changeYear(1)} className="p-3 md:p-4 text-[#112760] hover:bg-slate-50 rounded-full transition-all active:scale-75">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="md:hidden flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {months.map((month, index) => (
                <button
                  key={`mobile-month-${month}`}
                  onClick={() => setMonth(index)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] transition-all ${
                    currentMonth === index ? 'bg-[#112760] text-white shadow' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>

            <div className="hidden md:grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-3">
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
          <div className="mb-3 md:mb-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 px-1 md:px-4">
              {(Object.entries(EVENT_DOT_COLORS) as [EventType, string][]).map(([type, colorClass]) => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`w-full flex items-center justify-start space-x-2 py-2.5 px-3 md:px-4 rounded-xl md:rounded-2xl border shadow-sm transition-all ${
                    selectedTypes.has(type)
                      ? 'bg-white border-slate-200 hover:shadow-md'
                      : 'bg-slate-50 border-slate-100 opacity-50 hover:opacity-80'
                  }`}
                >
                  <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${colorClass} shadow-sm ring-2 ring-slate-50`}></span>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 text-left leading-tight whitespace-normal">
                    {EVENT_TYPE_LABELS[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-5 md:mb-14">
            <button
              onClick={clearTypeFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.18em] hover:bg-slate-200 transition-colors"
            >
              Limpar Filtros
            </button>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              {filteredEvents.length} eventos visíveis
            </span>
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
                  events={filteredEvents} 
                  onDayClick={handleDayClick}
                  selectedDay={selectedDay}
                />
              ) : (
                <ListView events={filteredEvents} onEventDetailsClick={handleEventDetailsClick} />
              )}
            </div>
          )}
          </>
        )}
      </main>

      <DaySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => {setIsSidebarOpen(false); setSelectedDay(null);}}
        date={selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null}
        events={selectedDay ? filteredEvents.filter(e => e.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`) : []}
      />

      <footer className="py-12 md:py-16 text-center">
        <div className="w-12 h-0.5 bg-slate-100 mx-auto mb-6 rounded-full"></div>
        <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-slate-300">EAC • {currentYear}</p>
      </footer>
    </div>
  );
};

export default App;
