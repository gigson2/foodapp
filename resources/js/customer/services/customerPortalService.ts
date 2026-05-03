import { apiClient } from '@/services/apiClient';
import type { AppNotification, Order, Review } from '@/types';
import { normalizeUsPhone } from '@/utils/phone';
import type {
    CustomerDashboardSummary,
    CustomerPasswordUpdateInput,
    CustomerPortalNotification,
    CustomerPortalOrder,
    CustomerPortalReview,
    CustomerProfileRecord,
    CustomerProfileUpdateInput,
} from '@/customer/types/customerPortal';

type ApiCollection<T> = {
    data: T[];
};

type ApiItem<T> = {
    data: T;
};

type ApiOrder = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    subtotal: number;
    total: number;
    payment_method: 'cash';
    payment_status?: 'paid' | 'unpaid';
    order_type: 'pickup';
    status: Order['status'];
    cash_status?: 'cash_pending' | 'cash_collected';
    customer_note?: string | null;
    admin_note?: string | null;
    placed_at?: string | null;
    accepted_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    created_at: string;
    updated_at?: string | null;
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

type ApiReview = {
    id: number;
    customer_name: string;
    customer_phone: string;
    rating: number;
    message: string;
    food_name?: string | null;
    status: Review['status'];
    created_at: string;
    order?: {
        id: number;
        order_number: string;
    } | null;
};

type ApiDashboardSummary = {
    metrics: {
        total_orders: number;
        active_orders: number;
        completed_orders: number;
        cancelled_orders: number;
        total_spent: number;
        pending_reviews: number;
        unread_notifications: number;
    };
    status_breakdown: Record<string, number>;
    recent_orders: ApiOrder[];
};

function mapOrder(order: ApiOrder): CustomerPortalOrder {
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
        paymentStatus: order.payment_status,
        orderType: order.order_type,
        status: order.status,
        cashStatus: order.cash_status,
        customerNote: order.customer_note,
        adminNote: order.admin_note,
        acceptedAt: order.accepted_at,
        completedAt: order.completed_at,
        cancelledAt: order.cancelled_at,
        createdAt: order.placed_at ?? order.created_at,
        updatedAt: order.updated_at ?? null,
    };
}

function mapNotificationType(notification: ApiDatabaseNotification): AppNotification['type'] {
    const kind = typeof notification.data.kind === 'string' ? notification.data.kind : '';
    const status = typeof notification.data.status === 'string' ? notification.data.status : '';

    if (kind === 'order_status') {
        if (status === 'processing') {
            return 'order_processing';
        }

        if (status === 'ready_for_pickup') {
            return 'order_ready';
        }

        if (status === 'completed') {
            return 'order_completed';
        }

        return 'order_received';
    }

    if (kind === 'review_pending') {
        return 'review_pending';
    }

    return 'system';
}

function mapNotification(notification: ApiDatabaseNotification): CustomerPortalNotification {
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
        type: mapNotificationType(notification),
        read: Boolean(notification.read_at),
        createdAt: notification.created_at,
        targetRole: 'customer',
        orderId: typeof notification.data.order_id === 'number' ? String(notification.data.order_id) : undefined,
        reviewId: typeof notification.data.review_id === 'number' ? String(notification.data.review_id) : undefined,
        orderStatus: typeof notification.data.status === 'string' ? (notification.data.status as Order['status']) : undefined,
    };
}

function mapReview(review: ApiReview): CustomerPortalReview {
    return {
        id: String(review.id),
        customerName: review.customer_name,
        customerPhone: review.customer_phone,
        rating: review.rating,
        message: review.message,
        foodName: review.food_name ?? undefined,
        status: review.status,
        createdAt: review.created_at,
        orderNumber: review.order?.order_number,
    };
}

