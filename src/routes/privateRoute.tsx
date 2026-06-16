import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuthStatus } from 'src/services/auth/AuthRepositoryHooks';

type PrivateRouteProps = {
  allowedRoles: string[];
};

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { isLoading, isAuthenticated, user } = useAuthStatus();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  const userWithRoles = user as ({ role?: string; roles?: string[] | string } | null);
  const rawRoles = userWithRoles?.role || userWithRoles?.roles || 'user';
  const userRoles = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
  const hasAllowedRole = allowedRoles.length === 0 || userRoles.some((role) => allowedRoles.includes(role));

  if (!hasAllowedRole) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
