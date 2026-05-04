import { Navigate, type RouteObject } from 'react-router-dom';

export const customerRoutes: RouteObject = {
    path: '/customer',
    lazy: async () => ({ Component: (await import('@/customer/CustomerApp')).CustomerApp }),
    children: [
        {
            index: true,
            element: <Navigate replace to="/customer/dashboard" />,
        },
        {
            path: 'dashboard',
            lazy: async () => ({ Component: (await import('@/customer/pages/CustomerOverviewPage')).CustomerOverviewPage }),
        },
        {
            path: 'orders',
            lazy: async () => ({ Component: (await import('@/customer/pages/CustomerOrdersPage')).CustomerOrdersPage }),
        },
        {
            path: 'notifications',
            lazy: async () => ({ Component: (await import('@/customer/pages/CustomerNotificationsPage')).CustomerNotificationsPage }),
        },
        {
            path: 'reviews',
            lazy: async () => ({ Component: (await import('@/customer/pages/CustomerReviewsPage')).CustomerReviewsPage }),
        },
        {
            path: 'profile',
            lazy: async () => ({ Component: (await import('@/customer/pages/CustomerProfilePage')).CustomerProfilePage }),
        },
    ],
};
