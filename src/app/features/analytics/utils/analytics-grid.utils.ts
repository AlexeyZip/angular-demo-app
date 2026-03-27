import { ColDef } from 'ag-grid-community';
import { AnalyticsProjectRowDto } from '../../../core/services/analytics-api.service';

export function buildAnalyticsColumnDefs(
  translate: (key: string) => string,
): ColDef<AnalyticsProjectRowDto>[] {
  return [
    { field: 'name', headerName: translate('analytics.table.project'), minWidth: 220 },
    { field: 'code', headerName: translate('analytics.table.code'), width: 130 },
    { field: 'owner', headerName: translate('analytics.table.owner'), width: 170 },
    {
      field: 'budget',
      headerName: translate('analytics.table.budget'),
      valueFormatter: (p) => `$${Number(p.value ?? 0).toLocaleString()}`,
      width: 140,
    },
    {
      field: 'riskLevel',
      headerName: translate('analytics.table.risk'),
      width: 120,
      valueFormatter: (p) => translate(`risk.${p.value as string}`),
    },
    { field: 'progress', headerName: translate('analytics.table.progress'), width: 130 },
    { field: 'velocity', headerName: translate('analytics.table.velocity'), width: 120 },
    {
      field: 'updatedAt',
      headerName: translate('analytics.table.updated'),
      valueFormatter: (p) => new Date(p.value as string).toLocaleDateString(),
      width: 130,
    },
  ];
}
