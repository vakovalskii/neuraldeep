# CLAUDE.md — правила для AI-агентов в этом проекте

## Документация

Перед началом работы ознакомься с документацией:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — общая схема, компоненты, потоки данных
- [docs/DATABASE.md](docs/DATABASE.md) — модели, поля, миграции
- [docs/API.md](docs/API.md) — все эндпоинты с параметрами
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — сервер, Docker, CI/CD, env переменные
- [docs/SECURITY.md](docs/SECURITY.md) — аутентификация, аудит, rate limiting
- [README.md](README.md) — быстрый старт, локальная разработка, корпоративное использование

## Рабочий процесс (обязательно)

**НИКОГДА не коммить напрямую в main.** Полный цикл:

1. **Ветка** — создай от актуального main: `git checkout main && git pull && git checkout -b feat/short-description`
2. **Анализ** — зайди на сервер по SSH, посмотри БД, проверь текущее состояние данных
3. **Правки** — вноси изменения в ветке, коммить
4. **Пуш** — `git push -u origin feat/short-description`
5. **PR** — `gh pr create`, дождись CI (тесты + билд)
6. **Мерж** — только после прохождения CI
7. **Деплой** — CI/CD автоматически деплоит main на сервер
8. **Проверка** — после деплоя проверь сайт через Playwright MCP (browser_navigate → browser_snapshot)

### SSH и БД

Сервер: `ssh ubuntu@<DEPLOY_HOST>` (IP в deploy/server.md).
БД: PostgreSQL в Docker.

```bash
# Посмотреть контейнеры
ssh ubuntu@<HOST> "docker ps"

# Запрос к БД
ssh ubuntu@<HOST> 'docker exec -i $(docker ps -q -f name=postgres) psql -U skills -d skillsdb -c "SELECT ..."'
```

**НЕ собирать и НЕ запускать тесты локально** — зависимости (Prisma, vitest и т.д.) устанавливаются только на CI. Локально можно только редактировать файлы и коммитить.

### Формат веток

- `feat/` — новая функциональность
- `fix/` — баг-фикс
- `refactor/` — рефакторинг без изменения поведения
- `docs/` — документация

## Коммиты

Формат: краткое описание на английском, тело — что и зачем.

```
Add category filter to leaderboard

- Dynamic chips from skill categories
- Filter persists with sort mode
```

## Перед коммитом

1. Убедись что CI прогонит `cd web && npm run test` — все тесты должны проходить
2. `npx prisma generate` — если менялась schema.prisma (на CI)
3. Не коммить `.env`, секреты, токены, API ключи

## Стек

- **Web**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **ORM**: Prisma + PostgreSQL 16
- **Auth**: NextAuth 5 (GitHub OAuth)
- **Tests**: Vitest (node environment, fork pool)
- **CLI**: Node.js ES Modules (npm: skillsbd)
- **Deploy**: Docker Compose (Traefik + App + PostgreSQL)

## Структура

```
web/src/app/          — страницы и API routes
web/src/components/   — React компоненты
web/src/data/         — data layer (Prisma queries)
web/src/lib/          — auth, db, admin helpers
web/prisma/           — schema + migrations
web/__tests__/        — vitest тесты
cli/src/              — CLI (npx skillsbd)
```

## Ключевые файлы

- `web/src/lib/admin.ts` — проверка админа (ID из env, НЕ хардкодить)
- `web/src/lib/db.ts` — Prisma singleton
- `web/src/lib/auth.ts` — NextAuth config
- `web/src/data/skills.ts` — queries + formatInstalls + toSlug
- `docker-compose.yml` — продакшн стек

## Правила

- Все навыки в каталоге фильтруются по `status: "approved"`
- Новые навыки через `/submit` идут в `status: "pending"`
- Admin ID берётся из `ADMIN_USER_IDS` env (через запятую)
- Rate limit на `/api/skills/install`: 10 сек на навык на IP
- Аудит запускается ежечасно через cron + при добавлении навыка
- GitHub API запросы используют `GITHUB_TOKEN` для лимита 5000/час
- URL навыков: `/skill/{slug}` где slug = `toSlug(name)` (lowercase, пробелы → дефисы)
- Старые URL (cuid) автоматически редиректят на slug

## Не делать

- Не хардкодить секреты, admin ID, токены
- Не пушить в main напрямую
- Не добавлять `.env` в git
- Не ставить `"use client"` на серверные компоненты без необходимости
- Не использовать `dangerouslySetInnerHTML` — весь markdown через react-markdown
