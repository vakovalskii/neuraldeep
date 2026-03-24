# skillsБД

Российский каталог навыков для AI-агентов. [skillsbd.ru](https://skillsbd.ru)

Навыки для работы с Яндекс, Битрикс, 1С и другими российскими сервисами. Устанавливайте одной командой, делитесь с RU-комьюнити.

## Быстрый старт

```bash
# Поиск навыков
npx skillsbd search яндекс

# Установка навыка
npx skillsbd add artwist-polyakov/polyakov-claude-skills/yandex-wordstat

# Список установленных
npx skillsbd list
```

## Локальная разработка

### Требования

- Node.js 20+
- Docker + Docker Compose
- PostgreSQL (через Docker)

### Запуск

```bash
# 1. Клонируйте репо
git clone https://github.com/vakovalskii/skillsbd.git
cd skillsbd

# 2. Создайте .env из примера
cp .env.production .env
# Заполните:
#   POSTGRES_PASSWORD=любой_пароль
#   NEXTAUTH_SECRET=openssl rand -base64 32
#   GITHUB_CLIENT_ID=из_github_oauth_app
#   GITHUB_CLIENT_SECRET=из_github_oauth_app

# 3. Поднимите PostgreSQL
docker compose up postgres -d

# 4. Установите зависимости
cd web
npm install

# 5. Примените миграции
DATABASE_URL="postgresql://skills:ваш_пароль@localhost:5432/skillsdb" npx prisma migrate deploy

# 6. Запустите dev-сервер
DATABASE_URL="postgresql://skills:ваш_пароль@localhost:5432/skillsdb" npm run dev
```

Сайт доступен на http://localhost:3000

### Тесты

```bash
cd web
npm run test        # один запуск
npm run test:watch  # watch-режим
```

38 тестов: API routes, data layer, audit patterns, admin guards.

## Структура

```
skillsbd/
├── web/                    # Next.js 16 приложение
│   ├── src/
│   │   ├── app/            # Страницы и API routes
│   │   ├── components/     # React компоненты
│   │   ├── data/           # Data layer (Prisma queries)
│   │   └── lib/            # Auth, DB, admin helpers
│   ├── prisma/             # Схема и миграции
│   ├── __tests__/          # Vitest тесты
│   └── public/             # Статика, favicon, SKILL.md
├── cli/                    # npm пакет skillsbd (npx skillsbd)
├── deploy/                 # Инфо о сервере
├── docker-compose.yml      # Traefik + App + PostgreSQL
└── .github/workflows/      # CI/CD
```

## Стек

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **БД**: PostgreSQL 16
- **Инфра**: Docker, Traefik v3, Let's Encrypt
- **CI/CD**: GitHub Actions → rsync → docker compose
- **Тесты**: Vitest (38 тестов)
- **CLI**: Node.js ES Modules (npm: skillsbd)

## API

Открытый API без авторизации для GET-запросов.

```bash
# Все навыки
curl https://skillsbd.ru/api/skills

# Поиск
curl https://skillsbd.ru/api/skills?q=яндекс

# Тренды
curl https://skillsbd.ru/api/skills?sort=trending
```

[Полная документация API →](https://skillsbd.ru/docs/api)

## Контрибьюция

1. Форкните репо
2. Создайте ветку (`git checkout -b feature/my-feature`)
3. Коммитните изменения
4. Откройте PR

### Как добавить навык в каталог

1. Создайте GitHub-репозиторий с файлом `SKILL.md`
2. Зайдите на [skillsbd.ru/submit](https://skillsbd.ru/submit)
3. Заполните форму — навык попадёт на модерацию

## Лицензия

MIT

## Автор

[Валерий Ковальский](https://t.me/neuraldeep)
