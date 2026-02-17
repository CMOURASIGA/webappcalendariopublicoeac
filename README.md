# Calendário Público EAC

Aplicação React/Vite para exibir eventos usando um endpoint publicado no Google Apps Script.

## Pré-requisitos

1. Node.js 20+.
2. Um Web App do Google Apps Script publicado com acesso liberado.
3. A action `GET_EVENTS` disponível no `doPost`.

## Configuração

1. Instale as dependências:
   `npm install`
2. Copie `.env.example` para `.env`.
3. Preencha as variáveis:
   `VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec`
4. Execute:
   `npm run dev`

## Contrato esperado do endpoint

O frontend envia:
1. `POST` para `VITE_APPS_SCRIPT_URL`
2. Body JSON: `{ "action": "GET_EVENTS", "payload": {} }`

A resposta esperada:
1. `{ "ok": true, "events": [...] }`
2. Campos de cada evento: `id`, `atividade`, `tipo`, `inicio`, `termino`, `local`, `proprietario`, `status`

## Sobre GOOGLE_CREDENTIALS

- `GOOGLE_CREDENTIALS` não deve ser exposto no frontend.
- Se você usar Apps Script como proxy, as credenciais ficam no próprio Apps Script/projeto Google, não no browser.
