import { BellRing, Flame } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { AppNotification } from '@/types';

type TabletHeaderProps = {
    customerName?: string;
    isLoggedIn: boolean;
    notifications: AppNotification[];
    onAccount: () => void;
    onGoHome: () => void;
    onGoMenu: () => void;
    onMarkAllRead: () => void;
    onMarkRead: (id: string) => void;
    unreadCount: number;
};

export function TabletHeader({
    customerName,
    isLoggedIn,
    notifications,
    onAccount,
    onGoHome,
    onGoMenu,
    onMarkAllRead,
    onMarkRead,
    unreadCount,
}: TabletHeaderProps) {
    return (
        <header className="section-shell hidden py-4 md:block lg:hidden">
            <div className="glass-card flex items-center justify-between gap-3 px-4 py-3">
                <button className="flex items-center gap-3" onClick={onGoHome} type="button">
                    <div className="rounded-2xl bg-[color:var(--primary-500)]/18 p-2.5 text-[color:var(--primary-900)]">
                        <Flame className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <p className="font-display text-lg font-semibold">Ember Table</p>
                    </div>
                </button>

                <div className="flex items-center gap-2">
                    <Button onClick={onGoHome} size="sm" variant="ghost">Home</Button>
                    <Button onClick={onGoMenu} size="sm" variant="ghost">Menu</Button>
                    <Button onClick={onAccount} size="sm" variant="ghost">
                        {isLoggedIn ? customerName ?? 'Account' : 'Login'}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <NotificationBell
                            notifications={notifications}
                            onMarkAllRead={onMarkAllRead}
                            onMarkRead={onMarkRead}
                            unreadCount={unreadCount}
                        />
                    ) : (
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-muted">
                            <BellRing className="h-4 w-4" />
                        </div>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
