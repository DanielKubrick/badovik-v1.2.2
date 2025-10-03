#!/bin/bash

echo "🚀 Deploying Badovik Mini Woo Store v1.2.2 to GitHub"
echo ""
echo "⚠️  ВАЖНО: Замените YOUR_USERNAME на ваш GitHub username в команде ниже!"
echo ""
read -p "Введите ваш GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ Ошибка: GitHub username не может быть пустым"
    exit 1
fi

echo "🔗 Добавляем remote origin..."
git remote add origin https://github.com/$github_username/badovik-v1.2.2.git

echo "📤 Отправляем код на GitHub..."
git branch -M main
git push -u origin main

echo "🏷️  Создаем тег версии..."
git tag -a v1.2.2 -m "Badovik Mini Woo Store v1.2.2"
git push origin v1.2.2

echo ""
echo "✅ Готово! Репозиторий доступен по адресу:"
echo "   https://github.com/$github_username/badovik-v1.2.2"
echo ""
echo "📊 Статистика проекта:"
git log --oneline | head -5
