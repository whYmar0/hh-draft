import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.errors[0]?.message || 'Ошибка валидации данных';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, password, role } = result.data;

    // Проверяем, зарегистрирован ли уже такой email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже зарегистрирован' },
        { status: 409 }
      );
    }

    // Хешируем пароль
    const passwordHash = await hashPassword(password);

    // Создаем пользователя и начальный профиль в одной транзакции
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
          status: 'ACTIVE',
        },
      });

      if (role === 'STUDENT') {
        // Создаем базовый студенческий профиль
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            firstName: email.split('@')[0],
            lastName: 'Студент',
            university: 'НИУ ВШЭ',
            fieldOfStudy: 'Программная инженерия',
            degreeLevel: 'BACHELOR',
            currentCourse: 1,
            graduationYear: new Date().getFullYear() + 3,
            gpa: 4.0,
            gpaScale: 'SCALE_5',
            normalizedGpa: 3.2,
            searchStatus: 'LOOKING_FOR_INTERNSHIP',
          },
        });
      } else if (role === 'EMPLOYER') {
        // Создаем базовый профиль компании
        const companyName = email.split('@')[0];
        const slug = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
        await tx.companyProfile.create({
          data: {
            userId: newUser.id,
            companyName,
            slug,
            industry: 'IT / Разработка ПО',
            verified: false,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера при регистрации' },
      { status: 500 }
    );
  }
}
