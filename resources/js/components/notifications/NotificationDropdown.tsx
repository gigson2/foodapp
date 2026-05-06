import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import type { AppNotification } from '@/types';

type NotificationDropdownProps = {
    notifications: AppNotification[];
    onMarkAllRead: () => void;
    onMarkRead: (id: string) => void;
};

export function NotificationDropdown({ notifications, onMarkAllRead, onMarkRead }: NotificationDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = dropdownRef.current;
        if (!el) return;

        const correct = () => {
            el.style.transform = '';
            const rect = el.getBoundingClientRect();
            const leftOverflow = rect.left;
            if (leftOverflow < 8) {
                el.style.transform = `translateX(${8 - leftOverflow}px)`;
            }
        };

        correct();
        window.addEventListener('resize', correct);
        return () => window.removeEventListener('resize', correct);
    }, []);

    const unreadNotifications = notifications
        .filter((notification): notification is AppNotification => Boolean(notification) && !notification.read)
        .slice(0, 3);

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-[calc(100%+0.75rem)] z-[90] w-[min(92vw,24rem)] rounded-[1.75rem] border border-[color:var(--ui-border-strong)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
            style={{ background: 'color-mix(in srgb, var(--background-100) 96%, black 4%)' }}
        >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="mt-1 text-xs text-muted">Order updates, review events, and account alerts.</p>
                </div>
                <Button disabled={unreadNotifications.length === 0} onClick={onMarkAllRead} size="sm" variant="secondary">
                    <CheckCheck className="h-4 w-4" />
                    Mark all read
                </Button>
            </div>

            {unreadNotifications.length === 0 ? (
                <EmptyState description="Only the latest unread account updates appear here. Open your notification page for history." title="No unread notifications" />
            ) : (
                <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-1">
                    {unreadNotifications.map((notification) => (
                        <div
                            className="ui-surface-solid ui-card-hover w-full rounded-[1.5rem] px-4 py-3 text-left"
                            key={notification.id}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">{notification.title ?? 'Notification'}</p>
                                    <p className="mt-1 text-sm leading-6 text-muted">{notification.message ?? 'No message available.'}</p>
                                </div>
                                <Badge className="shrink-0 bg-[color:var(--accent-500)]/16 text-[color:var(--accent-900)]">
                                    New
                                </Badge>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                                <Bell className="h-3.5 w-3.5" />
                                {new Date(notification.createdAt).toLocaleString()}
                            </div>
                            <div className="mt-3 flex justify-end">
                                <Button onClick={() => onMarkRead(notification.id)} size="sm" variant="ghost">
                                    Mark read
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 border-t border-[color:var(--ui-divider)] pt-4">
                <Link className="text-sm font-semibold text-[color:var(--primary-500)]" to="/customer/notifications">
                    Open full notification center
                </Link>
            </div>
        </div>
    );
}
