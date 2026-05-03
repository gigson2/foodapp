import { useQuery } from '@tanstack/react-query';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { adminService } from '@/services/adminService';
import { formatDateTime } from '@/utils/admin';

export function AdminCustomersPage() {
    const customersQuery = useQuery({
        queryKey: ['admin', 'customers'],
        queryFn: adminService.getCustomers,
    });

    const customers = customersQuery.data ?? [];

    return (
        <div className="space-y-5">
            <AdminPageHeading
                description="Review customer records, lifetime value, and latest order activity for repeat pickup guests."
                title="Customer records"
            />

            <AdminTableCard
                description="Registered customer accounts and high-level commercial value."
                title="Customers"
            >
                {customersQuery.isLoading ? (
                    <div className="p-6">
                        <LoadingSpinner />
                    </div>
                ) : customers.length === 0 ? (
                    <EmptyState description="Customers will appear here as registrations and orders accumulate." title="No customers yet" />
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                            <tr>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Orders</th>
                                <th className="px-5 py-4">Lifetime value</th>
                                <th className="px-5 py-4">Profile</th>
                                <th className="px-5 py-4">Last order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr className="border-b border-white/6 align-top" key={customer.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold">{customer.name}</p>
                                        <p className="mt-1 text-xs text-muted">{customer.phone ?? customer.email ?? 'N/A'}</p>
                                    </td>
                                    <td className="px-5 py-4">{customer.orders_count ?? 0}</td>
                                    <td className="px-5 py-4"><MoneyDisplay amount={customer.lifetime_value ?? 0} /></td>
                                    <td className="px-5 py-4 text-xs text-muted">
                                        {customer.customer_profile?.address ? <p>{customer.customer_profile.address}</p> : null}
                                        {customer.customer_profile?.city ? <p>{customer.customer_profile.city}</p> : null}
                                        {customer.customer_profile?.notes ? <p className="mt-1">{customer.customer_profile.notes}</p> : null}
                                    </td>
                                    <td className="px-5 py-4">{formatDateTime(customer.last_order_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </AdminTableCard>
        </div>
    );
}
