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
