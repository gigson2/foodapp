import { Navigate, type RouteObject } from 'react-router-dom';
import { CustomerApp } from '@/customer/CustomerApp';
import { CustomerNotificationsPage } from '@/customer/pages/CustomerNotificationsPage';
import { CustomerOrdersPage } from '@/customer/pages/CustomerOrdersPage';
import { CustomerOverviewPage } from '@/customer/pages/CustomerOverviewPage';
import { CustomerProfilePage } from '@/customer/pages/CustomerProfilePage';
import { CustomerReviewsPage } from '@/customer/pages/CustomerReviewsPage';

export const customerRoutes: RouteObject = {
    path: '/customer',
    element: <CustomerApp />,
    children: [
        {
            index: true,
            element: <Navigate replace to="/customer/dashboard" />,
        },
        {
            path: 'dashboard',
            element: <CustomerOverviewPage />,
        },
        {
            path: 'orders',
            element: <CustomerOrdersPage />,
        },
        {
            path: 'notifications',
            element: <CustomerNotificationsPage />,
        },
        {
            path: 'reviews',
            element: <CustomerReviewsPage />,
        },
        {
            path: 'profile',
            element: <CustomerProfilePage />,
        },
    ],
};
