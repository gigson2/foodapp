import type { OrderStatus } from '@/types/order';

export type NotificationTargetRole = 'customer' | 'admin';
export type NotificationKind =
    | 'order_received'
    | 'order_processing'
    | 'order_ready'
    | 'order_completed'
    | 'review_pending'
    | 'system';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: NotificationKind;
    read: boolean;
    createdAt: string;
    targetRole: NotificationTargetRole;
    orderId?: string;
    reviewId?: string;
    orderStatus?: OrderStatus;
}
