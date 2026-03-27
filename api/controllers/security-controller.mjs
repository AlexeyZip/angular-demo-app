import { issueCsrfToken } from '../security/csrf.mjs';

export function getCsrfToken(_req, res) {
  const token = issueCsrfToken(res);
  res.json({ token });
}
