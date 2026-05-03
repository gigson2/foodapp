import { createBrowserRouter } from 'react-router-dom';
import { adminRoutes } from '@/admin/routes/adminRoutes';
import { AppShell } from '@/components/layout/AppShell';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { CustomerDashboardPage } from '@/pages/customer/CustomerDashboardPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: '/customer',
        element: <CustomerDashboardPage />,
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
