# SPEC — Publicação controlada de eventos Google EAC
Status: implementação preparatória; NÃO HOMOLOGADA; SEM MIGRATION APLICADA.

## Decisão aprovada
O calendário público exibirá os eventos públicos existentes do EAC e eventos **Google EAC explicitamente aprovados** no painel administrativo. Eventos GOOGLE_PAROQUIA nunca ingressam na projeção pública.

## Arquitetura
- O painel EAC lê Google EAC com OAuth somente no backend autenticado.
- Administrador do EAC aprova um evento de forma explícita, com confirmação.
- Backend autenticado valida role ADMIN no Supabase, origem GOOGLE_EAC, identidade estável `google_calendar_id + google_event_id`, e grava projeção com `publication_status=PUBLICADO`, `aprovado_por`, `aprovado_em`.
- Revogar imediatamente altera status para REVOGADO; alteração e exclusão na agenda original precisam sincronizar e retirar o item público.
- Site público lê `vw_public_calendar_events` e `eac_public_google_events` somente quando publicados. Nenhuma credencial OAuth sai do backend. A migration impõe CHECK de origem GOOGLE_EAC e RLS de leitura apenas PUBLICADO.
- Não usar `primary` implicitamente para identificar a origem autorizada no banco sem verificar o calendar ID efetivo; configurar identificador canônico no backend.
- Eventos internos, privacidade, convites e dados de convidados devem ser removidos do payload público.

## Pendências de implementação antes de ativação
1. Aplicar migration apenas após revisão do schema Supabase real.
2. API administrativa autenticada para aprovar/revogar; **não** confiar no header x-eac-user-email; verificar sessão real e perfil ADMIN.
3. Mostrar controle Aprovar publicação / Revogar publicação apenas em eventos GOOGLE_EAC, com status visível e registro de auditoria.
4. Sincronização de atualizações/exclusões (Google somente leitura), cuidando de retries e idempotência.
5. Testar RLS como anon e negar PENDENTE/REVOGADO; comparar quantidade de eventos, timezone e cancelamentos.
6. Typecheck e build do app público, testes mobile e desktop, e um Preview de homologação somente após concluir todas as etapas.
7. Documentar configuração e rollback. Não publicar em produção nem ativar leitura da tabela inexistente.
