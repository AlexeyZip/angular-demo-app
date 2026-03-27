import { getDashboardInsights, getDashboardSummary } from '../services/data-service.mjs';

/** Controller (MVC): тонкий слой над сервисом. */
export function getSummary(_req, res) {
  res.json(getDashboardSummary());
}

export function getInsights(_req, res) {
  res.json(getDashboardInsights());
}
