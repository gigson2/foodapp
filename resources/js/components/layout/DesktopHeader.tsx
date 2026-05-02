import { BellRing, Flame } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { AppNotification } from '@/types';

type DesktopHeaderProps = {
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

export function DesktopHeader({
    customerName,
    isLoggedIn,
    notifications,
    onAccount,
    onGoHome,
    onGoMenu,
    onMarkAllRead,
    onMarkRead,
    unreadCount,
}: DesktopHeaderProps) {
    return (
        <header className="section-shell hidden py-5 lg:block">
            <div className="glass-card flex items-center justify-between px-5 py-4">
                <button className="flex items-center gap-3" onClick={onGoHome} type="button">
                    <div className="rounded-2xl bg-[color:var(--primary-500)]/18 p-3 text-[color:var(--primary-900)]">
                        <Flame className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <p className="font-display text-xl font-semibold">Ember Table</p>
                        <p className="text-sm text-muted">Pickup kitchen and grill room</p>
                    </div>
                </button>

                <nav className="flex items-center gap-3">
                    <Button onClick={onGoHome} variant="ghost">Home</Button>
                    <Button onClick={onGoMenu} variant="ghost">Menu</Button>
                    <Button onClick={onAccount} variant="ghost">
                        {isLoggedIn ? customerName ?? 'Account' : 'Account / Login'}
                    </Button>
                </nav>

                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <NotificationBell
                            notifications={notifications}
                            onMarkAllRead={onMarkAllRead}
                            onMarkRead={onMarkRead}
                            unreadCount={unreadCount}
                        />
                    ) : (
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-3 py-2 text-sm text-muted">
                            <BellRing className="h-4 w-4" />
                            Sign in for updates
                        </div>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
