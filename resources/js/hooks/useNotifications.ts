import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
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
    const [permission, setPermission] = useState(() => getNotificationPermission());

    const filtered = useMemo(
        () => notifications.filter((notification) => notification.targetRole === targetRole),
        [notifications, targetRole],
    );

    const unreadCount = filtered.filter((notification) => ! notification.read).length;

    useEffect(() => {
        const updatePermission = () => setPermission(getNotificationPermission());

        updatePermission();
        window.addEventListener('focus', updatePermission);
        window.addEventListener('notification-permission-change', updatePermission as EventListener);

        return () => {
            window.removeEventListener('focus', updatePermission);
            window.removeEventListener('notification-permission-change', updatePermission as EventListener);
        };
    }, []);

    return {
        notifications: filtered as AppNotification[],
        unreadCount,
        permission,
        markRead: (id: string) => notificationService.markRead(id),
        markAllRead: () => notificationService.markAllRead(targetRole),
    };
}
