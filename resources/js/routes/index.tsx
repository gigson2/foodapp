import { createBrowserRouter } from 'react-router-dom';
import { adminRoutes } from '@/admin/routes/adminRoutes';
import { customerRoutes } from '@/customer/routes/customerRoutes';
import { AppShell } from '@/components/layout/AppShell';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';

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
        element: <AdminLoginPage />,
        errorElement: <RouteErrorBoundary />,
    },
]);
