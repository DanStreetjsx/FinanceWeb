import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthRepositoryApi } from './AuthRepositoryApi';

import type {
  LoginRequest,
  IAuthRepository,
  RegisterRequest,
  UpdateProfileRequest,
  ResetPasswordRequest,
  RequestResetPasswordRequest} from './AuthRepository';

// Constantes para las claves de consulta
const QUERY_KEYS = {
  USER_DATA: 'user-data',
  AUTH_STATUS: 'auth-status',
};

// Constante para la clave de refresh token
const REFRESH_TOKEN_KEY = 'refreshToken';

// Instancia del repositorio de autenticación
const authRepository: IAuthRepository = new AuthRepositoryApi();

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
    queryKey: ['auth-status'],
    queryFn: async () => {
      // Verificar si hay un token en localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        return { isAuthenticated: false, user: null };
      }
      
      // Verificar si hay un usuario en localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          // Si tenemos un usuario y un token, consideramos que está autenticado
          return { isAuthenticated: true, user };
        } catch (e) {
          console.error('Error al parsear el usuario:', e);
        }
      }
      
      // Si no hay usuario en localStorage pero hay token, intentar verificar el token
      try {
        const authRepo = new AuthRepositoryApi();
        const response = await authRepo.verifyToken(token);
        
        if (response.status === 'success' && response.data) {
          return { isAuthenticated: true, user: response.data };
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      }
      
      // Si llegamos aquí, no está autenticado
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
    refetch: () => queryClient.invalidateQueries({ queryKey: ['auth-status'] })
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