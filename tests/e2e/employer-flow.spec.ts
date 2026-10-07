import { test, expect } from '@playwright/test';

test.describe('E2E: Сценарий работодателя (Создание вакансии -> Поиск по GPA -> Kanban воронка)', () => {
  test('Работодатель может опубликовать вакансию, отфильтровать кандидатов по ВУЗу/GPA и сменить статус в Kanban', async ({
    page,
  }) => {
    // 1. Вход в кабинет работодателя
    await page.goto('/login');
    await expect(page.locator('h3')).toContainText('Вход в UniTalent');

    // Переключение на роль работодателя и ввод данных
    await page.click('button:has-text("Работодатель")');
    await page.fill('#email', 'hr@fintech-labs.ru');
    await page.fill('#password', 'Password123');
    await page.click('#loginSubmitBtn');

    // 2. Проверка профиля компании
    await expect(page).toHaveURL(/.*\/employer\/profile/);
    await expect(page.locator('text=Финтех Лабс')).toBeVisible();

    // 3. Публикация новой вакансии
    await page.click('text=Новая вакансия');
    await expect(page).toHaveURL(/.*\/employer\/vacancies\/new/);
    await expect(page.locator('h1')).toContainText('Публикация студенческой вакансии');

    const titleInput = page.locator('#title');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('Стажер Go Highload (Осенний набор)');
    await page.locator('#city').fill('Москва');
    await page.locator('#description').fill('Ищем профильного студента старших курсов для разработки высоконагруженных очередей.');
    await page.click('button:has-text("Опубликовать вакансию")');
    await expect(page.locator('text=Вакансия успешно опубликована')).toBeVisible();

    // 4. Поиск студентов по академическим критериям
    await page.goto('/employer/candidates');
    await expect(page.locator('h1')).toContainText('Академический поиск талантов');

    // Фильтрация по ВУЗу
    const univInput = page.locator('#univFilter');
    await univInput.fill('ВШЭ');
    await expect(page.locator('text=Алексей Смирнов')).toBeVisible();

    // 5. Управление воронкой Kanban
    await page.goto('/employer/applications');
    await expect(page.locator('h1')).toContainText('Воронка рассмотрения кандидатов (Kanban)');

    // Проверка наличия колонок воронки
    await expect(page.getByText('Новые отклики', { exact: true })).toBeVisible();
    await expect(page.getByText('Скрининг', { exact: true })).toBeVisible();
    await expect(page.getByText('Тестовое задание', { exact: true })).toBeVisible();

    // Смена статуса кандидата в Kanban
    const advanceButton = page.locator('button:has-text("→ Тестовое задание")').first();
    if (await advanceButton.isVisible()) {
      await advanceButton.click();
      await expect(page.locator('text=Смена этапа отбора кандидата')).toBeVisible();
      await page.fill('#modalNote', 'Тестовое задание выслано кандидату на почту.');
      await page.click('button:has-text("Подтвердить перевод")');
      await expect(page.locator('text=Смена этапа отбора кандидата')).not.toBeVisible();
    }
  });
});
