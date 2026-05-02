import type { AppNotification, Order } from '@/types';
import { createId } from '@/utils/ids';
import { readStorage, writeStorage } from '@/utils/storage';

const NOTIFICATION_KEY = 'restaurant.notifications';
const listeners = new Set<() => void>();
let notificationsCache = readStorage<AppNotification[]>(NOTIFICATION_KEY, []);

function notify() {
    listeners.forEach((listener) => listener());
}

function persist(notifications: AppNotification[]) {
    notificationsCache = notifications;
    writeStorage(NOTIFICATION_KEY, notifications);
    notify();
}

export const notificationService = {
    getNotifications() {
        return notificationsCache;
    },
    add(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
        const notifications = this.getNotifications();
        const next: AppNotification = {
            ...notification,
            id: createId('notification'),
            createdAt: new Date().toISOString(),
            read: false,
        };

        persist([next, ...notifications]);

        return next;
    },
    addOrderNotifications(order: Order) {
        this.add({
            title: 'Order received',
            message: `Your order ${order.orderNumber} has been received and is awaiting preparation.`,
            type: 'order_received',
            targetRole: 'customer',
            orderId: order.id,
            orderStatus: 'received',
        });

        this.add({
            title: 'New pickup order received',
            message: `${order.customerName} placed ${order.items[0]?.foodName} for cash pickup.`,
            type: 'system',
            targetRole: 'admin',
            orderId: order.id,
            orderStatus: 'received',
        });
    },
    addReviewPendingNotification(input: { customerName: string; reviewId: string; foodName?: string }) {
        this.add({
            title: 'New customer review pending approval',
            message: input.foodName
                ? `${input.customerName} submitted a review for ${input.foodName}.`
                : `${input.customerName} submitted a new customer review.`,
            type: 'review_pending',
            targetRole: 'admin',
            reviewId: input.reviewId,
        });
    },
    addSystemNotification(input: { title: string; message: string; targetRole: 'customer' | 'admin' }) {
        this.add({
            title: input.title,
            message: input.message,
            type: 'system',
            targetRole: input.targetRole,
        });
    },
    markRead(id: string) {
        const notifications = this.getNotifications().map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
        );

        persist(notifications);
    },
    markAllRead(targetRole?: 'customer' | 'admin') {
        const notifications = this.getNotifications().map((notification) =>
            ! targetRole || notification.targetRole === targetRole
                ? { ...notification, read: true }
                : notification,
        );

        persist(notifications);
    },
    subscribe(listener: () => void) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    },
};
