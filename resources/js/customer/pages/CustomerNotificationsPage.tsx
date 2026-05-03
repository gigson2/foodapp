import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing } from 'lucide-react';
import { toast } from 'sonner';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { customerPortalService } from '@/customer/services/customerPortalService';
import { markAllCustomerNotificationsReadInCache, markCustomerNotificationReadInCache } from '@/admin/utils/notificationCache';
import { formatDateTime } from '@/utils/admin';

export function CustomerNotificationsPage() {
    const queryClient = useQueryClient();
    const notificationsQuery = useQuery({
        queryKey: ['customer-portal', 'notifications'],
        queryFn: customerPortalService.getNotifications,
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });

    const markReadMutation = useMutation({
        mutationFn: customerPortalService.markNotificationRead,
        onSuccess: (notification) => {
            toast.success('Notification marked as read');
            markCustomerNotificationReadInCache(queryClient, notification.id);
        },
    });

    const markAllMutation = useMutation({
        mutationFn: customerPortalService.markAllNotificationsRead,
        onSuccess: () => {
            toast.success('Notifications marked as read');
            markAllCustomerNotificationsReadInCache(queryClient);
        },
    });

    if (notificationsQuery.isLoading && !notificationsQuery.data) {
        return (
            <div className="section-shell flex min-h-[40vh] items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    const notifications = notificationsQuery.data ?? [];
    const hasUnreadNotifications = notifications.some((notification) => !notification.read);

    return (
        <div className="section-shell space-y-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="section-eyebrow">Customer dashboard</p>
                    <h2 className="mt-4 text-4xl sm:text-5xl">Notifications</h2>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                        Read customer-specific updates for order status, review moderation, and system activity linked to your account.
                    </p>
                </div>
                <Button disabled={markAllMutation.isPending || !hasUnreadNotifications} onClick={() => markAllMutation.mutate()} size="sm" variant="secondary">
                    Mark all read
                </Button>
            </div>

            <AdminSectionCard className="overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <BellRing className="mx-auto h-8 w-8 text-[color:var(--primary-500)]" />
                        <p className="mt-4 text-sm text-muted">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[color:var(--ui-divider)]">
                        {notifications.map((notification) => (
                            <div className="px-5 py-5" key={notification.id}>
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="font-semibold">{notification.title}</p>
                                            {!notification.read ? <span className="ui-outline-accent rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--primary-500)]">Unread</span> : null}
                                        </div>
                                        <p className="mt-2 text-sm leading-7 text-muted">{notification.message}</p>
                                        <p className="mt-3 text-xs text-muted">{formatDateTime(notification.createdAt)}</p>
                                    </div>
                                    {!notification.read ? (
                                        <Button disabled={markReadMutation.isPending} onClick={() => markReadMutation.mutate(notification.id)} size="sm" variant="ghost">
                                            Mark read
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AdminSectionCard>
        </div>
    );
}
