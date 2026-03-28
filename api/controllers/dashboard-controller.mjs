import { getDashboardInsights, getDashboardSummary } from '../services/data-service.mjs';

/** Controller (MVC): thin layer over service/model. */
export function getSummary(_req, res) {
  res.json(getDashboardSummary());
}

export function getInsights(_req, res) {
  res.json(getDashboardInsights());
}
