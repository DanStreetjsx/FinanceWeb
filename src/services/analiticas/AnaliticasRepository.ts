// src/services/analiticas/AnaliticasRepository.ts

export interface BurnRate {
  total_spent: number;
  daily_average: number;
  days_in_period: number;
  projected_monthly: number;
  budget_status: 'ok' | 'warning' | 'critical';
  remaining_budget?: number;
  days_until_budget_exhausted?: number;
}

export interface DashboardData {
  metrics: {
    income: number;
    expense: number;
    balance: number;
    expense_diff_percent: number;
    previous_month_expense: number;
  };
  history: Array<{
    month: string;
    income: number;
    expense: number;
    savings: number;
    cumulative_balance: number;
  }>;
  categories_breakdown: Array<{
    label: string;
    value: number;
  }>;
  burn_rate: any; // Usar el tipo de BurnRate si es necesario
}

export const AnalyticsEndpoints = {
  BURN_RATE: '/analytics/burn-rate',
  DASHBOARD: '/analytics/dashboard',
} as const;

export interface IAnaliticasRepository {
  getBurnRate(): Promise<BurnRate>;
  getDashboardData(): Promise<DashboardData>;
}
