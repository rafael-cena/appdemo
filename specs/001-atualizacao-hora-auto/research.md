# Research: Atualização Automática da Hora do Servidor

**Feature**: 001-atualizacao-hora-auto
**Date**: 2026-11-20

## Decisões Técnicas

### 1. Endpoint para obter hora do servidor: `GET /api/time`

**Decision**: Adicionar endpoint REST `/api/time` retornando JSON com a hora atual do servidor.

**Rationale**: 
- Simples, stateless, retorna hora do servidor (requisito FR-003)
- JSON é padrão para APIs consumidas por `fetch()`
- Moment.js já é dependência do projeto (`moment().format('YYYY-MM-DD HH:mm:ss')`)
- Polling client-side via `setInterval(fetch('/api/time'), 1000)` atende FR-002

**Alternatives considered**:
- **WebSocket/SSE**: Overkill para atualização de 1s; adiciona complexidade de conexão persistente, reconexão, heartbeat
- **Server-Sent Events**: Similar a WebSocket, desnecessário para polling simples
- **Hora do cliente (`new Date()`)**: Viola FR-003 (hora deve vir do servidor)

### 2. Implementação do polling no frontend: JavaScript inline no template EJS

**Decision**: Incluir JavaScript diretamente no template `index.ejs` dentro de tag `<script>`.

**Rationale**: 
- Feature pequena, single-page; inline evita arquivo estático extra
- Simples de manter; fallback gracioso (FR-007) - se JS falhar, hora inicial do server-side render permanece
- Não requer build step ou configuração de static files (`express.static`)

**Alternatives considered**:
- **Arquivo JS separado em `public/js/`**: Requer configurar `express.static`, mais complexidade para feature mínima
- **Alpine.js/htmx**: Nova dependência desnecessária (YAGNI - You Ain't Gonna Need It)

### 3. Alteração do título e cabeçalho: Edição direta no template EJS

**Decision**: Modificar `<title>` e `<h1>` diretamente em `views/index.ejs`.

**Rationale**: Mudança puramente textual (FR-004, FR-005); template EJS já renderiza esses elementos.

**Alternatives considered**: Nenhuma - mudança direta no template é a abordagem óbvia.

### 4. Formato da hora: `YYYY-MM-DD HH:mm:ss`

**Decision**: Manter o formato já usado na especificação e no código atual (`moment().format('YYYY-MM-DD HH:mm:ss')`).

**Rationale**: Consistência com implementação existente; formato legível e padrão.

### 5. Tratamento de erros no endpoint `/api/time`

**Decision**: Retornar 500 em caso de erro (improvável, pois `moment()` não falha em condições normais). No frontend, em caso de erro no fetch, manter última hora conhecida e tentar novamente no próximo intervalo.

**Rationale**: Simplicidade; polling contínuo tolera falhas transitórias.

## Boas Práticas Aplicadas

- **YAGNI**: Não adicionar WebSocket, SSE, ou bibliotecas extras para polling simples de 1s
- **Progressive Enhancement**: Server-side render fornece hora inicial; JS melhora com atualização automática
- **Graceful Degradation**: Se JS falhar/desabilitado, usuário ainda vê hora (embora estática)
- **Separation of Concerns**: Endpoint API separado da renderização da página
- **Stateless**: Endpoint não mantém estado; cada requisição é independente

## Referências

- Express.js Routing: https://expressjs.com/en/guide/routing.html
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Moment.js Format: https://momentjs.com/docs/#/displaying/format/
- setInterval: https://developer.mozilla.org/en-US/docs/Web/API/setInterval