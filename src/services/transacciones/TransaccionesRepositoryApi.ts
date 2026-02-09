// src/services/transacciones/TransaccionesRepositoryApi.ts

import api from '../api';
import { 
  TransactionEndpoints 
} from './TransaccionesRepository';

import type { 
  Transaction, 
  TransactionFilter, 
  PaginatedResponse, 
  ITransaccionesRepository,
  CreateTransactionRequest,
  UpdateTransactionRequest
} from './TransaccionesRepository';

export class TransaccionesRepositoryApi implements ITransaccionesRepository {
  async getAll(filters?: TransactionFilter): Promise<PaginatedResponse<Transaction>> {
    const response = await api.get<PaginatedResponse<Transaction>>(TransactionEndpoints.LIST, {
      params: filters
    });
    return response.data;
  }

  async getById(id: number): Promise<Transaction> {
    const response = await api.get<Transaction>(TransactionEndpoints.GET(id));
    return response.data;
  }

  async create(data: CreateTransactionRequest): Promise<Transaction> {
    const response = await api.post<Transaction>(TransactionEndpoints.CREATE, data);
    return response.data;
  }

  async update(id: number, data: UpdateTransactionRequest): Promise<Transaction> {
    const response = await api.put<Transaction>(TransactionEndpoints.UPDATE(id), data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(TransactionEndpoints.DELETE(id));
  }
}

export const transaccionesRepository: ITransaccionesRepository = new TransaccionesRepositoryApi();
