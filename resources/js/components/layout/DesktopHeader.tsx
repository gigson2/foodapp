import { Bell, FlameKindling, MapPin, UserRound } from 'lucide-react';
import { cn } from '@/utils/classNames';
import { Button } from '@/components/common/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { AppNotification } from '@/types';

type DesktopHeaderProps = {
    activeSection: 'home' | 'menu' | 'reviews' | 'contact' | 'account';
    customerName?: string;
    isLoggedIn: boolean;
    notifications: AppNotification[];
    onAccount: () => void;
    onGoContact: () => void;
    onGoHome: () => void;
    onGoMenu: () => void;
    onGoReviews: () => void;
    onMarkAllRead: () => void;
    onMarkRead: (id: string) => void;
    unreadCount: number;
};

export function DesktopHeader({
    activeSection,
    customerName,
    isLoggedIn,
    notifications,
    onAccount,
    onGoContact,
    onGoHome,
    onGoMenu,
    onGoReviews,
    onMarkAllRead,
    onMarkRead,
    unreadCount,
}: DesktopHeaderProps) {
    const navItems = [
        { id: 'home', label: 'Home', onClick: onGoHome },
        { id: 'menu', label: 'Menu', onClick: onGoMenu },
        { id: 'reviews', label: 'Reviews', onClick: onGoReviews },
        { id: 'contact', label: 'Contact', onClick: onGoContact },
        { id: 'account', label: 'Account', onClick: onAccount },
    ] as const;

    return (
        <div className="hidden lg:block">
            <div className="top-utility">
                <div className="section-shell flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-sm text-muted">
                        <MapPin className="h-4 w-4 text-[color:var(--primary-500)]" />
                        <span>Welcome to Dri Africain Traditional Grill LLC</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <NotificationBell
                                notifications={notifications}
                                onMarkAllRead={onMarkAllRead}
                                onMarkRead={onMarkRead}
                                unreadCount={unreadCount}
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[color:var(--text-800)]">
                                <Bell className="h-4 w-4" />
                            </div>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <header className="brand-nav">
                <div className="section-shell flex min-h-24 items-center justify-between gap-8">
                    <button className="flex items-center gap-4" onClick={onGoHome} type="button">
                        <div className="flex h-13 w-13 items-center justify-center rounded-full border border-white/10 bg-[color:var(--primary-500)] text-white shadow-[0_16px_36px_rgba(203,69,56,0.25)]">
                            <FlameKindling className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-display text-3xl leading-none">Dri Africain</p>
                            <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-muted">Traditional Grill LLC</p>
                        </div>
                    </button>

                    <nav className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
                        {navItems.map((item) => (
                            <button
                                className={cn(
                                    'theme-link-hover rounded-full px-5 py-3',
                                    activeSection === item.id && 'border-[color:var(--primary-500)]/30 bg-[color:var(--primary-500)]/14 text-[color:var(--primary-500)] shadow-[0_14px_32px_rgba(0,0,0,0.08)]',
                                )}
                                key={item.id}
                                onClick={item.onClick}
                                type="button"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Button onClick={onAccount} size="sm" variant="ghost">
                            <UserRound className="h-4 w-4" />
                            {isLoggedIn ? customerName ?? 'Account' : 'Account'}
                        </Button>
                        <Button onClick={onGoMenu} size="sm">
                            Order Now
                        </Button>
                    </div>
                </div>
            </header>
        </div>
    );
}
