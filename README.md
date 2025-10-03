# Badovik Mini Woo Store v1.2.2 🛒

Современное мини-приложение для интернет-магазина с интеграцией Telegram Web App и WooCommerce.

## 🚀 Особенности

- **Telegram Web App** интеграция для удобных покупок через Telegram
- **WooCommerce REST API** интеграция для управления товарами и заказами
- **Адаптивный дизайн** для мобильных устройств
- **Готовые корзины** с предустановленными наборами товаров
- **Система оплаты** с обработкой заказов
- **Telegram уведомления** о заказах

## 🛠 Технологический стек

### Frontend
- **Next.js 15** (App Router) — React фреймворк
- **TypeScript** — статическая типизация
- **TailwindCSS** — утилитарный CSS-фреймворк
- **Radix UI** — компонентная библиотека для доступности
- **Zustand** — легковесное управление состоянием
- **Lucide React** — иконки

### Backend & Интеграции
- **Telegraf.js** — SDK для Telegram Bot API
- **WooCommerce REST API** — интеграция с интернет-магазином
- **Prisma ORM** — работа с базой данных
- **SQLite** — база данных для разработки

### Deployment & DevOps
- **PM2** — процесс-менеджер
- **Nginx** — веб-сервер
- **Bash scripts** — автоматизация и мониторинг

## 📁 Структура проекта

```
/opt/mini-woo/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── cart/              # Страница корзины
│   ├── checkout/          # Оформление заказа
│   ├── product/[id]/      # Детальная страница товара
│   └── order-success/     # Подтверждение заказа
├── components/            # React компоненты
├── lib/                   # Утилиты и библиотеки
├── prisma/               # База данных и схема
├── public/               # Статические файлы
└── versions/             # История версий
```

## ⚙️ Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/YOUR_USERNAME/badovik-v1.2.2.git
cd badovik-v1.2.2
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
```bash
cp .env.example .env
```

Заполните файл `.env` своими значениями:

- `NEXT_PUBLIC_BASE_PATH` — URL вашего развертывания
- `TELEGRAM_BOT_TOKEN` — токен Telegram бота от @BotFather
- `TELEGRAM_BOT_SECRET` — секретный ключ для webhook
- `WOOCOMMERCE_URL` — URL вашего WooCommerce сайта
- `WOOCOMMERCE_CONSUMER_KEY` — ключ для WooCommerce REST API
- `WOOCOMMERCE_CONSUMER_SECRET` — секрет для WooCommerce REST API
- `DATABASE_URL` — путь к базе данных

### 4. Настройка базы данных
```bash
npx prisma generate
npx prisma db push
```

### 5. Запуск в режиме разработки
```bash
npm run dev
```

### 6. Сборка для продакшена
```bash
npm run build
npm start
```

## 🔧 Настройка Telegram Webhook

После развертывания приложения настройте webhook для Telegram бота:

```bash
curl -X POST https://your-domain.com/api/telegram-hook/init?secret_hash=YOUR_TELEGRAM_BOT_SECRET
```

## 🎨 Готовые корзины

Приложение поддерживает готовые корзины — предустановленные наборы товаров, которые пользователи могут быстро добавить в корзину.

## 📱 Использование

1. Откройте Telegram бота
2. Запустите команду `/start`
3. Откроется мини-приложение с каталогом товаров
4. Добавьте товары в корзину
5. Перейдите к оформлению заказа
6. Получите уведомление о статусе заказа

## 🤝 Поддержка

Для вопросов и предложений создавайте Issues в этом репозитории.

## 📄 Лицензия

Этот проект распространяется под лицензией MIT.

---

**Badovik Mini Woo Store** — современное решение для электронной коммерции в Telegram 🚀
