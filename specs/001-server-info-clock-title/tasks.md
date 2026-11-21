---

description: "Task list template for feature implementation"
---

# Tasks: Server Info Clock Title

**Input**: Design documents from `/specs/001-server-info-clock-title/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested in the feature specification (Jest for unit/integration with 80/80/75/80 coverage thresholds, Playwright for E2E)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Express backend at repository root, EJS templates in `views/`, static assets in `public/`, tests in `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan (verify `app.js`, `views/`, `public/js/`, `tests/` directories exist)
- [X] T002 Initialize Node.js project with Express/EJS/moment/os dependencies (verify `package.json` has required dependencies)
- [X] T003 [P] Configure linting and formatting tools (ESLint/Prettier if not present)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup Express server with EJS template engine in `app.js` (routes, static files, view engine)
- [X] T005 [P] Implement server IP detection function `getIpAddress()` in `app.js` (data-model.md: ServerInformation.ip)
- [X] T006 [P] Configure Jest test environment with supertest and coverage thresholds (80% statements/branches/lines, 75% functions) in `package.json`
- [X] T007 [P] Configure Playwright for E2E testing in `playwright.config.js`
- [X] T008 Create base EJS template structure in `views/index.ejs` with placeholder for server time and IP

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Real-time Server Clock Updates (Priority: P1) 🎯 MVP

**Goal**: Implement automatic server time updates every second without page reload using client-side polling to `/api/time` endpoint

**Independent Test**: Open page at `http://localhost:3000`, observe time update every second (±100ms tolerance) without manual refresh, verify IP remains unchanged (SC-001, SC-002, SC-005, SC-006)

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Contract test for GET `/api/time` endpoint in `tests/unit/time-api.test.js` (validates response format, headers per contracts/api-time.json)
- [ ] T010 [P] [US1] Integration test for `/` route rendering initial server time and IP in `tests/integration/server.test.js` (validates ServerInformation entity from data-model.md)
- [ ] T011 [P] [US1] E2E test for clock auto-update behavior in `tests/e2e/clock.spec.js` (validates SC-001, SC-002, SC-006)

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement GET `/api/time` endpoint in `app.js` returning `{ "time": "YYYY-MM-DD HH:mm:ss" }` with proper cache headers (contracts/api-time.json, data-model.md: ServerInformation.horaAtual)
- [ ] T013 [P] [US1] Add server-side time rendering in `app.js` root route using `moment().format('YYYY-MM-DD HH:mm:ss')` for initial page load (data-model.md: ServerInformation.horaAtual)
- [ ] T014 [US1] Create client-side polling logic in `public/js/clock.js` to fetch `/api/time` every 1000ms and update `#server-time` element (research.md: polling strategy)
- [ ] T015 [US1] Add interval cleanup in `public/js/clock.js` (`clearInterval` on fetch error and `beforeunload` for memory leak prevention per research.md)
- [ ] T016 [US1] Include `clock.js` script tag in `views/index.ejs` for progressive enhancement (server-rendered fallback when JS disabled per FR-005)
- [ ] T017 [US1] Add error handling for `/api/time` fetch failures (stop polling, log error to console)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Updated Page Title (Priority: P2)

**Goal**: Update page title and heading from "Informações do Servidor (ALTERADO)" to "Informações do Servidor (alterado pelo Claude Code)"

**Independent Test**: Inspect browser tab title and main heading (h1) on page load - both must display exact strings per FR-003, FR-004, SC-003, SC-004

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Unit test for exact title string validation in `tests/unit/title.test.js` (validates PageLabels.pageTitle per data-model.md)
- [ ] T019 [P] [US2] Unit test for exact h1 string validation in `tests/unit/title.test.js` (validates PageLabels.heading per data-model.md)
- [ ] T020 [P] [US2] Integration test for title/heading in rendered HTML in `tests/integration/server.test.js`
- [ ] T021 [P] [US2] E2E test for title and header verification in `tests/e2e/clock.spec.js`

### Implementation for User Story 2

- [ ] T022 [P] [US2] Update `<title>` in `views/index.ejs` to "App Demo - Informações do Servidor (alterado pelo Claude Code)" (data-model.md: PageLabels.pageTitle, FR-003)
- [ ] T023 [P] [US2] Update `<h1>` in `views/index.ejs` to "Informações do Servidor (alterado pelo Claude Code)" (data-model.md: PageLabels.heading, FR-004)
- [ ] T024 [US2] Verify old "(ALTERADO)" uppercase text is completely removed from template

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T025 [P] Run quickstart.md validation scenarios manually (all 5 scenarios)
- [ ] T026 [P] Run full test suite with coverage (`npm test`) and verify thresholds met
- [ ] T027 [P] Run E2E tests (`npm run test:e2e`) against running server
- [ ] T028 Code cleanup and refactoring (remove any dead code, ensure consistent formatting)
- [ ] T029 Performance verification: monitor memory/CPU over 5 minutes (SC-006)
- [ ] T030 Documentation updates if needed (README.md, inline code comments)
- [ ] T031 Security review: verify no sensitive data exposed, proper cache headers on API

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1, can run in parallel

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models/endpoints before client-side logic
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, both user stories can start in parallel
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract test for GET /api/time in tests/unit/time-api.test.js"
Task: "Integration test for / route in tests/integration/server.test.js"
Task: "E2E test for clock auto-update in tests/e2e/clock.spec.js"

# Launch implementation tasks for User Story 1:
Task: "Implement GET /api/time endpoint in app.js"
Task: "Add server-side time rendering in app.js root route"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Unit test for exact title string in tests/unit/title.test.js"
Task: "Unit test for exact h1 string in tests/unit/title.test.js"
Task: "Integration test for title/heading in tests/integration/server.test.js"
Task: "E2E test for title/header in tests/e2e/clock.spec.js"

# Launch implementation tasks for User Story 2:
Task: "Update <title> in views/index.ejs"
Task: "Update <h1> in views/index.ejs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (time updates every second)
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
   - Developer A: User Story 1 (clock auto-update)
   - Developer B: User Story 2 (title/heading update)
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
- Constrained fields from data-model.md cited in implementing tasks:
  - ServerInformation.ip → T005
  - ServerInformation.horaAtual → T012, T013
  - PageLabels.pageTitle → T022
  - PageLabels.heading → T023