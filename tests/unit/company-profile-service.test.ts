import { describe, it, expect } from 'vitest';
import { generateCompanySlug } from '@/server/services/company-profile-service';

describe('Company Profile Service', () => {
  describe('generateCompanySlug', () => {
    it('converts Russian company name to clean URL slug', () => {
      expect(generateCompanySlug('Яндекс Финтех')).toBe('yandeks-finteh');
      expect(generateCompanySlug('Тинькофф Образование')).toBe('tinkoff-obrazovanie');
      expect(generateCompanySlug('Сбер Технологии')).toBe('sber-tehnologii');
    });

    it('handles special characters and spaces correctly', () => {
      expect(generateCompanySlug('VK / ВКонтакте (Команда Поиска)')).toBe('vk-vkontakte-komanda-poiska');
      expect(generateCompanySlug('Лаборатория Касперского!')).toBe('laboratoriya-kasperskogo');
    });

    it('handles English and alphanumeric names', () => {
      expect(generateCompanySlug('JetBrains Research')).toBe('jetbrains-research');
    });
  });
});
