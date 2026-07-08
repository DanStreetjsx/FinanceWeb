import api from '../api';
import { AdminMetricsEndpoints } from './AdminMetricsRepository';

import type { AdminMetricsData, IAdminMetricsRepository } from './AdminMetricsRepository';

export class AdminMetricsRepositoryApi implements IAdminMetricsRepository {
  async getMetrics(days = 30): Promise<AdminMetricsData> {
    const response = await api.get<AdminMetricsData>(AdminMetricsEndpoints.METRICS, {
      params: { days },
    });

    return response.data;
  }
}

export const adminMetricsRepository: IAdminMetricsRepository = new AdminMetricsRepositoryApi();
