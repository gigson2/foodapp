import { Navigate, type RouteObject } from 'react-router-dom';

export const adminRoutes: RouteObject = {
    path: '/admin',
    lazy: async () => ({ Component: (await import('@/admin/AdminApp')).AdminApp }),
    children: [
        {
            index: true,
            element: <Navigate replace to="/admin/dashboard/overview" />,
        },
        {
            path: 'dashboard',
            element: <Navigate replace to="/admin/dashboard/overview" />,
        },
        {
            path: 'dashboard/overview',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminDashboardPage')).AdminDashboardPage }),
        },
        {
            path: 'orders',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminOrdersPage')).AdminOrdersPage }),
        },
        {
            path: 'menu',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminMenuPage')).AdminMenuPage }),
        },
        {
            path: 'categories',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminCategoriesPage')).AdminCategoriesPage }),
        },
        {
            path: 'reviews',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminReviewsPage')).AdminReviewsPage }),
        },
        {
            path: 'customers',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminCustomersPage')).AdminCustomersPage }),
        },
        {
            path: 'analytics',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminAnalyticsPage')).AdminAnalyticsPage }),
        },
        {
            path: 'notifications',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminNotificationsPage')).AdminNotificationsPage }),
        },
        {
            path: 'settings/company',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminCompanySettingsPage')).AdminCompanySettingsPage }),
        },
        {
            path: 'settings/seo',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminSeoSettingsPage')).AdminSeoSettingsPage }),
        },
        {
            path: 'settings/pwa',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminPwaSettingsPage')).AdminPwaSettingsPage }),
        },
        {
            path: 'profile',
            lazy: async () => ({ Component: (await import('@/admin/pages/AdminProfilePage')).AdminProfilePage }),
        },
    ],
};
