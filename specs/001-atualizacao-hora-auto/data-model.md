# Data Model: Atualização Automática da Hora do Servidor

**Feature**: 001-atualizacao-hora-auto
**Date**: 2026-11-20

## Visão Geral

Esta feature **não introduz entidades de dados persistidas** nem modelo de dados estruturado. A hora do servidor é obtida diretamente do sistema operacional via `moment()` a cada requisição ao endpoint `/api/time`. Não há estado armazenado, banco de dados, cache ou persistência envolvidos.

## Entidades Conceituais (Não Persistidas)

### ServerTime (Response do endpoint `/api/time`)

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `time` | string | Hora atual do servidor no formato ISO-like | `"2026-11-20 14:30:45"` |
| `source` | string | Origem da hora (sempre "server") | `"server"` |

**Validação**: 
- `time` deve seguir regex `^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$`
- `source` deve ser exatamente `"server"`

### ServerInfo (Dados da página principal)

| Campo | Tipo | Descrição | Fonte |
|-------|------|-----------|-------|
| `ip` | string | Endereço IPv4 não-interno do servidor | `os.networkInterfaces()` |
| `horaAtual` | string | Hora no momento do render server-side | `moment().format(...)` |

**Nota**: `ServerInfo` existe apenas durante o render server-side da página inicial. Não é uma entidade persistida.

## Relacionamentos

Não há relacionamentos entre entidades, pois não há persistência.

## Regras de Negócio

1. **Hora sempre do servidor**: Toda exibição de hora deve originar do servidor (FR-003)
2. **Formato fixo**: `YYYY-MM-DD HH:mm:ss` (24h, zero-padded)
3. **Fallback**: Se JS falhar, `horaAtual` do server-side render é exibida (FR-007)

## Migração / Compatibilidade

- Nenhuma migração necessária (sem banco de dados)
- Compatível com versões anteriores: página continua funcionando sem JS
- Endpoint `/api/time` é aditivo (não quebra rotas existentes)