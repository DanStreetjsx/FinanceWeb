// src/services/presupuestos/PresupuestosRepositoryHooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { presupuestosRepository } from './PresupuestosRepositoryApi';

import type { 
  CreateBudgetRequest, 
  UpdateBudgetRequest,
  CreateBudgetCategoryRequest,
  UpdateBudgetCategoryRequest 
} from './PresupuestosRepository';

const QUERY_KEYS = {
  BUDGETS: 'budgets',
  BUDGET: 'budget',
  BUDGET_CATEGORIES: 'budget_categories',
};

export const useBudgets = () =>
  useQuery({
    queryKey: [QUERY_KEYS.BUDGETS],
    queryFn: () => presupuestosRepository.getAll(),
  });

export const useBudget = (id: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.BUDGET, id],
    queryFn: () => presupuestosRepository.getById(id),
    enabled: !!id,
  });

export const useBudgetCategories = (budgetId: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.BUDGET_CATEGORIES, budgetId],
    queryFn: () => presupuestosRepository.getCategories(budgetId),
    enabled: !!budgetId,
  });

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => presupuestosRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBudgetRequest }) => 
      presupuestosRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGET, variables.id] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => presupuestosRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });
};

export const useAddBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ budgetId, data }: { budgetId: number; data: CreateBudgetCategoryRequest }) => 
      presupuestosRepository.addCategory(budgetId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGET_CATEGORIES, variables.budgetId] });
    },
  });
};

export const useUpdateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ budgetId, catId, data }: { budgetId: number; catId: number; data: UpdateBudgetCategoryRequest }) => 
      presupuestosRepository.updateCategory(budgetId, catId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGET_CATEGORIES, variables.budgetId] });
    },
  });
};

export const useDeleteBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ budgetId, catId }: { budgetId: number; catId: number }) => 
      presupuestosRepository.deleteCategory(budgetId, catId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGET_CATEGORIES, variables.budgetId] });
    },
  });
};
