import { Menu, Store } from 'lucide-react';
import type { AppNotification } from '@/types';
import { Button } from '@/components/common/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

type CustomerHeaderProps = {
    brandName: string;
    currentUserName: string;
    notifications: AppNotification[];
    unreadCount: number;
    onMarkRead: (notificationId: string) => void;
    onMarkAllRead: () => void;
    onOpenDrawer: () => void;
    onVisitStore: () => void;
};

export function CustomerHeader({
    brandName,
    currentUserName,
    notifications,
    unreadCount,
    onMarkRead,
    onMarkAllRead,
    onOpenDrawer,
    onVisitStore,
}: CustomerHeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-[color:var(--ui-divider)] bg-[color:var(--background-50)]/92 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        aria-label="Open customer menu"
                        className="ui-surface-solid ui-focus-ring flex h-11 w-11 items-center justify-center rounded-full md:hidden"
                        onClick={onOpenDrawer}
                        type="button"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="min-w-0">
                        <p className="text-sm text-muted">Signed in as {currentUserName} at {brandName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button className="hidden md:inline-flex" onClick={onVisitStore} size="sm" variant="secondary">
                        <Store className="h-4 w-4" />
                        Visit store
                    </Button>
                    <NotificationBell
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
