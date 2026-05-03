export type AdminNotificationType = 'new_order' | 'review_pending' | 'order_status' | 'review_status' | 'system';

export interface AdminNotificationItem {
    id: string;
    title: string;
    message: string;
    type: AdminNotificationType;
    read: boolean;
    createdAt: string;
    orderId?: string;
    reviewId?: string;
}
