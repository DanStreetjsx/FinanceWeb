// src/services/configuracion/ConfiguracionRepository.ts

export interface UserSettings {
  id: number;
  user_id: number;
  phone_prefix: string;
  default_currency: string;
  timezone: string;
  locale: string;
  start_of_week: number;
  notify_daily_reminder: boolean;
  notify_budget_warnings: boolean;
  daily_reminder_time?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateSettingsRequest {
  phone_prefix?: string;
  default_currency?: string;
  timezone?: string;
  locale?: string;
  start_of_week?: number;
  notify_daily_reminder?: boolean;
  notify_budget_warnings?: boolean;
  daily_reminder_time?: string;
}

export const SettingsEndpoints = {
  GET: '/user/settings',
  UPDATE: '/user/settings',
} as const;

export interface IConfiguracionRepository {
  getSettings(): Promise<UserSettings>;
  updateSettings(data: UpdateSettingsRequest): Promise<UserSettings>;
}
