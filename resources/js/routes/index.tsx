import { createBrowserRouter } from 'react-router-dom';
import { adminRoutes } from '@/admin/routes/adminRoutes';
import { customerRoutes } from '@/customer/routes/customerRoutes';
import { RouteHydrateFallback } from '@/components/layout/RouteHydrateFallback';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';

export const router = createBrowserRouter([
    {
        path: '/',
        lazy: async () => ({ Component: (await import('@/components/layout/AppShell')).AppShell }),
        errorElement: <RouteErrorBoundary />,
        hydrateFallbackElement: <RouteHydrateFallback />,
    },
    {
        ...customerRoutes,
        errorElement: <RouteErrorBoundary />,
        hydrateFallbackElement: <RouteHydrateFallback />,
    },
    {
        ...adminRoutes,
        errorElement: <RouteErrorBoundary />,
        hydrateFallbackElement: <RouteHydrateFallback />,
    },
    {
        path: '/admin/login',
        lazy: async () => ({ Component: (await import('@/pages/admin/AdminLoginPage')).AdminLoginPage }),
        errorElement: <RouteErrorBoundary />,
        hydrateFallbackElement: <RouteHydrateFallback />,
    },
]);
