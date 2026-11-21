# Data Model: Atualização Automática da Hora do Servidor

## Entidades

### 1. Servidor (Server)

Representa a máquina que hospeda a aplicação. Não é persistida em banco de dados; é estado em memória derivado do sistema operacional.

| Atributo | Tipo | Descrição | Validação/Regras |
|----------|------|-----------|------------------|
| `ip` | string | Endereço IPv4 não-interno da primeira interface de rede encontrada | Não vazio; formato IPv4 válido; fallback: "Endereço IP não encontrado" |
| `horaAtual` | string | Timestamp atual do servidor no formato `YYYY-MM-DD HH:mm:ss` | Gerado via `moment().format('YYYY-MM-DD HH:mm:ss')` a cada request |

**Relacionamentos**: Nenhum (entidade autônoma, sem persistência)

**Origem dos dados**: 
- `ip`: `os.networkInterfaces()` (Node.js built-in)
- `horaAtual`: `moment()` (biblioteca moment.js)

---

### 2. Página de Informações (InfoPage)

Representa a view renderizada para o usuário. Estado transitório composto por dados do Servidor + metadados de UI.

| Atributo | Tipo | Descrição | Validação/Regras |
|----------|------|-----------|------------------|
| `title` | string | Conteúdo do elemento `<title>` HTML | **Deve ser exatamente**: `"App Demo - Informações do Servidor (alterado pelo Claude Code)"` (FR-004, SC-002) |
| `header` | string | Conteúdo do elemento `<h1>` HTML | **Deve ser exatamente**: `"Informações do Servidor (alterado pelo Claude Code)"` (FR-005, SC-003) |
| `ip` | string | Valor exibido para IP do servidor | Vem de `Servidor.ip`; não vazio (FR-006) |
| `horaAtual` | string | Valor inicial exibido para hora do servidor | Vem de `Servidor.horaAtual` no momento do render server-side (FR-001, FR-007) |

**Relacionamentos**: 
- `InfoPage` **usa** `Servidor` (composição transitória no request/response)

**Estados de UI (Client-side)**:
| Estado | Descrição | Transição |
|--------|-----------|-----------|
| `INITIAL` | Página carregada com hora server-side | → `UPDATING` após `DOMContentLoaded` |
| `UPDATING` | Polling ativo, hora atualizada a cada 1s | → `ERROR` se fetch falhar 3x consecutivas |
| `ERROR` | Polling parado, hora estática (última conhecida ou inicial) | Terminal (sem auto-recovery por simplicidade) |

---

## Regras de Validação (Derivadas dos Requisitos)

| Regra | Entidade/Contexto | Descrição |
|-------|-------------------|-----------|
| RV-001 | `InfoPage.title` | Deve conter substring "(alterado pelo Claude Code)" |
| RV-002 | `InfoPage.header` | Deve conter substring "(alterado pelo Claude Code)" |
| RV-003 | `Servidor.horaAtual` | Formato fixo `YYYY-MM-DD HH:mm:ss` (24h, zero-padded) |
| RV-004 | `InfoPage.horaAtual` (inicial) | Mesmo formato de `Servidor.horaAtual` |
| RV-005 | `API /api/time` response | JSON `{ "time": "YYYY-MM-DD HH:mm:ss" }` com Content-Type `application/json` |
| RV-006 | Client-side update | Intervalo de 1000ms ± 100ms entre atualizações DOM (SC-001) |

---

## Fluxo de Dados

```mermaid
flowchart LR
    A[Request GET /] --> B[Express Route Handler]
    B --> C[getIpAddress()]
    B --> D[moment().format()]
    C --> E[Servidor.ip]
    D --> F[Servidor.horaAtual]
    E --> G[res.render('index', {ip, horaAtual})]
    F --> G
    G --> H[views/index.ejs]
    H --> I[HTML Response]
    
    I --> J[Browser: DOMContentLoaded]
    J --> K[clock.js: startPolling()]
    K --> L[fetch('/api/time') cada 1s]
    L --> M[GET /api/time]
    M --> N[Express: moment().format()]
    N --> O[JSON {time: ...}]
    O --> L
    L --> P[DOM Update: #server-time.textContent]
```

---

## Notas de Implementação

- **Sem migração de banco**: Não há persistência; dados são computados on-demand
- **Dados de teste**: Mock de `moment()` e `os.networkInterfaces()` em testes unitários
- **Timezone**: Hora reflete timezone do servidor (configuração do SO/container); não há conversão client-side