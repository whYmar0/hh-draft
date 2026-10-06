import { describe, it, expect } from 'vitest';
import { canUserPerformAction, UserRole } from '@/lib/auth/rbac';

describe('RBAC Access Control Rules', () => {
  describe('STUDENT role permissions', () => {
    it('allows student to edit their own profile', () => {
      expect(
        canUserPerformAction({
          userRole: 'STUDENT',
          userId: 'user-1',
          action: 'EDIT_STUDENT_PROFILE',
          resourceOwnerId: 'user-1',
        })
      ).toBe(true);
    });

    it('denies student editing another student profile', () => {
      expect(
        canUserPerformAction({
          userRole: 'STUDENT',
          userId: 'user-1',
          action: 'EDIT_STUDENT_PROFILE',
          resourceOwnerId: 'user-2',
        })
      ).toBe(false);
    });

    it('allows student to apply for vacancies', () => {
      expect(
        canUserPerformAction({
          userRole: 'STUDENT',
          userId: 'user-1',
          action: 'APPLY_TO_JOB',
        })
      ).toBe(true);
    });

    it('denies student creating job postings', () => {
      expect(
        canUserPerformAction({
          userRole: 'STUDENT',
          userId: 'user-1',
          action: 'CREATE_JOB_POSTING',
        })
      ).toBe(false);
    });

    it('denies student changing application kanban status', () => {
      expect(
        canUserPerformAction({
          userRole: 'STUDENT',
          userId: 'user-1',
          action: 'CHANGE_APPLICATION_STATUS',
        })
      ).toBe(false);
    });
  });

  describe('EMPLOYER role permissions', () => {
    it('allows employer to create job postings', () => {
      expect(
        canUserPerformAction({
          userRole: 'EMPLOYER',
          userId: 'emp-1',
          action: 'CREATE_JOB_POSTING',
        })
      ).toBe(true);
    });

    it('allows employer to update status of applicants on their job postings', () => {
      expect(
        canUserPerformAction({
          userRole: 'EMPLOYER',
          userId: 'emp-1',
          action: 'CHANGE_APPLICATION_STATUS',
          resourceOwnerId: 'emp-1',
        })
      ).toBe(true);
    });

    it('denies employer updating status of applicants on other employers job postings', () => {
      expect(
        canUserPerformAction({
          userRole: 'EMPLOYER',
          userId: 'emp-1',
          action: 'CHANGE_APPLICATION_STATUS',
          resourceOwnerId: 'emp-2',
        })
      ).toBe(false);
    });

    it('denies employer applying to job postings', () => {
      expect(
        canUserPerformAction({
          userRole: 'EMPLOYER',
          userId: 'emp-1',
          action: 'APPLY_TO_JOB',
        })
      ).toBe(false);
    });
  });

  describe('ADMIN role permissions', () => {
    it('grants admin permissions on all actions', () => {
      expect(
        canUserPerformAction({
          userRole: 'ADMIN',
          userId: 'admin-1',
          action: 'CREATE_JOB_POSTING',
        })
      ).toBe(true);
      expect(
        canUserPerformAction({
          userRole: 'ADMIN',
          userId: 'admin-1',
          action: 'EDIT_STUDENT_PROFILE',
          resourceOwnerId: 'any-user',
        })
      ).toBe(true);
      expect(
        canUserPerformAction({
          userRole: 'ADMIN',
          userId: 'admin-1',
          action: 'CHANGE_APPLICATION_STATUS',
          resourceOwnerId: 'any-emp',
        })
      ).toBe(true);
    });
  });
});
