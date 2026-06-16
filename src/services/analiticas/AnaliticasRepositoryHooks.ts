// src/services/analiticas/AnaliticasRepositoryHooks.ts

import { useQuery } from '@tanstack/react-query';

import { analiticasRepository } from './AnaliticasRepositoryApi';

const QUERY_KEYS = {
  BURN_RATE: 'burn-rate',
  DASHBOARD_DATA: 'dashboard-data',
};

export const useBurnRate = () =>
  useQuery({
    queryKey: [QUERY_KEYS.BURN_RATE],
    queryFn: () => analiticasRepository.getBurnRate(),
  });

export const useDashboardData = (month?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_DATA, month ?? 'current'],
    queryFn: () => analiticasRepository.getDashboardData(month),
  });
