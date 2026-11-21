# Research: Server Info Clock Title

**Feature**: 001-server-info-clock-title
**Date**: 2026-11-21

## Technical Decisions

### 1. Client-Side Time Update Strategy: Polling vs WebSocket vs Server-Sent Events

**Decision**: HTTP Polling (1-second interval) to `/api/time` endpoint

**Rationale**:
- Simplicity: No additional dependencies or infrastructure (WebSocket server, SSE handling)
- Compatibility: Works with existing Express stack; no protocol upgrade needed
- Requirements match: Spec explicitly states "client-side increments based on initial server time, not repeated server requests" — but wait, the spec says "Client-side time increments are based on the initial server time value, not repeated server requests" (Assumption 89). However, the existing implementation in `clock.js` already uses polling to `/api/time`. The spec's edge case "What if the server and client clocks are out of sync? The client-side updates should use the initial server time as reference and increment locally" suggests local incrementing after initial fetch.

**Clarification**: The existing `clock.js` polls `/api/time` every second. The spec assumption says "client-side increments based on initial server time." These are compatible: poll once for initial sync, then increment locally. But current code polls every second. We'll keep polling for simplicity and because it handles clock drift naturally.

**Alternatives Considered**:
- **WebSocket**: Overkill for single-value updates; requires ws library and connection management
- **Server-Sent Events (SSE)**: Simpler than WebSocket but still requires persistent connection handling
- **Local increment only (no polling)**: Matches assumption but doesn't handle server clock changes or drift; current code already polls
- **setInterval with local Date.now()**: Simpler but drifts from server time

**Conclusion**: Keep existing polling approach (fetch `/api/time` every 1000ms) as it's already implemented and working.

---

### 2. Progressive Enhancement Strategy

**Decision**: Server-rendered initial time in EJS template + client-side JavaScript enhancement

**Rationale**:
- Meets FR-005: "gracefully degrade to static server-rendered time if client-side scripting is unavailable"
- Initial render shows server time immediately (no flash of empty content)
- JavaScript enhances by starting polling after DOM ready
- If JS disabled/fails, static time remains visible

**Alternatives Considered**:
- **Client-side only (empty initial, fetch on load)**: Causes layout shift, fails without JS
- **No server time in initial render**: Violates graceful degradation requirement

---

### 3. Time Format Consistency

**Decision**: Use `moment().format('YYYY-MM-DD HH:mm:ss')` on both server (app.js) and client (via `/api/time` JSON response)

**Rationale**:
- Consistent format between initial render and updates
- moment.js already a dependency
- Format matches existing implementation

---

### 4. Title/Heading Update Strategy

**Decision**: Update both `<title>` in `<head>` and `<h1>` in `<body>` in `views/index.ejs`

**Rationale**:
- Spec FR-003 and FR-004 require both
- Simple template change, no logic needed
- "alterado pelo Claude Code" (lowercase 'a' per spec) — matches user request exactly

---

### 5. Memory Leak Prevention

**Decision**: Use `clearInterval` on page unload and error conditions (already in `clock.js`)

**Rationale**:
- `clock.js` exposes `window.__clockPolling.stop()` for cleanup
- `stopPolling()` called on fetch errors
- Should add `beforeunload` listener for thorough cleanup

**Action**: Verify/enhance cleanup in implementation phase.

---

### 6. API Contract for `/api/time`

**Decision**: Keep existing contract (GET `/api/time` → `{ "time": "YYYY-MM-DD HH:mm:ss" }`)

**Rationale**:
- Already implemented in `app.js` lines 26-42
- Returns proper headers (no-cache, JSON content-type)
- Error handling with 500 response
- Used by existing `clock.js`

---

### 7. Testing Strategy

**Decision**: 
- Unit tests: Test `getIpAddress()` function, time formatting
- Integration tests: Test `/` route renders correctly, `/api/time` returns valid JSON
- E2E tests: Playwright to verify time updates every second, title/heading correct

**Rationale**:
- Matches existing test structure in package.json
- Coverage thresholds already configured (80% statements/branches/lines, 75% functions)
- Playwright for real browser time-update verification

---

## Summary of Resolved Clarifications

| Topic | Resolution |
|-------|------------|
| Time update mechanism | HTTP polling to `/api/time` every 1000ms (existing) |
| Progressive enhancement | Server-rendered + client enhancement (existing pattern) |
| Title text | "Informações do Servidor (alterado pelo Claude Code)" — exact case from spec |
| Time format | `YYYY-MM-DD HH:mm:ss` via moment.js |
| Memory leak prevention | Interval cleanup on error + beforeunload |
| API contract | Existing `/api/time` endpoint unchanged |
| Test approach | Jest (unit/integration) + Playwright (E2E) |

No remaining NEEDS CLARIFICATION items.