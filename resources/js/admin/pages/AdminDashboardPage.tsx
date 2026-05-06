import { PlusCircle, Radio, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminDashboardMetrics } from '@/admin/hooks/useAdminDashboardMetrics';
import { adminOrderService } from '@/admin/services/adminOrderService';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { DashboardOrderQueueWidget } from '@/admin/components/dashboard/DashboardOrderQueueWidget';
import { DashboardOrderQuickViewModal } from '@/admin/components/dashboard/DashboardOrderQuickViewModal';
import { KpiCard } from '@/admin/components/dashboard/KpiCard';
import { QuickActionsWidget } from '@/admin/components/dashboard/QuickActionsWidget';
import { OrderStatusChart } from '@/admin/components/dashboard/OrderStatusChart';
import { CashSalesChart } from '@/admin/components/dashboard/CashSalesChart';
import { PopularFoodsWidget } from '@/admin/components/dashboard/PopularFoodsWidget';
import { PendingReviewsWidget } from '@/admin/components/dashboard/PendingReviewsWidget';
import { VisitorSummaryWidget } from '@/admin/components/dashboard/VisitorSummaryWidget';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/common/Button';
import type { AdminOrderStatus } from '@/admin/types/adminOrder';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

function toDateInputValue(date: Date) {
    return date.toISOString().slice(0, 10);
}

function getAdminDefaultRange() {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 3);

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

