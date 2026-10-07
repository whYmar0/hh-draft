# Руководство по развертыванию UniTalent (Next.js + Prisma) на Firebase

В этом проекте используется **Next.js 15 (App Router)** с серверными функциями API и базой данных PostgreSQL через **Prisma ORM**. Firebase Hosting поддерживает прямое развертывание современных приложений Next.js с помощью технологии **Firebase Web Frameworks** (автоматический запуск SSR/API в Cloud Functions / Cloud Run).

---

## 1. Архитектурная подготовка (База Данных)

Firebase Hosting отвечает за фронтенд и серверный код Next.js, но для реляционной базы данных PostgreSQL (Prisma) необходима облачная СУБД:
- **Бесплатные облачные PostgreSQL**:
  - [Neon.tech](https://neon.tech) (Serverless Postgres, идеален для Prisma)
  - [Supabase](https://supabase.com) (PostgreSQL)
  - Либо Google Cloud SQL (в той же консоли Google Cloud).

Получите строку подключения:
```env
DATABASE_URL="postgresql://user:password@ep-host.eu-central-1.aws.neon.tech/unitalent?sslmode=require"
```

---

## 2. Установка Firebase CLI и авторизация

1. Убедитесь, что установлен Node.js (v18, v20 или v22).
2. Установите глобально утилиту Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
3. Войдите в свой Google-аккаунт:
   ```bash
   firebase login
   ```

---

## 3. Создание проекта в Firebase Console

1. Перейдите в [Firebase Console](https://console.firebase.google.com/).
2. Нажмите **«Создать проект»** (например, `unitalent-platform`).
3. Подключите тарифный план **Blaze (Pay as you go)**:
   > ⚠️ Для серверного рендеринга (SSR) и обращений к внешним базам данных (PostgreSQL) Firebase требует план Blaze. В рамках бесплатных лимитов Google Cloud вы не платите ничего при небольшом трафике.

---

## 4. Включение поддержки Next.js (Web Frameworks)

Выполните команду в корне проекта:
```bash
firebase experiments:enable webframeworks
```

В проекте уже создан файл конфигурации [`firebase.json`](file:///c:/Users/zell/Documents/PythonProjects/hh-draft/firebase.json):
```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}
```

---

## 5. Инициализация в проекте

Свяжите локальный проект с созданным в консоли:
```bash
firebase use --add
```
(Выберите проект, созданный в шаге 3, и дайте ему алиас `default`).

---

## 6. Настройка переменных окружения (Production)

Для работы аутентификации NextAuth и Prisma задайте переменные окружения:

Создайте в корне файл `.env.production` (он не попадет в git):
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_URL="https://<YOUR-PROJECT-ID>.web.app"
NEXTAUTH_SECRET="f6c8d2a1b9e4a3c7d0e5f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2"
NODE_ENV="production"
```

Сгенерируйте миграции на вашей боевой базе данных:
```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

---

## 7. Развертывание (Деплой)

Выполните команду деплоя:
```bash
firebase deploy --only hosting
```

### Что сделает Firebase:
1. Автоматически выполнит `npm run build`.
2. Определит статические страницы и выгрузит их на глобальный CDN Firebase Hosting.
3. Соберет серверные обработчики (динамические роуты, NextAuth API, серверные экшены) в облачную функцию.
4. Выдаст публичный URL вида `https://<YOUR-PROJECT-ID>.web.app`.

---

## 8. Проверка и логи

- Панель управления: [Firebase Console -> Hosting](https://console.firebase.google.com/).
- Логи Cloud Functions: `firebase functions:log` или в Google Cloud Logs Explorer.
