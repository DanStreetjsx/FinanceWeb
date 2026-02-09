// src/services/presupuestos/PresupuestosRepositoryApi.ts

import api from '../api';
import { 
  BudgetEndpoints 
} from './PresupuestosRepository';

import type { 
  Budget, 
  BudgetCategory, 
  CreateBudgetRequest, 
  UpdateBudgetRequest,
  IPresupuestosRepository,
  CreateBudgetCategoryRequest,
  UpdateBudgetCategoryRequest 
} from './PresupuestosRepository';

export class PresupuestosRepositoryApi implements IPresupuestosRepository {
  async getAll(): Promise<Budget[]> {
    const response = await api.get<Budget[]>(BudgetEndpoints.LIST);
    return response.data;
  }

  async getById(id: number): Promise<Budget> {
    const response = await api.get<Budget>(BudgetEndpoints.GET(id));
    return response.data;
  }

  async create(data: CreateBudgetRequest): Promise<Budget> {
    const response = await api.post<Budget>(BudgetEndpoints.CREATE, data);
    return response.data;
  }

  async update(id: number, data: UpdateBudgetRequest): Promise<Budget> {
    const response = await api.put<Budget>(BudgetEndpoints.UPDATE(id), data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(BudgetEndpoints.DELETE(id));
  }

  async getCategories(budgetId: number): Promise<BudgetCategory[]> {
    const response = await api.get<BudgetCategory[]>(BudgetEndpoints.CATEGORIES(budgetId));
    return response.data;
  }

  async addCategory(budgetId: number, data: CreateBudgetCategoryRequest): Promise<BudgetCategory> {
    const response = await api.post<BudgetCategory>(BudgetEndpoints.CATEGORIES(budgetId), data);
    return response.data;
  }

  async updateCategory(budgetId: number, catId: number, data: UpdateBudgetCategoryRequest): Promise<BudgetCategory> {
    const response = await api.put<BudgetCategory>(BudgetEndpoints.CATEGORY_DETAIL(budgetId, catId), data);
    return response.data;
  }

  async deleteCategory(budgetId: number, catId: number): Promise<void> {
    await api.delete(BudgetEndpoints.CATEGORY_DETAIL(budgetId, catId));
  }
}

export const presupuestosRepository: IPresupuestosRepository = new PresupuestosRepositoryApi();
