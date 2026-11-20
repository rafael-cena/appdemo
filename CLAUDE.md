# Fábrica de Software — Contexto Global (Claude Code)

Projeto: Fábrica de Software baseada no fluxo GitHub Spec Kit com orquestrador principal e seis subagentes especializados.

## Constituição e fontes de verdade

A constituição do projeto está em `.specify/memory/constitution.md` e governa todas as etapas. Em divergência entre este arquivo e uma skill `speckit-*`, prevalece a skill. Requisitos e escopo aprovados no Checkpoint 1 não mudam sem autorização explícita do humano.

## Regras globais (aplicáveis a todos os agentes)

1. **Nunca criar arquivos de controle na raiz do projeto.** Premissas, dúvidas, resumos e relatórios intermediários vão em `specs/<feature>/notes/` (nome kebab-case prefixado pela etapa) ou no bloco de retorno ao orquestrador.
2. **Não editar à mão** `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `tasks.md`, `checklists/` nem `.specify/`. Alterações legítimas acontecem apenas pela skill do Spec Kit da etapa.
3. **Não implementar código fora do subagente Desenvolvedor.** O orquestrador não escreve código de produto; só gerencia o fluxo e `state.json`.
4. **Subagentes não fazem commits, pushes nem merges** O orquestrador faz os commits na branch da feature. O push só acontece com confirmação do humano no prompt de permissão. O merge é sempre do humano.
5. **Sempre confirmar a branch da feature** antes de agir: `git switch <branch-da-feature>` e `git branch --show-current`. NuNunca trabalhar na branch base nem criar branches novas. Única exceção: o orquestrador cria a branch da feature (`git switch -c <BRANCH_NAME>`) logo após o `speckit-specify` retornar.
6. **Identificadores:** `FR-001` (requisitos funcionais), `SC-001` (critérios de sucesso), `US1`, `US2`… (histórias), `T001` (tarefas), `[P]` (paralelismo), `[USn]` (rastreabilidade).

## Fluxo E0–E8 com dois checkpoints humanos

| Checkpoint | Quando | O que o humano decide |
|---|---|---|
| Checkpoint 1 — aprovar a spec | Fim de E1 | O que vai ser construído (aprovação da `spec.md` e respostas do `speckit-clarify`) |
| Checkpoint 2 — aprovar o merge do PR | Fim de E7 | O que entra na branch base (apenas o humano faz o merge) |

Entre os checkpoints o fluxo é autônomo: plano (E2), tarefas (E3), análise (E3.5), implementação (E4), revisão (E5), QA (E6), commits, push, abertura do PR e CI (E7).

## Como executar

Inicie o fluxo com `claude --agent orquestrador`. O orquestrador precisa ser o agente principal da sessão, porque subagentes não acionam outros subagentes.