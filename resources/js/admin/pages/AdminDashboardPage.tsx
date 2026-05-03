import { PlusCircle, Radio, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminDashboardMetrics } from '@/admin/hooks/useAdminDashboardMetrics';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { KpiCard } from '@/admin/components/dashboard/KpiCard';
import { RecentOrdersWidget } from '@/admin/components/dashboard/RecentOrdersWidget';
import { QuickActionsWidget } from '@/admin/components/dashboard/QuickActionsWidget';
import { OrderStatusChart } from '@/admin/components/dashboard/OrderStatusChart';
import { CashSalesChart } from '@/admin/components/dashboard/CashSalesChart';
import { PopularFoodsWidget } from '@/admin/components/dashboard/PopularFoodsWidget';
import { PendingReviewsWidget } from '@/admin/components/dashboard/PendingReviewsWidget';
import { VisitorSummaryWidget } from '@/admin/components/dashboard/VisitorSummaryWidget';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/common/Button';

export function AdminDashboardPage() {
    const dashboardQuery = useAdminDashboardMetrics();
    const snapshot = dashboardQuery.data;

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

            {dashboardQuery.isLoading || !snapshot ? (
                <AdminSectionCard className="flex min-h-[18rem] items-center justify-center">
                    <LoadingSpinner />
                </AdminSectionCard>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <KpiCard label="Total orders" tone="primary" value={String(snapshot.metrics.totalOrders)} />
                        <KpiCard label="Today's orders" value={String(snapshot.metrics.todayOrders)} />
                        <KpiCard label="Ready for pickup" tone="accent" value={String(snapshot.metrics.readyForPickupOrders)} />
                        <KpiCard label="Unread notifications" value={String(snapshot.metrics.unreadNotifications)} />
                        <KpiCard label="Cash sales today" tone="primary" value={formatAdminMoney(snapshot.metrics.todayCashSales)} />
                        <KpiCard label="Cash sales this week" value={formatAdminMoney(snapshot.metrics.weeklyCashSales)} />
                        <KpiCard label="Pending reviews" value={String(snapshot.metrics.pendingReviews)} />
                        <KpiCard label="Total visitors" value={String(snapshot.metrics.totalVisitors)} />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                        <RecentOrdersWidget orders={snapshot.recentOrders} />
                        <QuickActionsWidget actions={snapshot.quickActions} />
                    </div>

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
                            <p className="mt-4 text-sm leading-7 text-muted">Admin alerts reflect live order and review activity from the database and support faster kitchen and pickup coordination.</p>
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
        </div>
    );
}
