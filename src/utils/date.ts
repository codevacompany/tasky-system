export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString().slice(-2);
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

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

export const formatDateToPortuguese = (dateString: string): string => {
  const date = new Date(dateString);

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${day} de ${month}`;
};

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const getBusinessDayDifference = (
  targetDate: string | Date,
  referenceDate: Date = new Date(),
): number => {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : new Date(targetDate);
  const reference = new Date(referenceDate);

  if (Number.isNaN(target.getTime()) || Number.isNaN(reference.getTime())) {
    return 0;
  }

  const direction = target >= reference ? 1 : -1;
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const current = new Date(start);
  let businessDays = 0;

  while ((direction === 1 && current < end) || (direction === -1 && current > end)) {
    current.setDate(current.getDate() + direction);
    if (!isWeekend(current)) {
      businessDays += direction;
    }
  }

  return businessDays;
};
