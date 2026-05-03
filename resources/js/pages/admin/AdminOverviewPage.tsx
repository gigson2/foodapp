import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminMetricCard } from '@/components/admin/AdminMetricCard';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { adminService } from '@/services/adminService';
import { formatDateTime } from '@/utils/admin';

export function AdminOverviewPage() {
    const dashboardQuery = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: adminService.getDashboard,
    });

    const metrics = dashboardQuery.data?.metrics;
    const recentOrders = dashboardQuery.data?.recentOrders ?? [];

    return (
        <div className="space-y-5">
            <AdminPageHeading
                actions={
                    <>
                        <Link to="/admin/orders">
                            <Button variant="secondary">Manage orders</Button>
                        </Link>
                        <Link to="/admin/foods/new">
                            <Button>Add food</Button>
                        </Link>
                    </>
                }
                description="Track pickup performance, recent order activity, and the operational health of Dri Africain Traditional Grill from one dashboard."
                title="Operations overview"
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminMetricCard helper="All recorded pickup orders" label="Total orders" value={metrics ? metrics.total_orders : <LoadingSpinner />} />
                <AdminMetricCard helper="Pending, received, and processing" label="Pending orders" value={metrics ? metrics.pending_orders : <LoadingSpinner />} />
                <AdminMetricCard helper="Completed pickup orders" label="Completed orders" value={metrics ? metrics.completed_orders : <LoadingSpinner />} />
                <AdminMetricCard helper="Cancelled before collection" label="Cancelled orders" value={metrics ? metrics.cancelled_orders : <LoadingSpinner />} />
                <AdminMetricCard helper="Customer accounts in database" label="Total customers" value={metrics ? metrics.total_customers : <LoadingSpinner />} />
                <AdminMetricCard helper="Tracked visitor sessions" label="Total visitors" value={metrics ? metrics.total_visitors : <LoadingSpinner />} />
                <AdminMetricCard helper="Revenue completed today" label="Today revenue" value={metrics ? <MoneyDisplay amount={metrics.today_revenue} /> : <LoadingSpinner />} />
                <AdminMetricCard helper="Revenue completed this month" label="Month revenue" value={metrics ? <MoneyDisplay amount={metrics.month_revenue} /> : <LoadingSpinner />} />
            </div>

            <AdminTableCard
                description="Latest pickup orders received through the platform."
                title="Recent orders"
            >
                {dashboardQuery.isLoading ? (
                    <div className="p-6">
                        <LoadingSpinner />
                    </div>
                ) : recentOrders.length === 0 ? (
                    <EmptyState description="Orders will appear here as soon as customers begin placing pickup requests." title="No recent orders" />
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                            <tr>
                                <th className="px-5 py-4">Order</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Item</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr className="border-b border-white/6" key={order.id}>
                                    <td className="px-5 py-4">
                                        <Link className="font-semibold transition hover:text-[color:var(--primary-500)]" to={`/admin/orders/${order.id}`}>
                                            {order.order_number}
                                        </Link>
                                        <p className="mt-1 text-xs text-muted">{formatDateTime(order.placed_at)}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p>{order.customer_name}</p>
                                        <p className="mt-1 text-xs text-muted">{order.customer_phone}</p>
                                    </td>
                                    <td className="px-5 py-4">{order.items[0]?.food_name ?? 'N/A'}</td>
                                    <td className="px-5 py-4">
                                        <OrderStatusBadge status={order.status as never} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <MoneyDisplay amount={order.total} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </AdminTableCard>
        </div>
    );
}
