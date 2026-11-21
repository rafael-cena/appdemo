# Research: Atualização Automática da Hora do Servidor

## Decisões Técnicas

### 1. Estratégia de Atualização da Hora: Polling vs WebSocket vs Server-Sent Events

**Decision**: Polling HTTP simples (fetch + setInterval) a cada 1 segundo.

**Rationale**: 
- Requisito FR-002 exige atualização a cada segundo
- Polling é simples, confiável e funciona em qualquer infraestrutura (sem proxy WebSocket, sem configuração de SSE)
- Para 1 cliente, 1 request/segundo é trivial para o servidor Express
- Fallback gracioso nativo: se JS falha, hora inicial do server-side render permanece

**Alternatives considered**:
- **WebSocket**: Overkill para 1 valor escalar a 1Hz; adiciona dependência (ws) e complexidade de conexão persistente
- **Server-Sent Events (SSE)**: Mais leve que WebSocket, mas ainda requer endpoint streaming e reconexão; polling é mais simples para este caso
- **setInterval com Date.now() no cliente**: Viola FR-003 (hora DEVE vir do servidor)

### 2. Endpoint API para Hora Atual

**Decision**: Novo endpoint `GET /api/time` retornando JSON `{ "time": "YYYY-MM-DD HH:mm:ss" }`

**Rationale**:
- Separação de concerns: página HTML (`/`) vs dados da hora (`/api/time`)
- Permite cache control headers se necessário no futuro
- Fácil de testar independentemente (unit/integration)
- Compatível com fetch nativo

**Alternatives considered**:
- **Reutilizar `/` com query param `?format=json`**: Mistura responsabilidades; menos RESTful
- **WebSocket endpoint**: Ver decisão #1

### 3. Client-Side Implementation

**Decision**: Arquivo estático `public/js/clock.js` carregado via `<script src="/js/clock.js">` no template EJS

**Rationale**:
- Express serve arquivos estáticos via `express.static('public')` (já padrão)
- Separa lógica JS do template (melhor manutenibilidade, cacheável)
- Permite usar ES6 modules se necessário no futuro
- Fallback: se script não carrega, hora inicial do EJS permanece visível

**Alternatives considered**:
- **Inline `<script>` no EJS**: Funciona mas mistura template e lógica; não cacheável
- **Bundler (Vite/Webpack)**: Overkill para ~30 linhas de JS vanilla

### 4. Test Strategy

**Decision**: 
- **Unit/Integration**: Jest + Supertest para endpoint `/api/time` e rota `/`
- **E2E**: Playwright para validar atualização visual no navegador (SC-001, SC-002, SC-003)
- **Coverage**: Mínimo 80% (constituição não especifica, mas boa prática)

**Rationale**:
- Jest/Supertest são padrão no ecossistema Express
- Playwright testa o comportamento real do usuário (atualização a cada segundo no DOM)
- Projeto não tem configuração de teste atual; será adicionada no package.json

**Alternatives considered**:
- **Cypress**: Alternativa válida ao Playwright; escolha baseada em preferência da equipe
- **Apenas testes manuais**: Não atende critério de rastreabilidade e automação

### 5. Tratamento de Erros e Fallback

**Decision**: 
- Client-side: try/catch no fetch; em erro, para o interval e loga no console (hora inicial do server-side permanece)
- Server-side: endpoint `/api/time` com try/catch; retorna 500 + JSON de erro se moment falhar

**Rationale**: 
- Atende FR-007 (fallback gracioso)
- Não quebra a página se API falhar temporariamente
- Log no console auxilia debug sem impactar UX

## Resumo de Artefatos a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `app.js` | MODIFY | Adicionar `express.static('public')`, endpoint `GET /api/time` |
| `views/index.ejs` | MODIFY | Atualizar `<title>` e `<h1>`; adicionar `<script src="/js/clock.js">` |
| `public/js/clock.js` | CREATE | Lógica de polling fetch + atualização DOM a cada 1s |
| `package.json` | MODIFY | Adicionar scripts de teste, jest, supertest, playwright como devDependencies |
| `jest.config.js` | CREATE | Configuração Jest |
| `tests/unit/time-api.test.js` | CREATE | Testes do endpoint `/api/time` |
| `tests/integration/server.test.js` | CREATE | Testes de integração da rota `/` |
| `tests/e2e/clock.spec.js` | CREATE | Testes E2E Playwright |
| `.gitignore` | MODIFY | Adicionar `node_modules/`, `coverage/`, `playwright-report/` se não existirem |