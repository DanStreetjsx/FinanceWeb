// src/services/configuracion/ConfiguracionRepositoryHooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { configuracionRepository } from './ConfiguracionRepositoryApi';

import type { UpdateSettingsRequest } from './ConfiguracionRepository';

const QUERY_KEYS = {
  SETTINGS: 'user-settings',
};

export const useSettings = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: () => configuracionRepository.getSettings(),
  });

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsRequest) => configuracionRepository.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
    },
  });
};
