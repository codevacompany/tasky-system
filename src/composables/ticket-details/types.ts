import type { Department, User } from '@/models';

export type DepartmentUserSelection = {
  department: Department | null;
  user: User | null;
};

export interface SpecialUpdateEvent {
  data?: {
    reason?: string;
    content?: string;
    id?: string | number;
  };
}
