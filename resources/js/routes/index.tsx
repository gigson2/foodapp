import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminCategoryEditorPage } from '@/pages/admin/AdminCategoryEditorPage';
import { AdminCompanySettingsPage } from '@/pages/admin/AdminCompanySettingsPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminFoodEditorPage } from '@/pages/admin/AdminFoodEditorPage';
import { AdminFoodsPage } from '@/pages/admin/AdminFoodsPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminNotificationsPage } from '@/pages/admin/AdminNotificationsPage';
import { AdminOrderDetailPage } from '@/pages/admin/AdminOrderDetailPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminRouteLayout } from '@/pages/admin/AdminRouteLayout';
import { AdminSeoSettingsPage } from '@/pages/admin/AdminSeoSettingsPage';
import { AdminVisitorsPage } from '@/pages/admin/AdminVisitorsPage';
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
        path: '/admin',
        element: <AdminRouteLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                index: true,
                element: <AdminOverviewPage />,
            },
            {
                path: 'orders',
                element: <AdminOrdersPage />,
            },
            {
                path: 'orders/:orderId',
                element: <AdminOrderDetailPage />,
            },
            {
                path: 'foods',
                element: <AdminFoodsPage />,
            },
            {
                path: 'foods/new',
                element: <AdminFoodEditorPage />,
            },
            {
                path: 'foods/:foodId/edit',
                element: <AdminFoodEditorPage />,
            },
            {
                path: 'categories',
                element: <AdminCategoriesPage />,
            },
            {
                path: 'categories/new',
                element: <AdminCategoryEditorPage />,
            },
            {
                path: 'categories/:categoryId/edit',
                element: <AdminCategoryEditorPage />,
            },
            {
                path: 'customers',
                element: <AdminCustomersPage />,
            },
            {
                path: 'visitors',
                element: <AdminVisitorsPage />,
            },
            {
                path: 'settings',
                element: <Navigate replace to="/admin/settings/company" />,
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
                path: 'notifications',
                element: <AdminNotificationsPage />,
            },
        ],
    },
    {
        path: '/admin/login',
        element: <AdminLoginPage />,
        errorElement: <RouteErrorBoundary />,
    },
]);
