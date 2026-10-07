# Руководство по бесплатному деплою UniTalent на Vercel (100% Free, без карты)

**Vercel** — это платформа от самих создателей **Next.js**. 
В отличие от Firebase, здесь **не требуется привязка банковской карты**, а поддержка Next.js 15 App Router, SSR, Middleware и Server Actions работает нативно из коробки на бесплатном тарифе **Hobby**.

---

## Способ 1: Деплой через GitHub (Самый удобный и рекомендуемый)

При этом способе каждый `git push` будет автоматически обновлять ваш сайт в продакшне.

### Шаг 1. Загрузите код на GitHub
Если репозиторий еще не на GitHub:
1. Создайте новый репозиторий на [github.com](https://github.com/new) (например, `unitalent-platform`).
2. В терминале вашего проекта выполните:
   ```bash
   git add .
   git commit -m "feat: prepare project for production deployment"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

### Шаг 2. Авторизуйтесь на Vercel
1. Перейдите на **[vercel.com/signup](https://vercel.com/signup)**.
2. Выберите **«Continue with GitHub»** (войти через GitHub) — **карту вводить не нужно!**
3. Выберите тарифный план **Hobby** (Personal / Non-commercial).

### Шаг 3. Импорт проекта
1. Нажмите кнопку **«Add New...»** ➔ **«Project»**.
2. В списке репозиториев найдите ваш проект и нажмите **«Import»**.

### Шаг 4. Настройка переменных окружения (Environment Variables)
В окне настройки проекта раскройте вкладку **Environment Variables** и добавьте переменные:

| Name | Value | Описание |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Строка подключения к вашей базе данных (Supabase / Neon) |
| `NEXTAUTH_SECRET` | `f6c8d2a1b9e4a3c7d0e5f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2` | Секретный ключ для сессий NextAuth |
| `NEXTAUTH_URL` | `https://<your-project>.vercel.app` | URL вашего приложения (можно дописать после первого деплоя) |

> 💡 **Команда сборки уже настроена:** В `package.json` скрипт `"build"` обновлен до `"prisma generate && next build"`, поэтому Vercel автоматически сгенерирует клиент Prisma при каждой сборке.

### Шаг 5. Деплой!
1. Нажмите синюю кнопку **«Deploy»**.
2. Через 1-2 минуты проект соберется, и вы получите конфетти на экране и рабочий публичный домен:
   `https://<project-name>.vercel.app`

---

## Способ 2: Деплой прямо из терминала через Vercel CLI (Без GitHub)

Если вы не хотите создавать репозиторий на GitHub, можно задеплоить прямо из текущей консоли:

1. **Установите Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Войдите в аккаунт**:
   ```bash
   vercel login
   ```
   *(выберите способ входа через браузер или email)*

3. **Запустите деплой в продакшн**:
   ```bash
   vercel --prod
   ```
   - Нажмите `Y` на вопрос о настройке проекта.
   - Выберите вашу учетную запись.
   - Подтвердите имя проекта (Enter по умолчанию).
   - В ответ на вопрос `Want to modify these settings? [y/N]` нажмите `N`.

4. **Добавьте переменные окружения**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   ```
   И вставьте соответствующие значения.

5. Запустите финальную сборку:
   ```bash
   vercel --prod
   ```

---

## База данных: Накатывание схемы (Prisma)
Перед первым запуском убедитесь, что таблицы созданы в вашей облачной БД:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
