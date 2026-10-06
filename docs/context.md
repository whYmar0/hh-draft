# Контекст проекта и доменная модель (UniTalent)

> **Бизнес-контекст, целевые персоны, сценарии взаимодействия (User Journeys) и схема сущностей данных (ERD) для MVP платформы студенческого рекрутинга.**

---

## 1. Бизнес-контекст и проблематика

### Проблема рынка
Классические платформы рекрутинга (HeadHunter, SuperJob, LinkedIn) создавались для устоявшегося рынка труда:
1. **Дискриминация по опыту:** 90%+ вакансий содержат фильтр «опыт работы от 1 года». У талантливых студентов старших курсов нет коммерческого стажа, из-за чего их отклики автоматически отсеиваются алгоритмами или первичным скринингом HR.
2. **Игнорирование академических сигналов:** стандартные формы резюме скрывают реальные достижения студента: высокий GPA (средний балл), победы во всероссийских олимпиадах, курсовые/дипломные проекты с продакшн-стеком, участие в конференциях и научные публикации.
3. **Высокая стоимость найма джуниоров для бизнеса:** компании тратят сотни часов на ручной просмотр резюме без релевантных маркеров, получая шквал неквалифицированных откликов («свитчеров» после быстрых курсов) вместо профильных студентов с фундаментальной базой.

### Решение UniTalent
Платформа **UniTalent** позиционируется как специализированная экосистема раннего карьерного старта:
* **Для студентов:** возможность представить свой академический капитал (ВУЗ, средний балл, проекты на GitHub, хакатоны, публикации) как полноценный эквивалент коммерческого опыта.
* **Для компаний:** инструмент таргетированного поиска молодых талантов с фильтрацией по конкретным ВУЗам, кафедрам, курсам, минимальному среднему баллу (GPA) и специализированным навыкам.

---

## 2. Пользовательские персоны (User Personas)

### Персона 1: Алексей (Студент-выпускник)
* **Возраст:** 21 год.
* **Статус:** 3-й курс бакалавриата (ФКН ВШЭ / МГТУ им. Баумана, «Программная инженерия»).
* **Академический профиль:** GPA 4.8 / 5.0, призер олимпиады «Я — профессионал», курсовой проект — распределенный кеш на Go/Rust с открытым кодом на GitHub.
* **Цель:** Найти гибкую стажировку (20–30 часов в неделю) или part-time позицию в сильной инженерной команде с возможностью совмещения с сессией и наличием ментора.
* **Боли:** Традиционные рекрутеры на HH отказывают из-за графы «Опыт: нет», не открывая ссылки на GitHub и код курсовых работ.

### Персона 2: Екатерина (Tech Lead / Hiring Manager в ИТ-компании)
* **Возраст:** 32 года.
* **Роль:** Руководитель группы бэкенд-разработки в финтехе.
* **Цель:** Набрать 3–4 стажеров на оплачиваемую летне-осеннюю программу с перспективой перевода в штат на Junior+.
* **Критерии отбора:** Сильная фундаментальная база (алгоритмы, дискретная математика, базы данных), профильные направления ведущих технических ВУЗов, GPA не ниже 4.2, наличие учебных проектов с чистым кодом.
* **Боли:** Огромный поток нерелевантных откликов на общих сайтах; невозможность отфильтровать кандидатов по ВУЗу и академической успеваемости.

### Персона 3: Дмитрий (HR / Talent Acquisition Specialist)
* **Возраст:** 27 лет.
* **Роль:** Ведущий специалист по работе со студенческими программами в крупной EdTech-компании.
* **Цель:** Организовать прозрачную воронку отбора кандидатов на стажировки, оперативно передавать тестовые задания и согласовывать интервью с тимлидами.
* **Боли:** Необходимость вести кандидатов в разрозненных таблицах Excel/Notion, отсутствие прозрачного статуса рассмотрения и стандартизированных академических анкет.

### Персона 4: Администратор платформы
* **Роль:** Обеспечение качества и безопасности каталога.
* **Цель:** Верификация профилей компаний-работодателей, модерация вакансий на соответствие условиям стажировок (проверка наличия стипендии, запрет недобросовестных неоплачиваемых переработок), актуализация справочников ВУЗов.

