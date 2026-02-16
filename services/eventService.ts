
import { CalendarEvent, EventType } from '../types';

export const fetchPublicEvents = async (year: number, month: number): Promise<CalendarEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const types: EventType[] = [
    'Encontro', 'Cantina', 'Circulo', 'Pós-Encontro', 'Missa', 'Preparação Encontro', 'Reunião', 'Outro'
  ];

  const events: CalendarEvent[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    // Dias com múltiplos eventos para testar a lógica das bolinhas (+X)
    if (i % 4 === 0) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      // Adiciona 6 eventos em um único dia para testar o "+2" (4 bolas + 2)
      for (let j = 0; j < 6; j++) {
        events.push({
          id: `event-${year}-${month}-${i}-${j}`,
          title: `${types[j % types.length]} - Atividade ${j + 1}`,
          date: date,
          type: types[j % types.length],
          startTime: `${14 + j}:00`,
          location: 'Centro Pastoral',
          description: 'Detalhes da atividade programada no cronograma oficial do EAC.'
        });
      }
    } else if (i % 5 === 0) {
      events.push({
        id: `event-${year}-${month}-${i}-single`,
        title: `Missa Comunitária`,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        type: 'Missa',
        startTime: '19:30',
        location: 'Igreja Matriz'
      });
    }
  }

  return events;
};
