import { Navigate, type RouteObject } from 'react-router-dom';
import { AdminApp } from '@/admin/AdminApp';
import { AdminAnalyticsPage } from '@/admin/pages/AdminAnalyticsPage';
import { AdminCategoriesPage } from '@/admin/pages/AdminCategoriesPage';
import { AdminCompanySettingsPage } from '@/admin/pages/AdminCompanySettingsPage';
import { AdminCustomersPage } from '@/admin/pages/AdminCustomersPage';
import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage';
import { AdminMenuPage } from '@/admin/pages/AdminMenuPage';
import { AdminNotificationsPage } from '@/admin/pages/AdminNotificationsPage';
import { AdminOrdersPage } from '@/admin/pages/AdminOrdersPage';
import { AdminProfilePage } from '@/admin/pages/AdminProfilePage';
import { AdminPwaSettingsPage } from '@/admin/pages/AdminPwaSettingsPage';
import { AdminReviewsPage } from '@/admin/pages/AdminReviewsPage';
import { AdminSeoSettingsPage } from '@/admin/pages/AdminSeoSettingsPage';

export const adminRoutes: RouteObject = {
    path: '/admin',
    element: <AdminApp />,
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
            element: <AdminDashboardPage />,
        },
        {
            path: 'orders',
            element: <AdminOrdersPage />,
        },
        {
            path: 'menu',
            element: <AdminMenuPage />,
        },
        {
            path: 'categories',
            element: <AdminCategoriesPage />,
        },
        {
            path: 'reviews',
            element: <AdminReviewsPage />,
        },
        {
            path: 'customers',
            element: <AdminCustomersPage />,
        },
        {
            path: 'analytics',
            element: <AdminAnalyticsPage />,
        },
        {
            path: 'notifications',
            element: <AdminNotificationsPage />,
        },
        {
            path: 'settings/company',
            element: <AdminCompanySettingsPage />,
        },
        {
            path: 'settings/seo',
            element: <AdminSeoSettingsPage />,
        },
        {
            path: 'settings/pwa',
            element: <AdminPwaSettingsPage />,
        },
        {
            path: 'profile',
            element: <AdminProfilePage />,
        },
    ],
};
