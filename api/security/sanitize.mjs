const ESCAPE_RE = /[&<>"'`]/g;
const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
};

export function sanitizeString(value) {
  return value.replace(ESCAPE_RE, (ch) => ESCAPE_MAP[ch]);
}

export function sanitizeDeep(value) {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeDeep(v));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitizeDeep(v)]),
    );
  }
  return value;
}
