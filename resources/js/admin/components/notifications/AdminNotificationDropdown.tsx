import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import type { AdminNotificationItem } from '@/admin/types/adminNotification';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminEmptyState } from '@/admin/components/common/AdminEmptyState';

type AdminNotificationDropdownProps = {
    notifications: AdminNotificationItem[];
    onMarkAllRead: () => void;
    onMarkRead: (notificationId: string) => void;
};

export function AdminNotificationDropdown({
    notifications,
    onMarkAllRead,
    onMarkRead,
}: AdminNotificationDropdownProps) {
    const unreadNotifications = notifications.filter((notification) => !notification.read).slice(0, 3);

    return (
        <div
            className="absolute right-0 top-[calc(100%+0.75rem)] z-[90] hidden w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-[color:var(--ui-border-strong)] shadow-[0_24px_60px_rgba(0,0,0,0.24)] md:block"
            style={{ background: 'color-mix(in srgb, var(--background-100) 96%, black 4%)' }}
        >
            <div className="flex items-center justify-between border-b px-5 py-4 ui-divider">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Notifications</p>
                    <h2 className="mt-1 text-2xl">Admin alerts</h2>
                </div>
                <Button disabled={unreadNotifications.length === 0} onClick={onMarkAllRead} size="sm" variant="secondary">Mark all read</Button>
            </div>

            {unreadNotifications.length === 0 ? (
                <AdminEmptyState description="Only the latest unread admin alerts appear here. Open the full notification page for history." title="No unread alerts" />
            ) : (
                <div className="max-h-[24rem] overflow-y-auto">
                    {unreadNotifications.map((notification) => (
                        <div className="border-b px-5 py-4 ui-divider" key={notification.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold">{notification.title}</p>
                                        <AdminBadge className="border-[color:var(--primary-500)]/30 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]">Unread</AdminBadge>
                                    </div>
                                    <p className="text-sm leading-7 text-muted">{notification.message}</p>
                                    <p className="text-xs text-muted">{formatAdminDateTime(notification.createdAt)}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <Button onClick={() => onMarkRead(notification.id)} size="sm" variant="ghost">Mark read</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t px-5 py-4 ui-divider">
                <Link className="text-sm font-semibold text-[color:var(--primary-500)]" to="/admin/notifications">
                    Open full notification center
                </Link>
            </div>
        </div>
    );
}
