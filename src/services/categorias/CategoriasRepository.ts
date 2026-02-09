// src/services/categorias/CategoriasRepository.ts

export interface Category {
  id: number;
  user_id: number;
  name: string;
  icon?: string;
  color?: string;
  type: 'expense' | 'income' | 'both';
  parent_id?: number;
  parent?: Category;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  parent_id?: number;
  icon?: string;
  color?: string;
  type?: 'expense' | 'income' | 'both';
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export const CategoryEndpoints = {
  LIST: '/categories',
  CREATE: '/categories',
  GET: (id: number) => `/categories/${id}`,
  UPDATE: (id: number) => `/categories/${id}`,
  DELETE: (id: number) => `/categories/${id}`,
} as const;

export interface ICategoriasRepository {
  getAll(filters?: { type?: 'expense' | 'income' | 'both' }): Promise<Category[]>;
  getById(id: number): Promise<Category>;
  create(data: CreateCategoryRequest): Promise<Category>;
  update(id: number, data: UpdateCategoryRequest): Promise<Category>;
  delete(id: number): Promise<void>;
}
