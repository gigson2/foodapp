import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import { formatDateTime } from '@/utils/admin';

export function AdminNotificationsPage() {
    const queryClient = useQueryClient();
    const notificationsQuery = useQuery({
        queryKey: ['admin', 'notifications'],
        queryFn: adminService.getNotifications,
    });

    const markReadMutation = useMutation({
        mutationFn: adminService.markNotificationRead,
        onSuccess: async () => {
            toast.success('Notification marked as read');
            await queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: adminService.markAllNotificationsRead,
        onSuccess: async () => {
            toast.success('All notifications marked as read');
            await queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
        },
    });

    const notifications = notificationsQuery.data ?? [];

    return (
        <div className="space-y-5">
            <AdminPageHeading
                actions={
                    <Button onClick={() => markAllReadMutation.mutate()} variant="secondary">
                        Mark all read
                    </Button>
                }
                description="Review order-related and system notifications sent to the admin account."
                title="Admin notifications"
            />

            <AdminTableCard
                description="Database notifications for new orders, customer activity, and moderation events."
                title="Notifications"
            >
                {notificationsQuery.isLoading ? (
                    <div className="p-6">
                        <LoadingSpinner />
                    </div>
                ) : notifications.length === 0 ? (
                    <EmptyState description="Notifications will appear as the platform records new events." title="No notifications yet" />
                ) : (
                    <div className="divide-y divide-white/6">
                        {notifications.map((notification) => (
                            <div className="px-5 py-4" key={notification.id}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold">{notification.type}</p>
                                        <p className="mt-1 text-xs text-muted">{formatDateTime(notification.created_at)}</p>
                                    </div>
                                    {notification.read_at ? (
                                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Read</span>
                                    ) : (
                                        <Button onClick={() => markReadMutation.mutate(notification.id)} size="sm" variant="ghost">
                                            Mark read
                                        </Button>
                                    )}
                                </div>
                                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[1rem] border border-white/10 bg-white/6 p-4 text-xs text-muted">
                                    {JSON.stringify(notification.data, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </AdminTableCard>
        </div>
    );
}
