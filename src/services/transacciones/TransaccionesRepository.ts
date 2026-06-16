// src/services/transacciones/TransaccionesRepository.ts

import type { Category } from 'src/services/categorias/CategoriasRepository';

export interface Merchant {
  id: number;
  name: string;
}

export interface TransactionSplit {
  id: number;
  amount: number;
  category_id?: number;
  category?: Category;
}

export interface Transaction {
  id: number;
  user_id: number;
  category_id?: number;
  merchant_id?: number;
  amount: number;
  currency: string;
  operation_at: string;
  detail?: string;
  notes?: string;
  status: string;
  merchant_name?: string;
  source?: string;
  category?: Category;
  merchant?: Merchant;
  splits?: TransactionSplit[];
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionRequest {
  category_id?: number | null;
  merchant_id?: number | null;
  amount: number;
  currency: string;
  operation_at: string;
  detail?: string;
  notes?: string;
  status?: string;
  merchant_name?: string;
  source?: string;
  type: 'income' | 'expense';
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {}

export interface TransactionFilter {
  start_date?: string;
  end_date?: string;
  category_id?: number;
  type?: 'income' | 'expense';
  direction?: 'inbound' | 'outbound';
  source?: string;
  per_page?: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const TransactionEndpoints = {
  LIST: '/transactions',
  CREATE: '/transactions',
  GET: (id: number) => `/transactions/${id}`,
  UPDATE: (id: number) => `/transactions/${id}`,
  DELETE: (id: number) => `/transactions/${id}`,
} as const;

export interface ITransaccionesRepository {
  getAll(filters?: TransactionFilter): Promise<PaginatedResponse<Transaction>>;
  getById(id: number): Promise<Transaction>;
  create(data: CreateTransactionRequest): Promise<Transaction>;
  update(id: number, data: UpdateTransactionRequest): Promise<Transaction>;
  delete(id: number): Promise<void>;
}
