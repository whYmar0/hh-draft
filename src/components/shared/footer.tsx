import Link from 'next/link';
import { GraduationCap, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm py-12 text-sm text-muted-foreground">
      <div className="container max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground text-base tracking-tight">UniTalent</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed">
              MVP веб-платформы рекрутинга для студентов, выпускников и работодателей с фокусом на академический бэкграунд, средний балл (GPA) и реальные проекты.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Студентам</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/vacancies" className="hover:text-foreground transition-colors">Поиск стажировок</Link></li>
              <li><Link href="/student/profile" className="hover:text-foreground transition-colors">Академическое резюме</Link></li>
              <li><Link href="/student/applications" className="hover:text-foreground transition-colors">Мои отклики</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Компаниям</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/employer/profile" className="hover:text-foreground transition-colors">Кабинет компании</Link></li>
              <li><Link href="/employer/vacancies/new" className="hover:text-foreground transition-colors">Опубликовать вакансию</Link></li>
              <li><Link href="/employer/candidates" className="hover:text-foreground transition-colors">Поиск по ВУЗам и GPA</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} UniTalent. Платформа академического рекрутинга.</p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com" target="_blank" className="hover:text-foreground flex items-center gap-1">
              <Github className="h-3.5 w-3.5" />
              Репозиторий
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
