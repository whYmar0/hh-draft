import { normalizeGpa, GpaScale } from '@/lib/gpa';
import { StudentProfileInput } from '@/lib/validations/student-profile';

export interface ProfileCompletenessParams {
  firstName: string;
  lastName: string;
  university: string;
  fieldOfStudy: string;
  currentCourse: number;
  graduationYear: number;
  gpa: number;
  bio?: string | null;
  githubUrl?: string | null;
  skillsCount?: number;
  projectsCount?: number;
  achievementsCount?: number;
}

export interface ProfileCompletenessResult {
  score: number; // 0..100
  missingFields: string[];
  recommendations: string[];
}

/**
 * Подготовка данных студенческого профиля перед сохранением в БД:
 * автоматический расчет нормализованного GPA по 4.0 шкале
 */
export function prepareStudentProfileData(data: StudentProfileInput) {
  const normalizedGpa = normalizeGpa(data.gpa, data.gpaScale as GpaScale);
  return {
    ...data,
    normalizedGpa,
  };
}

/**
 * Расчет индекса полноты академического резюме студента (0..100%)
 */
export function calculateProfileCompleteness(
  profile: ProfileCompletenessParams
): ProfileCompletenessResult {
  const missingFields: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // Базовая информация (30 баллов)
  if (profile.firstName && profile.lastName) score += 10;
  if (profile.university && profile.fieldOfStudy) score += 15;
  if (profile.currentCourse && profile.graduationYear) score += 5;

  // Академическая успеваемость (20 баллов)
  if (profile.gpa && profile.gpa > 0) {
    score += 20;
  } else {
    missingFields.push('gpa');
    recommendations.push('Укажите средний балл (GPA) для фильтрации работодателями');
  }

  // Практический бэкграунд и GitHub (20 баллов)
  if (profile.githubUrl && profile.githubUrl.trim().length > 0) {
    score += 10;
  } else {
    missingFields.push('githubUrl');
    recommendations.push('Добавьте ссылку на профиль GitHub с учебным кодом');
  }

  if (profile.bio && profile.bio.trim().length > 10) {
    score += 10;
  } else {
    missingFields.push('bio');
    recommendations.push('Напишите кратко о ваших научных интересах и целях');
  }

  // Навыки (15 баллов)
  if ((profile.skillsCount ?? 0) >= 3) {
    score += 15;
  } else {
    missingFields.push('skills');
    recommendations.push('Укажите не менее 3 ключевых навыков (Hard/Soft/Языки)');
  }

  // Проекты и достижения (15 баллов)
  if ((profile.projectsCount ?? 0) >= 1) {
    score += 10;
  } else {
    missingFields.push('projects');
    recommendations.push('Добавьте курсовой или дипломный проект с описанием стека');
  }

  if ((profile.achievementsCount ?? 0) >= 1) {
    score += 5;
  }

  return {
    score: Math.min(100, score),
    missingFields,
    recommendations,
  };
}
