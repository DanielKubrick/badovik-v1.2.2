#!/bin/bash
cd /opt/mini-woo

echo "=== МОНИТОРИНГ БАЗЫ ДАННЫХ MINI WOO ==="
echo "Время: $(date)"
echo ""

# Проверяем размер БД
echo "📊 РАЗМЕР БАЗЫ ДАННЫХ:"
ls -lh dev.db | awk '{print $5" ("$9")"}'
echo ""

# Статистика по таблицам
echo "📈 СТАТИСТИКА ПО ТАБЛИЦАМ:"
sqlite3 dev.db "
SELECT 
  '👤 ПОЛЬЗОВАТЕЛИ: ' || COUNT(*) FROM users
UNION ALL SELECT 
  '🛒 КОРЗИНЫ: ' || COUNT(*) FROM carts
UNION ALL SELECT 
  '📦 ТОВАРЫ В КОРЗИНАХ: ' || COUNT(*) FROM cart_items
UNION ALL SELECT 
  '📋 ЗАКАЗЫ: ' || COUNT(*) FROM orders
UNION ALL SELECT 
  '🛍️ ТОВАРЫ В ЗАКАЗАХ: ' || COUNT(*) FROM order_items
UNION ALL SELECT 
  '❤️ ИЗБРАННЫЕ ТОВАРЫ: ' || COUNT(*) FROM favorite_items;
"
echo ""

# Если есть пользователи, показываем их
USER_COUNT=$(sqlite3 dev.db "SELECT COUNT(*) FROM users;")
if [ "$USER_COUNT" -gt 0 ]; then
  echo "📱 ПОСЛЕДНИЕ ПОЛЬЗОВАТЕЛИ:"
  sqlite3 dev.db -header -column "
  SELECT 
    substr(firstName || ' ' || COALESCE(lastName, ''), 1, 20) as 'Имя',
    substr(username, 1, 15) as 'Username', 
    totalOrders as 'Заказов',
    CAST(totalSpent as INTEGER) as 'Потрачено₽',
    datetime(createdAt, 'localtime') as 'Регистрация'
  FROM users 
  ORDER BY createdAt DESC 
  LIMIT 5;
  "
  echo ""
fi

# Если есть заказы, показываем их
ORDER_COUNT=$(sqlite3 dev.db "SELECT COUNT(*) FROM orders;")
if [ "$ORDER_COUNT" -gt 0 ]; then
  echo "📋 ПОСЛЕДНИЕ ЗАКАЗЫ:"
  sqlite3 dev.db -header -column "
  SELECT 
    orderNumber as 'Номер заказа',
    billingFirstName || ' ' || billingLastName as 'Покупатель',
    status as 'Статус',
    CAST(total as INTEGER) as 'Сумма₽',
    datetime(createdAt, 'localtime') as 'Дата'
  FROM orders 
  ORDER BY createdAt DESC 
  LIMIT 5;
  "
  echo ""
fi

echo "===================================="
