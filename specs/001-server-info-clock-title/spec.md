# Feature Specification: Server Info Clock Title

**Feature Branch**: `[001-server-info-clock-title]`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Na página de informações do servidor (onde são exibidos o IP e a hora), faça duas alterações mantendo a seguinte ordem de prioridade:
1. Configure a hora do servidor para atualizar automaticamente a cada segundo sem a necessidade de recarregar a página
2. Altere o título atual de "Informações do Servidor (ALTERADO)" para "Informações do Servidor (alterado pelo Claude Code)"

Contexto do projeto:
- Aplicação Express (app.js) com template EJS (views/index.ejs)
- Dependências: express, ejs, moment, os
- Página atual exibe IP e hora estática (renderizada no servidor)
- Título atual no HTML: "App Demo - Informações do Servidor" (no <title>) e "Informações do Servidor" (no <h1>)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Real-time Server Clock Updates (Priority: P1)

As a user viewing the server information page, I want the server time to update automatically every second so that I always see the current server time without needing to reload the page.

**Why this priority**: This is the primary functional change requested and directly improves the user experience by providing real-time information.

**Independent Test**: Can be fully tested by opening the page and observing the time update every second without manual refresh. Delivers immediate value as a live clock display.

**Acceptance Scenarios**:

1. **Given** the server information page is loaded, **When** one second passes, **Then** the displayed server time updates to show the new current time
2. **Given** the page remains open, **When** multiple seconds pass, **Then** the time continues to update each second without page reload
3. **Given** the page is loaded, **When** the time updates, **Then** the IP address remains unchanged (only time refreshes)

---

### User Story 2 - Updated Page Title (Priority: P2)

As a user viewing the server information page, I want the page title to read "Informações do Servidor (alterado pelo Claude Code)" so that the page correctly reflects its updated state.

**Why this priority**: This is a cosmetic change requested as the second priority to update the branding/label of the page.

**Independent Test**: Can be fully tested by inspecting the browser tab title and the main heading on the page. Delivers value as accurate labeling.

**Acceptance Scenarios**:

1. **Given** the server information page is loaded, **When** the page renders, **Then** the browser tab title displays "App Demo - Informações do Servidor (alterado pelo Claude Code)"
2. **Given** the server information page is loaded, **When** the page renders, **Then** the main heading (h1) displays "Informações do Servidor (alterado pelo Claude Code)"

---

### Edge Cases

- What happens if JavaScript is disabled in the browser? The time should display the initial server-rendered time (graceful degradation)
- What happens if the page loses connection to the server? The client-side clock should continue updating based on the client's clock or stop gracefully
- How does the system handle rapid page navigation? The interval timer should be properly cleaned up to avoid memory leaks
- What if the server and client clocks are out of sync? The client-side updates should use the initial server time as reference and increment locally

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the current server time that updates automatically every second without requiring page reload
- **FR-002**: System MUST display the server IP address statically (does not update automatically)
- **FR-003**: System MUST display the page title as "App Demo - Informações do Servidor (alterado pelo Claude Code)" in the browser tab
- **FR-004**: System MUST display the main heading as "Informações do Servidor (alterado pelo Claude Code)" on the page
- **FR-005**: System MUST gracefully degrade to static server-rendered time if client-side scripting is unavailable

### Key Entities

- **Server Information**: Represents the data displayed on the page including server IP address and current server time. The IP address is static per page load; the time is dynamic and updates client-side every second.
- **Page Title/Heading**: Represents the textual labels identifying the page, updated to include "alterado pelo Claude Code" suffix.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The displayed server time updates visibly every second (±100ms tolerance) without page reload
- **SC-002**: The IP address remains constant while the time updates
- **SC-003**: Browser tab title shows "App Demo - Informações do Servidor (alterado pelo Claude Code)"
- **SC-004**: Page heading shows "Informações do Servidor (alterado pelo Claude Code)"
- **SC-005**: Page loads and displays initial server time within 2 seconds of request
- **SC-006**: Time update mechanism does not cause memory leaks or excessive CPU usage over 5 minutes of continuous viewing

## Assumptions

- Users have JavaScript enabled in their browsers (progressive enhancement approach with server-rendered fallback)
- The server's system clock is the authoritative time source for the initial render
- Client-side time increments are based on the initial server time value, not repeated server requests
- The existing Express/EJS/moment/os technology stack remains unchanged
- No authentication or authorization is required for this page
- Single-page scope: only the root route (/) is affected
- The "GITACTIONS" suffix in the IP address (from app.js line 13) is considered part of the current behavior and remains unchanged