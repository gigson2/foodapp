import type { AdminCustomerSummary } from '@/admin/types/adminCustomer';
import { adminApiClient, buildAdminQuery, mapPaginatedResponse, type AdminPaginatedResult, type AdminTableParams } from '@/admin/services/adminApiClient';

type ApiCustomer = {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    status: string;
    orders_count?: number;
    reviews_count?: number;
    lifetime_value?: number;
    last_order_at?: string | null;
    last_visit_at?: string | null;
    last_login_at?: string | null;
    created_at?: string | null;
    customer_profile?: {
        address?: string | null;
        city?: string | null;
        notes?: string | null;
    } | null;
};

function mapCustomer(customer: ApiCustomer): AdminCustomerSummary {
    return {
        id: String(customer.id),
        name: customer.name,
        phone: customer.phone ?? 'No phone',
        email: customer.email ?? null,
        totalOrders: customer.orders_count ?? 0,
        totalSpent: customer.lifetime_value ?? 0,
        lastOrderAt: customer.last_order_at,
        lastVisitAt: customer.last_visit_at,
        reviewsCount: customer.reviews_count ?? 0,
        status: customer.status,
        address: customer.customer_profile?.address ?? null,
        city: customer.customer_profile?.city ?? null,
        notes: customer.customer_profile?.notes ?? null,
        lastLoginAt: customer.last_login_at ?? null,
        createdAt: customer.created_at ?? null,
    };
}

export const adminCustomerService = {
    async getCustomers(params: AdminTableParams): Promise<AdminPaginatedResult<AdminCustomerSummary>> {
        const response = await adminApiClient.get('/admin/customers', {
            params: buildAdminQuery({
                page: params.page,
                per_page: params.perPage,
                search: params.search,
            }),
        });

        return mapPaginatedResponse(response.data, mapCustomer);
    },
    async getCustomer(customerId: string | number): Promise<AdminCustomerSummary> {
        const response = await adminApiClient.get(`/admin/customers/${customerId}`);

        return mapCustomer(response.data.data as ApiCustomer);
    },
};
