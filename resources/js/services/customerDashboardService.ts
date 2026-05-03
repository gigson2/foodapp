import { apiClient } from '@/services/apiClient';
import type { AppNotification, Order } from '@/types';

type ApiCollection<T> = {
    data: T[];
};

type ApiOrder = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    subtotal: number;
    total: number;
    payment_method: 'cash';
    order_type: 'pickup';
    status: Order['status'];
    placed_at?: string | null;
    created_at: string;
    items: Array<{
        id: number;
        food_id: number | null;
        food_name: string;
        unit_price: number;
        quantity: number;
        line_total: number;
    }>;
};

type ApiDatabaseNotification = {
    id: string;
    type: string;
    data: Record<string, unknown>;
    read_at?: string | null;
    created_at: string;
};

function mapOrder(order: ApiOrder): Order {
    return {
        id: String(order.id),
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        items: order.items.map((item) => ({
            id: String(item.id),
            foodId: String(item.food_id ?? ''),
            foodName: item.food_name,
            price: item.unit_price,
            quantity: item.quantity,
            total: item.line_total,
        })),
        subtotal: order.subtotal,
        total: order.total,
        paymentMethod: order.payment_method,
        orderType: order.order_type,
        status: order.status,
        createdAt: order.placed_at ?? order.created_at,
    };
}

function mapNotification(notification: ApiDatabaseNotification): AppNotification {
    const title = typeof notification.data.title === 'string' ? notification.data.title : notification.type.split('\\').pop() ?? 'Notification';
    const message =
        typeof notification.data.message === 'string'
            ? notification.data.message
            : typeof notification.data.body === 'string'
                ? notification.data.body
                : 'Activity was recorded on your account.';

    return {
        id: notification.id,
        title,
        message,
        type: 'system',
        read: Boolean(notification.read_at),
        createdAt: notification.created_at,
        targetRole: 'customer',
        orderId: typeof notification.data.order_id === 'number' ? String(notification.data.order_id) : undefined,
    };
}

export const customerDashboardService = {
    async getOrders() {
        const response = await apiClient.get<ApiCollection<ApiOrder>>('/customer/orders');

        return response.data.data.map(mapOrder);
    },
    async getNotifications() {
        const response = await apiClient.get<ApiCollection<ApiDatabaseNotification>>('/customer/notifications');

        return response.data.data.map(mapNotification);
    },
    async markNotificationRead(notificationId: string) {
        const response = await apiClient.patch<{ data: ApiDatabaseNotification }>(`/customer/notifications/${notificationId}/read`);

        return mapNotification(response.data.data);
    },
    async markAllNotificationsRead() {
        const response = await apiClient.patch<{ message: string }>('/customer/notifications/read-all');

        return response.data.message;
    },
};
