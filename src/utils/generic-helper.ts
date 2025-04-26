import { TicketStatus, type Ticket } from "@/models";

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

export function calculateDeadline (ticket: Ticket) {
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
};
