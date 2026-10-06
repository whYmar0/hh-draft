# UniTalent (CampusCareer)

> MVP веб-платформы рекрутинга для студентов, выпускников и работодателей с фокусом на академический бэкграунд, исследовательские достижения и ранний старт карьеры.

## Документация проекта

Вся документация по архитектуре, модели данных, правилам разработки и ADR расположена в каталоге [`docs/`](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/):

* 📘 [**docs/README.md**](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/README.md) — Описание продукта, архитектура и пошаговые инструкции по локальному развертыванию (`docker-compose`, миграции, переменные окружения).
* 🗺️ [**docs/context.md**](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/context.md) — Бизнес-контекст, персоны пользователей, карты сценариев (User Journeys) и схема сущностей данных (ERD).
* 🤖 [**docs/agents.md**](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/agents.md) — Руководство и правила разработки для автономных ИИ-агентов (соглашения об именовании, правила рефакторинга, TDD и работа с БД).
* 🏛️ [**docs/adr/**](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/adr/) — Архитектурные решения (Architecture Decision Records):
  * [ADR-001: Выбор технологического стека и СУБД](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/adr/ADR-001-tech-stack.md)
  * [ADR-002: Модель данных, полиморфные профили и RBAC](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/adr/ADR-002-data-model.md)
  * [ADR-003: UI-стратегия, дизайн-система и shadcn/ui](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/adr/ADR-003-ui-strategy.md)
  * [ADR-004: Методология тестирования и TDD](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/adr/ADR-004-testing-strategy.md)

## Быстрый старт

```bash
# 1. Запуск базы данных PostgreSQL в Docker
docker-compose up -d

# 2. Настройка окружения
cp .env.example .env

# 3. Установка зависимостей
npm install

# 4. Применение миграций и сидирование
npx prisma migrate dev --name init
npm run db:seed

# 5. Запуск сервера разработки
npm run dev
```

Подробные инструкции смотрите в [docs/README.md](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/docs/README.md).
