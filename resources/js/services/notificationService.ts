import type { AppNotification, Order } from '@/types';
import { createId } from '@/utils/ids';
import { readStorage, writeStorage } from '@/utils/storage';

const NOTIFICATION_KEY = 'restaurant.notifications';
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((listener) => listener());
}

function persist(notifications: AppNotification[]) {
    writeStorage(NOTIFICATION_KEY, notifications);
    notify();
}

export const notificationService = {
    getNotifications() {
        return readStorage<AppNotification[]>(NOTIFICATION_KEY, []);
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
            title: 'New pickup order',
            message: `${order.customerName} placed ${order.items[0]?.foodName} for pickup.`,
            type: 'new_order',
            targetRole: 'admin',
            orderId: order.id,
            orderStatus: 'received',
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
