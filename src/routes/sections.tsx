import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { PrivateRoute } from './privateRoute';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const IngresosPage = lazy(() => import('src/pages/ingresos'));
export const PresupuestosPage = lazy(() => import('src/pages/presupuestos'));
export const CategoriasPage = lazy(() => import('src/pages/categorias'));
export const RecordatoriosPage = lazy(() => import('src/pages/recordatorios'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const GastosPage = lazy(() => import('src/pages/gastos'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 420,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: 'dashboard',
    element: <PrivateRoute allowedRoles={['admin', 'user', 'usuario']} />,
    children: [
      {
        path: '',
        element: (
          <DashboardLayout>
            <Suspense fallback={renderFallback()}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'ingresos', element: <IngresosPage /> },
          { path: 'gastos', element: <GastosPage /> },
          { path: 'presupuestos', element: <PresupuestosPage /> },
          { path: 'categorias', element: <CategoriasPage /> },
          { path: 'recordatorios', element: <RecordatoriosPage /> },
          { path: 'perfil', element: <ProfilePage /> },
          { path: 'configuracion', element: <SettingsPage /> },
          { path: 'blog', element: <BlogPage /> },
        ],
      },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'sign-up',
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
