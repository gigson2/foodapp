import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TableColumn } from 'react-data-table-component';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminCustomerService } from '@/admin/services/adminCustomerService';
import type { AdminCustomerSummary } from '@/admin/types/adminCustomer';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { formatAdminMoney } from '@/admin/utils/adminMoney';

export function AdminCustomersPage() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');

    const customersQuery = useQuery({
        queryKey: ['admin-app', 'customers', { page, perPage, search }],
        queryFn: () => adminCustomerService.getCustomers({ page, perPage, search }),
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
        </div>
    );
}
