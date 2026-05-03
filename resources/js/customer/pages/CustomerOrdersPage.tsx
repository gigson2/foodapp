import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TableColumn } from 'react-data-table-component';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminFilterSelect } from '@/admin/components/common/AdminFilterSelect';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { customerPortalService } from '@/customer/services/customerPortalService';
import type { CustomerPortalOrder } from '@/customer/types/customerPortal';
import { formatDateTime } from '@/utils/admin';

export function CustomerOrdersPage() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<CustomerPortalOrder | null>(null);
    const ordersQuery = useQuery({
        queryKey: ['customer-portal', 'orders'],
        queryFn: customerPortalService.getOrders,
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });

    const filteredOrders = useMemo(() => {
        const term = search.trim().toLowerCase();

        return (ordersQuery.data ?? []).filter((order) => {
            const statusMatch = statusFilter === '' || order.status === statusFilter;
            const text = [
                order.orderNumber,
                order.customerName,
                order.customerPhone,
                ...order.items.map((item) => item.foodName),
            ].join(' ').toLowerCase();

            return statusMatch && (term === '' || text.includes(term));
        });
    }, [ordersQuery.data, search, statusFilter]);

    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * perPage;

        return filteredOrders.slice(start, start + perPage);
    }, [filteredOrders, page, perPage]);

    const columns: TableColumn<CustomerPortalOrder>[] = [
        {
            name: 'Order',
            cell: (order) => (
                <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
            ),
        },
        {
            name: 'Items',
            grow: 1.3,
            cell: (order) => <span className="text-sm text-muted">{order.items.map((item) => `${item.foodName} x${item.quantity}`).join(', ')}</span>,
        },
        {
            name: 'Status',
            cell: (order) => <OrderStatusBadge status={order.status} />,
        },
        {
            name: 'Cash',
            cell: (order) => <span className="text-sm font-semibold">{order.cashStatus === 'cash_collected' ? 'Collected' : 'Pending'}</span>,
        },
        {
            name: 'Total',
            cell: (order) => <span className="font-semibold"><MoneyDisplay amount={order.total} /></span>,
        },
        {
            name: 'Actions',
            button: true,
            cell: (order) => (
                <Button onClick={() => setSelectedOrder(order)} size="sm" variant="secondary">
                    Details
                </Button>
            ),
        },
    ];

    if (ordersQuery.isLoading && !ordersQuery.data) {
        return (
            <div className="section-shell flex min-h-[40vh] items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="section-shell space-y-6 py-6">
            <div>
                <p className="section-eyebrow">Customer dashboard</p>
                <h2 className="mt-4 text-4xl sm:text-5xl">Orders</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                    Review all pickup orders, their latest status, and the cash collection state recorded for your account.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <AdminSectionCard className="overflow-hidden">
                    <div className="grid gap-4 border-b border-[color:var(--ui-divider)] px-5 py-5 md:grid-cols-[1.2fr_0.7fr]">
                        <AdminSearchInput
                            label="Search"
                            onChange={(value) => {
                                setSearch(value);
                                setPage(1);
                            }}
                            placeholder="Search by order number or food item"
                            value={search}
                        />
                        <AdminFilterSelect
                            label="Status"
                            onChange={(value) => {
                                setStatusFilter(value);
                                setPage(1);
                            }}
                            options={[
                                { label: 'All', value: '' },
                                { label: 'Received', value: 'received' },
                                { label: 'Processing', value: 'processing' },
                                { label: 'Ready for pickup', value: 'ready_for_pickup' },
                                { label: 'Completed', value: 'completed' },
                                { label: 'Cancelled', value: 'cancelled' },
                            ]}
                            value={statusFilter}
                        />
                    </div>

                    <AdminDataTable
                        columns={columns}
                        currentPage={page}
                        data={paginatedOrders}
                        loading={ordersQuery.isLoading}
                        perPage={perPage}
                        totalRows={filteredOrders.length}
                        onPageChange={setPage}
                        onPerPageChange={(nextPerPage) => {
                            setPerPage(nextPerPage);
                            setPage(1);
                        }}
                    />
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6">
                    <h3 className="text-3xl">Order details</h3>
                    {selectedOrder ? (
                        <div className="mt-5 space-y-4">
                            <div className="ui-surface-raised rounded-[1.5rem] p-4">
                                <p className="text-xs uppercase tracking-[0.14em] text-muted">Order number</p>
                                <p className="mt-2 text-2xl font-semibold">{selectedOrder.orderNumber}</p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="ui-outline rounded-2xl p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Status</p>
                                    <div className="mt-3"><OrderStatusBadge status={selectedOrder.status} /></div>
                                </div>
                                <div className="ui-outline rounded-2xl p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Cash status</p>
                                    <p className="mt-3 font-semibold">{selectedOrder.cashStatus === 'cash_collected' ? 'Cash collected' : 'Cash pending'}</p>
                                </div>
                            </div>
                            <div className="ui-outline rounded-2xl p-4">
                                <p className="text-xs uppercase tracking-[0.14em] text-muted">Items</p>
                                <div className="mt-3 space-y-3">
                                    {selectedOrder.items.map((item) => (
                                        <div className="flex items-center justify-between gap-3" key={item.id}>
                                            <div>
                                                <p className="font-semibold">{item.foodName}</p>
                                                <p className="text-sm text-muted">Qty {item.quantity}</p>
                                            </div>
                                            <MoneyDisplay amount={item.total} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedOrder.customerNote ? (
                                <div className="ui-outline rounded-2xl p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Your note</p>
                                    <p className="mt-3 text-sm text-muted">{selectedOrder.customerNote}</p>
                                </div>
                            ) : null}
                            {selectedOrder.adminNote ? (
                                <div className="ui-outline rounded-2xl p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Admin note</p>
                                    <p className="mt-3 text-sm text-muted">{selectedOrder.adminNote}</p>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <p className="mt-5 text-sm text-muted">Select an order from the table to view the full pickup details.</p>
                    )}
                </AdminSectionCard>
            </div>
        </div>
    );
}
