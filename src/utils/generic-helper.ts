import { TicketStatus, type Ticket } from '@/models';

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

export function formatSnakeToNaturalCase(str: string): string {
  return str.replace('_', ' ').replace(/[a-z]/, (firstLetter) => firstLetter.toUpperCase());
}

export function calculateDeadline(ticket: Ticket) {
  if (!ticket.dueAt) return '—';

  if (ticket.status !== TicketStatus.Pending && ticket.status !== TicketStatus.InProgress) {
    return '—';
  }

  const deadline = new Date(ticket.dueAt);
  const today = new Date();

  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Atrasado';
  }

  return `${diffDays} dias restantes`;
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
    const firstInitial = input.firstName?.charAt(0) || '';
    const lastInitial = input.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  return '??';
}
