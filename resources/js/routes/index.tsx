import { createBrowserRouter } from 'react-router-dom';
import { adminRoutes } from '@/admin/routes/adminRoutes';
import { customerRoutes } from '@/customer/routes/customerRoutes';
import { AppShell } from '@/components/layout/AppShell';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
    },
    {
        ...customerRoutes,
        errorElement: <RouteErrorBoundary />,
    },
    {
        ...adminRoutes,
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: '/admin/login',
        lazy: async () => ({ Component: (await import('@/pages/admin/AdminLoginPage')).AdminLoginPage }),
        errorElement: <RouteErrorBoundary />,
    },
]);
