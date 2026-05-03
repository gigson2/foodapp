import { Bell, FlameKindling, MapPin, UserRound } from 'lucide-react';
import { cn } from '@/utils/classNames';
import { Button } from '@/components/common/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { AppNotification } from '@/types';

type DesktopHeaderProps = {
    activeSection: 'home' | 'menu' | 'reviews' | 'contact' | 'account';
    brandLogoUrl?: string | null;
    brandName: string;
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
    brandLogoUrl,
    brandName,
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
            <div className="top-utility relative z-20">
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
                            <div className="ui-surface-solid flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--text-800)]">
                                <Bell className="h-4 w-4" />
                            </div>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <header className="brand-nav relative z-10">
                <div className="section-shell flex min-h-24 items-center justify-between gap-8">
                    <button className="flex items-center gap-4" onClick={onGoHome} type="button">
                        {brandLogoUrl ? <img alt={`${brandName} logo`} className="h-13 w-auto shrink-0 object-contain" src={brandLogoUrl} /> : <FlameKindling className="h-8 w-8 shrink-0 text-[color:var(--primary-500)]" />}
                        <div className="max-w-[18rem] text-left">
                            <p className="font-display text-3xl leading-none">{brandName}</p>
                        </div>
                    </button>

                    <nav className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
                        {navItems.map((item) => (
                            <button
                                className={cn(
                                    'theme-link-hover rounded-full px-5 py-3',
                                    activeSection === item.id && 'ui-active-nav text-[color:var(--primary-500)]',
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
