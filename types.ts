
export type EventType = 
  | 'Encontro' 
  | 'Cantina' 
  | 'Circulo' 
  | 'Pós-Encontro' 
  | 'Missa' 
  | 'Preparação Encontro'
  | 'Reunião'
  | 'Outro';

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

/**
 * Cores baseadas nas imagens fornecidas:
 * Missa e Preparação possuem fundos escuros com texto claro.
 * Encontro, Cantina, Circulo e Pós possuem fundos claros com texto escuro.
 */
export const EVENT_COLORS: Record<EventType, string> = {
  'Encontro': 'bg-[#bfdbfe] text-[#1e40af] border-[#93c5fd]',
  'Cantina': 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]',
  'Circulo': 'bg-[#ddd6fe] text-[#5b21b6] border-[#c4b5fd]',
  'Pós-Encontro': 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]',
  'Missa': 'bg-[#065f46] text-white border-[#065f46]',
  'Preparação Encontro': 'bg-[#991b1b] text-white border-[#991b1b]',
  'Reunião': 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]',
  'Outro': 'bg-[#f8fafc] text-[#64748b] border-[#f1f5f9]',
};

export const EVENT_DOT_COLORS: Record<EventType, string> = {
  'Encontro': 'bg-[#3b82f6]',
  'Cantina': 'bg-[#60a5fa]',
  'Circulo': 'bg-[#8b5cf6]',
  'Pós-Encontro': 'bg-[#f59e0b]',
  'Missa': 'bg-[#10b981]',
  'Preparação Encontro': 'bg-[#ef4444]',
  'Reunião': 'bg-[#64748b]',
  'Outro': 'bg-[#94a3b8]',
};
