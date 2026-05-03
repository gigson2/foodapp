import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import { toast } from 'sonner';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminFilterSelect } from '@/admin/components/common/AdminFilterSelect';
import { IconButton } from '@/components/common/IconButton';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminOrderService } from '@/admin/services/adminOrderService';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { getCashStatusMeta, getOrderStatusMeta } from '@/admin/utils/adminStatus';
import type { AdminOrderStatus, CashStatus } from '@/admin/types/adminOrder';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Textarea';
import type { AdminOrder } from '@/admin/types/adminOrder';

const statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Received', value: 'received' },
    { label: 'Processing', value: 'processing' },
    { label: 'Ready for Pickup', value: 'ready_for_pickup' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

const cashOptions = [
    { label: 'All cash states', value: '' },
    { label: 'Cash Pending', value: 'unpaid' },
    { label: 'Cash Collected', value: 'paid' },
];

export function AdminOrdersPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [noteDraftByOrder, setNoteDraftByOrder] = useState<Record<string, string>>({});

    const ordersQuery = useQuery({
        queryKey: ['admin-app', 'orders', { page, perPage, search, status, paymentStatus }],
        queryFn: () => adminOrderService.getOrders({ page, perPage, search, status, paymentStatus }),
    });

    const selectedOrderQuery = useQuery({
        enabled: Boolean(selectedOrderId),
        queryKey: ['admin-app', 'orders', 'detail', selectedOrderId],
        queryFn: () => adminOrderService.getOrder(selectedOrderId as string),
    });

    const invalidateOrders = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['admin-app', 'orders'] }),
            queryClient.invalidateQueries({ queryKey: ['admin-app', 'dashboard'] }),
            queryClient.invalidateQueries({ queryKey: ['admin-app', 'notifications'] }),
        ]);
    };

    const statusMutation = useMutation({
        mutationFn: ({ orderId, nextStatus }: { orderId: string; nextStatus: AdminOrderStatus }) => adminOrderService.updateStatus(orderId, nextStatus),
        onSuccess: async () => {
            toast.success('Order status updated');
            await invalidateOrders();
        },
    });

    const cashMutation = useMutation({
        mutationFn: ({ orderId, cashStatus }: { orderId: string; cashStatus: CashStatus }) => adminOrderService.updateCashStatus(orderId, cashStatus),
        onSuccess: async () => {
            toast.success('Cash status updated');
            await invalidateOrders();
        },
    });

    const noteMutation = useMutation({
        mutationFn: ({ orderId, adminNote }: { orderId: string; adminNote: string }) => adminOrderService.updateAdminNote(orderId, adminNote),
        onSuccess: async () => {
            toast.success('Admin note saved');
            await invalidateOrders();
        },
    });

    const selectedOrder = selectedOrderQuery.data;
    const orders = ordersQuery.data?.items ?? [];
    const meta = ordersQuery.data?.meta;
    const noteDraft = selectedOrder ? (noteDraftByOrder[selectedOrder.id] ?? selectedOrder.adminNote ?? '') : '';
    const columns: TableColumn<AdminOrder>[] = [
        {
            name: 'Order #',
            cell: (order) => <div className="font-semibold">{order.orderNumber}</div>,
            sortable: false,
        },
        {
            name: 'Customer',
            cell: (order) => (
                <div>
                    <p>{order.customerName}</p>
                    <p className="mt-1 text-xs text-muted">{order.customerPhone}</p>
                </div>
            ),
        },
        {
            name: 'Items',
            grow: 1.4,
            cell: (order) => (
                <div className="text-sm text-muted">
                    {order.items.map((item) => `${item.quantity}x ${item.foodName}`).join(', ')}
                </div>
            ),
        },
        {
            name: 'Total',
            cell: (order) => <span className="font-semibold">{formatAdminMoney(order.total)}</span>,
        },
        {
            name: 'Status',
            cell: (order) => <AdminBadge className={getOrderStatusMeta(order.status).className}>{getOrderStatusMeta(order.status).label}</AdminBadge>,
        },
        {
            name: 'Cash',
            cell: (order) => <AdminBadge className={getCashStatusMeta(order.cashStatus).className}>{getCashStatusMeta(order.cashStatus).label}</AdminBadge>,
        },
        {
            name: 'Created',
            cell: (order) => <span className="text-sm text-muted">{formatAdminDateTime(order.createdAt)}</span>,
        },
        {
            name: 'Actions',
            allowOverflow: true,
            button: true,
            cell: (order) => (
                <IconButton aria-label={`View ${order.orderNumber}`} className="h-10 w-10" onClick={() => setSelectedOrderId(order.id)}>
                    <Eye className="h-4 w-4" />
                </IconButton>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                description="Search, filter, and move pickup orders through the grill workflow while tracking cash collection and internal notes."
                title="Orders"
            />

            <AdminSectionCard className="overflow-hidden">
                <div className="grid gap-4 border-b border-white/10 px-5 py-5 lg:grid-cols-[1.3fr_repeat(2,minmax(0,0.55fr))]">
                    <AdminSearchInput label="Search" onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search order number, customer, phone, or item" value={search} />
                    <AdminFilterSelect label="Status" onChange={(value) => { setStatus(value); setPage(1); }} options={statusOptions} value={status} />
                    <AdminFilterSelect label="Cash status" onChange={(value) => { setPaymentStatus(value); setPage(1); }} options={cashOptions} value={paymentStatus} />
                </div>

                {meta ? (
                    <AdminDataTable
                        columns={columns}
                        currentPage={page}
                        data={orders}
                        loading={ordersQuery.isLoading}
                        perPage={perPage}
                        totalRows={meta.total}
                        onPageChange={setPage}
                        onPerPageChange={(nextPerPage) => {
                            setPerPage(nextPerPage);
                            setPage(1);
                        }}
                    />
                ) : null}
            </AdminSectionCard>

            {selectedOrder ? (
                <AdminSectionCard className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Order detail</p>
                            <h2 className="mt-2 text-3xl">{selectedOrder.orderNumber}</h2>
                            <p className="mt-3 text-sm text-muted">{selectedOrder.customerName} · {selectedOrder.customerPhone}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <AdminBadge className={getOrderStatusMeta(selectedOrder.status).className}>{getOrderStatusMeta(selectedOrder.status).label}</AdminBadge>
                            <AdminBadge className={getCashStatusMeta(selectedOrder.cashStatus).className}>{getCashStatusMeta(selectedOrder.cashStatus).label}</AdminBadge>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <div className="rounded-[1.35rem] border border-white/10 bg-white/5">
                                <div className="border-b border-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                                    Items ordered
                                </div>
                                <div className="divide-y divide-white/6">
                                    {selectedOrder.items.map((item) => (
                                        <div className="flex items-center justify-between gap-3 px-5 py-4" key={item.id}>
                                            <div>
                                                <p className="font-semibold">{item.foodName}</p>
                                                <p className="mt-1 text-sm text-muted">Qty {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">{formatAdminMoney(item.lineTotal)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/5 p-5">
                                <div className="grid gap-3 text-sm sm:grid-cols-2">
                                    <div><span className="text-muted">Payment method:</span> Cash</div>
                                    <div><span className="text-muted">Order type:</span> Pickup</div>
                                    <div><span className="text-muted">Created:</span> {formatAdminDateTime(selectedOrder.createdAt)}</div>
                                    <div><span className="text-muted">Total:</span> {formatAdminMoney(selectedOrder.total)}</div>
                                </div>
                                {selectedOrder.customerNote ? <p className="mt-4 text-sm text-muted">Customer note: {selectedOrder.customerNote}</p> : null}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Quick status actions</p>
                                <div className="mt-4 grid gap-3">
                                    <Button onClick={() => statusMutation.mutate({ orderId: selectedOrder.id, nextStatus: 'processing' })} size="sm" variant="secondary">Start processing</Button>
                                    <Button onClick={() => statusMutation.mutate({ orderId: selectedOrder.id, nextStatus: 'ready_for_pickup' })} size="sm" variant="secondary">Mark ready for pickup</Button>
                                    <Button onClick={() => statusMutation.mutate({ orderId: selectedOrder.id, nextStatus: 'completed' })} size="sm" variant="accent">Mark completed</Button>
                                    <Button onClick={() => cashMutation.mutate({ orderId: selectedOrder.id, cashStatus: 'cash_collected' })} size="sm">Mark cash collected</Button>
                                    <Button onClick={() => statusMutation.mutate({ orderId: selectedOrder.id, nextStatus: 'cancelled' })} size="sm" variant="ghost">Cancel order</Button>
                                </div>
                            </div>

                            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-5">
                                <Textarea label="Admin note" onChange={(event) => selectedOrder && setNoteDraftByOrder((current) => ({ ...current, [selectedOrder.id]: event.target.value }))} value={noteDraft} />
                                <div className="mt-4">
                                    <Button onClick={() => noteMutation.mutate({ orderId: selectedOrder.id, adminNote: noteDraft })} size="sm">
                                        Save note
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminSectionCard>
            ) : null}
        </div>
    );
}
