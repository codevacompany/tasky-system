/** Shared tag chip colors — darker fill in dark mode so tint stays visible. */
export function getTagChipColors(color: string | undefined | null, isDark: boolean) {
  const base = color || '#6B7280';
  return {
    backgroundColor: `${base}${isDark ? '33' : '12'}`,
    borderColor: base,
    color: base,
  };
}
