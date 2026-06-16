import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { authRepository } from './AuthRepositoryApi';

import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ResetPasswordRequest,
  RequestResetPasswordRequest} from './AuthRepository';

// Constantes para las claves de consulta
const QUERY_KEYS = {
  USER_DATA: 'user-data',
  AUTH_STATUS: 'auth-status',
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => authRepository.login(data),
    onSuccess: (response) => {
      if (response.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['auth-status'] });
        setError(null);
      } else {
        setError(response.message || 'Error desconocido');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al iniciar sesión');
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error,
    data: mutation.data,
  };
};

// Hook para registro
export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authRepository.register(data),
    onSuccess: (response) => {
      if (response.status === 'success') {
        setError(null);
      } else {
        setError(response.message || 'Error desconocido');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al registrarse');
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error,
    data: mutation.data,
  };
};

// Hook para actualizar perfil
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => authRepository.updateProfile(data),
    onSuccess: (response) => {
      if (response.status === 'success') {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_DATA] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_STATUS] });
        setError(null);
      } else {
        setError(response.message || 'Error desconocido');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al actualizar perfil');
    },
  });

  return {
    updateProfile: mutation.mutate,
    isLoading: mutation.isPending,
    error,
    data: mutation.data,
  };
};

// Hook para verificar token y estado de autenticación
export function useAuthStatus() {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: [QUERY_KEYS.AUTH_STATUS],
    queryFn: async () => {
      // Verificar si hay un token en localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        return { isAuthenticated: false, user: null };
      }
      
      // Verificar token vía API. Si falla, limpiar sesión local para evitar estados inconsistentes.
      try {
        const response = await authRepository.verifyToken(token);
        
        if (response.status === 'success' && response.data) {
          return { isAuthenticated: true, user: response.data };
        }
      } catch {
        // Si falla verificación, limpiamos sesión local más abajo.
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return { isAuthenticated: false, user: null };
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  
  const isAuthenticated = data?.isAuthenticated ?? false;
  
  return {
    isLoading,
    isAuthenticated,
    user: data?.user || null,
    refetch: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_STATUS] })
  };
}

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-status'] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al cerrar sesión');
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
    error,
  };
};

// Hook para solicitar restablecimiento de contraseña
export const useRequestResetPassword = () => {
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: RequestResetPasswordRequest) => authRepository.requestResetPassword(data),
    onSuccess: (response) => {
      if (response.status === 'success') {
        setError(null);
      } else {
        setError(response.message || 'Error desconocido');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al solicitar restablecimiento de contraseña');
    },
  });

  return {
    requestResetPassword: mutation.mutate,
    isLoading: mutation.isPending,
    error,
    data: mutation.data,
  };
};

// Hook para restablecer contraseña
export const useResetPassword = () => {
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authRepository.resetPassword(data),
    onSuccess: (response) => {
      if (response.status === 'success') {
        setError(null);
      } else {
        setError(response.message || 'Error desconocido');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al restablecer contraseña');
    },
  });

  return {
    resetPassword: mutation.mutate,
    isLoading: mutation.isPending,
    error,
    data: mutation.data,
  };
};
