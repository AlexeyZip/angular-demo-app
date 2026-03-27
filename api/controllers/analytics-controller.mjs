import { getAnalyticsOverview } from '../services/data-service.mjs';

export function overview(_req, res) {
  res.json(getAnalyticsOverview());
}
