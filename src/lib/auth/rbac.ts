export type UserRole = 'STUDENT' | 'EMPLOYER' | 'ADMIN';

export type UserAction =
  | 'VIEW_PUBLIC_VACANCIES'
  | 'EDIT_STUDENT_PROFILE'
  | 'APPLY_TO_JOB'
  | 'VIEW_OWN_APPLICATIONS'
  | 'CREATE_JOB_POSTING'
  | 'EDIT_JOB_POSTING'
  | 'VIEW_JOB_APPLICATIONS'
  | 'CHANGE_APPLICATION_STATUS'
  | 'MANAGE_COMPANIES'
  | 'ADMIN_ACCESS';

export interface CheckPermissionParams {
  userRole: UserRole;
  userId: string;
  action: UserAction;
  resourceOwnerId?: string;
}

/**
 * Проверка прав доступа пользователя к выполнению конкретного действия (RBAC + ABAC)
 */
export function canUserPerformAction({
  userRole,
  userId,
  action,
  resourceOwnerId,
}: CheckPermissionParams): boolean {
  // Администратор имеет неограниченный доступ ко всем действиям системы
  if (userRole === 'ADMIN') {
    return true;
  }

  switch (action) {
    case 'VIEW_PUBLIC_VACANCIES':
      return true;

    case 'EDIT_STUDENT_PROFILE':
      // Только студент и только свой собственный профиль
      return userRole === 'STUDENT' && resourceOwnerId === userId;

    case 'APPLY_TO_JOB':
      // Только студент может откликаться на вакансии
      return userRole === 'STUDENT';

    case 'VIEW_OWN_APPLICATIONS':
      return userRole === 'STUDENT' && resourceOwnerId === userId;

    case 'CREATE_JOB_POSTING':
      // Только работодатель может создавать вакансии
      return userRole === 'EMPLOYER';

    case 'EDIT_JOB_POSTING':
      // Работодатель может редактировать только вакансии своей компании
      return userRole === 'EMPLOYER' && resourceOwnerId === userId;

    case 'VIEW_JOB_APPLICATIONS':
      // Работодатель может просматривать отклики только на свои вакансии
      return userRole === 'EMPLOYER' && resourceOwnerId === userId;

    case 'CHANGE_APPLICATION_STATUS':
      // Работодатель может менять статус отклика только для своих вакансий
      return userRole === 'EMPLOYER' && resourceOwnerId === userId;

    case 'MANAGE_COMPANIES':
    case 'ADMIN_ACCESS':
      return false;

    default:
      return false;
  }
}
