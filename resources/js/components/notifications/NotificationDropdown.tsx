import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/common/Badge';
import type { AppNotification } from '@/types';

type NotificationDropdownProps = {
    notifications: AppNotification[];
    onMarkAllRead: () => void;
    onMarkRead: (id: string) => void;
};

export function NotificationDropdown({ notifications, onMarkAllRead, onMarkRead }: NotificationDropdownProps) {
    return (
        <div className="glass-card-strong absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(92vw,24rem)] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="mt-1 text-xs text-muted">Order updates and pickup alerts appear here.</p>
                </div>
                <Button onClick={onMarkAllRead} size="sm" variant="ghost">
                    <CheckCheck className="h-4 w-4" />
                    Read all
                </Button>
            </div>

            {notifications.length === 0 ? (
                <EmptyState
                    description="Your notifications will appear here once you place an order."
                    title="No notifications yet"
                />
            ) : (
                <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-1">
                    {notifications.map((notification) => (
                        <button
                            className="w-full rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-3 text-left transition hover:bg-white/10"
                            key={notification.id}
                            onClick={() => onMarkRead(notification.id)}
                            type="button"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">{notification.title}</p>
                                    <p className="mt-1 text-sm leading-6 text-muted">{notification.message}</p>
                                </div>
                                {! notification.read ? <Badge className="shrink-0 bg-[color:var(--accent-500)]/16 text-[color:var(--accent-900)]">New</Badge> : null}
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                                <Bell className="h-3.5 w-3.5" />
                                {new Date(notification.createdAt).toLocaleString()}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
