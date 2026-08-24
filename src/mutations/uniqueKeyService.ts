export function normalizeBusinessKey(value: string): string {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, '-');
  if (!/^[A-Z0-9][A-Z0-9._-]{0,79}$/.test(normalized)) throw new Error('Invalid business key.');
  return normalized;
}

export function uniqueKeyDocumentId(namespace: string, key: string): string {
  return `${normalizeBusinessKey(namespace)}__${normalizeBusinessKey(key)}`;
}
