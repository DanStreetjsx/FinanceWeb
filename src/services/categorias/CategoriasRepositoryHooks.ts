// src/services/categorias/CategoriasRepositoryHooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { categoriasRepository } from './CategoriasRepositoryApi';

import type { CreateCategoryRequest, UpdateCategoryRequest } from './CategoriasRepository';

const QUERY_KEYS = {
  CATEGORIES: 'categories',
  CATEGORY: 'category',
};

export const useCategories = (filters?: { type?: 'expense' | 'income' | 'both' }) =>
  useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, filters],
    queryFn: () => categoriasRepository.getAll(filters),
  });

export const useCategory = (id: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.CATEGORY, id],
    queryFn: () => categoriasRepository.getById(id),
    enabled: !!id,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriasRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) => 
      categoriasRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY, variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriasRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
};
