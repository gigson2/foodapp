import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { IconButton } from '@/components/common/IconButton';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import type { AppNotification } from '@/types';

type NotificationBellProps = {
    notifications: AppNotification[];
    unreadCount: number;
    onMarkRead: (id: string) => void;
    onMarkAllRead: () => void;
};

export function NotificationBell({
    notifications,
    onMarkAllRead,
    onMarkRead,
    unreadCount,
}: NotificationBellProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (! open) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (rootRef.current && ! rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [open]);

    return (
        <div className="relative" ref={rootRef}>
            <IconButton aria-label="Open notifications" onClick={() => setOpen((current) => ! current)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 ? (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[color:var(--primary-500)]" />
                ) : null}
            </IconButton>

            {open ? (
                <NotificationDropdown
                    notifications={notifications}
                    onMarkAllRead={onMarkAllRead}
                    onMarkRead={(id) => {
                        onMarkRead(id);
                    }}
                />
            ) : null}
        </div>
    );
}
