import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminNotificationService } from '@/admin/services/adminNotificationService';
import { markAdminNotificationReadInCache, markAllAdminNotificationsReadInCache } from '@/admin/utils/notificationCache';

export function useAdminNotifications() {
    const queryClient = useQueryClient();
    const notificationsQuery = useQuery({
        queryKey: ['admin-app', 'notifications', 'header'],
        queryFn: () => adminNotificationService.getNotifications({ page: 1, perPage: 10 }),
        staleTime: 15_000,
    });
    const unreadCountQuery = useQuery({
        queryKey: ['admin-app', 'notifications', 'unread-count'],
        queryFn: () => adminNotificationService.getNotifications({ page: 1, perPage: 1, unreadOnly: true }),
        staleTime: 15_000,
    });

    const markReadMutation = useMutation({
        mutationFn: adminNotificationService.markRead,
        onSuccess: (notification) => {
            markAdminNotificationReadInCache(queryClient, notification.id);
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: adminNotificationService.markAllRead,
        onSuccess: () => {
            markAllAdminNotificationsReadInCache(queryClient);
        },
    });

    const notifications = notificationsQuery.data?.items ?? [];
    const unreadCount = unreadCountQuery.data?.meta.total ?? notifications.filter((notification) => !notification.read).length;

    return {
        ...notificationsQuery,
        notifications,
        unreadCount,
        markRead: (notificationId: string) => markReadMutation.mutate(notificationId),
        markAllRead: () => markAllReadMutation.mutate(),
        isMutating: markReadMutation.isPending || markAllReadMutation.isPending,
    };
}
