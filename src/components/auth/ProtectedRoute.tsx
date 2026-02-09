import type { ReactNode} from 'react';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { useAuthStatus } from '../../services/auth/AuthRepositoryHooks';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  allowedRoles?: string[];
}

/**
 * Componente que protege rutas para que solo sean accesibles por usuarios autenticados
 * Si el usuario no está autenticado, redirige a la página de login
 * Si se especifican roles permitidos, verifica que el usuario tenga alguno de esos roles
 */
export function ProtectedRoute({ 
  children, 
  redirectTo = '/sign-in',
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStatus();
  
  // Verificar roles si es necesario
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // El backend usa 'role' en singular. Si no hay rol, asignamos 'user' por defecto
  const userRole = user?.role || user?.roles || 'user';
  const hasRequiredRole = allowedRoles.length === 0 || 
    (Array.isArray(userRole) 
      ? userRole.some(role => allowedRoles.includes(role)) 
      : allowedRoles.includes(userRole));

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo);
    } else if (!isLoading && isAuthenticated && !hasRequiredRole) {
      // Si está autenticado pero no tiene los roles necesarios
      navigate('/404');
    }
  }, [isAuthenticated, isLoading, redirectTo, navigate, hasRequiredRole]);

  // Mientras verifica la autenticación, muestra un spinner
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si está autenticado y tiene los roles necesarios, muestra el contenido protegido
  return (isAuthenticated && hasRequiredRole) ? <>{children}</> : null;
}
