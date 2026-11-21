# Feature Specification: Atualização Automática da Hora do Servidor

**Feature Branch**: `001-atualizacao-hora-auto`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Na página de informações do servidor (onde são exibidos o IP e a hora), faça duas alterações mantendo a seguinte ordem de prioridade: primeiro, configure a hora do servidor para atualizar automaticamente a cada segundo sem a necessidade de recarregar a página; segundo, altere o título atual de 'Informações do Servidor (ALTERADO)' para 'Informações do Servidor (alterado pelo Claude Code)'"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hora Atualiza Automaticamente (Priority: P1)

Como usuário da aplicação, quero que a hora exibida na página seja atualizada automaticamente a cada segundo sem precisar recarregar a página, para sempre ver a hora atual do servidor em tempo real.

**Why this priority**: É a primeira prioridade do pedido do usuário e representa a mudança de comportamento mais significativa (de estática para dinâmica).

**Independent Test**: Pode ser testado independentemente abrindo a página e observando se o campo da hora muda a cada segundo sem recarregar.

**Acceptance Scenarios**:

1. **Given** a página está carregada no navegador, **When** aguardo 1 segundo, **Then** o valor da hora exibida é atualizado para refletir a hora atual do servidor
2. **Given** a página está carregada, **When** aguardo 10 segundos, **Then** a hora foi atualizada 10 vezes, mostrando a progressão de segundos
3. **Given** a página está carregada, **When** não recarrego a página por 1 minuto, **Then** a hora continua atualizando a cada segundo sem intervenção do usuário

---

### User Story 2 - Título Atualizado (Priority: P2)

Como usuário da aplicação, quero que o título da página (tanto na aba do navegador quanto no cabeçalho principal) exiba "Informações do Servidor (alterado pelo Claude Code)" em vez do título anterior, para identificar que a página foi modificada pelo Claude Code.

**Why this priority**: Segunda prioridade do pedido, mudança puramente textual/visual.

**Independent Test**: Pode ser testado independentemente verificando o `<title>` do HTML e o texto do `<h1>` na página renderizada.

**Acceptance Scenarios**:

1. **Given** a página é carregada, **When** inspeciono o título da aba do navegador, **Then** ele exibe "App Demo - Informações do Servidor (alterado pelo Claude Code)"
2. **Given** a página é carregada, **When** leio o cabeçalho principal (h1), **Then** ele exibe "Informações do Servidor (alterado pelo Claude Code)"

---

### Edge Cases

- O que acontece se o JavaScript falhar ao carregar? A hora inicial renderizada pelo servidor ainda deve ser exibida (fallback gracioso)
- Como o sistema lida se o relógio do servidor estiver dessincronizado? A hora exibida reflete a hora do servidor (não do cliente), então depende da configuração do servidor
- O que acontece se a página ficar aberta por longos períodos? A atualização contínua não deve causar vazamento de memória ou degradação de performance

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir a hora atual do servidor na página inicial
- **FR-002**: O sistema DEVE atualizar a hora exibida automaticamente a cada segundo sem necessidade de recarregar a página
- **FR-003**: O sistema DEVE obter a hora atualizada do servidor (não do cliente) a cada atualização
- **FR-004**: O sistema DEVE exibir o título da página como "App Demo - Informações do Servidor (alterado pelo Claude Code)" no elemento `<title>`
- **FR-005**: O sistema DEVE exibir o cabeçalho principal como "Informações do Servidor (alterado pelo Claude Code)" no elemento `<h1>`
- **FR-006**: O sistema DEVE continuar exibindo o endereço IP do servidor conforme implementação atual
- **FR-007**: Se o JavaScript falhar ao carregar, o sistema DEVE ainda exibir a hora inicial renderizada pelo servidor (fallback)

### Key Entities

- **Servidor**: Representa a máquina que hospeda a aplicação; atributos: endereço IP, hora atual
- **Página de Informações**: Interface web que exibe IP e hora do servidor; atributos: título, cabeçalho, IP exibido, hora exibida

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A hora exibida na página é atualizada a cada 1 segundo (±100ms) sem recarregar a página
- **SC-002**: O título da aba do navegador exibe exatamente "App Demo - Informações do Servidor (alterado pelo Claude Code)"
- **SC-003**: O cabeçalho principal (h1) exibe exatamente "Informações do Servidor (alterado pelo Claude Code)"
- **SC-004**: O endereço IP do servidor continua sendo exibido corretamente
- **SC-005**: A página carrega completamente em menos de 3 segundos em conexão local
- **SC-006**: A atualização contínua da hora não causa aumento de uso de memória superior a 10MB em 5 minutos de página aberta

## Assumptions

- A aplicação continua rodando em Node.js/Express com template engine EJS
- O servidor tem relógio sincronizado (NTP ou similar)
- O cliente (navegador) suporta JavaScript ES6+ (fetch, setInterval)
- A arquitetura atual (renderização server-side + atualização client-side) é mantida
- Não há necessidade de autenticação ou autorização para acessar a página
- A frequência de atualização de 1 segundo é fixa e não configurável