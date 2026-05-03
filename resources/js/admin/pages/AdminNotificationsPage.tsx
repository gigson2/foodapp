import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TableColumn } from 'react-data-table-component';
import { toast } from 'sonner';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminFilterSelect } from '@/admin/components/common/AdminFilterSelect';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminNotificationService } from '@/admin/services/adminNotificationService';
import type { AdminNotificationItem } from '@/admin/types/adminNotification';
import { markAdminNotificationReadInCache, markAllAdminNotificationsReadInCache } from '@/admin/utils/notificationCache';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';

export function AdminNotificationsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [unreadOnly, setUnreadOnly] = useState('');
    const [broadcastTitle, setBroadcastTitle] = useState('');
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastUrl, setBroadcastUrl] = useState('/customer/notifications');

    const notificationsQuery = useQuery({
        queryKey: ['admin-app', 'notifications', { page, perPage, unreadOnly }],
        queryFn: () => adminNotificationService.getNotifications({ page, perPage, unreadOnly: unreadOnly === 'true' }),
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });

    const markReadMutation = useMutation({
        mutationFn: adminNotificationService.markRead,
        onSuccess: (notification) => {
            toast.success('Notification marked as read');
            markAdminNotificationReadInCache(queryClient, notification.id);
        },
    });

    const markAllMutation = useMutation({
        mutationFn: adminNotificationService.markAllRead,
        onSuccess: () => {
            toast.success('All admin notifications marked as read');
            markAllAdminNotificationsReadInCache(queryClient);
        },
    });
    const broadcastMutation = useMutation({
        mutationFn: adminNotificationService.broadcastToCustomers,
        onSuccess: async (payload) => {
            toast.success(payload.message);
            setBroadcastTitle('');
            setBroadcastMessage('');
            setBroadcastUrl('/customer/notifications');
            await queryClient.invalidateQueries({ queryKey: ['admin-app', 'notifications'] });
        },
    });

    const notifications = notificationsQuery.data?.items ?? [];
    const meta = notificationsQuery.data?.meta;
    const hasUnreadNotifications = notifications.some((notification) => !notification.read);
    const columns: TableColumn<AdminNotificationItem>[] = [
        {
            name: 'Title',
            cell: (notification) => (
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{notification.title}</p>
                        {!notification.read ? <AdminBadge className="border-[color:var(--primary-500)]/30 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]">Unread</AdminBadge> : null}
                    </div>
                    <p className="mt-2 text-sm text-muted">{notification.message}</p>
                </div>
            ),
            grow: 1.8,
        },
        {
            name: 'Type',
            cell: (notification) => <span className="text-sm text-muted">{notification.type.replaceAll('_', ' ')}</span>,
        },
        {
            name: 'Created',
            cell: (notification) => <span className="text-sm text-muted">{formatAdminDateTime(notification.createdAt)}</span>,
        },
        {
            name: 'Action',
            button: true,
            cell: (notification) => !notification.read ? (
                <Button disabled={markReadMutation.isPending} onClick={() => markReadMutation.mutate(notification.id)} size="sm" variant="ghost">
                    Mark read
                </Button>
            ) : null,
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                actions={<Button disabled={markAllMutation.isPending || !hasUnreadNotifications} onClick={() => markAllMutation.mutate()} size="sm" variant="secondary">Mark all read</Button>}
                description="Review new order alerts, pending review notices, and other operational notifications generated from the live restaurant data."
                title="Notifications"
            />

            <AdminSectionCard className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Customer broadcast</p>
                        <h2 className="mt-2 text-3xl">Send live message to all customers</h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                            Use this for break notices, closed ordering windows, sold-out foods, or any live customer-wide update.
                        </p>
                    </div>
                </div>
                <div className="mt-5 grid gap-4">
                    <Input label="Notification title" onChange={(event) => setBroadcastTitle(event.target.value)} placeholder="Ordering closed for tonight" value={broadcastTitle} />
                    <Textarea label="Notification message" onChange={(event) => setBroadcastMessage(event.target.value)} placeholder="We are on a short break and will reopen ordering at 6:00 PM." value={broadcastMessage} />
                    <Input label="Open target" onChange={(event) => setBroadcastUrl(event.target.value)} placeholder="/customer/notifications" value={broadcastUrl} />
                </div>
                <div className="mt-5">
                    <Button
                        disabled={broadcastMutation.isPending || !broadcastTitle.trim() || !broadcastMessage.trim()}
                        onClick={() => broadcastMutation.mutate({
                            title: broadcastTitle.trim(),
                            message: broadcastMessage.trim(),
                            url: broadcastUrl.trim() || '/customer/notifications',
                        })}
                        size="sm"
                    >
                        Send live customer notification
                    </Button>
                </div>
            </AdminSectionCard>

            <AdminSectionCard className="overflow-hidden">
                <div className="border-b border-white/10 px-5 py-5">
                    <div className="max-w-xs">
                        <AdminFilterSelect
                            label="Filter"
                            onChange={(value) => { setUnreadOnly(value); setPage(1); }}
                            options={[
                                { label: 'All notifications', value: '' },
                                { label: 'Unread only', value: 'true' },
                            ]}
                            value={unreadOnly}
                        />
                    </div>
                </div>

                {meta ? (
                    <AdminDataTable
                        columns={columns}
                        currentPage={page}
                        data={notifications}
                        loading={notificationsQuery.isLoading}
                        perPage={perPage}
                        totalRows={meta.total}
                        onPageChange={setPage}
                        onPerPageChange={(nextPerPage) => {
                            setPerPage(nextPerPage);
                            setPage(1);
                        }}
                    />
                ) : null}
            </AdminSectionCard>
        </div>
    );
}
