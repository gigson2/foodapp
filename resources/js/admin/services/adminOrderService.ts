import type { AdminOrder, AdminOrderStatus, CashStatus } from '@/admin/types/adminOrder';
import { adminApiClient, buildAdminQuery, mapPaginatedResponse, type AdminPaginatedResult, type AdminTableParams } from '@/admin/services/adminApiClient';

type ApiOrder = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    subtotal: number;
    total: number;
    payment_method: 'cash';
    payment_status: 'unpaid' | 'paid';
    cash_status: CashStatus;
    order_type: 'pickup';
    status: AdminOrderStatus;
    customer_note?: string | null;
    admin_note?: string | null;
    created_at: string;
    updated_at: string;
    placed_at?: string | null;
    items: Array<{
        id: number;
        food_name: string;
        quantity: number;
        unit_price: number;
        line_total: number;
    }>;
};

function mapOrder(order: ApiOrder): AdminOrder {
    return {
        id: String(order.id),
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        items: order.items.map((item) => ({
            id: String(item.id),
            foodName: item.food_name,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            lineTotal: item.line_total,
        })),
        subtotal: order.subtotal,
        total: order.total,
        paymentMethod: order.payment_method,
        orderType: order.order_type,
        status: order.status,
        cashStatus: order.cash_status,
        customerNote: order.customer_note,
        adminNote: order.admin_note,
        createdAt: order.placed_at ?? order.created_at,
        updatedAt: order.updated_at,
    };
}

export const adminOrderService = {
    async getOrders(params: AdminTableParams): Promise<AdminPaginatedResult<AdminOrder>> {
        const response = await adminApiClient.get('/admin/orders', {
            params: buildAdminQuery({
                page: params.page,
                per_page: params.perPage,
                search: params.search,
                status: params.status,
                payment_status: params.paymentStatus,
                date_from: params.dateFrom,
                date_to: params.dateTo,
            }),
        });

        return mapPaginatedResponse(response.data, mapOrder);
    },
    async getOrder(orderId: string | number): Promise<AdminOrder> {
        const response = await adminApiClient.get<{ data: ApiOrder }>(`/admin/orders/${orderId}`);

        return mapOrder(response.data.data);
    },
    async updateStatus(orderId: string | number, status: AdminOrderStatus, adminNote?: string) {
        const response = await adminApiClient.patch<{ data: ApiOrder }>(`/admin/orders/${orderId}/status`, {
            status,
            admin_note: adminNote,
        });

        return mapOrder(response.data.data);
    },
    async updateCashStatus(orderId: string | number, cashStatus: CashStatus) {
        const response = await adminApiClient.patch<{ data: ApiOrder }>(`/admin/orders/${orderId}/payment-status`, {
            payment_status: cashStatus === 'cash_collected' ? 'paid' : 'unpaid',
        });

        return mapOrder(response.data.data);
    },
    async updateAdminNote(orderId: string | number, adminNote: string) {
        const response = await adminApiClient.patch<{ data: ApiOrder }>(`/admin/orders/${orderId}/note`, {
            admin_note: adminNote,
        });

        return mapOrder(response.data.data);
    },
};
