import type { AdminNotificationItem } from '@/admin/types/adminNotification';
import { adminApiClient, buildAdminQuery, mapPaginatedResponse, type AdminPaginatedResult } from '@/admin/services/adminApiClient';

type ApiNotification = {
    id: string;
    type: string | null;
    data: Record<string, unknown> | null;
    read_at?: string | null;
    created_at: string;
};

function mapNotification(notification: ApiNotification): AdminNotificationItem {
    const data = notification.data ?? {};
    return {
        id: notification.id,
        title: String(data.title ?? 'Notification'),
        message: String(data.message ?? ''),
        type: (data.kind as AdminNotificationItem['type']) ?? 'system',
        read: Boolean(notification.read_at),
        createdAt: notification.created_at,
        orderId: data.order_id ? String(data.order_id) : undefined,
        reviewId: data.review_id ? String(data.review_id) : undefined,
    };
}

export const adminNotificationService = {
    async getNotifications(params: { page?: number; perPage?: number; unreadOnly?: boolean } = {}): Promise<AdminPaginatedResult<AdminNotificationItem>> {
        const response = await adminApiClient.get('/admin/notifications', {
            params: buildAdminQuery({
                page: params.page,
                per_page: params.perPage,
                unread_only: params.unreadOnly,
            }),
        });

        return mapPaginatedResponse(response.data, mapNotification);
    },
    async markRead(notificationId: string) {
        const response = await adminApiClient.patch<{ data: ApiNotification }>(`/admin/notifications/${notificationId}/read`);

        return mapNotification(response.data.data);
    },
    async markAllRead() {
        await adminApiClient.patch('/admin/notifications/read-all');
    },
    async broadcastToCustomers(input: { title: string; message: string; url?: string }) {
        const response = await adminApiClient.post<{ message: string; recipients: number }>('/admin/notifications/broadcast', input);

        return response.data;
    },
};
