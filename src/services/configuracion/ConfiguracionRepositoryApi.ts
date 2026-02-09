// src/services/configuracion/ConfiguracionRepositoryApi.ts

import api from '../api';
import { 
  SettingsEndpoints 
} from './ConfiguracionRepository';

import type { 
  UserSettings, 
  UpdateSettingsRequest, 
  IConfiguracionRepository 
} from './ConfiguracionRepository';

export class ConfiguracionRepositoryApi implements IConfiguracionRepository {
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<UserSettings>(SettingsEndpoints.GET);
    return response.data;
  }

  async updateSettings(data: UpdateSettingsRequest): Promise<UserSettings> {
    const response = await api.put<UserSettings>(SettingsEndpoints.UPDATE, data);
    return response.data;
  }
}

export const configuracionRepository: IConfiguracionRepository = new ConfiguracionRepositoryApi();
