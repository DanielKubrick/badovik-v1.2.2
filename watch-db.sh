#!/bin/bash
cd /opt/mini-woo

echo "🔍 НАЧИНАЕМ МОНИТОРИНГ БАЗЫ ДАННЫХ..."
echo "Проверяем изменения каждые 3 секунды"
echo "Нажмите Ctrl+C для остановки"
echo ""

while true; do
  clear
  ./monitor-db.sh
  echo ""
  echo "⏱️  Следующее обновление через 3 секунды..."
  sleep 3
done
