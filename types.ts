
export type EventType = 
  | 'Encontro' 
  | 'Cantina' 
  | 'Circulo' 
  | 'Pós-Encontro' 
  | 'Missa' 
  | 'Preparação Encontro';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; 
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  type: EventType;
}

export type ViewMode = 'calendar' | 'list';

export const EVENT_COLORS: Record<EventType, string> = {
  'Encontro': 'bg-blue-50 text-[#112760] border-blue-100',
  'Cantina': 'bg-orange-50 text-orange-600 border-orange-100',
  'Circulo': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Pós-Encontro': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  'Missa': 'bg-rose-50 text-rose-600 border-rose-100',
  'Preparação Encontro': 'bg-slate-50 text-slate-600 border-slate-100',
};

export const EVENT_DOT_COLORS: Record<EventType, string> = {
  'Encontro': 'bg-[#112760]',
  'Cantina': 'bg-orange-500',
  'Circulo': 'bg-emerald-500',
  'Pós-Encontro': 'bg-indigo-500',
  'Missa': 'bg-rose-500',
  'Preparação Encontro': 'bg-slate-400',
};
