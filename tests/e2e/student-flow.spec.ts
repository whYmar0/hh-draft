import { test, expect } from '@playwright/test';

test.describe('E2E: Сценарий студента (Регистрация -> Профиль -> Отклик)', () => {
  test('Студент может пройти регистрацию, настроить академический профиль и откликнуться на стажировку', async ({
    page,
  }) => {
    // 1. Главная страница
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('академический капитал');

    // 2. Переход к регистрации
    await page.click('text=Регистрация');
    await expect(page).toHaveURL(/.*\/register/);

    // Заполнение формы регистрации
    await page.fill('#regEmail', 'alexey.e2e@edu.hse.ru');
    await page.fill('#regPass', 'SecurePassword123');
    await page.fill('#regPassConfirm', 'SecurePassword123');
    await page.click('button[type="submit"]');

    // 3. Переход в академический профиль
    await expect(page).toHaveURL(/.*\/student\/profile/);
    await expect(page.locator('text=Индекс академического резюме')).toBeVisible();

    // Переход в режим редактирования
    await page.click('text=Редактировать профиль');
    await expect(page.locator('#university')).toBeVisible();

    // Проверка наличия полей академического резюме
    await expect(page.locator('#gpa')).toBeVisible();
    await expect(page.locator('#gpaScale')).toBeVisible();

    // 4. Переход в каталог вакансий
    await page.goto('/vacancies');
    await expect(page.locator('h1')).toContainText('Вакансии и студенческие стажировки');

    // Проверка фильтрации
    const searchInput = page.locator('#searchQuery');
    await searchInput.fill('Go');
    await expect(page.locator('text=Стажер Backend-разработчик (Go / Highload)')).toBeVisible();

    // 5. Открытие детальной страницы вакансии
    await page.click('text=Стажер Backend-разработчик (Go / Highload)');
    await expect(page.locator('text=Тестовое задание для кандидатов')).toBeVisible();

    // Подача отклика
    await page.click('text=Откликнуться на стажировку');
    await expect(page.locator('#coverLetter')).toBeVisible();

    await page.click('button:has-text("Отправить")');
    await expect(page.locator('text=Отклик успешно отправлен')).toBeVisible();

    // 6. Проверка отклика в кабинете студента
    await page.goto('/student/applications');
    await expect(page.locator('h1')).toContainText('Мои отклики на стажировки');
    await expect(page.locator('text=Финтех Лабс')).toBeVisible();
  });
});