---

## 3. Пользовательские сценарии (User Journeys)

### Сценарий 1: Студент — от регистрации до оффера

```mermaid
journey
    title Путь студента на платформе UniTalent
    section Регистрация и Профиль
      Регистрация через Email/OAuth: 5: Студент
      Заполнение ВУЗа, факультета, курса, GPA: 4: Студент
      Добавление проектов (GitHub), олимпиад и навыков: 5: Студент
      Публикация статуса "Ищу стажировку": 5: Студент
    section Поиск вакансий
      Настройка фильтров (стажировка, гибкий график, ментор): 5: Студент
      Просмотр карточки с академическими требованиями: 4: Студент
      Отклик с сопроводительным письмом: 5: Студент
    section Отбор и Результат
      Получение статуса "Скрининг пройден": 4: Студент
      Загрузка решения тестового задания: 4: Студент
      Прохождение технического интервью: 5: Студент
      Получение оффера в личном кабинете: 5: Студент
```

### Сценарий 2: Работодатель — публикация вакансии и отбор кандидатов

```mermaid
flowchart TD
    A[Регистрация работодателя] --> B[Заполнение профиля компании и программ стажировок]
    B --> C[Публикация вакансии с академическими фильтрами]
    C -->|Критерии: ВУЗ, мин. курс, GPA >= 4.5, стек| D[Публикация в каталоге]
    
    D --> E{Поступление откликов}
    E --> F[Входящий отклик в статусе 'Новый']
    
    F --> G[Скрининг профиля: ВУЗ, GPA, проекты GitHub]
    G -->|Кандидат не подошел| H[Статус: Отказ с обратной связью]
    G -->|Кандидат подходит| I[Статус: Скрининг / Отправка тестового]
    
    I --> J[Проверка тестового задания]
    J -->|Успешно| K[Статус: Техническое интервью]
    J -->|Неуспешно| H
    
    K --> L{Финальное решение}
    L -->|Оффер| M[Статус: Оффер выставлен]
    L -->|Отказ| H
```

---

## 4. Схема сущностей данных (Entity Relationship Diagram — ERD)

