import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';
import { studentProfileSchema } from '@/lib/validations/student-profile';
import { normalizeGpa } from '@/lib/gpa';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        projects: true,
        achievements: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Профиль студента не найден' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = studentProfileSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.errors[0]?.message || 'Неверные данные профиля';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = parsed.data;
    const normalizedGpa = normalizeGpa(data.gpa, data.gpaScale as any);

    const updated = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        university: data.university,
        faculty: data.faculty,
        fieldOfStudy: data.fieldOfStudy,
        degreeLevel: data.degreeLevel as any,
        currentCourse: data.currentCourse,
        graduationYear: data.graduationYear,
        gpa: data.gpa,
        gpaScale: data.gpaScale as any,
        normalizedGpa,
        searchStatus: data.searchStatus as any,
        bio: data.bio,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        linkedinUrl: data.linkedinUrl,
      },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        university: data.university,
        faculty: data.faculty,
        fieldOfStudy: data.fieldOfStudy,
        degreeLevel: data.degreeLevel as any,
        currentCourse: data.currentCourse,
        graduationYear: data.graduationYear,
        gpa: data.gpa,
        gpaScale: data.gpaScale as any,
        normalizedGpa,
        searchStatus: data.searchStatus as any,
        bio: data.bio,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        linkedinUrl: data.linkedinUrl,
      },
      include: {
        projects: true,
        achievements: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (error: any) {
    console.error('Error updating student profile:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
