# Data Model: Server Info Clock Title

**Feature**: 001-server-info-clock-title
**Date**: 2026-11-21

## Entities

### ServerInformation

Represents the data displayed on the server information page.

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| ip | string | Yes | Server IPv4 address (non-internal) | Non-empty; valid IPv4 format; "Endereço IP não encontrado" if none |
| horaAtual | string | Yes | Current server time at render moment | Format: `YYYY-MM-DD HH:mm:ss` (moment.js) |

**Relationships**: None (single entity, no persistence)

**State Transitions**: 
- Initial render: Server provides both fields
- Client-side: `horaAtual` updates every second via polling; `ip` remains static

---

### PageLabels

Represents the textual identifiers for the page.

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| pageTitle | string | Yes | Browser tab title | Exact: "App Demo - Informações do Servidor (alterado pelo Claude Code)" |
| heading | string | Yes | Main page heading (h1) | Exact: "Informações do Servidor (alterado pelo Claude Code)" |

**Relationships**: None (static labels)

**State Transitions**: None (static values, no runtime changes)

---

## Validation Rules Summary

1. **ServerInformation.ip**: Must be a valid IPv4 address from non-internal network interface, or fallback string
2. **ServerInformation.horaAtual**: Must match regex `^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$`
3. **PageLabels.pageTitle**: Must equal exact string from FR-003
4. **PageLabels.heading**: Must equal exact string from FR-004

---

## API Response Model

### GET /api/time

**Response** (200 OK):
```json
{
  "time": "2026-11-21 14:30:45"
}
```

**Error Response** (500):
```json
{
  "error": "Falha ao obter hora do servidor"
}
```

**Field Validation**:
- `time`: string, required, format `YYYY-MM-DD HH:mm:ss`