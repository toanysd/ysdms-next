export const normalizeCode = (s?: string | null) =>
  (s ?? '').toUpperCase().replace(/[\s\-_]/g, '').trim();
