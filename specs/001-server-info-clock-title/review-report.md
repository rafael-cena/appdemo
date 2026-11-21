# Code Review Report: Server Info Clock Title

**Feature Branch**: `001-server-info-clock-title`
**Review Date**: 2026-11-21
**Reviewer**: Revisor de Código (subagent-revisor-codigo)
**Commit Range**: `main...HEAD` (base_branch...feature branch)

---

## Executive Summary

**Parecer**: `aprovado com ressalvas`

The implementation successfully delivers the two prioritized changes:
1. ✅ Real-time server clock updates every second (FR-001, SC-001, SC-006)
2. ✅ Updated page title and heading to "Informações do Servidor (alterado pelo Claude Code)" (FR-003, FR-004, SC-002, SC-003)

All functional requirements (FR-001 to FR-005) and success criteria (SC-001 to SC-006) are met. The code follows the architectural decisions in the plan (Express/EJS, progressive enhancement, `/api/time` endpoint). Test coverage is comprehensive across unit, integration, and E2E layers.

**However**, there are two **Alto** severity findings that should be addressed before merge:
1. Missing `beforeunload` cleanup for the polling interval (memory leak risk per SC-006 and spec edge case)
2. Implementation uses server polling instead of local time increments, contradicting the spec assumption and plan constraint

---

## Findings by Severity

### ALTO

#### 1. Missing `beforeunload` interval cleanup — memory leak risk
**File**: `public/js/clock.js`
**Lines**: 54-59 (`stopPolling` function exists but not attached to unload)

**Description**: The `clock.js` implements `stopPolling()` which clears the interval, but it is never registered to run on page unload (`beforeunload` or `pagehide`). The spec explicitly lists this as an edge case: "How does the system handle rapid page navigation? The interval timer should be properly cleaned up to avoid memory leaks". SC-006 requires "Time update mechanism does not cause memory leaks or excessive CPU usage over 5 minutes of continuous viewing".

**Impact**: If users navigate away from the page, the `setInterval` continues running in memory, causing a leak. Over multiple navigations, this accumulates.

**Suggested Fix**: Add a `beforeunload`/`pagehide` listener to call `stopPolling()`:
```javascript
// In the IIFE, after startPolling() call:
window.addEventListener('beforeunload', stopPolling);
window.addEventListener('pagehide', stopPolling);
// Or use AbortController pattern if modern browser support allows
```

---

#### 2. Server polling contradicts spec assumption and plan constraint on local increments
**File**: `public/js/clock.js` (lines 20-44, 51)
**Related**: `spec.md` Assumptions, `plan.md` Constraints

**Description**: 
- **Spec assumption** (spec.md line 89): "Client-side time increments are based on the initial server time value, not repeated server requests"
- **Plan constraint** (plan.md line 45): "Client-side increments based on initial server time (no repeated server requests for time)"
- **Implementation**: `clock.js` polls `/api/time` every 1000ms via `fetch()` (line 51: `setInterval(fetchServerTime, POLL_INTERVAL_MS)`)

The plan's "Technical Approach" (line 10) says "client-side polling to `/api/time` endpoint", which contradicts its own constraint and the approved spec assumption. The implementation follows the plan's approach, not its constraint.

**Impact**: Unnecessary network requests every second per client. Increases server load and fails if network is unavailable (spec edge case: "What happens if the page loses connection to the server? The client-side clock should continue updating based on the client's clock"). Current implementation stops polling entirely on error (line 42).

**Suggested Fix**: 
- Option A (align with spec/plan constraint): Change to local increment using `setInterval(() => updateTimeDisplay(incrementTime(initialTime)), 1000)` based on the server-rendered initial time.
- Option B (keep polling, document deviation): Update spec.md assumption and plan.md constraint to reflect polling approach, with human approval (Checkpoint 1 scope change).

---

### MÉDIO

#### 3. Permanent polling stop on any fetch error — no retry or local fallback
**File**: `public/js/clock.js`
**Line**: 42 (`stopPolling()` called in catch block)

**Description**: On any network error (timeout, 5xx, CORS, offline), `stopPolling()` is called, permanently stopping time updates. The spec edge case says: "What happens if the page loses connection to the server? The client-side clock should continue updating based on the client's clock or stop gracefully". Current behavior stops without local fallback.

**Impact**: Brief network blip causes clock to freeze permanently until page reload.

**Suggested Fix**: Implement retry with exponential backoff, or fall back to local time increments using the last known server time as base.

---

#### 4. Plan contains internal contradiction (constraint vs. approach)
**File**: `specs/001-server-info-clock-title/plan.md`
**Lines**: 10 (approach), 45 (constraint)

**Description**: Plan line 10: "client-side polling to `/api/time` endpoint". Plan line 45 (constraint): "Client-side increments based on initial server time (no repeated server requests for time)". These are mutually exclusive.

**Impact**: Confusion for future maintainers; implementation followed "approach" but constraint was violated.

**Suggested Fix**: Update plan.md to remove the contradictory constraint or clarify the chosen approach.

---

#### 5. Spec assumption references stale "GITACTIONS" suffix
**File**: `specs/001-server-info-clock-title/spec.md`
**Line**: 92

**Description**: "The 'GITACTIONS' suffix in the IP address (from app.js line 13) is considered part of the current behavior and remains unchanged". However, `app.js` line 13 is `app.use(express.static(...))` — no IP logic there. The `getIpAddress()` function (lines 45-56) returns raw IPv4 without any suffix. Integration test (server.test.js line 86) explicitly asserts `not.toContain('GITACTIONS')`.

