// src/services/categorias/CategoriasRepositoryApi.ts

import api from '../api';
import { 
  CategoryEndpoints 
} from './CategoriasRepository';

import type { 
  Category, 
  ICategoriasRepository, 
  CreateCategoryRequest, 
  UpdateCategoryRequest 
} from './CategoriasRepository';

export class CategoriasRepositoryApi implements ICategoriasRepository {
  async getAll(filters?: { type?: 'expense' | 'income' | 'both' }): Promise<Category[]> {
    const response = await api.get<Category[]>(CategoryEndpoints.LIST, {
      params: filters
    });
    return response.data;
  }

  async getById(id: number): Promise<Category> {
    const response = await api.get<Category>(CategoryEndpoints.GET(id));
    return response.data;
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<Category>(CategoryEndpoints.CREATE, data);
    return response.data;
  }

  async update(id: number, data: UpdateCategoryRequest): Promise<Category> {
    const response = await api.put<Category>(CategoryEndpoints.UPDATE(id), data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(CategoryEndpoints.DELETE(id));
  }
}

export const categoriasRepository: ICategoriasRepository = new CategoriasRepositoryApi();