```mermaid
erDiagram
    User ||--o| StudentProfile : "has profile (ROLE=STUDENT)"
    User ||--o| CompanyProfile : "has profile (ROLE=EMPLOYER)"
    User ||--o{ Session : "authenticates"
    User ||--o{ Account : "OAuth links"

    StudentProfile ||--o{ AcademicAchievement : "has achievements"
    StudentProfile ||--o{ AcademicProject : "has projects"
    StudentProfile ||--o{ StudentSkill : "has skills"
    StudentProfile ||--o{ JobApplication : "submits applications"

    CompanyProfile ||--o{ JobPosting : "publishes"

    JobPosting ||--o{ JobApplication : "receives"
    JobPosting ||--o{ JobPostingSkill : "requires"

    JobApplication ||--o{ ApplicationStatusHistory : "tracks audit trail"
    User ||--o{ ApplicationStatusHistory : "status changed by"

    Skill ||--o{ StudentSkill : "referenced by"
    Skill ||--o{ JobPostingSkill : "referenced by"

    User {
        string id PK
        string email UK
        string passwordHash
        enum role "STUDENT | EMPLOYER | ADMIN"
        enum status "ACTIVE | SUSPENDED | PENDING_VERIFICATION"
        datetime emailVerified
        datetime createdAt
        datetime updatedAt
    }

    StudentProfile {
        string id PK
        string userId FK, UK
        string firstName
        string lastName
        string phone
        string avatarUrl
        string university
        string faculty
        string fieldOfStudy
        enum degreeLevel "BACHELOR | MASTER | SPECIALIST | POSTGRADUATE"
        int currentCourse
        int graduationYear
        float gpa
        enum gpaScale "SCALE_4 | SCALE_5"
        enum searchStatus "LOOKING_FOR_INTERNSHIP | LOOKING_FOR_JOB | NOT_LOOKING"
        string bio
        string githubUrl
        string portfolioUrl
        string linkedinUrl
        datetime createdAt
        datetime updatedAt
    }

    AcademicAchievement {
        string id PK
        string studentProfileId FK
        enum type "OLYMPIAD | PUBLICATION | CONFERENCE | HACKATHON | SCHOLARSHIP"
        string title
        string description
        int year
        string verificationUrl
    }

    AcademicProject {
        string id PK
        string studentProfileId FK
        string title
        string description
        string role
        string repoUrl
        string demoUrl
        string[] technologies
        datetime createdAt
    }

    Skill {
        string id PK
        string name UK
        enum category "HARD | SOFT | LANGUAGE"
    }

    StudentSkill {
        string id PK
        string studentProfileId FK
        string skillId FK
        enum level "BEGINNER | INTERMEDIATE | ADVANCED"
    }

    CompanyProfile {
        string id PK
        string userId FK, UK
        string companyName
        string slug UK
        string logoUrl
        string website
        string industry
        string description
        boolean verified
        string internshipProgramsDescription
        datetime createdAt
        datetime updatedAt
    }

    JobPosting {
        string id PK
        string companyProfileId FK
        string title
        string slug
        string description
        enum employmentType "INTERNSHIP | PART_TIME | FULL_TIME | FLEXIBLE"
        enum locationType "REMOTE | HYBRID | ONSITE"
        string city
        int salaryMin
        int salaryMax
        string currency
        boolean isStipend
        boolean hasMentorship
        string testTaskDescription
        string[] targetMajors
        int minCourse
        float minGpa
        enum status "DRAFT | PUBLISHED | ARCHIVED | CLOSED"
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    JobPostingSkill {
        string id PK
        string jobPostingId FK
        string skillId FK
        boolean isRequired
    }

    JobApplication {
        string id PK
        string jobPostingId FK
        string studentProfileId FK
        string coverLetter
        enum status "NEW | SCREENING | TEST_TASK | INTERVIEW | OFFER | REJECTED"
        string testSubmissionUrl
        string employerFeedback
        datetime appliedAt
        datetime updatedAt
    }

    ApplicationStatusHistory {
        string id PK
        string applicationId FK
        string changedByUserId FK
        enum fromStatus "NEW | SCREENING | TEST_TASK | INTERVIEW | OFFER | REJECTED"
        enum toStatus "NEW | SCREENING | TEST_TASK | INTERVIEW | OFFER | REJECTED"
        string note
        datetime changedAt
    }
```

---

## 5. Ролевая модель и матрица доступа (RBAC)

| Ресурс / Действие | Гость | Студент (`STUDENT`) | Работодатель (`EMPLOYER`) | Администратор (`ADMIN`) |
| :--- | :---: | :---: | :---: | :---: |
| Просмотр каталога вакансий | ✅ | ✅ | ✅ | ✅ |
| Поиск и фильтрация по GPA / ВУЗам | ❌ (превью) | ✅ | ✅ | ✅ |
| Просмотр профиля компании | ✅ | ✅ | ✅ | ✅ |
| Создание / редактирование своего резюме | ❌ | ✅ (только свое) | ❌ | ✅ (модерация) |
| Отклик на вакансию | ❌ | ✅ | ❌ | ❌ |
| Создание и редактирование вакансий | ❌ | ❌ | ✅ (только своей компании) | ✅ |
| Просмотр откликов на вакансию | ❌ | ❌ | ✅ (на свои вакансии) | ✅ |
| Смена статуса отклика (Kanban) | ❌ | ❌ | ✅ | ✅ |
| Верификация компании / модерация | ❌ | ❌ | ❌ | ✅ |

---

## 6. Ключевые продуктовые метрики (KPI)

1. **Конверсия студента в отклик (CR):** доля зарегистрированных студентов с заполненным профилем (ВУЗ, GPA, >= 1 проект), отправивших минимум 1 отклик.
2. **Time-to-First-Response:** среднее время отклика работодателя на академическую анкету студента (целевой показатель < 72 часов).
3. **Релевантность кандидатов:** процент кандидатов, переведенных со стадии `Новый` на стадию `Тестовое`/`Интервью` (цель > 35% благодаря фильтрации по ВУЗу и GPA).
4. **Завершенность профиля (Profile Completeness Score):** процент студентов с заполненным GPA, подтвержденными проектами и списком хард-скиллов.
