import { Bell, FlameKindling, MapPin } from 'lucide-react';
import { cn } from '@/utils/classNames';
import { Button } from '@/components/common/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { AppNotification } from '@/types';

type TabletHeaderProps = {
    activeSection: 'home' | 'menu' | 'reviews' | 'contact';
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

export function TabletHeader({
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
}: TabletHeaderProps) {
    const navItems = [
        { id: 'home', label: 'Home', onClick: onGoHome },
        { id: 'menu', label: 'Menu', onClick: onGoMenu },
        { id: 'reviews', label: 'Reviews', onClick: onGoReviews },
        { id: 'contact', label: 'Contact', onClick: onGoContact },
    ] as const;

    return (
        <div className="hidden md:block lg:hidden">
            <div className="top-utility relative z-20">
                <div className="section-shell flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        <MapPin className="h-3.5 w-3.5 text-[color:var(--primary-500)]" />
                        Papillion, Nebraska
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[color:var(--text-800)]">
                                <Bell className="h-4 w-4" />
                            </div>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <header className="brand-nav relative z-10 py-4">
                <div className="section-shell flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <button className="flex items-center gap-3" onClick={onGoHome} type="button">
                            {brandLogoUrl ? <img alt={`${brandName} logo`} className="h-12 w-auto shrink-0 object-contain" src={brandLogoUrl} /> : <FlameKindling className="h-7 w-7 shrink-0 text-[color:var(--primary-500)]" />}
                            <div className="max-w-[16rem] text-left">
                                <p className="font-display text-2xl leading-none">{brandName}</p>
                            </div>
                        </button>

                        <div className="flex items-center gap-2">
                            <Button onClick={onAccount} size="sm" variant="ghost">
                                {isLoggedIn ? customerName ?? 'Account' : 'Account'}
                            </Button>
                            <Button onClick={onGoMenu} size="sm">
                                Order Now
                            </Button>
                        </div>
                    </div>

                    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 text-xs font-semibold uppercase tracking-[0.16em]">
                        {navItems.map((item) => (
                            <button
                                className={cn(
                                    'theme-link-hover rounded-full border border-white/10 px-4 py-2.5',
                                    activeSection === item.id && 'border-[color:var(--primary-500)]/32 bg-[color:var(--primary-500)]/14 text-[color:var(--primary-500)] shadow-[0_14px_28px_rgba(0,0,0,0.08)]',
                                )}
                                key={item.id}
                                onClick={item.onClick}
                                type="button"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>
        </div>
    );
}
