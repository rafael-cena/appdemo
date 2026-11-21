# Quickstart: Server Info Clock Title Validation

**Feature**: 001-server-info-clock-title
**Date**: 2026-11-21

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Port 3000 available (or set `PORT` environment variable)

## Setup

```bash
# From project root
cd D:\UNOESTE\8° TERMO\TTC III\projetofinal\appdemo
npm install
```

## Run Application

```bash
# Start server
npm start
# Server runs at http://localhost:3000
```

## Validation Scenarios

### Scenario 1: Page Loads with Correct Title and Heading (SC-003, SC-004, SC-005)

**Steps**:
1. Open browser to `http://localhost:3000`
2. Observe browser tab title
3. Observe main heading on page

**Expected**:
- Browser tab shows: "App Demo - Informações do Servidor (alterado pelo Claude Code)"
- Page heading (h1) shows: "Informações do Servidor (alterado pelo Claude Code)"
- Page loads within 2 seconds
- Server IP and initial time displayed

### Scenario 2: Time Updates Every Second (SC-001, SC-002)

**Steps**:
1. Load page at `http://localhost:3000`
2. Note the initial time displayed
3. Wait 3-5 seconds
4. Observe time display

**Expected**:
- Time updates every second (±100ms tolerance)
- IP address remains unchanged
- No page reload occurs

### Scenario 3: Graceful Degradation (FR-005, Edge Case)

**Steps**:
1. Disable JavaScript in browser (DevTools → Settings → Disable JavaScript)
2. Reload `http://localhost:3000`
3. Observe time display

**Expected**:
- Initial server-rendered time displayed
- Time does not update (static)
- IP address displayed
- Title and heading correct

### Scenario 4: API Endpoint Contract (contracts/api-time.json)

**Steps**:
```bash
# Test successful response
curl -i http://localhost:3000/api/time

# Test response format
curl -s http://localhost:3000/api/time | jq .
```

**Expected**:
- HTTP 200
- Content-Type: application/json; charset=utf-8
- Cache-Control: no-cache, no-store, must-revalidate
- Body: `{"time": "YYYY-MM-DD HH:mm:ss"}`

### Scenario 5: Memory/CPU Stability (SC-006)

**Steps**:
1. Open page at `http://localhost:3000`
2. Leave open for 5 minutes
3. Monitor browser DevTools Memory/Performance tabs

**Expected**:
- No memory growth from polling interval
- CPU usage minimal (< 1% for clock)
- No console errors

## Automated Test Commands

```bash
# Run all tests with coverage
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests (requires running server)
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Expected Test Coverage

Per package.json thresholds:
- Statements: 80%
- Branches: 80%
- Functions: 75%
- Lines: 80%

## Related Artifacts

- **Spec**: `specs/001-server-info-clock-title/spec.md`
- **Plan**: `specs/001-server-info-clock-title/plan.md`
- **Data Model**: `specs/001-server-info-clock-title/data-model.md`
- **API Contract**: `specs/001-server-info-clock-title/contracts/api-time.json`
- **Research**: `specs/001-server-info-clock-title/research.md`