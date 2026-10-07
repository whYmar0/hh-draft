export interface VacancyFilterCriteria {
  query?: string;
  employmentType?: 'INTERNSHIP' | 'PART_TIME' | 'FULL_TIME' | 'FLEXIBLE';
  employmentTypes?: Array<'INTERNSHIP' | 'PART_TIME' | 'FULL_TIME' | 'FLEXIBLE'>;
  locationType?: 'REMOTE' | 'HYBRID' | 'ONSITE';
  locationTypes?: Array<'REMOTE' | 'HYBRID' | 'ONSITE'>;
  hasMentorship?: boolean;
  isStipend?: boolean;
  minCourse?: number;
  minGpa?: number;
  targetMajor?: string;
  skills?: string[];
  studentCourse?: number;
  studentNormalizedGpa?: number;
}

export interface VacancyItem {
  id: string;
  title: string;
  description: string;
  employmentType: 'INTERNSHIP' | 'PART_TIME' | 'FULL_TIME' | 'FLEXIBLE';
  locationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  city?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  isStipend: boolean;
  hasMentorship: boolean;
  minCourse: number;
  minGpa?: number | null;
  targetMajors: string[];
  skills?: string[];
  createdAt: Date;
}

/**
 * Проверка, подходит ли студент под академические требования вакансии
 */
export function isStudentEligibleForJob(
  student: { currentCourse: number; normalizedGpa: number },
  job: { minCourse: number; minGpa?: number | null }
): boolean {
  if (student.currentCourse < job.minCourse) {
    return false;
  }
  if (job.minGpa != null && student.normalizedGpa < job.minGpa) {
    return false;
  }
  return true;
}

/**
 * Фильтрация списка вакансий по критериям
 */
export function filterVacancies(
  vacancies: VacancyItem[],
  criteria: VacancyFilterCriteria
): VacancyItem[] {
  return vacancies.filter((job) => {
    // 1. Текстовый поиск по заголовку и описанию
    if (criteria.query && criteria.query.trim().length > 0) {
      const q = criteria.query.toLowerCase().trim();
      const inTitle = job.title.toLowerCase().includes(q);
      const inDesc = job.description.toLowerCase().includes(q);
      const inSkills = job.skills?.some((s) => s.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inSkills) {
        return false;
      }
    }

    // 2. Формат занятости (поддержка множественного выбора и единичного)
    if (criteria.employmentTypes && criteria.employmentTypes.length > 0) {
      if (!criteria.employmentTypes.includes(job.employmentType)) {
        return false;
      }
    } else if (criteria.employmentType && job.employmentType !== criteria.employmentType) {
      return false;
    }

    // 3. Формат локации (поддержка множественного выбора и единичного)
    if (criteria.locationTypes && criteria.locationTypes.length > 0) {
      if (!criteria.locationTypes.includes(job.locationType)) {
        return false;
      }
    } else if (criteria.locationType && job.locationType !== criteria.locationType) {
      return false;
    }

    // 4. Наличие наставника
    if (criteria.hasMentorship !== undefined && job.hasMentorship !== criteria.hasMentorship) {
      return false;
    }

    // 5. Оплачиваемая стипендия
    if (criteria.isStipend !== undefined && job.isStipend !== criteria.isStipend) {
      return false;
    }

    // 6. Фильтрация по соответствию академическому профилю студента
    if (criteria.studentCourse != null && criteria.studentNormalizedGpa != null) {
      const eligible = isStudentEligibleForJob(
        {
          currentCourse: criteria.studentCourse,
          normalizedGpa: criteria.studentNormalizedGpa,
        },
        job
      );
      if (!eligible) {
        return false;
      }
    }

    // 7. Фильтр по направлению
    if (criteria.targetMajor && criteria.targetMajor.trim().length > 0) {
      const tm = criteria.targetMajor.toLowerCase();
      const matchesMajor = job.targetMajors.some((m) => m.toLowerCase().includes(tm));
      if (!matchesMajor) {
        return false;
      }
    }

    return true;
  });
}
