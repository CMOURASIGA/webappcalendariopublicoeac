import { createClient } from '@supabase/supabase-js';
import { CalendarEvent, EventType } from '../types';

interface PublicCalendarEventRow {
  id?: string | number | null;
  atividade?: string | null;
  tipo?: string | null;
  inicio?: string | null;
  termino?: string | null;
  local?: string | null;
  proprietario?: string | null;
  status?: string | null;
}

interface ParsedDateTime {
  date: string;
  time?: string;
}

const SAO_PAULO_TIME_ZONE = 'America/Sao_Paulo';
const SOURCE_TIMEZONE_ADJUSTMENT_HOURS = 3;
const SHOULD_ADJUST_SOURCE_TIMEZONE = (import.meta.env.VITE_ADJUST_SOURCE_TIMEZONE?.trim().toLowerCase() ?? 'true') === 'true';
const DEFAULT_EVENTS_VIEW = 'vw_public_calendar_events';
const CANCELLED_STATUSES = new Set(['CANCELADO', 'CANCELADA']);

let supabaseClient: ReturnType<typeof createClient> | null = null;

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const normalizeStatus = (value: string | null | undefined): string =>
  normalizeText(String(value || '')).toUpperCase();

const includesAny = (text: string, candidates: string[]): boolean =>
  candidates.some((candidate) => text.includes(candidate));

const isLiturgicalEvent = (value: string): boolean => {
  const normalized = normalizeText(value);
  return includesAny(normalized, [
    'tempo liturgico',
    'solenidade',
    'datas marianas',
    'festa mariana',
    'festa de santos',
    'festa dos santos',
    'advento',
    'quaresma',
    'tempo pascal',
    'tempo comum',
    'nossa senhora',
    'imaculada conceicao',
    'assuncao de maria',
    'santissima trindade',
    'corpus christi',
    'pentecostes',
    'missa',
    'celebracao eucaristica',
    'eucaristia',
    'santa ',
    'santo ',
    'sao ',
    'apostolo',
    'martir',
    'mes vocacional',
    'mês vocacional',
    'vocacional',
  ]);
};

const toEventType = (value: string): EventType => {
  const normalized = normalizeText(value);

  if (includesAny(normalized, ['missa', 'celebracao eucaristica', 'eucaristia'])) return 'Missa';
  if (normalized.includes('pos-encontro') || normalized.includes('pos encontro')) return 'P\u00f3s-Encontro';
  if (normalized.includes('montagem')) return 'Prepara\u00e7\u00e3o Encontro';
  if (normalized.includes('preparacao') && normalized.includes('encontro')) return 'Prepara\u00e7\u00e3o Encontro';
  if (normalized.includes('circulo')) return 'Circulo';
  if (normalized.includes('cantina')) return 'Cantina';
  if (normalized.includes('reuniao')) return 'Reuni\u00e3o';
  if (normalized.includes('encontro')) return 'Encontro';
  if (normalized.includes('pastoral')) return 'Outro';

  return 'Outro';
};

const getRequiredEnv = (value: string | undefined, name: string): string => {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`Defina ${name} para habilitar a leitura publica via Supabase.`);
  }
  return normalized;
};

const getSupabaseClient = (): ReturnType<typeof createClient> => {
  if (supabaseClient) return supabaseClient;

  const url = getRequiredEnv(import.meta.env.VITE_SUPABASE_URL, 'VITE_SUPABASE_URL');
  const anonKey = getRequiredEnv(import.meta.env.VITE_SUPABASE_ANON_KEY, 'VITE_SUPABASE_ANON_KEY');
  supabaseClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabaseClient;
};

const getEventsViewName = (): string => {
  const schema = import.meta.env.VITE_SUPABASE_SCHEMA?.trim() || 'public';
  const viewName = import.meta.env.VITE_SUPABASE_EVENTS_VIEW?.trim() || DEFAULT_EVENTS_VIEW;
  return schema === 'public' ? viewName : `${schema}.${viewName}`;
};

const buildSaoPauloBoundary = (year: number, monthIndex: number): string => {
  const month = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${month}-01T00:00:00-03:00`;
};

const parseDateTime = (rawValue: string): ParsedDateTime | null => {
  const value = rawValue.trim();
  if (!value) return null;

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    const displayDate = SHOULD_ADJUST_SOURCE_TIMEZONE
      ? new Date(parsedDate.getTime() + SOURCE_TIMEZONE_ADJUSTMENT_HOURS * 60 * 60 * 1000)
      : parsedDate;
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: SAO_PAULO_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(displayDate);

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;
    const hour = parts.find((part) => part.type === 'hour')?.value;
    const minute = parts.find((part) => part.type === 'minute')?.value;

    if (year && month && day) {
      return {
        date: `${year}-${month}-${day}`,
        time: hour && minute ? `${hour}:${minute}` : undefined,
      };
    }
  }

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

const mapSupabaseEvents = (events: PublicCalendarEventRow[]): CalendarEvent[] =>
  events
    .map((event, index) => {
      const title = String(event.atividade || '').trim();
      if (!title) return null;

      const normalizedStatus = normalizeStatus(event.status);
      if (CANCELLED_STATUSES.has(normalizedStatus)) return null;

      const parsedStart = parseDateTime(String(event.inicio || '').trim());
      if (!parsedStart) return null;

      const parsedEnd = parseDateTime(String(event.termino || '').trim());
      const eventTypeSource = String(event.tipo || title).trim();
      if (isLiturgicalEvent(`${eventTypeSource} ${title}`)) return null;

      return {
        id: String(event.id || `supabase-ev-${index}`),
        title,
        date: parsedStart.date,
        startTime: parsedStart.time,
        endTime: parsedEnd?.time,
        location: String(event.local || '').trim() || undefined,
        description: String(event.proprietario || '').trim() || undefined,
        status: String(event.status || '').trim() || undefined,
        sourceType: String(event.tipo || '').trim() || undefined,
        type: toEventType(eventTypeSource),
      } as CalendarEvent;
    })
    .filter((event): event is CalendarEvent => Boolean(event))
    .sort((a, b) => {
      const left = `${a.date} ${a.startTime ?? '00:00'} ${a.title}`;
      const right = `${b.date} ${b.startTime ?? '00:00'} ${b.title}`;
      return left.localeCompare(right, 'pt-BR');
    });

export const fetchPublicEvents = async (year: number, month: number): Promise<CalendarEvent[]> => {
  const client = getSupabaseClient();
  const viewName = getEventsViewName();
  const rangeStart = buildSaoPauloBoundary(year, month);
  const rangeEnd = buildSaoPauloBoundary(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

  const { data, error } = await client
    .from(viewName)
    .select('id, atividade, tipo, inicio, termino, local, proprietario, status')
    .gte('inicio', rangeStart)
    .lt('inicio', rangeEnd)
    .order('inicio', { ascending: true });

  if (error) {
    throw new Error(`Falha ao consultar Supabase (${viewName}): ${error.message}`);
  }

  return mapSupabaseEvents((data || []) as PublicCalendarEventRow[]);
};
