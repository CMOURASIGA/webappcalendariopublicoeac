
export type EventType = 
  | 'Encontro' 
  | 'Cantina' 
  | 'Circulo' 
  | 'Pós-Encontro' 
  | 'Missa' 
  | 'Preparação Encontro'
  | 'Reunião'
  | 'Tempo Litúrgico'
  | 'Solenidade'
  | 'Festa de Santos'
  | 'Datas Marianas'
  | 'Outro';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; 
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  status?: string;
  type: EventType;
}

export type ViewMode = 'calendar' | 'list';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'Encontro': 'Encontro',
  'Cantina': 'Cantina',
  'Circulo': 'Circulo',
  'Pós-Encontro': 'Pós-Encontro',
  'Missa': 'Missa',
  'Preparação Encontro': 'Preparação',
  'Reunião': 'Reunião',
  'Tempo Litúrgico': 'Tempo Litúrgico',
  'Solenidade': 'Solenidade',
  'Festa de Santos': 'Festa de Santos',
  'Datas Marianas': 'Datas Marianas',
  'Outro': 'Pastoral',
};

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
  'Tempo Litúrgico': 'bg-[#dbe4ef] text-[#334155] border-[#cbd5e1]',
  'Solenidade': 'bg-[#7f1d1d] text-white border-[#7f1d1d]',
  'Festa de Santos': 'bg-[#155e75] text-white border-[#155e75]',
  'Datas Marianas': 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]',
  'Outro': 'bg-[#111827] text-[#fde68a] border-[#facc15]',
};

export const EVENT_DOT_COLORS: Record<EventType, string> = {
  'Encontro': 'bg-[#3b82f6]',
  'Cantina': 'bg-[#60a5fa]',
  'Circulo': 'bg-[#8b5cf6]',
  'Pós-Encontro': 'bg-[#f59e0b]',
  'Missa': 'bg-[#10b981]',
  'Preparação Encontro': 'bg-[#ef4444]',
  'Reunião': 'bg-[#64748b]',
  'Tempo Litúrgico': 'bg-[#94a3b8]',
  'Solenidade': 'bg-[#7f1d1d]',
  'Festa de Santos': 'bg-[#155e75]',
  'Datas Marianas': 'bg-[#7c3aed]',
  'Outro': 'bg-[#facc15]',
};
