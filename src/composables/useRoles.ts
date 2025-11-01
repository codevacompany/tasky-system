import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { RoleName } from '@/models/role';

export function useRoles() {
  const userStore = useUserStore();
  const user = computed(() => userStore.user);

  const hasRole = (roleName: RoleName): boolean => {
    return user.value?.role?.name === roleName;
  };

  const hasAnyRole = (roleNames: RoleName[]): boolean => {
    const userRole = user.value?.role?.name;
    return userRole ? roleNames.includes(userRole) : false;
  };

  const isGlobalAdmin = computed(() => hasRole(RoleName.GlobalAdmin));
  const isTenantAdmin = computed(() => hasRole(RoleName.TenantAdmin));
  const isSupervisor = computed(() => hasRole(RoleName.Supervisor));
  const isUser = computed(() => hasRole(RoleName.User));
  const isAdmin = computed(() => hasAnyRole([RoleName.GlobalAdmin, RoleName.TenantAdmin]));

  const getUserRole = (): RoleName | undefined => {
    return user.value?.role?.name;
  };

  return {
    hasRole,
    hasAnyRole,
    isGlobalAdmin,
    isTenantAdmin,
    isSupervisor,
    isUser,
    isAdmin,
    getUserRole,
  };
}
