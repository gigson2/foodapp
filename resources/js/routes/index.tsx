import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PlaceholderRoute } from '@/components/layout/PlaceholderRoute';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { AdminConsolePage } from '@/pages/admin/AdminConsolePage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: '/customer',
        element: (
            <PlaceholderRoute
                description="The full customer dashboard is intentionally deferred. The current phase focuses on the public ordering flow, pickup identity, and account modal."
                title="Customer dashboard placeholder"
            />
        ),
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: '/admin',
        element: <AdminConsolePage />,
        errorElement: <RouteErrorBoundary />,
    },
]);
