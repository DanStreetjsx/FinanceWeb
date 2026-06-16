import { render, screen } from '@testing-library/react';
import { it, vi, expect, describe, beforeEach } from 'vitest';
import { Route, Routes, MemoryRouter } from 'react-router-dom';

import { useAuthStatus } from 'src/services/auth/AuthRepositoryHooks';

import { PrivateRoute } from './privateRoute';

vi.mock('src/services/auth/AuthRepositoryHooks', () => ({
  useAuthStatus: vi.fn(),
}));

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRoute = () =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/sign-in" element={<div>Sign In Page</div>} />
          <Route path="/404" element={<div>Not Found Page</div>} />
          <Route path="/" element={<PrivateRoute allowedRoles={['user']} />}>
            <Route index element={<div>Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

  it('shows loading indicator while auth status is pending', () => {
    vi.mocked(useAuthStatus).mockReturnValue({
      user: null,
      refetch: vi.fn(),
      isLoading: true,
      isAuthenticated: false,
    });

    renderRoute();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('redirects to sign-in when user is not authenticated', () => {
    vi.mocked(useAuthStatus).mockReturnValue({
      user: null,
      refetch: vi.fn(),
      isLoading: false,
      isAuthenticated: false,
    });

    renderRoute();

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('redirects to 404 when user lacks required role', () => {
    vi.mocked(useAuthStatus).mockReturnValue({
      refetch: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: 1,
        role: 'admin',
        name: 'User Admin',
        phone_number: '3001234567',
      },
    });

    renderRoute();

    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  it('renders child route when user has required role', () => {
    vi.mocked(useAuthStatus).mockReturnValue({
      refetch: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: 1,
        role: 'user',
        name: 'Regular User',
        phone_number: '3001234567',
      },
    });

    renderRoute();

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
