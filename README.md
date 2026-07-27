# Calendário Público EAC

Aplicação React/Vite para consultar, apresentar e compartilhar os eventos públicos não litúrgicos do EAC.

## Pré-requisitos

1. Node.js 20+.
2. Projeto Supabase com acesso público de leitura configurado.
3. View `vw_public_calendar_events` ou outra view compatível.

## Configuração

1. Instale as dependências:
   `npm install`
2. Copie `.env.example` para `.env`.
3. Preencha as variáveis descritas em `.env.example`.
4. Execute:
   `npm run dev`

## Dados esperados

A view deve fornecer os campos `id`, `atividade`, `tipo`, `inicio`, `termino`, `local`, `proprietario` e `status`.

Eventos cancelados e categorias litúrgicas são descartados antes da apresentação. A imagem mensal de compartilhamento usa apenas os eventos do mês selecionado.
