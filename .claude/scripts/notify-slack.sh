#!/usr/bin/env bash
# uso: notify-slack.sh <agente> <status> "<resumo curto sem aspas>"
[ -z "$SLACK_WEBHOOK_URL" ] && { echo "SLACK_WEBHOOK_URL ausente"; exit 0; }
payload=$(printf '{"text":"*%s* | %s | %s"}' "$1" "$2" "$3")
curl -s -X POST -H 'Content-type: application/json' --data "$payload" "$SLACK_WEBHOOK_URL" >/dev/null