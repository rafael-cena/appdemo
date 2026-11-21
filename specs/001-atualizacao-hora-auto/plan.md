# Implementation Plan: Atualização Automática da Hora do Servidor

**Branch**: `001-atualizacao-hora-auto` | **Date**: 2026-11-20 | **Spec**: specs/001-atualizacao-hora-auto/spec.md

**Input**: Feature specification from `specs/001-atualizacao-hora-auto/spec.md`

## Summary

A feature requer duas alterações na página de informações do servidor (rota `/`): (1) implementar atualização automática da hora do servidor a cada segundo via JavaScript no cliente, consumindo um endpoint que retorne a hora atual do servidor; (2) alterar o título da página (elemento `<title>` e `<h1>`) de "Informações do Servidor (ALTERADO)" para "Informações do Servidor (alterado pelo Claude Code)". A arquitetura atual (Node.js/Express + EJS) será mantida com adição de endpoint API `/api/time` e script client-side para polling a cada 1 segundo.

## Technical Context

**Language/Version**: Node.js 18+ / Express 4.18+

**Primary Dependencies**: express, ejs, moment (já instalados)

**Storage**: N/A (sem banco de dados; estado em memória)

**Testing**: Jest + Supertest (unit/integration); Playwright (E2E) — a configurar

**Target Platform**: Linux/Windows/macOS (servidor Node.js), navegadores modernos (ES6+)

**Project Type**: Web application (server-rendered com client-side enhancement)

**Performance Goals**: 
- Atualização de hora a cada 1s (±100ms) — SC-001
- Carga inicial < 3s em localhost — SC-005
- Vazamento de memória < 10MB em 5 min — SC-006

**Constraints**: 
- Fallback gracioso se JS falhar (hora inicial server-side) — FR-007
- Hora sempre do servidor (não cliente) — FR-003
- Frequência fixa de 1s, não configurável — Assumption

**Scale/Scope**: Single page, single endpoint, ~50 linhas de código novo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Constitution as Single Source of Truth | ✅ PASS | Seguindo spec.md e constitution.md |
| II. No Manual Edits to Spec Kit Artifacts | ✅ PASS | Gerado via skill speckit-plan |
| III. Developer-Only Implementation | ✅ PASS | Plano apenas; implementação no E4 |
| IV. Orchestrator-Managed Git Operations | ✅ PASS | Não há commits neste estágio |
| V. Feature Branch Discipline | ✅ PASS | Branch confirmada: `001-atualizacao-hora-auto` |
| VI. Structured Identifiers | ✅ PASS | FR/SC/US/T usados consistentemente |
| VII. Two Human Checkpoints | ✅ PASS | Checkpoint 1 (spec aprovada) concluído |
| VIII. Autonomous Flow Between Checkpoints | ✅ PASS | Planejamento autônomo em andamento |

**All gates pass. No violations requiring Complexity Tracking.**

## Project Structure

### Documentation (this feature)

```text
specs/001-atualizacao-hora-auto/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contract)
└── tasks.md             # Phase 2 output (NOT created by speckit-plan)
```

### Source Code (repository root)

```text
# Option 1: Single project (current structure - DEFAULT)
app.js                    # Express server (modify: add /api/time endpoint)
views/
└── index.ejs             # Template (modify: title, h1, add client JS)
public/                   # NEW: static assets directory
└── js/
    └── clock.js          # NEW: client-side auto-update logic
package.json              # Modify: add test scripts, devDependencies
```

**Structure Decision**: Mantém estrutura atual (single project). Adiciona pasta `public/js/` para asset estático do client-side clock. Não há backend/frontend separados.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |