// src/services/presupuestos/PresupuestosRepository.ts

export interface Budget {
  id: number;
  user_id: number;
  name: string;
  currency: string;
  period: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetRequest {
  name: string;
  currency?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {}

export interface BudgetCategory {
  id: number;
  budget_id: number;
  category_id: number;
  allocated_amount: number;
  category?: {
    id: number;
    name: string;
  };
}

export interface CreateBudgetCategoryRequest {
  category_id: number;
  allocated_amount: number;
}

export interface UpdateBudgetCategoryRequest extends Partial<CreateBudgetCategoryRequest> {}

export const BudgetEndpoints = {
  LIST: '/budgets',
  CREATE: '/budgets',
  GET: (id: number) => `/budgets/${id}`,
  UPDATE: (id: number) => `/budgets/${id}`,
  DELETE: (id: number) => `/budgets/${id}`,
  CATEGORIES: (id: number) => `/budgets/${id}/categories`,
  CATEGORY_DETAIL: (id: number, catId: number) => `/budgets/${id}/categories/${catId}`,
} as const;

export interface IPresupuestosRepository {
  getAll(): Promise<Budget[]>;
  getById(id: number): Promise<Budget>;
  create(data: CreateBudgetRequest): Promise<Budget>;
  update(id: number, data: UpdateBudgetRequest): Promise<Budget>;
  delete(id: number): Promise<void>;
  getCategories(budgetId: number): Promise<BudgetCategory[]>;
  addCategory(budgetId: number, data: CreateBudgetCategoryRequest): Promise<BudgetCategory>;
  updateCategory(budgetId: number, catId: number, data: UpdateBudgetCategoryRequest): Promise<BudgetCategory>;
  deleteCategory(budgetId: number, catId: number): Promise<void>;
}
