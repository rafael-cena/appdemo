# Fábrica de Software Constitution

## Core Principles

### I. Constitution as Single Source of Truth
The project constitution at `.specify/memory/constitution.md` governs all stages of the Spec Kit workflow. In any divergence between this constitution and a `speckit-*` skill, the skill prevails. Requirements and scope approved at Checkpoint 1 cannot change without explicit human authorization.

### II. No Manual Edits to Spec Kit Artifacts
Files managed by Spec Kit skills — `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `tasks.md`, `checklists/`, and `.specify/` — must never be edited by hand. Legitimate changes occur only through the corresponding Spec Kit skill for each stage.

### III. Developer-Only Implementation
Product code implementation is exclusively the responsibility of the **Desenvolvedor** subagent. The orchestrator manages workflow and `state.json` but does not write product code. Other subagents produce analysis, plans, tasks, reviews, and QA artifacts — never implementation code.

### IV. Orchestrator-Managed Git Operations
Only the orchestrator performs commits on the feature branch. Pushes occur only with human confirmation at the permission prompt. Merges into the base branch are always performed by the human. Subagents never commit, push, or merge.

### V. Feature Branch Discipline
Before any action, the current feature branch must be confirmed: `git switch <feature-branch>` and `git branch --show-current`. Work never occurs on the base branch. The sole exception: the orchestrator creates the feature branch (`git switch -c <BRANCH_NAME>`) immediately after `speckit-specify` returns.

### VI. Structured Identifiers
All work items use standardized identifiers for traceability:
- `FR-###` — Functional Requirements
- `SC-###` — Success Criteria
- `US#` — User Stories (US1, US2, …)
- `T###` — Implementation Tasks (T001, T002, …)
- `[P]` — Parallel execution marker
- `[USn]` — Traceability link to user story

### VII. Two Human Checkpoints
The E0–E8 workflow mandates two explicit human decision points:
- **Checkpoint 1 (end of E1)**: Human approves the feature specification (`spec.md` and `speckit-clarify` answers) — decides *what* will be built.
- **Checkpoint 2 (end of E7)**: Human approves the PR merge — decides *what* enters the base branch.

### VIII. Autonomous Flow Between Checkpoints
Between Checkpoint 1 and Checkpoint 2 the workflow runs autonomously: planning (E2), task generation (E3), analysis (E3.5), implementation (E4), code review (E5), QA (E6), commits, push, PR creation, and CI (E7). No human intervention is required or expected during these stages.

## Workflow Structure

### E0–E8 Stage Definitions
| Stage | Name | Responsible Agent | Output |
|-------|------|-------------------|--------|
| E0 | Initialize | Orchestrator | Feature branch, `state.json` |
| E1 | Specify | Analista de Requisitos | `spec.md` (Checkpoint 1) |
| E2 | Plan | Arquiteto | `plan.md`, `research.md`, `data-model.md`, `contracts/` |
| E3 | Tasks | Criador de Tarefas | `tasks.md` |
| E3.5 | Analysis | Analista de Requisitos | `analysis.md` |
| E4 | Implement | Desenvolvedor | Product code, tests |
| E5 | Review | Revisor de Código | `review.md` |
| E6 | QA | Analista de QA | `qa-report.md` |
| E7 | Deliver | Orchestrator | Commits, push, PR (Checkpoint 2) |
| E8 | Close | Human | Merge, cleanup |

### Artifact Location Rules
- Intermediate artifacts (assumptions, questions, summaries, reports) go in `specs/<feature>/notes/` with kebab-case names prefixed by stage (e.g., `e1-clarifications.md`, `e5-review-findings.md`).
- Return blocks to the orchestrator carry only decisions and next-stage triggers — no full documents.

## Governance

### Amendment Procedure
1. Propose changes by editing `.specify/memory/constitution.md` via the `speckit-constitution` skill.
2. Version bump follows semantic versioning (see below).
3. Sync Impact Report is generated and reviewed.
4. Human ratifies the amendment; `RATIFICATION_DATE` remains the original adoption date, `LAST_AMENDED_DATE` updates to today.

### Versioning Policy
- **MAJOR**: Backward-incompatible governance changes — principle removals, redefinitions, or checkpoint restructuring.
- **MINOR**: New principle/section added or materially expanded guidance (e.g., adding a new subagent role, new artifact type).
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements.

### Compliance Review
- Every PR review (E5) must verify compliance with this constitution.
- Complexity must be justified; YAGNI applies — start simple.
- The `CLAUDE.md` file serves as runtime development guidance and must stay consistent with this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-11-20 | **Last Amended**: 2026-11-20