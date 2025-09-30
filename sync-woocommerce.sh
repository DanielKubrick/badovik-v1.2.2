#!/bin/bash

# Скрипт для синхронизации данных с WooCommerce
LOG_FILE="/opt/mini-woo/sync.log"
API_URL="http://localhost:3001/api/sync"

echo "$(date): Запуск синхронизации с WooCommerce..." >> "$LOG_FILE"

# Вызываем API синхронизации
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$API_URL")
http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')

if [ "$http_code" -eq 200 ]; then
    echo "$(date): ✅ Синхронизация успешна" >> "$LOG_FILE"
    echo "$body" | jq '.' >> "$LOG_FILE" 2>/dev/null || echo "$body" >> "$LOG_FILE"
else
    echo "$(date): ❌ Ошибка синхронизации (HTTP $http_code)" >> "$LOG_FILE"
    echo "$body" >> "$LOG_FILE"
fi

echo "$(date): Синхронизация завершена" >> "$LOG_FILE"
echo "----------------------------------------" >> "$LOG_FILE"
