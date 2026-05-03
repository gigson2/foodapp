import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AdminNotificationItem } from '@/admin/types/adminNotification';
import { AdminNotificationDropdown } from '@/admin/components/notifications/AdminNotificationDropdown';

type AdminNotificationBellProps = {
    notifications: AdminNotificationItem[];
    unreadCount: number;
    onMarkRead: (notificationId: string) => void;
    onMarkAllRead: () => void;
};

export function AdminNotificationBell({
    notifications,
    unreadCount,
    onMarkRead,
    onMarkAllRead,
}: AdminNotificationBellProps) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative">
            <button
                aria-label="Open admin notifications"
                className="ui-surface-solid ui-focus-ring relative inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--text-950)] transition hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)]"
                onClick={() => {
                    if (window.innerWidth < 768) {
                        navigate('/admin/notifications');
                        return;
                    }

                    setOpen((current) => !current);
                }}
                type="button"
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--primary-500)] px-1 text-[0.65rem] font-bold text-white">
                        {unreadCount}
                    </span>
                ) : null}
            </button>

            {open ? (
                <AdminNotificationDropdown
                    notifications={notifications}
                    onMarkAllRead={() => {
                        onMarkAllRead();
                        setOpen(false);
                    }}
                    onMarkRead={(notificationId) => onMarkRead(notificationId)}
                />
            ) : null}
        </div>
    );
}
