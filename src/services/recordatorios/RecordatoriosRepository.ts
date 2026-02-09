// src/services/recordatorios/RecordatoriosRepository.ts

export interface Reminder {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  amount?: number;
  due_date: string;
  is_completed: boolean;
  frequency?: 'once' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  amount?: number;
  due_date: string;
  frequency?: 'once' | 'weekly' | 'monthly';
}

export interface UpdateReminderRequest extends Partial<CreateReminderRequest> {
  is_completed?: boolean;
}

export const ReminderEndpoints = {
  LIST: '/reminders',
  CREATE: '/reminders',
  GET: (id: number) => `/reminders/${id}`,
  UPDATE: (id: number) => `/reminders/${id}`,
  DELETE: (id: number) => `/reminders/${id}`,
} as const;

export interface IRecordatoriosRepository {
  getAll(): Promise<Reminder[]>;
  getById(id: number): Promise<Reminder>;
  create(data: CreateReminderRequest): Promise<Reminder>;
  update(id: number, data: UpdateReminderRequest): Promise<Reminder>;
  delete(id: number): Promise<void>;
}
