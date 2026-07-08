export interface AdminMetric {
  value: number;
  previous_value: number;
  change_percent: number;
}

export interface AdminMetricsData {
  period: {
    days: number;
    start_date: string;
    end_date: string;
  };
  summary: {
    web_visits: AdminMetric;
    unique_visitors: AdminMetric;
    web_users: AdminMetric;
    whatsapp_users: AdminMetric;
    whatsapp_inbound_messages: AdminMetric;
    whatsapp_outbound_messages: AdminMetric;
    whatsapp_delivery_rate: {
      value: number;
      previous_value: number;
    };
    transactions: AdminMetric;
  };
  charts: {
    daily_activity: Array<{
      date: string;
      visits: number;
      users: number;
      whatsapp_inbound: number;
      whatsapp_outbound: number;
    }>;
    top_pages: Array<{
      path: string;
      visits: number;
      unique_visitors: number;
    }>;
    message_status: Array<{
      label: string;
      value: number;
    }>;
    registration_sources: Array<{
      label: string;
      value: number;
    }>;
  };
  recent: {
    users: Array<{
      id: number;
      name: string;
      phone: string;
      role: string;
      created_at: string;
    }>;
    visits: Array<{
      path: string;
      title?: string;
      created_at: string;
    }>;
  };
}

export const AdminMetricsEndpoints = {
  METRICS: '/admin/metrics',
} as const;

export interface IAdminMetricsRepository {
  getMetrics(days?: number): Promise<AdminMetricsData>;
}
