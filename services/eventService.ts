import { CalendarEvent, EventType } from '../types';

interface AppsScriptEvent {
  id?: string;
  atividade?: string;
  tipo?: string;
  inicio?: string;
  termino?: string;
  local?: string;
  proprietario?: string;
  status?: string;
}

interface AppsScriptEventsResponse {
  ok?: boolean;
  events?: AppsScriptEvent[];
  error?: string;
}

interface ParsedDateTime {
  date: string;
  time?: string;
}

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const includesAny = (text: string, candidates: string[]): boolean =>
  candidates.some((candidate) => text.includes(candidate));

const toEventType = (value: string): EventType => {
  const normalized = normalizeText(value);

  if (includesAny(normalized, ['tempo liturgico', 'advento', 'quaresma', 'tempo pascal', 'tempo comum'])) {
    return 'Tempo Litúrgico';
  }

  if (
    includesAny(normalized, [
      'solenidade',
      'pascoa',
      'pentecostes',
      'corpus christi',
      'natal',
      'ascensao do senhor',
      'santissima trindade',
    ])
  ) {
    return 'Solenidade';
  }

  if (
    includesAny(normalized, [
      'datas marianas',
      'festa mariana',
      'nossa senhora',
      'imaculada conceicao',
      'aparecida',
      'assuncao de maria',
      'maria mae de deus',
    ])
  ) {
    return 'Datas Marianas';
  }

  if (
    includesAny(normalized, [
      'festa de santos',
      'festa dos santos',
      'sao ',
      'santa ',
      'santo ',
      'apostolo',
      'martir',
    ])
  ) {
    return 'Festa de Santos';
  }

  if (includesAny(normalized, ['missa', 'celebracao eucaristica', 'eucaristia'])) return 'Missa';
  if (normalized.includes('pos-encontro') || normalized.includes('pos encontro')) return 'Pós-Encontro';
  if (normalized.includes('preparacao') && normalized.includes('encontro')) return 'Preparação Encontro';
  if (normalized.includes('circulo')) return 'Circulo';
  if (normalized.includes('cantina')) return 'Cantina';
  if (normalized.includes('reuniao')) return 'Reunião';
  if (normalized.includes('encontro')) return 'Encontro';
  if (normalized.includes('pastoral')) return 'Outro';

  // Compatibilidade: eventos antigos sem categoria litúrgica continuam como Pastoral.
  return 'Outro';
};

const parseDateTime = (rawValue: string): ParsedDateTime | null => {
  const value = rawValue.trim();
  if (!value) return null;

  const brazilianDateMatch = value.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (brazilianDateMatch) {
    const [, day, month, year, hour = '00', minute = '00'] = brazilianDateMatch;
    return {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
    };
  }

  const isoDateMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::\d{2})?)?$/
  );

  if (isoDateMatch) {
    const [, year, month, day, hour = '00', minute = '00'] = isoDateMatch;
    return {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
    };
  }

  return null;
};

const mapAppsScriptEvents = (events: AppsScriptEvent[]): CalendarEvent[] =>
  events
    .map((event, index) => {
      const title = String(event.atividade || '').trim();
      const parsedStart = parseDateTime(String(event.inicio || '').trim());
      const parsedEnd = parseDateTime(String(event.termino || '').trim());

      if (!title || !parsedStart) return null;

      const status = String(event.status || '').trim();

      return {
        id: String(event.id || `ev-${index}`),
        title,
        date: parsedStart.date,
        startTime: parsedStart.time,
        endTime: parsedEnd?.time,
        location: String(event.local || '').trim() || undefined,
        status: status || undefined,
        type: toEventType(String(event.tipo || title)),
      } as CalendarEvent;
    })
    .filter((event): event is CalendarEvent => Boolean(event));

const fetchEventsFromAppsScript = async (endpointUrl: string): Promise<CalendarEvent[]> => {
  const response = await fetch(endpointUrl, {
    method: 'POST',
    body: JSON.stringify({
      action: 'GET_EVENTS',
      payload: {},
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Falha ao consultar endpoint Apps Script (HTTP ${response.status}). Resposta: ${errorBody}`);
  }

  const payload = (await response.json()) as AppsScriptEventsResponse;
  if (!payload.ok) {
    throw new Error(payload.error || 'Resposta inválida do Apps Script.');
  }

  return mapAppsScriptEvents(payload.events ?? []);
};

export const fetchPublicEvents = async (year: number, month: number): Promise<CalendarEvent[]> => {
  const endpointUrl = import.meta.env.VITE_APPS_SCRIPT_URL?.trim();

  if (!endpointUrl) {
    throw new Error('Defina VITE_APPS_SCRIPT_URL no arquivo .env.local.');
  }

  const allEvents = await fetchEventsFromAppsScript(endpointUrl);

  return allEvents
    .filter((event) => {
      const [eventYear, eventMonth] = event.date.split('-').map(Number);
      return eventYear === year && eventMonth === month + 1;
    })
    .sort((a, b) => `${a.date} ${a.startTime ?? ''}`.localeCompare(`${b.date} ${b.startTime ?? ''}`));
};
