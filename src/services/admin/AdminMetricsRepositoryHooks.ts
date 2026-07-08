import { useQuery } from '@tanstack/react-query';

import { adminMetricsRepository } from './AdminMetricsRepositoryApi';

const QUERY_KEYS = {
  ADMIN_METRICS: 'admin-metrics',
};

export const useAdminMetrics = (days = 30) =>
  useQuery({
    queryKey: [QUERY_KEYS.ADMIN_METRICS, days],
    queryFn: () => adminMetricsRepository.getMetrics(days),
  });
