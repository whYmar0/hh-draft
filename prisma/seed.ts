import { PrismaClient, UserRole, GpaScale, DegreeLevel, StudentSearchStatus, EmploymentType, LocationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем сидирование базы данных UniTalent...');

  const defaultPassword = await bcrypt.hash('Password123', 10);

  // 1. Создание словаря навыков
  const skillsData = [
    { name: 'TypeScript', category: 'HARD' as const },
    { name: 'React', category: 'HARD' as const },
    { name: 'Next.js', category: 'HARD' as const },
    { name: 'Python', category: 'HARD' as const },
    { name: 'Go', category: 'HARD' as const },
    { name: 'PostgreSQL', category: 'HARD' as const },
    { name: 'Docker', category: 'HARD' as const },
    { name: 'Алгоритмы и структуры данных', category: 'HARD' as const },
    { name: 'Командная работа', category: 'SOFT' as const },
    { name: 'Английский (B2/C1)', category: 'LANGUAGE' as const },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }
  console.log('✅ Навыки добавлены');

  // 2. Администратор
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@unitalent.local' },
    update: {},
    create: {
      email: 'admin@unitalent.local',
      passwordHash: defaultPassword,
      role: UserRole.ADMIN,
    },
  });

  // 3. Работодатель 1: Финтех Лабс
  const employerUser1 = await prisma.user.upsert({
    where: { email: 'hr@fintech-labs.ru' },
    update: {},
    create: {
      email: 'hr@fintech-labs.ru',
      passwordHash: defaultPassword,
      role: UserRole.EMPLOYER,
      companyProfile: {
        create: {
          companyName: 'Финтех Лабс',
          slug: 'fintech-labs',
          website: 'https://fintech-labs.example.ru',
          industry: 'Финтех / Высоконагруженные системы',
          description: 'Разработка платежных решений, алгоритмического трейдинга и необанкинга.',
          verified: true,
          internshipProgramsDescription: 'Оплачиваемые стажировки от 3 до 6 месяцев с личным техлидом-наставником.',
        },
      },
    },
    include: { companyProfile: true },
  });

  // 4. Вакансии компании
  if (employerUser1.companyProfile) {
    const jobGo = await prisma.jobPosting.upsert({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000001',
        companyProfileId: employerUser1.companyProfile.id,
        title: 'Стажер Backend-разработчик (Go / Highload)',
        slug: 'intern-backend-go-highload',
        description: 'Ищем студента старших курсов (3-4 курс бакалавриата или 1-2 курс магистратуры) с хорошей базой алгоритмов и пониманием многопоточности для работы над распределенным транзакционным шлюзом.',
        employmentType: EmploymentType.INTERNSHIP,
        locationType: LocationType.HYBRID,
        city: 'Москва',
        salaryMin: 70000,
        salaryMax: 95000,
        currency: 'RUB',
        isStipend: true,
        hasMentorship: true,
        testTaskDescription: 'Реализовать in-memory кольцевой буфер с поддержкой concurrency-safe операций.',
        targetMajors: ['Прикладная математика и информатика', 'Программная инженерия', 'Информатика и ВТ'],
        minCourse: 3,
        minGpa: 3.5, // По 4.0 шкале (~ 4.37 по 5.0)
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    const jobFrontend = await prisma.jobPosting.upsert({
      where: { id: '00000000-0000-0000-0000-000000000002' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000002',
        companyProfileId: employerUser1.companyProfile.id,
        title: 'Стажер Frontend-разработчик (React / Next.js / TypeScript)',
        slug: 'intern-frontend-react-ts',
        description: 'Приглашаем увлеченного фронтендера в продуктовую команду интерфейсов аналитики. Менторство с первого дня, гибкий график под учебу.',
        employmentType: EmploymentType.PART_TIME,
        locationType: LocationType.REMOTE,
        city: 'Москва / Санкт-Петербург',
        salaryMin: 60000,
        salaryMax: 85000,
        currency: 'RUB',
        isStipend: true,
        hasMentorship: true,
        testTaskDescription: 'Создать компонент виртуализированного списка с фильтрацией на React.',
        targetMajors: ['Программная инженерия', 'Фундаментальная информатика'],
        minCourse: 2,
        minGpa: 3.2,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }
  console.log('✅ Работодатель и вакансии созданы');

  // 5. Демо-студент: Алексей Смирнов (ВШЭ, ФКН, GPA 4.85)
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@edu.hse.ru' },
    update: {},
    create: {
      email: 'student@edu.hse.ru',
      passwordHash: defaultPassword,
      role: UserRole.STUDENT,
      studentProfile: {
        create: {
          firstName: 'Алексей',
          lastName: 'Смирнов',
          university: 'НИУ ВШЭ',
          faculty: 'Факультет компьютерных наук (ФКН)',
          fieldOfStudy: 'Программная инженерия',
          degreeLevel: DegreeLevel.BACHELOR,
          currentCourse: 3,
          graduationYear: 2026,
          gpa: 4.85,
          gpaScale: GpaScale.SCALE_5,
          normalizedGpa: 3.88,
          searchStatus: StudentSearchStatus.LOOKING_FOR_INTERNSHIP,
          bio: 'Студент 3-го курса ФКН ВШЭ. Интересуюсь распределенными системами, алгоритмами и высоконагруженными бэкендами на Go. Автор открытых библиотек на GitHub.',
          githubUrl: 'https://github.com/alexey-smirnov-hse',
          achievements: {
            create: [
              {
                type: 'OLYMPIAD',
                title: 'Медалист всероссийской олимпиады «Я — профессионал» по направлению «Программная инженерия»',
                year: 2025,
              },
              {
                type: 'PUBLICATION',
                title: 'Оптимизация параллельной обработки очередей сообщений в распределенных RPC',
                description: 'Доклад и публикация в сборнике трудов научно-практической конференции ВШЭ',
                year: 2025,
              },
            ],
          },
          projects: {
            create: [
              {
                title: 'Go-Raft-KV: Распределенное ключ-значение хранилище',
                description: 'Реализация алгоритма консенсуса Raft с репликацией логов, heartbeat механизмом и снепшотами состояния.',
                role: 'Единственный автор',
                repoUrl: 'https://github.com/alexey-smirnov-hse/go-raft-kv',
                technologies: ['Go', 'gRPC', 'Protobuf', 'Docker'],
              },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });
  console.log('✅ Профиль студента наполнен академическими данными');

  console.log('🎉 Сидирование успешно завершено!');
}

main()
  .catch((e) => {
    console.error('Ошибка сидирования:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
