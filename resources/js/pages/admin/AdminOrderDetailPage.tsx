import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { adminService } from '@/services/adminService';
import { formatDateTime, formatLabel } from '@/utils/admin';
import type { AdminOrderStatus } from '@/types/admin';

const statusOptions: AdminOrderStatus[] = ['pending', 'received', 'processing', 'ready_for_pickup', 'completed', 'cancelled'];

export function AdminOrderDetailPage() {
    const queryClient = useQueryClient();
    const params = useParams();
    const orderId = Number(params.orderId);
    const orderQuery = useQuery({
        queryKey: ['admin', 'orders', orderId],
        queryFn: () => adminService.getOrder(orderId),
        enabled: Number.isFinite(orderId),
    });

    const orderStatusMutation = useMutation({
        mutationFn: ({ status }: { status: AdminOrderStatus }) => adminService.updateOrderStatus(orderId, status),
        onSuccess: async () => {
            toast.success('Order status updated');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
                queryClient.invalidateQueries({ queryKey: ['admin', 'orders', orderId] }),
                queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
            ]);
        },
    });

    if (orderQuery.isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    const order = orderQuery.data;

    if (!order) {
        return (
            <Card className="theme-panel p-6">
                <p className="text-lg font-semibold">Order not found.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            <AdminPageHeading
                actions={
                    <Link to="/admin/orders">
                        <Button variant="secondary">Back to orders</Button>
                    </Link>
                }
                description="Use this view to inspect the pickup order in full, confirm customer details, and move the order through the restaurant workflow."
                title={`Order ${order.order_number}`}
            />

            <div className="grid gap-5 xl:grid-cols-[0.58fr_0.42fr]">
                <Card className="theme-panel p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted">Current status</p>
                            <div className="mt-3">
                                <OrderStatusBadge status={order.status as never} />
                            </div>
                        </div>
                        <div className="w-full max-w-xs">
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-[color:var(--text-950)]">Update status</span>
                                <select
                                    className="theme-field w-full rounded-xl px-3 py-2"
                                    defaultValue={order.status}
                                    onChange={(event) => orderStatusMutation.mutate({ status: event.target.value as AdminOrderStatus })}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {formatLabel(status)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                            <p className="text-sm text-muted">Customer</p>
                            <p className="mt-2 font-semibold">{order.customer_name}</p>
                            <p className="mt-1 text-sm text-muted">{order.customer_phone}</p>
                            {order.customer_email ? <p className="mt-1 text-sm text-muted">{order.customer_email}</p> : null}
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                            <p className="text-sm text-muted">Pickup timing</p>
                            <p className="mt-2 text-sm leading-7">Placed: {formatDateTime(order.placed_at)}</p>
                            <p className="text-sm leading-7">Accepted: {formatDateTime(order.accepted_at)}</p>
                            <p className="text-sm leading-7">Completed: {formatDateTime(order.completed_at)}</p>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                <tr>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Qty</th>
                                    <th className="px-4 py-3">Unit</th>
                                    <th className="px-4 py-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr className="border-b border-white/6 last:border-b-0" key={item.id}>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold">{item.food_name}</p>
                                            {item.customer_note ? <p className="mt-1 text-xs text-muted">{item.customer_note}</p> : null}
                                        </td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3"><MoneyDisplay amount={item.unit_price} /></td>
                                        <td className="px-4 py-3"><MoneyDisplay amount={item.line_total} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="theme-panel p-5">
                    <h2 className="text-2xl">Payment and notes</h2>
                    <div className="mt-5 space-y-4 text-sm leading-7">
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                            <p className="text-sm text-muted">Payment method</p>
                            <p className="mt-2 font-semibold">{formatLabel(order.payment_method)}</p>
                            <p className="mt-1 text-sm text-muted">Status: {formatLabel(order.payment_status)}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                            <p className="text-sm text-muted">Order totals</p>
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <span>Subtotal</span>
                                    <MoneyDisplay amount={order.subtotal} />
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Total</span>
                                    <MoneyDisplay amount={order.total} className="font-semibold" />
                                </div>
                            </div>
                        </div>
                        {order.customer_note ? (
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                                <p className="text-sm text-muted">Customer note</p>
                                <p className="mt-2">{order.customer_note}</p>
                            </div>
                        ) : null}
                        {order.admin_note ? (
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                                <p className="text-sm text-muted">Admin note</p>
                                <p className="mt-2">{order.admin_note}</p>
                            </div>
                        ) : null}
                    </div>
                </Card>
            </div>
        </div>
    );
}
