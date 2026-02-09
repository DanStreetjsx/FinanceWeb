// src/services/analiticas/AnaliticasRepositoryApi.ts

import api from '../api';
import { 
  AnalyticsEndpoints 
} from './AnaliticasRepository';

import type { 
  BurnRate, 
  DashboardData,
  IAnaliticasRepository 
} from './AnaliticasRepository';

export class AnaliticasRepositoryApi implements IAnaliticasRepository {
  async getBurnRate(): Promise<BurnRate> {
    const response = await api.get<BurnRate>(AnalyticsEndpoints.BURN_RATE);
    return response.data;
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get<DashboardData>(AnalyticsEndpoints.DASHBOARD);
    return response.data;
  }
}

export const analiticasRepository: IAnaliticasRepository = new AnaliticasRepositoryApi();
