---

description: "Task list template for feature implementation"
---

# Tasks: Atualização Automática da Hora do Servidor

**Input**: Design documents from `/specs/001-atualizacao-hora-auto/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify existing project structure matches plan.md (app.js, views/, package.json at root)
- [ ] T002 [P] Create `public/js/` directory for static assets
- [ ] T003 [P] Verify `express.static('public')` middleware can be added to app.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add `express.static('public')` middleware in `app.js` to serve static files from `public/`
- [ ] T005 Implement `GET /api/time` endpoint in `app.js` returning JSON `{ "time": "YYYY-MM-DD HH:mm:ss", "source": "server" }` per `contracts/api-time.json` and `data-model.md` (Servidor.horaAtual format RV-003, RV-005)
- [ ] T006 Add error handling in `/api/time` endpoint (try/catch, return 500 on failure per contract)
- [ ] T007 [P] Update `package.json` with test scripts and devDependencies: jest, supertest, playwright, @playwright/test

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Hora Atualiza Automaticamente (Priority: P1) 🎯 MVP

**Goal**: Implementar atualização automática da hora do servidor a cada segundo via polling client-side, consumindo endpoint `/api/time`

**Independent Test**: Abrir a página no navegador e observar se o campo da hora muda a cada segundo sem recarregar a página (SC-001). Validar via Playwright E2E que a hora atualiza a cada 1000ms ± 100ms.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Create contract test for `GET /api/time` in `tests/unit/time-api.test.js` validating response schema per `contracts/api-time.json`
- [ ] T009 [P] [US1] Create integration test for server time endpoint in `tests/integration/server.test.js` using Supertest
- [ ] T010 [P] [US1] Create E2E test for auto-update behavior in `tests/e2e/clock.spec.js` using Playwright (validates SC-001, SC-006)

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create client-side polling logic in `public/js/clock.js`:
  - Fetch `/api/time` every 1000ms using `setInterval`
  - Update DOM element `#server-time` with response `time` value
  - Include try/catch error handling: stop interval on error, log to console (per research.md decision #5, FR-007)
  - Start polling on `DOMContentLoaded`
- [ ] T012 [US1] Update `views/index.ejs`:
  - Add `id="server-time"` to the `<p>` element displaying `horaAtual` for DOM targeting
  - Add `<script src="/js/clock.js">` before closing `</body>` tag
- [ ] T013 [US1] Verify fallback: initial `horaAtual` from server-side render remains visible if JS fails to load (FR-007)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Título Atualizado (Priority: P2)

**Goal**: Alterar o título da página (elemento `<title>` e `<h1>`) de "Informações do Servidor (ALTERADO)" para "Informações do Servidor (alterado pelo Claude Code)"

**Independent Test**: Verificar o `<title>` do HTML e o texto do `<h1>` na página renderizada via curl ou navegador (SC-002, SC-003)

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T014 [P] [US2] Create unit test in `tests/unit/title.test.js` validating exact title and header strings per `data-model.md` (RV-001, RV-002) and `spec.md` (FR-004, FR-005, SC-002, SC-003)

### Implementation for User Story 2

- [ ] T015 [US2] Update `views/index.ejs`:
  - Change `<title>` from "App Demo - Informações do Servidor" to "App Demo - Informações do Servidor (alterado pelo Claude Code)" (FR-004, SC-002)
  - Change `<h1>` from "Informações do Servidor" to "Informações do Servidor (alterado pelo Claude Code)" (FR-005, SC-003)
  - Per `data-model.md` InfoPage.title and InfoPage.header exact values

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, validation, and documentation

- [ ] T016 [P] Configure `jest.config.js` for Jest + Supertest (test environment: node, testMatch for tests/**/*.test.js)
- [ ] T017 [P] Create Playwright config `playwright.config.js` for E2E tests (baseURL: http://localhost:3000)
- [ ] T018 [P] Add `.gitignore` entries for `node_modules/`, `coverage/`, `playwright-report/`, `.nyc_output/` if not present
- [ ] T019 Run quickstart.md validation scenarios manually:
  - Cenário 1: Título e Cabeçalho (US2)
  - Cenário 2: IP do Servidor (FR-006)
  - Cenário 3: Endpoint `/api/time` (FR-003)
  - Cenário 4: Atualização automática (US1)
  - Cenário 5: Fallback sem JS (FR-007)
  - Cenário 6: Performance e Memória (SC-005, SC-006)
- [ ] T020 Run automated test suite: `npm test` (Jest) and `npm run test:e2e` (Playwright)
- [ ] T021 Verify code coverage ≥ 80% (statements, branches, functions, lines)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1 (independently testable)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services (N/A - no models in this feature)
- Services before endpoints (Foundational phase covers endpoint)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003)
- All Foundational tasks marked [P] can run in parallel (T007)
- Once Foundational phase completes, both user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel (T008, T009, T010 for US1; T014 for US2)
- Polish tasks marked [P] can run in parallel (T016, T017, T018)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for GET /api/time in tests/unit/time-api.test.js"
Task: "Integration test for server time endpoint in tests/integration/server.test.js"
Task: "E2E test for auto-update behavior in tests/e2e/clock.spec.js"

# Launch implementation tasks (after tests written and failing):
Task: "Create client-side polling logic in public/js/clock.js"
Task: "Update views/index.ejs with id and script tag"
```

---

## Parallel Example: User Story 2

```bash
# Launch test and implementation in parallel (different files):
Task: "Create unit test for title/header in tests/unit/title.test.js"
Task: "Update views/index.ejs title and h1"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (auto-update hour)
4. **STOP and VALIDATE**: Test User Story 1 independently via quickstart.md Cenário 4
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (auto-update)
   - Developer B: User Story 2 (title update)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All FR-001 to FR-007 and SC-001 to SC-006 are covered by tasks above
- Data model constrained fields cited: `data-model.md` Servidor.horaAtual (RV-003, RV-005), InfoPage.title (RV-001), InfoPage.header (RV-002), API response (RV-005)