function toFormData(input: CustomerProfileUpdateInput): FormData {
    const formData = new FormData();

    formData.append('name', input.name);
    formData.append('phone', normalizeUsPhone(input.phone));
    formData.append('email', input.email ?? '');
    formData.append('address', input.address ?? '');
    formData.append('city', input.city ?? '');
    formData.append('notes', input.notes ?? '');
    formData.append('in_app_enabled', input.inAppEnabled ? '1' : '0');
    formData.append('push_enabled', input.pushEnabled ? '1' : '0');
    formData.append('email_enabled', input.emailEnabled ? '1' : '0');

    if (input.avatar) {
        formData.append('avatar', input.avatar);
    }

    return formData;
}

export const customerPortalService = {
    async getDashboard(): Promise<CustomerDashboardSummary> {
        const response = await apiClient.get<ApiItem<ApiDashboardSummary>>('/customer/dashboard');
        const payload = response.data.data;

        return {
            metrics: {
                totalOrders: payload.metrics.total_orders,
                activeOrders: payload.metrics.active_orders,
                completedOrders: payload.metrics.completed_orders,
                cancelledOrders: payload.metrics.cancelled_orders,
                totalSpent: payload.metrics.total_spent,
                pendingReviews: payload.metrics.pending_reviews,
                unreadNotifications: payload.metrics.unread_notifications,
            },
            statusBreakdown: payload.status_breakdown,
            recentOrders: payload.recent_orders.map(mapOrder),
        };
    },
    async getOrders(): Promise<CustomerPortalOrder[]> {
        const response = await apiClient.get<ApiCollection<ApiOrder>>('/customer/orders');

        return response.data.data.map(mapOrder);
    },
    async getNotifications(): Promise<CustomerPortalNotification[]> {
        const response = await apiClient.get<ApiCollection<ApiDatabaseNotification>>('/customer/notifications');

        return response.data.data.map(mapNotification);
    },
    async markNotificationRead(notificationId: string): Promise<CustomerPortalNotification> {
        const response = await apiClient.patch<{ data: ApiDatabaseNotification }>(`/customer/notifications/${notificationId}/read`);

        return mapNotification(response.data.data);
    },
    async markAllNotificationsRead(): Promise<string> {
        const response = await apiClient.patch<{ message: string }>('/customer/notifications/read-all');

        return response.data.message;
    },
    async getProfile(): Promise<CustomerProfileRecord> {
        const response = await apiClient.get<{ data: CustomerProfileRecord }>('/customer/profile');

        return response.data.data;
    },
    async updateProfile(input: CustomerProfileUpdateInput): Promise<CustomerProfileRecord> {
        const formData = toFormData(input);
        formData.append('_method', 'PUT');

        const response = await apiClient.post<{ data: CustomerProfileRecord }>('/customer/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data.data;
    },
    async updatePassword(input: CustomerPasswordUpdateInput): Promise<string> {
        const response = await apiClient.put<{ message: string }>('/customer/profile/password', {
            current_password: input.currentPassword,
            password: input.password,
            password_confirmation: input.passwordConfirmation,
        });

        return response.data.message;
    },
    async getReviews(): Promise<CustomerPortalReview[]> {
        const response = await apiClient.get<ApiCollection<ApiReview>>('/customer/reviews');

        return response.data.data.map(mapReview);
    },
    async createReview(input: { rating: number; message: string; foodName?: string }): Promise<CustomerPortalReview> {
        const response = await apiClient.post<{ data: ApiReview }>('/customer/reviews', {
            rating: input.rating,
            message: input.message,
            food_name: input.foodName ?? '',
        });

        return mapReview(response.data.data);
    },
    async savePushSubscription(subscription: PushSubscription): Promise<void> {
        const subJson = subscription.toJSON();

        await apiClient.post('/push-subscriptions', {
            endpoint: subscription.endpoint,
            public_key: subJson.keys?.p256dh ?? null,
            auth_token: subJson.keys?.auth ?? null,
            content_encoding: 'aes128gcm',
            user_agent: navigator.userAgent,
        });
    },
};
