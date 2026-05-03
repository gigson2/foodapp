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
    return (
        <div className="ui-outline-strong absolute right-0 top-[calc(100%+0.75rem)] z-[80] w-[min(92vw,24rem)] rounded-[1.75rem] p-4 shadow-[var(--ui-shadow-soft)]" style={{ background: 'var(--background-100)' }}>
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="mt-1 text-xs text-muted">Order updates, review events, and account alerts.</p>
                </div>
                <Button onClick={onMarkAllRead} size="sm" variant="ghost">
                    <CheckCheck className="h-4 w-4" />
                    Read all
                </Button>
            </div>

            {notifications.length === 0 ? (
                <EmptyState description="Notifications appear after you place orders or interact with the app." title="No notifications yet" />
            ) : (
                <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-1">
                    {notifications.map((notification) => (
                        <button
                            className="ui-surface-solid ui-card-hover w-full rounded-[1.5rem] px-4 py-3 text-left"
                            key={notification.id}
                            onClick={() => onMarkRead(notification.id)}
                            type="button"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">{notification.title}</p>
                                    <p className="mt-1 text-sm leading-6 text-muted">{notification.message}</p>
                                </div>
                                {! notification.read ? (
                                    <Badge className="shrink-0 bg-[color:var(--accent-500)]/16 text-[color:var(--accent-900)]">
                                        New
                                    </Badge>
                                ) : null}
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
