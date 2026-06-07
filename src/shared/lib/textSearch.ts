export function matchesQuery<T extends object>(
  item: T,
  query: string,
  fields: Array<keyof T>,
): boolean {
  if (!query.trim()) return true;
  const needle = query.trim().toLowerCase();
  return fields.some((field) => {
    const value = item[field];
    if (value == null) return false;
    return String(value).toLowerCase().includes(needle);
  });
}
