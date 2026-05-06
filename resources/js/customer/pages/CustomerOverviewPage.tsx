import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, CircleDollarSign, PackageCheck, RotateCcw, Star } from 'lucide-react';
import { AdminEChart } from '@/admin/components/common/AdminEChart';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { customerPortalService } from '@/customer/services/customerPortalService';
import { formatDateTime } from '@/utils/admin';

function StatCard({
    title,
    value,
    icon: Icon,
    description,
}: {
    title: string;
    value: ReactNode;
    icon: typeof Bell;
    description: string;
}) {
    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="ui-surface-raised flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--primary-500)]">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
                    <p className="mt-2 text-3xl font-semibold">{value}</p>
                </div>
            </div>
            <p className="mt-4 text-sm text-muted">{description}</p>
        </AdminSectionCard>
    );
}

function toDateInputValue(date: Date) {
    return date.toISOString().slice(0, 10);
}

function getCustomerDefaultRange() {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 1);

    return {
        dateFrom: toDateInputValue(start),
        dateTo: toDateInputValue(end),
    };
}

function formatRangeLabel(dateFrom?: string, dateTo?: string) {
    if (!dateFrom || !dateTo) {
        return '';
    }

    const from = new Date(`${dateFrom}T00:00:00`);
    const to = new Date(`${dateTo}T00:00:00`);

    return `${from.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${to.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

export function CustomerOverviewPage() {
    const [range, setRange] = useState(getCustomerDefaultRange);
    const dashboardQuery = useQuery({
        queryKey: ['customer-portal', 'dashboard', range],
        queryFn: () => customerPortalService.getDashboard(range),
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });

    const notificationsQuery = useQuery({
        queryKey: ['customer-portal', 'notifications'],
        queryFn: customerPortalService.getNotifications,
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });

    const reviewsQuery = useQuery({
        queryKey: ['customer-portal', 'reviews'],
        queryFn: customerPortalService.getReviews,
        refetchOnWindowFocus: true,
    });

    const chartOption = useMemo(() => {
        const breakdown = dashboardQuery.data?.statusBreakdown ?? {};
        const labels = [
            ['received', 'Received'],
            ['processing', 'Processing'],
            ['ready_for_pickup', 'Ready'],
            ['completed', 'Completed'],
            ['cancelled', 'Cancelled'],
        ] as const;

        return {
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: labels.map(([, label]) => label),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    type: 'bar',
                    barWidth: '42%',
                    data: labels.map(([key]) => breakdown[key] ?? 0),
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                    },
                },
            ],
        };
    }, [dashboardQuery.data?.statusBreakdown]);

    if (dashboardQuery.isLoading && !dashboardQuery.data) {
        return (
            <div className="section-shell flex min-h-[40vh] items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    const metrics = dashboardQuery.data?.metrics;
    const appliedDateFrom = dashboardQuery.data?.dateRange?.from ?? range.dateFrom;
    const appliedDateTo = dashboardQuery.data?.dateRange?.to ?? range.dateTo;
    const rangeLabel = formatRangeLabel(appliedDateFrom, appliedDateTo);
    const recentOrders = dashboardQuery.data?.recentOrders ?? [];
    const notifications = ((notificationsQuery.data ?? []).filter(Boolean)).filter((notification) => {
        const createdAt = new Date(notification.createdAt).getTime();
        const from = new Date(`${appliedDateFrom}T00:00:00`).getTime();
        const to = new Date(`${appliedDateTo}T23:59:59`).getTime();

        return createdAt >= from && createdAt <= to;
    });
    const reviews = (reviewsQuery.data ?? []).filter((review) => {
        const createdAt = new Date(review.createdAt).getTime();
        const from = new Date(`${appliedDateFrom}T00:00:00`).getTime();
        const to = new Date(`${appliedDateTo}T23:59:59`).getTime();

        return createdAt >= from && createdAt <= to;
    });

    return (
        <div className="section-shell space-y-6 py-6">
            <div>
                <p className="section-eyebrow">Customer dashboard</p>
                <h2 className="mt-4 text-4xl sm:text-5xl">Pickup overview</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                    Track active pickup orders, recent notifications, and your latest review activity.
                </p>
            </div>

            <AdminSectionCard className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Dashboard range</p>
                        <h3 className="mt-2 text-2xl">Filter your account activity by date</h3>
                        <p className="mt-2 text-sm text-muted">Default view shows the past 2 days. Current range: {rangeLabel}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
                        <Input label="From" max={range.dateTo} onChange={(event) => setRange((current) => ({ ...current, dateFrom: event.target.value }))} type="date" value={range.dateFrom} />
                        <Input label="To" min={range.dateFrom} onChange={(event) => setRange((current) => ({ ...current, dateTo: event.target.value }))} type="date" value={range.dateTo} />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={() => setRange(getCustomerDefaultRange())} size="sm" variant="ghost">
                        <RotateCcw className="h-4 w-4" />
                        Reset to past 2 days
                    </Button>
                </div>
            </AdminSectionCard>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard description="Orders placed within the selected range." icon={PackageCheck} title="Orders" value={metrics?.totalOrders ?? 0} />
                <StatCard description="Orders currently being handled for pickup in the selected range." icon={Bell} title="Active" value={metrics?.activeOrders ?? 0} />
                <StatCard description="Completed pickup orders inside the selected range." icon={CircleDollarSign} title="Completed" value={metrics?.completedOrders ?? 0} />
                <StatCard description="Approved or pending reviews submitted in the selected range." icon={Star} title="Reviews" value={reviews.length} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.56fr_0.44fr]">
                <AdminSectionCard className="p-5 sm:p-6">
                    <div className="mb-4">
                        <p className="section-eyebrow text-left">Order status</p>
                        <h3 className="mt-3 text-3xl">Pickup progress mix</h3>
                    </div>
                    <AdminEChart height={300} option={chartOption} />
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6">
                    <div className="mb-4">
                        <p className="section-eyebrow text-left">Account value</p>
                        <h3 className="mt-3 text-3xl">Completed cash total</h3>
                    </div>
                    <div className="ui-surface-raised rounded-[1.5rem] p-5">
                        <p className="text-sm text-muted">Total spent on completed pickup orders</p>
                        <div className="mt-4 text-4xl font-semibold">
                            <MoneyDisplay amount={metrics?.totalSpent ?? 0} />
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="ui-outline rounded-2xl p-4">
                                <p className="text-xs uppercase tracking-[0.14em] text-muted">Unread notifications</p>
                                <p className="mt-3 text-2xl font-semibold">{metrics?.unreadNotifications ?? 0}</p>
                            </div>
                            <div className="ui-outline rounded-2xl p-4">
                                <p className="text-xs uppercase tracking-[0.14em] text-muted">Pending reviews</p>
                                <p className="mt-3 text-2xl font-semibold">{metrics?.pendingReviews ?? 0}</p>
                            </div>
                        </div>
                    </div>
                </AdminSectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.56fr_0.44fr]">
                <AdminSectionCard className="overflow-hidden">
                    <div className="border-b border-[color:var(--ui-divider)] px-5 py-4">
                        <h3 className="text-2xl">Recent orders</h3>
                        <p className="mt-2 text-sm text-muted">Latest pickup orders linked to your customer account.</p>
                    </div>
                    <div className="divide-y divide-[color:var(--ui-divider)]">
                        {recentOrders.length === 0 ? (
                            <div className="px-5 py-6 text-sm text-muted">No orders yet.</div>
                        ) : recentOrders.map((order) => (
                            <div className="px-5 py-4" key={order.id}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold">{order.orderNumber}</p>
                                        <p className="mt-1 text-sm text-muted">{order.items.map((item) => `${item.foodName} x${item.quantity}`).join(', ')}</p>
                                    </div>
                                    <div className="text-right">
                                        <OrderStatusBadge status={order.status} />
                                        <p className="mt-2 text-sm font-semibold">
                                            <MoneyDisplay amount={order.total} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AdminSectionCard>

                <AdminSectionCard className="overflow-hidden">
                    <div className="border-b border-[color:var(--ui-divider)] px-5 py-4">
                        <h3 className="text-2xl">Recent notifications</h3>
                        <p className="mt-2 text-sm text-muted">The latest order and review updates sent to your account.</p>
                    </div>
                    <div className="divide-y divide-[color:var(--ui-divider)]">
                        {notifications.length === 0 ? (
                            <div className="px-5 py-6 text-sm text-muted">No notifications yet.</div>
                        ) : notifications.slice(0, 5).map((notification) => (
                            <div className="px-5 py-4" key={notification.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold">{notification.title ?? 'Notification'}</p>
                                        <p className="mt-1 text-sm text-muted">{notification.message ?? 'No message available.'}</p>
                                    </div>
                                    {!notification.read ? <span className="ui-outline-accent rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--primary-500)]">New</span> : null}
                                </div>
                                <p className="mt-2 text-xs text-muted">{formatDateTime(notification.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                </AdminSectionCard>
            </div>
        </div>
    );
}
