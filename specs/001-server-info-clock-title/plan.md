# Implementation Plan: Server Info Clock Title

**Branch**: `001-server-info-clock-title` | **Date**: 2026-11-21 | **Spec**: specs/001-server-info-clock-title/spec.md

**Input**: Feature specification from `specs/001-server-info-clock-title/spec.md`

## Summary

This feature implements two changes to the server information page (root route `/`):
1. **P1 (Primary)**: Real-time server clock updates every second without page reload using client-side polling to `/api/time` endpoint
2. **P2 (Secondary)**: Update page title and heading from "Informações do Servidor (ALTERADO)" to "Informações do Servidor (alterado pelo Claude Code)"

The technical approach uses progressive enhancement: server-rendered initial time with client-side polling for updates, graceful degradation to static time if JavaScript disabled.

## Technical Context

**Language/Version**: Node.js 18+ (Express.js)

**Primary Dependencies**: 
- express ^4.18.2 (web framework)
- ejs ^3.1.9 (template engine)
- moment ^2.29.4 (date/time formatting)
- os (built-in, server IP detection)

**Storage**: N/A (no database; stateless server info display)

**Testing**: 
- Unit/Integration: Jest 29.7.0 with supertest 6.3.4 (coverage threshold: 80% statements/branches/lines, 75% functions)
- E2E: Playwright 1.42.1

**Target Platform**: Web browser (desktop/mobile), Node.js server (Linux/Windows/macOS)

**Project Type**: Web application (Express + EJS server-rendered with client-side enhancement)

**Performance Goals**: 
- Initial page load < 2 seconds (SC-005)
- Time updates ±100ms tolerance every second (SC-001)
- No memory leaks or excessive CPU over 5 minutes (SC-006)

**Constraints**: 
- Stack unchanged: Express/EJS/moment/os
- Scope limited to root route `/` only
- No authentication required
- Progressive enhancement mandatory (server-rendered fallback)
- Client-side increments based on initial server time (no repeated server requests for time)

**Scale/Scope**: Single page, single route, minimal UI change

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Constitution as Single Source of Truth | PASS | Skill prevails over constitution |
| II. No Manual Edits to Spec Kit Artifacts | PASS | All artifacts generated via skill |
| III. Developer-Only Implementation | PASS | Plan only, no implementation code |
| IV. Orchestrator-Managed Git Operations | PASS | No git ops in this phase |
| V. Feature Branch Discipline | PASS | Confirmed on `001-server-info-clock-title` |
| VI. Structured Identifiers | PASS | FR/SC/US/T identifiers used |
| VII. Two Human Checkpoints | PASS | Checkpoint 1 approved (spec.md) |
| VIII. Autonomous Flow Between Checkpoints | PASS | Planning phase autonomous |

**Gate Result**: PASS — No violations, no justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-server-info-clock-title/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── api-time.json    # GET /api/time endpoint contract
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
# Option 2: Web application (Express backend + EJS frontend)
app.js                   # Express server with routes
views/
  └── index.ejs          # EJS template for root route
public/
  └── js/
      └── clock.js       # Client-side polling logic
package.json             # Dependencies and scripts
tests/
  ├── unit/              # Unit tests (Jest)
  ├── integration/       # Integration tests (Jest + supertest)
  └── e2e/               # E2E tests (Playwright)
```

**Structure Decision**: Existing Express/EJS web application structure retained. Feature modifies `app.js` (adds/verifies `/api/time` endpoint), `views/index.ejs` (title/heading update), and `public/js/clock.js` (polling logic). Tests organized by type in `tests/` directory.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — Constitution Check passed cleanly. No complexity justification required.