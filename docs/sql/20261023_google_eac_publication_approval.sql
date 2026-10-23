-- Proposta de migration. Não executar antes da homologação da publicação EAC.
-- Somente registros GOOGLE_EAC com aprovação explícita podem aparecer publicamente.
create table if not exists public.eac_public_google_events (
  id uuid primary key default gen_random_uuid(),
  google_calendar_id text not null,
  google_event_id text not null,
  google_etag text,
  atividade text not null,
  tipo text not null default 'Evento EAC',
  inicio timestamptz not null,
  termino timestamptz,
  local text,
  status text not null default 'CONFIRMADO',
  source text not null default 'GOOGLE_EAC' check (source = 'GOOGLE_EAC'),
  publication_status text not null default 'PENDENTE'
    check (publication_status in ('PENDENTE','PUBLICADO','REVOGADO')),
  aprovado_por uuid,
  aprovado_em timestamptz,
  atualizado_em timestamptz not null default now(),
  unique(google_calendar_id,google_event_id),
  constraint eac_approval_required check (
    publication_status <> 'PUBLICADO' or
    (aprovado_por is not null and aprovado_em is not null)
  )
);
create index if not exists eac_google_pub_window_idx
  on public.eac_public_google_events(publication_status,inicio);

alter table public.eac_public_google_events enable row level security;
revoke all on public.eac_public_google_events from anon,authenticated;
grant select on public.eac_public_google_events to anon,authenticated;
drop policy if exists eac_approved_google_read on public.eac_public_google_events;
create policy eac_approved_google_read on public.eac_public_google_events
 for select to anon,authenticated
 using (publication_status='PUBLICADO' and source='GOOGLE_EAC'
        and upper(status) not in ('CANCELADO','CANCELADA'));
-- Escrita somente via backend privilegiado com autenticação ADMIN.
-- Nenhuma policy de INSERT/UPDATE/DELETE para anon/authenticated.
