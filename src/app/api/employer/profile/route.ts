import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';
import { companyProfileSchema } from '@/lib/validations/company-profile';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        jobPostings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Профиль компании не найден' }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error('Error fetching company profile:', error);
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
    const parsed = companyProfileSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.errors[0]?.message || 'Неверные данные компании';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = parsed.data;
    const baseSlug = data.companyName.toLowerCase().replace(/[^a-zа-я0-9]/gi, '-');

    const updated = await prisma.companyProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: data.companyName,
        slug: `${baseSlug}-${Date.now().toString(36)}`,
        website: data.website || null,
        industry: data.industry || null,
        description: data.description || null,
        internshipProgramsDescription: data.internshipProgramsDescription || null,
      },
      update: {
        companyName: data.companyName,
        website: data.website || null,
        industry: data.industry || null,
        description: data.description || null,
        internshipProgramsDescription: data.internshipProgramsDescription || null,
      },
      include: {
        jobPostings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ company: updated });
  } catch (error: any) {
    console.error('Error updating company profile:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
