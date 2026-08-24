export const QUERY_LIMITS = [20, 25, 50, 100, 500] as const;
export type QueryLimit = (typeof QUERY_LIMITS)[number];

export interface QueryContract<TFilter> {
  queryId: string;
  filter: TFilter;
  limit: QueryLimit;
}

export function assertQueryLimit(value: number): asserts value is QueryLimit {
  if (!QUERY_LIMITS.includes(value as QueryLimit)) {
    throw new RangeError('Unsupported query limit.');
  }
}

export function createQueryContract<TFilter>(queryId: string, filter: TFilter, limit: number): QueryContract<TFilter> {
  assertQueryLimit(limit);
  return { queryId, filter, limit };
}
