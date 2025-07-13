import type { Directive } from 'vue';
import { usePermissions } from '@/utils/permissions';

export const vPermission: Directive = {
  mounted(el, binding) {
    const { hasPermission } = usePermissions();
    const permission = binding.value;

    if (!hasPermission(permission)) {
      el.style.display = 'none';
    }
  },
  updated(el, binding) {
    const { hasPermission } = usePermissions();
    const permission = binding.value;

    if (hasPermission(permission)) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  },
};

export const vAnyPermission: Directive = {
  mounted(el, binding) {
    const { hasAnyPermission } = usePermissions();
    const permissions = Array.isArray(binding.value) ? binding.value : [binding.value];

    if (!hasAnyPermission(permissions)) {
      el.style.display = 'none';
    }
  },
  updated(el, binding) {
    const { hasAnyPermission } = usePermissions();
    const permissions = Array.isArray(binding.value) ? binding.value : [binding.value];

    if (hasAnyPermission(permissions)) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  },
};

export const vAllPermissions: Directive = {
  mounted(el, binding) {
    const { hasAllPermissions } = usePermissions();
    const permissions = Array.isArray(binding.value) ? binding.value : [binding.value];

    if (!hasAllPermissions(permissions)) {
      el.style.display = 'none';
    }
  },
  updated(el, binding) {
    const { hasAllPermissions } = usePermissions();
    const permissions = Array.isArray(binding.value) ? binding.value : [binding.value];

    if (hasAllPermissions(permissions)) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  },
};
