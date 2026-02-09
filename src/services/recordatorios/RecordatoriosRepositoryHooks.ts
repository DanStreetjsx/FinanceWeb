// src/services/recordatorios/RecordatoriosRepositoryHooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { recordatoriosRepository } from './RecordatoriosRepositoryApi';

import type { CreateReminderRequest, UpdateReminderRequest } from './RecordatoriosRepository';

const QUERY_KEYS = {
  REMINDERS: 'reminders',
  REMINDER: 'reminder',
};

export const useReminders = () =>
  useQuery({
    queryKey: [QUERY_KEYS.REMINDERS],
    queryFn: () => recordatoriosRepository.getAll(),
  });

export const useReminder = (id: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.REMINDER, id],
    queryFn: () => recordatoriosRepository.getById(id),
    enabled: !!id,
  });

export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReminderRequest) => recordatoriosRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REMINDERS] });
    },
  });
};

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReminderRequest }) => 
      recordatoriosRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REMINDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REMINDER, variables.id] });
    },
  });
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recordatoriosRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REMINDERS] });
    },
  });
};
