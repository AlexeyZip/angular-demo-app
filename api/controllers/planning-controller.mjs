import { getPlanningScenario } from '../services/data-service.mjs';

export function scenario(_req, res) {
  res.json(getPlanningScenario());
}
