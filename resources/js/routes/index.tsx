import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PlaceholderRoute } from '@/components/layout/PlaceholderRoute';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';

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
        element: (
            <PlaceholderRoute
                description="The admin dashboard is intentionally deferred. This route is reserved for the later backend and operations interface."
                title="Admin dashboard placeholder"
            />
        ),
        errorElement: <RouteErrorBoundary />,
    },
]);