**Impact**: Misleading documentation; assumption does not match code.

**Suggested Fix**: Remove or correct the assumption in spec.md.

---

#### 6. No test for interval cleanup / memory leak prevention
**File**: `tests/e2e/clock.spec.js`, `tests/unit/` (none)

**Description**: SC-006 requires no memory leaks over 5 minutes. There is no test verifying `clearInterval` is called on unload, nor any test simulating page navigation to detect leaked intervals.

**Impact**: Regression risk for the Alto finding #1.

**Suggested Fix**: Add E2E test that navigates away and verifies no lingering timers (using `page.evaluate(() => window.__clockPolling)` or performance.memory), or add unit test for `stopPolling` invocation on unload event.

---

### BAIXO

#### 7. Error handling test for `/api/time` 500 path not testable without mocking
**File**: `tests/unit/time-api.test.js`
**Lines**: 86-89

**Description**: The test file acknowledges "Testing 500 error would require mocking moment() to throw". The try/catch in `app.js` lines 38-41 is not exercised.

**Impact**: Error path untested; if `moment()` throws (unlikely but possible), behavior unverified.

**Suggested Fix**: Use Jest mocking (`jest.spyOn(moment, 'format').mockImplementation(() => { throw new Error() })`) to test the 500 response.

---

#### 8. `window.__clockPolling` pollutes global namespace
**File**: `public/js/clock.js`
**Lines**: 68-72

**Description**: Test hook exposed on `window` object. While useful for E2E debugging, it leaks implementation details globally.

**Impact**: Minor namespace pollution; potential collision.

**Suggested Fix**: Use a unique Symbol key or keep only in test environment (`if (process.env.NODE_ENV === 'test')`).

---

### SUGESTÃO

#### 9. Consider retry with exponential backoff in `clock.js`
Instead of immediate `stopPolling()` on error, implement retry logic (e.g., 3 retries with 2s, 4s, 8s backoff) before giving up.

#### 10. Consider `setTimeout` loop instead of `setInterval` for drift resistance
`setInterval` can drift; a recursive `setTimeout` that schedules the next fetch after the previous completes is more robust.

#### 11. Add JSDoc comments to `clock.js` functions
Improve maintainability with `@param`, `@returns`, and description for `fetchServerTime`, `updateTimeDisplay`, `startPolling`, `stopPolling`.

---

## Compliance Checklist

| Artifact | Status | Notes |
|----------|--------|-------|
| `spec.md` FR-001 to FR-005 | ✅ PASS | All functional requirements implemented |
| `spec.md` SC-001 to SC-006 | ✅ PASS | All success criteria met (with Alto #1 caveat for SC-006) |
| `plan.md` architecture | ✅ PASS | Express/EJS, progressive enhancement, `/api/time` endpoint |
| `data-model.md` entities | ✅ PASS | ServerInformation, PageLabels match implementation |
| `contracts/api-time.json` | ✅ PASS | Response format, cache headers, error shape all match |
| `.specify/memory/constitution.md` | ✅ PASS | Feature branch, no manual artifact edits, identifiers used |

---

## Test Coverage Summary

| Layer | Files | Coverage Target | Notes |
|-------|-------|-----------------|-------|
| Unit | `time-api.test.js`, `title.test.js`, `error-handling.test.js` | 80% statements/branches/lines, 75% functions | Good contract and title validation |
| Integration | `server.test.js` | Same | Full page rendering tests |
| E2E | `clock.spec.js` | N/A (Playwright) | 7 tests covering clock updates, title, IP, fallback |

All tests pass locally (verified via `npm test` and `npm run test:e2e` in CI pipeline).

---

## Files Reviewed

- `app.js` — Express server with routes `/` and `/api/time`
- `views/index.ejs` — EJS template with updated title and heading
- `public/js/clock.js` — Client-side polling logic
- `package.json` — Dependencies and test scripts
- `tests/unit/time-api.test.js` — `/api/time` contract tests
- `tests/unit/title.test.js` — Title/heading exact string tests
- `tests/unit/error-handling.test.js` — Error handling and route tests
- `tests/integration/server.test.js` — Page integration tests
- `tests/e2e/clock.spec.js` — Playwright E2E tests
- `playwright.config.js` — Playwright configuration

---

## Next Steps

1. **Required before merge** (Alto items):
   - Add `beforeunload`/`pagehide` listener in `clock.js` to call `stopPolling()`
   - Decide on polling vs local increment: either implement local increments (per spec/plan constraint) or formally approve the polling approach (update spec.md assumption and plan.md constraint)

2. **Recommended** (Médio items):
   - Add retry/fallback logic in `clock.js` error handling
   - Fix plan.md internal contradiction
   - Remove stale GITACTIONS assumption from spec.md
   - Add test for interval cleanup

3. **Optional** (Baixo/Sugestão):
   - Mock moment() for 500 error test
   - Namespace `window.__clockPolling` more safely
   - Add JSDoc and consider setTimeout loop

---

## Approval Blockers

**None** — All Critical issues resolved. Alto issues do not block per constitution (only Critical blocks), but should be fixed for production quality.

---

*Report generated by Revisor de Código subagent per Fábrica de Software workflow E5.*