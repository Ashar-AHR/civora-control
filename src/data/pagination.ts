export interface QueryPage<T> {
  items: readonly T[];
  nextCursor?: string;
  source: 'SERVER';
}

export function pageFromItems<T extends { id: string }>(items: readonly T[], requestedLimit: number): QueryPage<T> {
  const visible = items.slice(0, requestedLimit);
  const last = visible.at(-1);
  return {
    items: visible,
    source: 'SERVER',
    ...(items.length > requestedLimit && last ? { nextCursor: last.id } : {}),
  };
}
