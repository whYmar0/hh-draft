'use server';

import { prisma } from '@/lib/db/prisma';
import { studentProfileSchema, StudentProfileInput } from '@/lib/validations/student-profile';
import { prepareStudentProfileData } from '@/server/services/student-profile-service';

export type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Получение профиля студента по ID пользователя
 */
export async function getStudentProfileByUserId(userId: string) {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        projects: true,
        achievements: true,
        skills: {
          include: { skill: true },
        },
      },
    });
    return profile;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }
}

/**
 * Обновление академического профиля студента
 */
export async function updateStudentProfileAction(
  userId: string,
  input: StudentProfileInput
): Promise<ActionResponse<any>> {
  try {
    const validation = studentProfileSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: 'Ошибка валидации данных профиля',
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const preparedData = prepareStudentProfileData(validation.data);

    const updated = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        firstName: preparedData.firstName,
        lastName: preparedData.lastName,
        phone: preparedData.phone,
        university: preparedData.university,
        faculty: preparedData.faculty,
        fieldOfStudy: preparedData.fieldOfStudy,
        degreeLevel: preparedData.degreeLevel,
        currentCourse: preparedData.currentCourse,
        graduationYear: preparedData.graduationYear,
        gpa: preparedData.gpa,
        gpaScale: preparedData.gpaScale,
        normalizedGpa: preparedData.normalizedGpa,
        searchStatus: preparedData.searchStatus,
        bio: preparedData.bio,
        githubUrl: preparedData.githubUrl,
        portfolioUrl: preparedData.portfolioUrl,
        linkedinUrl: preparedData.linkedinUrl,
      },
      create: {
        userId,
        firstName: preparedData.firstName,
        lastName: preparedData.lastName,
        phone: preparedData.phone,
        university: preparedData.university,
        faculty: preparedData.faculty,
        fieldOfStudy: preparedData.fieldOfStudy,
        degreeLevel: preparedData.degreeLevel,
        currentCourse: preparedData.currentCourse,
        graduationYear: preparedData.graduationYear,
        gpa: preparedData.gpa,
        gpaScale: preparedData.gpaScale,
        normalizedGpa: preparedData.normalizedGpa,
        searchStatus: preparedData.searchStatus,
        bio: preparedData.bio,
        githubUrl: preparedData.githubUrl,
        portfolioUrl: preparedData.portfolioUrl,
        linkedinUrl: preparedData.linkedinUrl,
      },
      include: {
        projects: true,
        achievements: true,
      },
    });

    return {
      success: true,
      data: updated,
      message: 'Академический профиль успешно сохранен',
    };
  } catch (error: any) {
    console.error('Error updating student profile:', error);
    return {
      success: false,
      error: error.message || 'Не удалось сохранить профиль',
    };
  }
}
