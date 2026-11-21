# Quickstart: Atualização Automática da Hora do Servidor

**Feature**: 001-atualizacao-hora-auto
**Date**: 2026-11-20

## Pré-requisitos

- Node.js 18+ instalado
- Git (para clonar/obter o código)
- Navegador moderno com suporte a ES6+ (fetch, setInterval, arrow functions)

## Setup

```bash
# 1. Clonar/acessar o repositório
cd /caminho/para/appdemo

# 2. Instalar dependências
npm install

# 3. Iniciar servidor
node app.js
# Servidor rodando em http://localhost:3000
```

## Validação Manual (Browser)

### 1. Carregamento Inicial
- Abrir `http://localhost:3000`
- **Verificar**: Página carrega em <3 segundos (SC-005)
- **Verificar**: Título da aba = "App Demo - Informações do Servidor (alterado pelo Claude Code)" (SC-002)
- **Verificar**: Cabeçalho (h1) = "Informações do Servidor (alterado pelo Claude Code)" (SC-003)
- **Verificar**: IP do servidor exibido (SC-004)
- **Verificar**: Hora inicial no formato YYYY-MM-DD HH:mm:ss (FR-001)

### 2. Atualização Automática (Polling)
- Aguardar 10 segundos sem recarregar a página
- **Verificar**: Hora atualiza a cada ~1 segundo (segundos incrementam) (SC-001, FR-002)
- **Verificar**: No DevTools Network (F12), requisições `GET /api/time` a cada 1s com status 200
- **Verificar**: Response JSON válido: `{"time":"2026-11-20 14:30:45","source":"server"}`

### 3. Fallback Gracioso (Opcional)
- No DevTools (F12) → Settings → Disable JavaScript
- Recarregar página
- **Verificar**: Hora inicial ainda visível (renderizada server-side) (FR-007)
- Reabilitar JavaScript

### 4. Teste de Memória (Opcional - SC-006)
- Abrir DevTools → Memory tab
- Gravar heap snapshot inicial
- Aguardar 5 minutos com página aberta
- Gravar segundo snapshot
- **Verificar**: Diferença < 10MB

## Endpoint API Direto (para teste via curl/Postman)

```bash
# Obter hora atual do servidor
curl http://localhost:3000/api/time

# Resposta esperada:
# {"time":"2026-11-20 14:30:45","source":"server"}
```

## Comandos de Verificação do Projeto

| Comando | Descrição | Status Atual |
|---------|-----------|--------------|
| `npm test` | Executar testes | Placeholder (não configurado) |
| `npm run lint` | Linting | Não configurado |
| `node app.js` | Iniciar servidor | Funcional |

## Critérios de Sucesso (Checklist)

- [ ] SC-001: Hora atualiza a cada 1s (±100ms) sem reload
- [ ] SC-002: Título da aba = "App Demo - Informações do Servidor (alterado pelo Claude Code)"
- [ ] SC-003: Cabeçalho h1 = "Informações do Servidor (alterado pelo Claude Code)"
- [ ] SC-004: IP do servidor exibido corretamente
- [ ] SC-005: Carregamento < 3s em conexão local
- [ ] SC-006: Sem vazamento memória >10MB em 5min (opcional)

## Troubleshooting

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| Hora não atualiza | JS desabilitado ou erro no fetch | Verificar console (F12) por erros; verificar rota `/api/time` |
| Erro 404 em `/api/time` | Rota não registrada em app.js | Verificar se `app.get('/api/time', ...)` foi adicionado |
| Hora mostra "Invalid Date" | moment() falhou | Verificar se moment está instalado (`npm list moment`) |
| Título não mudou | Cache do browser | Hard reload (Ctrl+Shift+R) ou limpar cache |