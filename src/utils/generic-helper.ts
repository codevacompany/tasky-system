import type { Ticket } from '@/models';
import { DefaultTicketStatus } from '@/models';
import { getBusinessDayDifference } from '@/utils/date';

export function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function formatCamelCase(str: string) {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

export function formatSnakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function formatSnakeToNaturalCase(str: string | undefined | null): string {
  if (!str) return '';

  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const MS_PER_HOUR = 1000 * 60 * 60;

export interface DeadlineInfo {
  isValid: boolean;
  isOverdue: boolean;
  businessDaysRemaining: number;
  hoursDifference: number; // positive when remaining, negative when overdue
  message: string;
}

export const getDeadlineInfo = (
  dueAt: string | Date,
  referenceDate: Date = new Date(),
): DeadlineInfo => {
  const deadline = typeof dueAt === 'string' ? new Date(dueAt) : new Date(dueAt);
  const reference = new Date(referenceDate);

  if (Number.isNaN(deadline.getTime()) || Number.isNaN(reference.getTime())) {
    return {
      isValid: false,
      isOverdue: false,
      businessDaysRemaining: 0,
      hoursDifference: 0,
      message: '---',
    };
  }

  const msDiff = deadline.getTime() - reference.getTime();
  const isOverdue = msDiff < 0;
  const hoursRemaining = !isOverdue ? Math.ceil(msDiff / MS_PER_HOUR) : 0;
  const hoursOverdue = isOverdue ? Math.ceil(Math.abs(msDiff) / MS_PER_HOUR) : 0;
  const businessDays = getBusinessDayDifference(deadline, reference);
  const isLessThanOneDay = !isOverdue && msDiff < MS_PER_HOUR * 24;

  let message = '';

  if (isOverdue) {
    if (hoursOverdue < 24) {
      message = hoursOverdue <= 1 ? 'Atrasado há 1 hora' : `Atrasado há ${hoursOverdue} horas`;
    } else {
      const daysOverdue = Math.ceil(hoursOverdue / 24);
      message = daysOverdue <= 1 ? 'Atrasado há 1 dia' : `Atrasado há ${daysOverdue} dias`;
    }
  } else {
    if (isLessThanOneDay) {
      const remainingHours = Math.max(1, hoursRemaining);
      message = remainingHours === 1 ? '1 hora restante' : `${remainingHours} horas restantes`;
    } else {
      message = businessDays === 1 ? '1 dia restante' : `${businessDays} dias restantes`;
    }
  }

  return {
    isValid: true,
    isOverdue,
    businessDaysRemaining: isOverdue ? 0 : Math.max(0, businessDays),
    hoursDifference: isOverdue ? -hoursOverdue : hoursRemaining,
    message,
  };
};

export function calculateDeadline(ticket: Ticket) {
  if (!ticket.dueAt) return '';

  const currentStatus = ticket.ticketStatus?.key || ticket.status || '';

  if (
    currentStatus === DefaultTicketStatus.Completed ||
    currentStatus === DefaultTicketStatus.Canceled ||
    currentStatus === DefaultTicketStatus.Rejected
  ) {
    return '';
  }

  const info = getDeadlineInfo(ticket.dueAt);

  if (!info.isValid) {
    return '';
  }

  return info.message;
}

export function formatTimeInSeconds(seconds?: number) {
  if (seconds === undefined || seconds === null) return '0 segundos';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    const hourText = hours > 0 ? ` e ${hours} ${hours === 1 ? 'hora' : 'horas'}` : '';
    return `${days} ${days === 1 ? 'dia' : 'dias'}${hourText}`;
  } else if (hours > 0) {
    const minuteText = minutes > 0 ? ` e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}` : '';
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}${minuteText}`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else {
    return `${secs} ${secs === 1 ? 'segundo' : 'segundos'}`;
  }
}

export function formatTimeInSecondsCompact(seconds?: number) {
  if (seconds === undefined || seconds === null) return '0s';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

export function formatTimeCompact(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  } else {
    return `${minutes}min`;
  }
}

export function formatTimeShort(seconds?: number): string {
  if (seconds === undefined || seconds === null || seconds === 0) return '0s';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return `${secs}s`;
  }
}

export function enumToOptions(enumObj: object): { value: string; label: string }[] {
  const filteredEntries = Object.entries(enumObj).filter(([key]) => isNaN(Number(key)));

  const options = filteredEntries.map((entry) => {
    const value = entry[1] as string;
    return {
      value: value,
      label: formatSnakeToNaturalCase(value),
    };
  });

  return options;
}

export function getUserInitials(
  input?: { firstName?: string; lastName?: string } | string,
): string {
  if (!input) return '??';

  if (typeof input === 'string') {
    return input
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  if ('firstName' in input && 'lastName' in input) {
    const firstName = input.firstName?.trim() || '';
    const lastName = input.lastName?.trim() || '';
    const firstInitial = firstName.charAt(0);
    const secondInitial = lastName.charAt(0) || firstName.charAt(1);
    const initials = `${firstInitial}${secondInitial}`.trim();
    return initials ? initials.toUpperCase() : '??';
  }

  return '??';
}

export const DEFAULT_AVATAR_PALETTE = [
  '#ef4444', // red
  '#f97316', // orange
  '#7d14e5', // purple
  '#84cc16', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#1e3a8a', // dark blue
] as const;

export function getAvatarColor(
  seed: string,
  palette: readonly string[] = DEFAULT_AVATAR_PALETTE,
): string {
  if (!seed || palette.length === 0) return palette[0] || '#0ea5e9';

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function getAvatarStyle(
  seed: string,
  palette: readonly string[] = DEFAULT_AVATAR_PALETTE,
): { backgroundColor: string } {
  return {
    backgroundColor: getAvatarColor(seed, palette),
  };
}
