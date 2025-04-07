export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'Agora';
  }

  if (diffInMinutes < 60) {
    return `Há ${diffInMinutes}min`;
  }

  if (diffInHours < 24) {
    return `Há ${diffInHours}h`;
  }

  if (diffInDays < 30) {
    return `Há ${diffInDays}d`;
  }

  if (diffInMonths < 12) {
    return `Há ${diffInMonths}m`;
  }

  return `Há ${diffInYears}a`;
};
