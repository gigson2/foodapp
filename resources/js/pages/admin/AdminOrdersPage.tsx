import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { adminService } from '@/services/adminService';
import { formatDateTime, formatLabel } from '@/utils/admin';
import type { AdminOrderStatus } from '@/types/admin';

const statusOptions: AdminOrderStatus[] = ['pending', 'received', 'processing', 'ready_for_pickup', 'completed', 'cancelled'];

export function AdminOrdersPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const ordersQuery = useQuery({
        queryKey: ['admin', 'orders'],
        queryFn: adminService.getOrders,
    });

    const orderStatusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: AdminOrderStatus }) => adminService.updateOrderStatus(orderId, status),
        onSuccess: async () => {
            toast.success('Order status updated');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
                queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
            ]);
        },
    });

    const filteredOrders = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return ordersQuery.data ?? [];
        }

        return (ordersQuery.data ?? []).filter((order) =>
            [order.order_number, order.customer_name, order.customer_phone, order.items[0]?.food_name]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(term)),
        );
    }, [ordersQuery.data, search]);

    return (
        <div className="space-y-5">
            <AdminPageHeading
                description="Review pickup orders, move them across statuses, and open full order details for customer service follow-up."
                title="Order management"
            />

            <AdminTableCard
                description="Every order currently recorded in the platform."
                title="Orders"
            >
                <div className="border-b border-white/10 px-5 py-4">
                    <Input
                        label="Search orders"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by order number, customer, phone, or item"
                        value={search}
                    />
                </div>

                {ordersQuery.isLoading ? (
                    <div className="p-6">
                        <LoadingSpinner />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <EmptyState description="Try a broader search term or wait for new orders." title="No orders found" />
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                            <tr>
                                <th className="px-5 py-4">Order</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Item</th>
                                <th className="px-5 py-4">Placed</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr className="border-b border-white/6 align-top" key={order.id}>
                                    <td className="px-5 py-4">
                                        <Link className="font-semibold transition hover:text-[color:var(--primary-500)]" to={`/admin/orders/${order.id}`}>
                                            {order.order_number}
                                        </Link>
                                        <p className="mt-1 text-xs text-muted">
                                            <MoneyDisplay amount={order.total} />
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p>{order.customer_name}</p>
                                        <p className="mt-1 text-xs text-muted">{order.customer_phone}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p>{order.items[0]?.food_name ?? 'N/A'}</p>
                                        <p className="mt-1 text-xs text-muted">Qty {order.items[0]?.quantity ?? 0}</p>
                                    </td>
                                    <td className="px-5 py-4">{formatDateTime(order.placed_at)}</td>
                                    <td className="px-5 py-4">
                                        <OrderStatusBadge status={order.status as never} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <select
                                            className="theme-field w-full rounded-xl px-3 py-2"
                                            defaultValue={order.status}
                                            onChange={(event) =>
                                                orderStatusMutation.mutate({
                                                    orderId: order.id,
                                                    status: event.target.value as AdminOrderStatus,
                                                })}
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {formatLabel(status)}
                                                </option>
                                            ))}
                                        </select>
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
