// src/services/transacciones/TransaccionesRepositoryHooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { transaccionesRepository } from './TransaccionesRepositoryApi';

import type { TransactionFilter, CreateTransactionRequest, UpdateTransactionRequest } from './TransaccionesRepository';

const QUERY_KEYS = {
  TRANSACTIONS: 'transactions',
  TRANSACTION: 'transaction',
};

export const useTransactions = (filters?: TransactionFilter) =>
  useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, filters],
    queryFn: () => transaccionesRepository.getAll(filters),
  });

export const useTransaction = (id: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION, id],
    queryFn: () => transaccionesRepository.getById(id),
    enabled: !!id,
  });

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transaccionesRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionRequest }) => 
      transaccionesRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTION, variables.id] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => transaccionesRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    },
  });
};
