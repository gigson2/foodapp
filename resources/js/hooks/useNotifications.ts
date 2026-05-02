import { useMemo, useSyncExternalStore } from 'react';
import { notificationService } from '@/services/notificationService';
import { getNotificationPermission } from '@/services/pwaService';
import type { AppNotification } from '@/types';

function subscribe(listener: () => void) {
    return notificationService.subscribe(listener);
}

function getSnapshot() {
    return notificationService.getNotifications();
}

export function useNotifications(targetRole: 'customer' | 'admin' = 'customer') {
    const notifications = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const filtered = useMemo(
        () => notifications.filter((notification) => notification.targetRole === targetRole),
        [notifications, targetRole],
    );

    const unreadCount = filtered.filter((notification) => ! notification.read).length;

    return {
        notifications: filtered as AppNotification[],
        unreadCount,
        permission: getNotificationPermission(),
        markRead: (id: string) => notificationService.markRead(id),
        markAllRead: () => notificationService.markAllRead(targetRole),
    };
}
