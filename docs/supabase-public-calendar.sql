create or replace view public.vw_public_calendar_events as
select
  id,
  atividade,
  coalesce(tipo, tipo_atividade) as tipo,
  inicio,
  termino,
  local,
  proprietario,
  status
from public.eventos_agenda
where nullif(trim(coalesce(atividade, '')), '') is not null
  and upper(unaccent(coalesce(status, ''))) not in ('CANCELADO', 'CANCELADA');

grant usage on schema public to anon, authenticated;
grant select on public.vw_public_calendar_events to anon, authenticated;
