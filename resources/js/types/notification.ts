import type { OrderStatus } from '@/types/order';

export type NotificationTargetRole = 'customer' | 'admin';
export type NotificationKind = 'order_received' | 'order_processing' | 'order_ready' | 'order_completed' | 'order_cancelled' | 'new_order' | 'pickup_waiting';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: NotificationKind;
    read: boolean;
    createdAt: string;
    targetRole: NotificationTargetRole;
    orderId?: string;
    orderStatus?: OrderStatus;
}
