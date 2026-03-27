type SearchValue = string | number | null | undefined;

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesSearchQuery(normalizedQuery: string, ...parts: SearchValue[]): boolean {
  if (!normalizedQuery) {
    return true;
  }
  const haystack = parts
    .map((part) => String(part ?? '').toLowerCase())
    .join(' ')
    .trim();
  return haystack.includes(normalizedQuery);
}

export function filterBySearchQuery<T>(
  items: T[],
  query: string,
  getSearchParts: (item: T) => SearchValue[],
): T[] {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) {
    return items;
  }
  return items.filter((item) => matchesSearchQuery(normalizedQuery, ...getSearchParts(item)));
}
