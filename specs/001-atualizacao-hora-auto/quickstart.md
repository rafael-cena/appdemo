# Quickstart: Validação da Atualização Automática da Hora

## Pré-requisitos

- Node.js 18+ instalado
- npm 9+ instalado
- Git (para clonar/checkout da branch)

## Setup

```bash
# 1. Navegar para o repositório
cd D:\UNOESTE\8° TERMO\TTC III\projetofinal\appdemo

# 2. Confirmar branch da feature
git switch 001-atualizacao-hora-auto
git branch --show-current
# Deve mostrar: 001-atualizacao-hora-auto

# 3. Instalar dependências (inclui devDependencies de teste)
npm install

# 4. Iniciar servidor em background
npm start &
# Servidor roda em http://localhost:3000
```

## Cenários de Validação

### Cenário 1: Título e Cabeçalho Atualizados (US2, FR-004, FR-005, SC-002, SC-003)

**Comando**:
```bash
curl -s http://localhost:3000 | grep -E '<title>|<h1>'
```

**Resultado Esperado**:
```html
<title>App Demo - Informações do Servidor (alterado pelo Claude Code)</title>
<h1>Informações do Servidor (alterado pelo Claude Code)</h1>
```

**Critério de Pass**: Ambos os textos exatos estão presentes.

---

### Cenário 2: IP do Servidor Exibido (FR-006, SC-004)

**Comando**:
```bash
curl -s http://localhost:3000 | grep 'Endereço IP do Servidor'
```

**Resultado Esperado**:
```html
<p>Endereço IP do Servidor: <IP_VÁLIDO>GITACTIONS</p>
```
(Onde `<IP_VÁLIDO>` é um IPv4 não-interno, ex: 192.168.x.x)

---

### Cenário 3: Endpoint `/api/time` Retorna Hora Válida (FR-003, RV-005)

**Comando**:
```bash
curl -s -H "Accept: application/json" http://localhost:3000/api/time
```

**Resultado Esperado**:
```json
{"time":"2026-11-20 14:30:45"}
```

**Validação**:
- Status HTTP 200
- Content-Type: application/json
- Campo `time` no formato `YYYY-MM-DD HH:mm:ss` (regex: `^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$`)

---

### Cenário 4: Atualização Automática a Cada Segundo no Navegador (US1, FR-002, SC-001)

**Pré-requisito**: Navegador com Playwright instalado (`npx playwright install chromium`)

**Teste Automatizado (Playwright)**:
```bash
# Executar teste E2E específico
npx playwright test tests/e2e/clock.spec.js --headed
```

**O que o teste verifica**:
1. Página carrega com hora inicial
2. Após 1 segundo, hora no DOM é atualizada
3. Após 3 segundos, hora foi atualizada 3 vezes (progressão de segundos)
4. Intervalo entre atualizações: 1000ms ± 100ms

**Validação Manual (Alternativa)**:
1. Abrir `http://localhost:3000` no navegador
2. Abrir DevTools (F12) → Console
3. Observar o elemento `<p>Hora Atual do Servidor: ...</p>`
4. Confirmar que o valor muda a cada segundo sem reload da página

---

### Cenário 5: Fallback Gracioso sem JavaScript (FR-007)

**Comando**:
```bash
# Desabilitar JS no navegador OU usar curl (que não executa JS)
curl -s http://localhost:3000 | grep 'Hora Atual do Servidor'
```

**Resultado Esperado**:
```html
<p>Hora Atual do Servidor: 2026-11-20 14:30:45</p>
```
(Hora renderizada server-side está presente, mesmo sem JS executar)

---

### Cenário 6: Performance e Memória (SC-005, SC-006)

**Carga Inicial (< 3s)**:
```bash
time curl -s -o /dev/null -w "%{time_total}\n" http://localhost:3000
# Deve retornar < 3.000
```

**Memória (validação manual via DevTools)**:
1. Abrir página no Chrome
2. DevTools → Memory → Take heap snapshot
3. Aguardar 5 minutos
4. Take heap snapshot → Comparar
5. Diferença < 10MB

---

## Executar Testes Automatizados

```bash
# Testes unitários + integração (Jest)
npm test

# Testes E2E (Playwright)
npm run test:e2e

# Todos os testes com coverage
npm run test:coverage
```

**Critérios de Passagem**:
- Todos os testes unitários/integração passam
- Todos os testes E2E passam
- Coverage ≥ 80% (statements, branches, functions, lines)

---

## Parar Servidor

```bash
# Encontrar PID do node
netstat -ano | findstr :3000
# Ou no PowerShell:
Get-Process node | Where-Object {$_.CPU -gt 0} | Stop-Process

# Ou simplesmente Ctrl+C se rodou em foreground
```

---

## Referências

- **Spec**: `specs/001-atualizacao-hora-auto/spec.md`
- **Plan**: `specs/001-atualizacao-hora-auto/plan.md`
- **Data Model**: `specs/001-atualizacao-hora-auto/data-model.md`
- **API Contract**: `specs/001-atualizacao-hora-auto/contracts/api-time.json`