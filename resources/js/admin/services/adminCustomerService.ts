import type { AdminCustomerSummary } from '@/admin/types/adminCustomer';
import { adminApiClient, buildAdminQuery, mapPaginatedResponse, type AdminPaginatedResult, type AdminTableParams } from '@/admin/services/adminApiClient';

type ApiCustomer = {
    id: number;
    name: string;
    phone?: string | null;
    status: string;
    orders_count?: number;
    reviews_count?: number;
    lifetime_value?: number;
    last_order_at?: string | null;
    last_visit_at?: string | null;
};

function mapCustomer(customer: ApiCustomer): AdminCustomerSummary {
    return {
        id: String(customer.id),
        name: customer.name,
        phone: customer.phone ?? 'No phone',
        totalOrders: customer.orders_count ?? 0,
        totalSpent: customer.lifetime_value ?? 0,
        lastOrderAt: customer.last_order_at,
        lastVisitAt: customer.last_visit_at,
        reviewsCount: customer.reviews_count ?? 0,
        status: customer.status,
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
};
