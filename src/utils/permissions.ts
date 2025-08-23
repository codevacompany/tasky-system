import { useUserStore } from '@/stores/user';

export const usePermissions = () => {
  const userStore = useUserStore();

  const hasPermission = (permission: string): boolean => {
    if (!userStore.user?.permissions) {
      return false;
    }
    return userStore.user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!userStore.user?.permissions) {
      return false;
    }
    return permissions.some((permission) => userStore.user!.permissions!.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!userStore.user?.permissions) {
      return false;
    }
    return permissions.every((permission) => userStore.user!.permissions!.includes(permission));
  };

  const getUserPermissions = (): string[] => {
    return userStore.user?.permissions || [];
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
  };
};

// Permission constants for easy reference
export const PERMISSIONS = {
  VIEW_BASIC_ANALYTICS: 'view_basic_analytics',
  VIEW_ADVANCED_ANALYTICS: 'view_advanced_analytics',
  EXPORT_REPORTS: 'export_reports',
  VIEW_DEPARTMENT_ANALYTICS: 'view_department_analytics',
  VIEW_USERS_ANALYTICS: 'view_users_analytics',
  EMAIL_NOTIFICATIONS: 'email_notifications',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
