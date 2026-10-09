'use client';

import * as React from 'react';
import { StudentProfileForm } from '@/components/student/student-profile-form';
import { ProfileCompletenessCard } from '@/components/student/profile-completeness-card';
import { calculateProfileCompleteness } from '@/server/services/student-profile-service';
import { StudentProfileInput } from '@/lib/validations/student-profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Eye } from 'lucide-react';
import Link from 'next/link';

import { StudentProfileView, StudentProfileViewProps } from '@/components/student/student-profile-view';

// Стартовые демонстрационные данные для интерактивной работы в MVP
const INITIAL_DEMO_STUDENT: StudentProfileViewProps['profile'] = {
  id: 'demo-student-id-1',
  firstName: 'Алексей',
  lastName: 'Смирнов',
  university: 'НИУ ВШЭ (Национальный исследовательский университет «Высшая школа экономики»)',
  faculty: 'Факультет компьютерных наук (ФКН)',
  fieldOfStudy: '09.03.04 Программная инженерия',
  degreeLevel: 'BACHELOR',
  currentCourse: 3,
  graduationYear: 2026,
  gpa: 4.85,
  gpaScale: 'SCALE_5',
  normalizedGpa: 3.88,
  searchStatus: 'LOOKING_FOR_INTERNSHIP',
  bio: 'Студент 3-го курса ФКН ВШЭ. Специализируюсь на распределенных хранилищах данных, сетевых протоколах и высоконагруженных бэкендах на Go. Увлекаюсь алгоритмами, участвую в ICPC и открытых Open-Source проектах.',
  githubUrl: 'https://github.com/alexey-smirnov-hse',
  portfolioUrl: 'https://alexey-dev.me',
  linkedinUrl: 'https://linkedin.com/in/alexey-smirnov',
  projects: [
    {
      id: 'proj-1',
      title: 'Go-Raft-KV: Распределенное ключ-значение хранилище',
      description:
        'Реализация алгоритма консенсуса Raft с репликацией логов, heartbeat механизмом и снепшотами состояния. Высокая устойчивость к разделению сети (network partition).',
      role: 'Автор и разработчик архитектуры',
      repoUrl: 'https://github.com/alexey-smirnov-hse/go-raft-kv',
      demoUrl: null,
      technologies: ['Go', 'gRPC', 'Protobuf', 'Docker', 'Raft'],
    },
    {
      id: 'proj-2',
      title: 'Mini-Postgres: Учебный движок СУБД с B+Tree',
      description:
        'Реализация буферного пула страниц, индекса B+Tree на диске и простого парсера подмножества SQL-запросов SELECT/INSERT.',
      role: 'Курсовой проект (оценка: 10/10)',
      repoUrl: 'https://github.com/alexey-smirnov-hse/mini-db',
      demoUrl: null,
      technologies: ['C++', 'B+Tree', 'Memory Management', 'CMake'],
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      type: 'OLYMPIAD' as const,
      title: 'Медалист олимпиады «Я — профессионал» по «Программной инженерии»',
      description: 'Финальный очный тур в Москве. Решение задач по параллельному программированию и архитектуре ПО.',
      year: 2025,
      verificationUrl: 'https://yandex.ru/profi',
    },
    {
      id: 'ach-2',
      type: 'PUBLICATION' as const,
      title: 'Оптимизация параллельной обработки очередей сообщений в распределенных RPC',
      description: 'Доклад и статья в рецензируемом сборнике трудов научно-практической конференции ВШЭ.',
      year: 2025,
      verificationUrl: null,
    },
  ],
  skills: [
    { id: 'sk-1', skill: { name: 'Go', category: 'HARD' }, level: 'ADVANCED' },
    { id: 'sk-2', skill: { name: 'PostgreSQL', category: 'HARD' }, level: 'INTERMEDIATE' },
    { id: 'sk-3', skill: { name: 'Docker', category: 'HARD' }, level: 'INTERMEDIATE' },
    { id: 'sk-4', skill: { name: 'Алгоритмы и структуры данных', category: 'HARD' }, level: 'ADVANCED' },
    { id: 'sk-5', skill: { name: 'Английский язык (C1)', category: 'LANGUAGE' }, level: 'ADVANCED' },
  ],
};

import { useSession } from 'next-auth/react';

export default function StudentProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState(INITIAL_DEMO_STUDENT);
  const [isLoading, setIsLoading] = React.useState(true);

  // Загружаем реальный профиль пользователя из БД, если авторизован
  React.useEffect(() => {
    async function loadProfile() {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/student/profile');
          if (res.ok) {
            const data = await res.json();
            if (data?.profile) {
              setProfileData(data.profile);
            }
          }
        } catch (err) {
          console.error('Failed to load profile from backend:', err);
        } finally {
          setIsLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setIsLoading(false);
      }
    }

    if (status !== 'loading') {
      loadProfile();
    }
  }, [status]);

  const completeness = calculateProfileCompleteness({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    university: profileData.university,
    fieldOfStudy: profileData.fieldOfStudy,
    currentCourse: profileData.currentCourse,
    graduationYear: profileData.graduationYear,
    gpa: profileData.gpa,
    bio: profileData.bio,
    githubUrl: profileData.githubUrl,
    skillsCount: profileData.skills?.length || 0,
    projectsCount: profileData.projects?.length || 0,
    achievementsCount: profileData.achievements?.length || 0,
  });

  const handleProfileSubmit = async (data: StudentProfileInput) => {
    try {
      // Сохраняем в реальную БД через API, если авторизован
      if (session?.user) {
        const res = await fetch('/api/student/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.profile) {
            setProfileData(result.profile);
            setIsEditing(false);
            return { success: true };
          }
        }
      }

      // Fallback для локального демо
      const normalizedGpa =
        data.gpaScale === 'SCALE_5'
          ? Math.round(((data.gpa / 5.0) * 4.0) * 100) / 100
          : data.gpa;

      setProfileData((prev) => ({
        ...prev,
        ...data,
        normalizedGpa,
      }));

      setIsEditing(false);
      return { success: true };
    } catch (err) {
      console.error('Profile update failed:', err);
      return { success: false, error: 'Ошибка сохранения' };
    }
  };

  return (
    <div className="container max-w-5xl py-8 px-4 sm:px-6">
      {/* Навигационная панель страницы */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'gradient'}
            size="sm"
            className="gap-1.5"
          >
            {isEditing ? (
              <>
                <Eye className="h-4 w-4" />
                Режим просмотра
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Редактировать профиль
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Левая колонка: Виджет полноты резюме */}
        <div className="lg:col-span-1 order-2 lg:order-1 space-y-4">
          <ProfileCompletenessCard
            completeness={completeness}
            onEditClick={() => setIsEditing(true)}
          />

          <div className="p-3 rounded-lg border border-border/50 bg-card text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground mr-1">💡 Совет:</span>
            Работодатели фильтруют отклики по <strong>ВУЗу, GPA</strong> и ссылкам на учебные репозитории GitHub.
          </div>
        </div>

        {/* Правая колонка: Основной контент резюме или форма */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {isEditing ? (
            <StudentProfileForm
              initialData={profileData}
              onSubmit={handleProfileSubmit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <StudentProfileView
              profile={profileData}
              isOwner={true}
              onEditClick={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
