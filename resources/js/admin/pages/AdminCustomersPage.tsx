import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminEmptyState } from '@/admin/components/common/AdminEmptyState';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminCustomerService } from '@/admin/services/adminCustomerService';
import type { AdminCustomerSummary } from '@/admin/types/adminCustomer';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { IconButton } from '@/components/common/IconButton';
import { Modal } from '@/components/common/Modal';

export function AdminCustomersPage() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(null);

    const customersQuery = useQuery({
        queryKey: ['admin-app', 'customers', { page, perPage, search }],
        queryFn: () => adminCustomerService.getCustomers({ page, perPage, search }),
    });
    const customerDetailQuery = useQuery({
        enabled: viewingCustomerId !== null,
        queryKey: ['admin-app', 'customer', viewingCustomerId],
        queryFn: () => adminCustomerService.getCustomer(viewingCustomerId as string),
    });

    const customers = customersQuery.data?.items ?? [];
    const meta = customersQuery.data?.meta;
    const columns: TableColumn<AdminCustomerSummary>[] = [
        {
            name: 'Customer',
            cell: (customer) => (
                <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="mt-1 text-xs text-muted">{customer.phone}</p>
                </div>
            ),
        },
        {
            name: 'Orders',
            cell: (customer) => <span>{customer.totalOrders}</span>,
        },
        {
            name: 'Spent',
            cell: (customer) => <span className="font-semibold">{formatAdminMoney(customer.totalSpent)}</span>,
        },
        {
            name: 'Last order',
            cell: (customer) => <span className="text-sm text-muted">{customer.lastOrderAt ? formatAdminDateTime(customer.lastOrderAt) : 'N/A'}</span>,
        },
        {
            name: 'Last visit',
            cell: (customer) => <span className="text-sm text-muted">{customer.lastVisitAt ? formatAdminDateTime(customer.lastVisitAt) : 'N/A'}</span>,
        },
        {
            name: 'Reviews',
            cell: (customer) => <span>{customer.reviewsCount}</span>,
        },
        {
            name: 'Status',
            cell: (customer) => <AdminBadge className="border-[color:var(--primary-500)]/30 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]">{customer.status}</AdminBadge>,
        },
        {
            name: 'Actions',
            button: true,
            cell: (customer) => (
                <IconButton aria-label={`View ${customer.name}`} className="h-10 w-10" onClick={() => setViewingCustomerId(customer.id)}>
                    <Eye className="h-4 w-4" />
                </IconButton>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                description="Search restaurant customers by name or phone and review their order totals, spending, last order, and recent visit activity."
                title="Customers"
            />

            <AdminSectionCard className="overflow-hidden">
                <div className="border-b border-white/10 px-5 py-5">
                    <AdminSearchInput onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search customer by name or phone" value={search} />
                </div>

                {meta ? (
                    <AdminDataTable
                        columns={columns}
                        currentPage={page}
                        data={customers}
                        loading={customersQuery.isLoading}
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

            <Modal
                description="Customer profile and account summary."
                isOpen={viewingCustomerId !== null}
                onClose={() => setViewingCustomerId(null)}
                panelClassName="max-w-3xl"
                title={customerDetailQuery.data?.name ?? 'Customer profile'}
            >
                {customerDetailQuery.isLoading ? (
                    <p className="text-sm text-muted">Loading customer details...</p>
                ) : customerDetailQuery.data ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Phone</p>
                            <p className="mt-2 text-sm text-[color:var(--text-950)]">{customerDetailQuery.data.phone}</p>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Email</p>
                            <p className="mt-2 text-sm text-[color:var(--text-950)]">{customerDetailQuery.data.email || 'No email on file'}</p>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Total orders</p>
                            <p className="mt-2 text-2xl">{customerDetailQuery.data.totalOrders}</p>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Lifetime spend</p>
                            <p className="mt-2 text-2xl">{formatAdminMoney(customerDetailQuery.data.totalSpent)}</p>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Last order</p>
                            <p className="mt-2 text-sm text-[color:var(--text-950)]">{customerDetailQuery.data.lastOrderAt ? formatAdminDateTime(customerDetailQuery.data.lastOrderAt) : 'No orders yet'}</p>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Last visit</p>
                            <p className="mt-2 text-sm text-[color:var(--text-950)]">{customerDetailQuery.data.lastVisitAt ? formatAdminDateTime(customerDetailQuery.data.lastVisitAt) : 'No visits tracked yet'}</p>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Address</p>
                            <p className="mt-2 text-sm leading-7 text-[color:var(--text-950)]">
                                {customerDetailQuery.data.address || customerDetailQuery.data.city
                                    ? [customerDetailQuery.data.address, customerDetailQuery.data.city].filter(Boolean).join(', ')
                                    : 'No address on file'}
                            </p>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Account status</p>
                            <div className="mt-2">
                                <AdminBadge className="border-[color:var(--primary-500)]/30 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]">
                                    {customerDetailQuery.data.status}
                                </AdminBadge>
                            </div>
                        </div>
                        <div className="ui-surface-solid rounded-[1.35rem] p-4 md:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Notes</p>
                            <p className="mt-2 text-sm leading-7 text-[color:var(--text-950)]">{customerDetailQuery.data.notes || 'No customer notes recorded.'}</p>
                        </div>
                    </div>
                ) : (
                    <AdminEmptyState
                        description="The selected customer could not be loaded."
                        title="Customer unavailable"
                    />
                )}
            </Modal>
        </div>
    );
}
