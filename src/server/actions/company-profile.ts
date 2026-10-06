'use server';

import { prisma } from '@/lib/db/prisma';
import { generateCompanySlug } from '@/server/services/company-profile-service';

export interface UpdateCompanyProfileInput {
  companyName: string;
  website?: string;
  industry?: string;
  description?: string;
  internshipProgramsDescription?: string;
}

export async function getCompanyProfileByUserId(userId: string) {
  try {
    return await prisma.companyProfile.findUnique({
      where: { userId },
      include: {
        jobPostings: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { applications: true },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }
}

export async function updateCompanyProfileAction(
  userId: string,
  input: UpdateCompanyProfileInput
) {
  try {
    if (!input.companyName || input.companyName.trim().length < 2) {
      return { success: false, error: 'Название компании обязательно' };
    }

    const slug = generateCompanySlug(input.companyName);

    const updated = await prisma.companyProfile.upsert({
      where: { userId },
      update: {
        companyName: input.companyName,
        slug,
        website: input.website || null,
        industry: input.industry || null,
        description: input.description || null,
        internshipProgramsDescription: input.internshipProgramsDescription || null,
      },
      create: {
        userId,
        companyName: input.companyName,
        slug,
        website: input.website || null,
        industry: input.industry || null,
        description: input.description || null,
        internshipProgramsDescription: input.internshipProgramsDescription || null,
        verified: false,
      },
      include: {
        jobPostings: true,
      },
    });

    return {
      success: true,
      data: updated,
      message: 'Профиль компании успешно сохранен',
    };
  } catch (error: any) {
    console.error('Error updating company profile:', error);
    return {
      success: false,
      error: error.message || 'Ошибка обновления профиля компании',
    };
  }
}
