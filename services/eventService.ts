
import { CalendarEvent } from '../types';

/**
 * Em um cenário real, este serviço chamaria a rota /api/public/events
 * que por sua vez chama o Google Script (handleGetEvents_).
 * 
 * Como estamos em um ambiente de demonstração, simularemos a resposta
 * que viria desse Proxy seguro.
 */

export const fetchPublicEvents = async (year: number, month: number): Promise<CalendarEvent[]> => {
  // Simulando o delay de rede do Google Apps Script
  await new Promise(resolve => setTimeout(resolve, 800));

  // Gerando dados fictícios baseados no mês solicitado para demonstração
  // Na implementação real, isso seria:
  // const response = await fetch(`/api/public/events?year=${year}&month=${month}`);
  // return response.json();

  const types: CalendarEvent['type'][] = [
    'Encontro', 'Cantina', 'Circulo', 'Pós-Encontro', 'Missa', 'Preparação Encontro'
  ];

  const events: CalendarEvent[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Gerar alguns eventos fixos para o mês
  for (let i = 1; i <= daysInMonth; i++) {
    if (i % 5 === 0) {
      events.push({
        id: `event-${year}-${month}-${i}-1`,
        title: `${types[i % types.length]} Mensal`,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        type: types[i % types.length],
        startTime: '19:00',
        endTime: '21:00',
        location: 'Salão Paroquial',
        description: 'Evento recorrente da nossa comunidade.'
      });
    }
    if (i % 7 === 0) {
      events.push({
        id: `event-${year}-${month}-${i}-2`,
        title: `Missa de Domingo`,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        type: 'Missa',
        startTime: '08:00',
        location: 'Igreja Matriz'
      });
    }
  }

  return events;
};
