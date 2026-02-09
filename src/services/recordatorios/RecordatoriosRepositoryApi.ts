// src/services/recordatorios/RecordatoriosRepositoryApi.ts

import api from '../api';
import { 
  ReminderEndpoints 
} from './RecordatoriosRepository';

import type { 
  Reminder, 
  CreateReminderRequest, 
  UpdateReminderRequest, 
  IRecordatoriosRepository 
} from './RecordatoriosRepository';

export class RecordatoriosRepositoryApi implements IRecordatoriosRepository {
  async getAll(): Promise<Reminder[]> {
    const response = await api.get<Reminder[]>(ReminderEndpoints.LIST);
    return response.data;
  }

  async getById(id: number): Promise<Reminder> {
    const response = await api.get<Reminder>(ReminderEndpoints.GET(id));
    return response.data;
  }

  async create(data: CreateReminderRequest): Promise<Reminder> {
    const response = await api.post<Reminder>(ReminderEndpoints.CREATE, data);
    return response.data;
  }

  async update(id: number, data: UpdateReminderRequest): Promise<Reminder> {
    const response = await api.put<Reminder>(ReminderEndpoints.UPDATE(id), data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(ReminderEndpoints.DELETE(id));
  }
}

export const recordatoriosRepository: IRecordatoriosRepository = new RecordatoriosRepositoryApi();
