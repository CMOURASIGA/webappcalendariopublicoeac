# Checklist de Homologacao

## Ambiente

1. Configurar `VITE_SUPABASE_URL`.
2. Configurar `VITE_SUPABASE_ANON_KEY`.
3. Configurar `VITE_SUPABASE_SCHEMA`.
4. Configurar `VITE_SUPABASE_EVENTS_VIEW`.
5. Confirmar que nenhuma chave `SUPABASE_SERVICE_ROLE_KEY` foi enviada ao frontend.

## Banco

1. Confirmar a tabela oficial de eventos.
2. Criar ou revisar a `view` publica.
3. Garantir `grant select` apenas na `view`.
4. Validar se eventos cancelados devem ou nao ser excluidos da `view`.
5. Se `unaccent` nao estiver habilitado no banco, ajustar o SQL da `view` antes de aplicar.

## Validacao funcional

1. Comparar a quantidade de eventos do mes atual entre Supabase e calendario publicado.
2. Validar meses com maior volume de eventos.
3. Validar eventos de dia inteiro e eventos com horario.
4. Validar ordenacao cronologica por `inicio`.
5. Validar tratamento de timezone em `America/Sao_Paulo`.
6. Validar comportamento visual de erro desligando temporariamente a `view` ou a `anon key`.

## Fluxo legado

1. Confirmar se a planilha continuara apenas como origem temporaria de importacao.
2. Se sim, validar o fluxo `planilha -> sync/importacao -> Supabase -> calendario publico`.
3. Remover do deploy publico qualquer variavel `GOOGLE_WEBAPP_URL`, `NEXT_PUBLIC_GOOGLE_WEBAPP_URL` ou `VITE_GOOGLE_WEBAPP_URL`.
