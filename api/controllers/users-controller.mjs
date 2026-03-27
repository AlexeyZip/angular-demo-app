import { listUsers } from '../services/data-service.mjs';

export function getUsers(_req, res) {
  res.json(listUsers());
}
