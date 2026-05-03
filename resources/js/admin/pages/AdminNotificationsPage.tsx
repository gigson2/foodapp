import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TableColumn } from 'react-data-table-component';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminFilterSelect } from '@/admin/components/common/AdminFilterSelect';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminNotificationService } from '@/admin/services/adminNotificationService';
import type { AdminNotificationItem } from '@/admin/types/adminNotification';
import { formatAdminDateTime } from '@/admin/utils/adminDates';

export function AdminNotificationsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [unreadOnly, setUnreadOnly] = useState('');

    const notificationsQuery = useQuery({
        queryKey: ['admin-app', 'notifications', { page, perPage, unreadOnly }],
        queryFn: () => adminNotificationService.getNotifications({ page, perPage, unreadOnly: unreadOnly === 'true' }),
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });

    const markReadMutation = useMutation({
        mutationFn: adminNotificationService.markRead,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'dashboard'] }),
            ]);
        },
    });

    const markAllMutation = useMutation({
        mutationFn: adminNotificationService.markAllRead,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'dashboard'] }),
            ]);
        },
    });

    const notifications = notificationsQuery.data?.items ?? [];
    const meta = notificationsQuery.data?.meta;
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
                <button className="text-sm font-semibold text-[color:var(--primary-500)]" onClick={() => markReadMutation.mutate(notification.id)} type="button">
                    Mark read
                </button>
            ) : <span className="text-sm text-muted">Read</span>,
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                actions={<button className="text-sm font-semibold text-[color:var(--primary-500)]" onClick={() => markAllMutation.mutate()} type="button">Mark all read</button>}
                description="Review new order alerts, pending review notices, and other operational notifications generated from the live restaurant data."
                title="Notifications"
            />

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
