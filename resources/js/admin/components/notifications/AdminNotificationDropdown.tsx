import { Link } from 'react-router-dom';
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
    return (
        <div className="ui-surface-solid absolute right-0 top-[calc(100%+0.75rem)] z-30 hidden w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] md:block">
            <div className="flex items-center justify-between border-b px-5 py-4 ui-divider">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Notifications</p>
                    <h2 className="mt-1 text-2xl">Admin alerts</h2>
                </div>
                <button className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--primary-500)]" onClick={onMarkAllRead} type="button">
                    Mark all read
                </button>
            </div>

            {notifications.length === 0 ? (
                <AdminEmptyState description="Alerts for new orders, reviews, and system activity will appear here." title="No alerts yet" />
            ) : (
                <div className="max-h-[24rem] overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                        <div className="border-b px-5 py-4 ui-divider" key={notification.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold">{notification.title}</p>
                                        {!notification.read ? <AdminBadge className="border-[color:var(--primary-500)]/30 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]">Unread</AdminBadge> : null}
                                    </div>
                                    <p className="text-sm leading-7 text-muted">{notification.message}</p>
                                    <p className="text-xs text-muted">{formatAdminDateTime(notification.createdAt)}</p>
                                </div>
                                {!notification.read ? (
                                    <button className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--primary-500)]" onClick={() => onMarkRead(notification.id)} type="button">
                                        Read
                                    </button>
                                ) : null}
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