export function AdminDashboardPage() {
    const queryClient = useQueryClient();
    const [range, setRange] = useState(getAdminDefaultRange);
    const [pickupPage, setPickupPage] = useState(1);
    const [completionPage, setCompletionPage] = useState(1);
    const [quickViewMode, setQuickViewMode] = useState<'received' | 'ready'>('received');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const dashboardQuery = useAdminDashboardMetrics(range);
    const snapshot = dashboardQuery.data;
    const rangeLabel = useMemo(
        () => formatRangeLabel(snapshot?.dateRange?.from ?? range.dateFrom, snapshot?.dateRange?.to ?? range.dateTo),
        [range.dateFrom, range.dateTo, snapshot?.dateRange?.from, snapshot?.dateRange?.to],
    );
    const pickupQueueQuery = useQuery({
        queryKey: ['admin-app', 'dashboard', 'pickup-queue', range, pickupPage],
        queryFn: () => adminOrderService.getOrders({
            page: pickupPage,
            perPage: 4,
            status: 'received',
            dateFrom: range.dateFrom,
            dateTo: range.dateTo,
        }),
    });
    const completionQueueQuery = useQuery({
        queryKey: ['admin-app', 'dashboard', 'completion-queue', range, completionPage],
        queryFn: () => adminOrderService.getOrders({
            page: completionPage,
            perPage: 4,
            status: 'ready_for_pickup',
            paymentStatus: 'unpaid',
            dateFrom: range.dateFrom,
            dateTo: range.dateTo,
        }),
    });
    const selectedOrderQuery = useQuery({
        enabled: Boolean(selectedOrderId),
        queryKey: ['admin-app', 'dashboard', 'quick-order-detail', selectedOrderId],
        queryFn: () => adminOrderService.getOrder(selectedOrderId as string),
    });
    const refreshDashboardQueues = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['admin-app', 'dashboard'] }),
            queryClient.invalidateQueries({ queryKey: ['admin-app', 'orders'] }),
            queryClient.invalidateQueries({ queryKey: ['admin-app', 'notifications'] }),
        ]);
    };
    const statusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: AdminOrderStatus }) => adminOrderService.updateStatus(orderId, status),
        onSuccess: async () => {
            toast.success('Order updated');
            await refreshDashboardQueues();
            setSelectedOrderId(null);
        },
    });
    const openQuickView = (mode: 'received' | 'ready', orderId: string) => {
        setQuickViewMode(mode);
        setSelectedOrderId(orderId);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                actions={
                    <>
                        <Link to="/admin/orders">
                            <Button size="sm">
                                <Radio className="h-4 w-4" />
                                View new orders
                            </Button>
                        </Link>
                        <Link to="/admin/menu">
                            <Button size="sm" variant="secondary">
                                <PlusCircle className="h-4 w-4" />
                                Add food
                            </Button>
                        </Link>
                    </>
                }
                description="Run Dri Africain pickup operations from one screen: monitor cash-only orders, chef workflow, pending reviews, and restaurant activity across desktop, tablet, and mobile."
                title="Operations overview"
            />

            <AdminSectionCard className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Dashboard range</p>
                        <h2 className="mt-2 text-2xl">Filter overview data by date</h2>
                        <p className="mt-2 text-sm text-muted">Default view shows the past 4 days. Current range: {rangeLabel}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[26rem]">
                        <Input label="From" max={range.dateTo} onChange={(event) => setRange((current) => ({ ...current, dateFrom: event.target.value }))} type="date" value={range.dateFrom} />
                        <Input label="To" min={range.dateFrom} onChange={(event) => setRange((current) => ({ ...current, dateTo: event.target.value }))} type="date" value={range.dateTo} />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={() => {
                        setRange(getAdminDefaultRange());
                        setPickupPage(1);
                        setCompletionPage(1);
                    }} size="sm" variant="ghost">
                        <RotateCcw className="h-4 w-4" />
                        Reset to past 4 days
                    </Button>
                </div>
            </AdminSectionCard>

            {dashboardQuery.isLoading || !snapshot ? (
                <AdminSectionCard className="flex min-h-[18rem] items-center justify-center">
                    <LoadingSpinner />
                </AdminSectionCard>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <KpiCard label="Orders" tone="primary" value={String(snapshot.metrics.totalOrders)} />
                        <KpiCard label="Received" value={String(snapshot.metrics.receivedOrders)} />
                        <KpiCard label="Ready for pickup" tone="accent" value={String(snapshot.metrics.readyForPickupOrders)} />
                        <KpiCard label="Unread notifications" value={String(snapshot.metrics.unreadNotifications)} />
                        <KpiCard label="Cash sales" tone="primary" value={formatAdminMoney(snapshot.metrics.totalCashSales)} />
                        <KpiCard label="Completed" value={String(snapshot.metrics.completedOrders)} />
                        <KpiCard label="Pending reviews" value={String(snapshot.metrics.pendingReviews)} />
                        <KpiCard label="Visitors" value={String(snapshot.metrics.totalVisitors)} />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                        <DashboardOrderQueueWidget
                            description="Only brand-new received pickup orders appear here so staff can move quickly on new customer requests."
                            emptyMessage="No newly received orders were found in the selected date range."
                            eyebrow="Pickup queue"
                            meta={pickupQueueQuery.data?.meta}
                            onPageChange={setPickupPage}
                            onView={(orderId) => openQuickView('received', orderId)}
                            orders={pickupQueueQuery.data?.items ?? []}
                            title="New customer orders"
                            viewLabel="View order"
                        />
                        <QuickActionsWidget actions={snapshot.quickActions} />
                    </div>

                    <DashboardOrderQueueWidget
                        description="These orders are ready for pickup, still unpaid, and waiting for final handoff. Use quick view to complete them after cash is collected."
                        emptyMessage="No ready-for-pickup unpaid orders were found in the selected date range."
                        eyebrow="Completed orders"
                        meta={completionQueueQuery.data?.meta}
                        onPageChange={setCompletionPage}
                        onView={(orderId) => openQuickView('ready', orderId)}
                        orders={completionQueueQuery.data?.items ?? []}
                        title="Ready for pickup & awaiting cash"
                        viewLabel="View order"
                    />

                    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                        <OrderStatusChart breakdown={snapshot.statusBreakdown} />
                        <CashSalesChart series={snapshot.cashSalesSeries} />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-3">
                        <PopularFoodsWidget foods={snapshot.popularFoods} />
                        <PendingReviewsWidget reviews={snapshot.pendingReviews} />
                        <VisitorSummaryWidget summary={snapshot.visitorSummary} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <AdminSectionCard className="p-5">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-[color:var(--primary-500)]" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Company</p>
                                    <h2 className="mt-2 text-2xl">Pickup policy</h2>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-muted">Pickup-only orders. Cash is collected physically at the restaurant after the customer receives the grill package.</p>
                        </AdminSectionCard>
                        <AdminSectionCard className="p-5">
                            <div className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-[color:var(--accent-500)]" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Reviews</p>
                                    <h2 className="mt-2 text-2xl">Public trust</h2>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-muted">Only approved reviews should appear on the public homepage. Pending moderation is highlighted here for daily staff attention.</p>
                        </AdminSectionCard>
                        <AdminSectionCard className="p-5">
                            <div className="flex items-center gap-3">
                                <Radio className="h-5 w-5 text-sky-300" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Notifications</p>
                                    <h2 className="mt-2 text-2xl">Alert readiness</h2>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-muted">Admin alerts help staff stay on top of orders and review activity throughout the day.</p>
                        </AdminSectionCard>
                        <AdminSectionCard className="p-5">
                            <div className="flex items-center gap-3">
                                <PlusCircle className="h-5 w-5 text-emerald-300" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Next</p>
                                    <h2 className="mt-2 text-2xl">Management pages</h2>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-muted">Use the navigation to manage orders, menu items, categories, customer reviews, visitor activity, and restaurant settings from one place.</p>
                        </AdminSectionCard>
                    </div>
                </>
            )}

            <DashboardOrderQuickViewModal
                isOpen={Boolean(selectedOrderId)}
                loading={selectedOrderQuery.isLoading}
                mode={quickViewMode}
                onCancel={(orderId) => statusMutation.mutate({ orderId, status: 'cancelled' })}
                onClose={() => setSelectedOrderId(null)}
                onMarkCompleted={(orderId) => statusMutation.mutate({ orderId, status: 'completed' })}
                onMarkReady={(orderId) => statusMutation.mutate({ orderId, status: 'ready_for_pickup' })}
                onStartProcessing={(orderId) => statusMutation.mutate({ orderId, status: 'processing' })}
                order={selectedOrderQuery.data ?? null}
                pending={statusMutation.isPending}
            />
        </div>
    );
}
