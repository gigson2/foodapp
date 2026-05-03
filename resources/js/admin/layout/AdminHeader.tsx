import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { AdminNotificationItem } from '@/admin/types/adminNotification';
import { getAdminRouteLabel } from '@/admin/layout/navigation';
import { AdminNotificationBell } from '@/admin/components/notifications/AdminNotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

type AdminHeaderProps = {
    currentUserName: string;
    notifications: AdminNotificationItem[];
    unreadCount: number;
    onMarkRead: (notificationId: string) => void;
    onMarkAllRead: () => void;
    onOpenDrawer: () => void;
};

export function AdminHeader({
    currentUserName,
    notifications,
    unreadCount,
    onMarkRead,
    onMarkAllRead,
    onOpenDrawer,
}: AdminHeaderProps) {
    const location = useLocation();
    const routeLabel = getAdminRouteLabel(location.pathname);

    return (
        <header className="sticky top-0 z-30 border-b ui-divider bg-[color:var(--ui-surface)]/94 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button aria-label="Open admin navigation" className="ui-surface-solid ui-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden" onClick={onOpenDrawer} type="button">
                        <Menu className="h-4 w-4" />
                    </button>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Admin</p>
                        <h1 className="mt-1 text-2xl sm:text-3xl">{routeLabel}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right lg:block">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Signed in</p>
                        <p className="mt-1 text-sm font-semibold">{currentUserName}</p>
                    </div>
                    <AdminNotificationBell
                        notifications={notifications}
                        onMarkAllRead={onMarkAllRead}
                        onMarkRead={onMarkRead}
                        unreadCount={unreadCount}
                    />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
