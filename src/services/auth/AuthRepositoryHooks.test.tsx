import type { ReactNode } from 'react';

import { waitFor, renderHook } from '@testing-library/react';
import { it, vi, expect, describe, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { User } from './AuthRepository';

vi.mock('./AuthRepositoryApi', () => ({
  authRepository: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    resetPassword: vi.fn(),
    updateProfile: vi.fn(),
    verifyToken: vi.fn(),
    refreshToken: vi.fn(),
    requestResetPassword: vi.fn(),
  },
}));

import { authRepository } from './AuthRepositoryApi';
import { useAuthStatus } from './AuthRepositoryHooks';

type WrapperProps = {
  children: ReactNode;
};

const mockUser: User = {
  id: 1,
  name: 'Test User',
  phone_number: '3001234567',
  role: 'user',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: WrapperProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('useAuthStatus', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns unauthenticated when no token exists', async () => {
    const { result } = renderHook(() => useAuthStatus(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(authRepository.verifyToken).not.toHaveBeenCalled();
  });

  it('clears local session if token verification fails', async () => {
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    vi.mocked(authRepository.verifyToken).mockResolvedValue({
      status: 'error',
      message: 'Token inválido',
      data: null,
    });

    const { result } = renderHook(() => useAuthStatus(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('returns authenticated user when token is valid', async () => {
    localStorage.setItem('token', 'valid-token');

    vi.mocked(authRepository.verifyToken).mockResolvedValue({
      status: 'success',
      message: 'Token verificado',
      data: mockUser,
    });

    const { result } = renderHook(() => useAuthStatus(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});
