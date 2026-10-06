export interface CandidateFilterCriteria {
  university?: string;
  fieldOfStudy?: string;
  minCourse?: number;
  maxCourse?: number;
  minNormalizedGpa?: number;
  skills?: string[];
  searchStatus?: 'LOOKING_FOR_INTERNSHIP' | 'LOOKING_FOR_JOB' | 'NOT_LOOKING';
  hasProjects?: boolean;
  hasAchievements?: boolean;
}

export interface CandidateItem {
  id: string;
  firstName: string;
  lastName: string;
  university: string;
  fieldOfStudy: string;
  currentCourse: number;
  normalizedGpa: number;
  searchStatus: 'LOOKING_FOR_INTERNSHIP' | 'LOOKING_FOR_JOB' | 'NOT_LOOKING';
  skills: string[];
  hasProjects: boolean;
  hasAchievements: boolean;
}

/**
 * Фильтрация кандидатов по академическим критериям работодателя
 */
export function filterCandidates(
  candidates: CandidateItem[],
  criteria: CandidateFilterCriteria
): CandidateItem[] {
  return candidates.filter((candidate) => {
    // 1. Фильтр по ВУЗу (подстрока)
    if (criteria.university && criteria.university.trim().length > 0) {
      const u = criteria.university.toLowerCase();
      if (!candidate.university.toLowerCase().includes(u)) {
        return false;
      }
    }

    // 2. Фильтр по специальности / направлению
    if (criteria.fieldOfStudy && criteria.fieldOfStudy.trim().length > 0) {
      const fos = criteria.fieldOfStudy.toLowerCase();
      if (!candidate.fieldOfStudy.toLowerCase().includes(fos)) {
        return false;
      }
    }

    // 3. Минимальный курс
    if (criteria.minCourse != null && candidate.currentCourse < criteria.minCourse) {
      return false;
    }

    // 4. Максимальный курс
    if (criteria.maxCourse != null && candidate.currentCourse > criteria.maxCourse) {
      return false;
    }

    // 5. Минимальный балл успеваемости (GPA по 4.0 шкале)
    if (
      criteria.minNormalizedGpa != null &&
      candidate.normalizedGpa < criteria.minNormalizedGpa
    ) {
      return false;
    }

    // 6. Статус поиска работы
    if (criteria.searchStatus && candidate.searchStatus !== criteria.searchStatus) {
      return false;
    }

    // 7. Наличие курсовых/практических проектов
    if (criteria.hasProjects && !candidate.hasProjects) {
      return false;
    }

    // 8. Наличие научных достижений / олимпиад
    if (criteria.hasAchievements && !candidate.hasAchievements) {
      return false;
    }

    // 9. Навыки кандидата (пословное или точное совпадение)
    if (criteria.skills && criteria.skills.length > 0) {
      const candidateSkills = candidate.skills.map((s) => s.toLowerCase());
      const hasAllSkills = criteria.skills.every((skill) => {
        const target = skill.toLowerCase().trim();
        const regex = new RegExp(`(^|[^a-z0-9а-я])${target}([^a-z0-9а-я]|$)`, 'i');
        return candidateSkills.some((cs) => cs === target || regex.test(cs));
      });
      if (!hasAllSkills) {
        return false;
      }
    }

    return true;
  });
}
