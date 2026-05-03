import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, LogOut, PackageCheck, UserRound } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AUTH_SESSION_QUERY_KEY, useAuthSession } from '@/hooks/useAuthSession';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useLocalCustomer } from '@/hooks/useLocalCustomer';
import { useLocalOrders } from '@/hooks/useLocalOrders';
import { useLocalReviews } from '@/hooks/useLocalReviews';
import { useNotifications } from '@/hooks/useNotifications';
import { customerDashboardService } from '@/services/customerDashboardService';
import { sessionService } from '@/services/sessionService';
import { formatDateTime } from '@/utils/admin';
import { formatUsPhone } from '@/utils/phone';

export function CustomerDashboardPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { customer, logout } = useLocalCustomer();
    const localOrders = useLocalOrders(customer?.phone);
    const { customerReviews } = useLocalReviews(customer?.phone);
    const localNotifications = useNotifications('customer');
    const { isLoading: loadingSessionUser, user: sessionUser } = useAuthSession();
    const backendOrdersQuery = useQuery({
        queryKey: ['customer-dashboard', 'orders'],
        queryFn: customerDashboardService.getOrders,
        enabled: sessionUser?.role === 'customer',
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
    });
    const backendNotificationsQuery = useQuery({
        queryKey: ['customer-dashboard', 'notifications'],
        queryFn: customerDashboardService.getNotifications,
        enabled: sessionUser?.role === 'customer',
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });

    const markNotificationReadMutation = useMutation({
        mutationFn: customerDashboardService.markNotificationRead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['customer-dashboard', 'notifications'] });
        },
    });

    const markAllNotificationsReadMutation = useMutation({
        mutationFn: customerDashboardService.markAllNotificationsRead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['customer-dashboard', 'notifications'] });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: sessionService.logout,
        onSuccess: async () => {
            logout();
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
            await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
            navigate('/');
        },
    });

    if (loadingSessionUser) {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    if (sessionUser?.role === 'admin') {
        return <Navigate replace to="/admin" />;
    }

    if (!sessionUser && !customer) {
        return <Navigate replace to="/" />;
    }

    const isBackendCustomer = sessionUser?.role === 'customer';
    const profileName = sessionUser?.name ?? customer?.name ?? 'Customer';
    const profilePhone = sessionUser?.phone ?? customer?.phone ?? '';
    const orders = isBackendCustomer ? backendOrdersQuery.data ?? [] : localOrders;
    const notifications = isBackendCustomer ? backendNotificationsQuery.data ?? [] : localNotifications.notifications;

    return (
        <div className="app-surface min-h-screen">
            <div className="section-shell py-6 lg:py-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="section-eyebrow">Customer dashboard</p>
                        <h1 className="mt-4 text-4xl sm:text-5xl">Your pickup account</h1>
                    </div>
                    <ThemeToggle />
                </div>

                <div className="mt-6 space-y-5">
                    <AdminPageHeading
                        actions={
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={() => navigate('/')} variant="secondary">
                                    Back to storefront
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (isBackendCustomer) {
                                            logoutMutation.mutate();
                                            return;
                                        }

                                        logout();
                                        navigate('/');
                                    }}
                                    variant="ghost"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        }
                        description={
                            isBackendCustomer
                                ? 'You are signed in as a customer. Track your pickup orders and account activity here.'
                                : 'This dashboard is using your local pickup identity from the storefront on this device.'
                        }
                        title="Customer dashboard"
                    />

                    <div className="grid gap-4 lg:grid-cols-3">
                        <Card className="theme-panel p-5">
                            <div className="flex items-center gap-3">
                                <UserRound className="h-5 w-5 text-[color:var(--primary-500)]" />
                                <h2 className="text-2xl">Profile</h2>
                            </div>
                            <p className="mt-4 font-semibold">{profileName}</p>
                            <p className="mt-1 text-sm text-muted">{profilePhone ? formatUsPhone(profilePhone) : 'No phone saved'}</p>
                            <p className="mt-3 text-sm text-muted">{isBackendCustomer ? 'Authenticated customer account' : 'Local device identity'}</p>
                        </Card>

                        <Card className="theme-panel p-5">
                            <div className="flex items-center gap-3">
                                <PackageCheck className="h-5 w-5 text-[color:var(--primary-500)]" />
                                <h2 className="text-2xl">Orders</h2>
                            </div>
                            <p className="mt-4 text-3xl font-semibold">{orders.length}</p>
                            <p className="mt-3 text-sm text-muted">Tracked pickup orders</p>
                        </Card>

                        <Card className="theme-panel p-5">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-[color:var(--primary-500)]" />
                                <h2 className="text-2xl">Notifications</h2>
                            </div>
                            <p className="mt-4 text-3xl font-semibold">
                                {notifications.filter((notification) => !notification.read).length}
                            </p>
                            <p className="mt-3 text-sm text-muted">Unread alerts</p>
                        </Card>
                    </div>

                    <AdminTableCard
                        description="Your recent pickup orders."
                        title="Orders"
                    >
                        {isBackendCustomer && backendOrdersQuery.isLoading ? (
                            <div className="p-6">
                                <LoadingSpinner />
                            </div>
                        ) : orders.length === 0 ? (
                            <EmptyState description="Orders you place will appear here." title="No orders yet" />
                        ) : (
                            <table className="min-w-full text-sm">
                                <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                    <tr>
                                        <th className="px-5 py-4">Order</th>
                                        <th className="px-5 py-4">Item</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Total</th>
                                        <th className="px-5 py-4">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr className="border-b border-white/6" key={order.id}>
                                            <td className="px-5 py-4 font-semibold">{order.orderNumber}</td>
                                            <td className="px-5 py-4">{order.items[0]?.foodName ?? 'N/A'}</td>
                                            <td className="px-5 py-4">
                                                <OrderStatusBadge status={order.status} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <MoneyDisplay amount={order.total} />
                                            </td>
                                            <td className="px-5 py-4">{formatDateTime(order.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </AdminTableCard>

                    <div className="grid gap-5 xl:grid-cols-[0.58fr_0.42fr]">
                        <AdminTableCard
                            description="Order and system alerts related to your pickup experience."
                            title="Notifications"
                        >
                            <div className="border-b border-white/10 px-5 py-4">
                                <Button
                                    onClick={() => {
                                        if (isBackendCustomer) {
                                            markAllNotificationsReadMutation.mutate();
                                            return;
                                        }

                                        localNotifications.markAllRead();
                                    }}
                                    size="sm"
                                    variant="secondary"
                                >
                                    Mark all read
                                </Button>
                            </div>
                            {isBackendCustomer && backendNotificationsQuery.isLoading ? (
                                <div className="p-6">
                                    <LoadingSpinner />
                                </div>
                            ) : notifications.length === 0 ? (
                                <EmptyState description="Notifications will appear here when new account activity happens." title="No notifications" />
                            ) : (
                                <div className="divide-y divide-white/6">
                                    {notifications.map((notification) => (
                                        <div className="px-5 py-4" key={notification.id}>
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold">{notification.title}</p>
                                                    <p className="mt-1 text-sm text-muted">{notification.message}</p>
                                                    <p className="mt-2 text-xs text-muted">{formatDateTime(notification.createdAt)}</p>
                                                </div>
                                                {!notification.read ? (
                                                    <Button
                                                        onClick={() => {
                                                            if (isBackendCustomer) {
                                                                markNotificationReadMutation.mutate(notification.id);
                                                                return;
                                                            }

                                                            localNotifications.markRead(notification.id);
                                                        }}
                                                        size="sm"
                                                        variant="ghost"
                                                    >
                                                        Mark read
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </AdminTableCard>

                        <Card className="theme-panel p-5">
                            <h2 className="text-2xl">Reviews</h2>
                            <p className="mt-3 text-sm leading-7 text-muted">
                                Reviews submitted from this device remain visible here with their approval workflow.
                            </p>
                            <div className="mt-5 space-y-3">
                                {customerReviews.length === 0 ? (
                                    <EmptyState description="Reviews will appear here after you submit them from the storefront." title="No submitted reviews" />
                                ) : (
                                    customerReviews.map((review) => (
                                        <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4" key={review.id}>
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-semibold">{review.foodName ?? 'General review'}</p>
                                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--primary-500)]">{review.status}</span>
                                            </div>
                                            <p className="mt-3 text-sm leading-7 text-muted">{review.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
