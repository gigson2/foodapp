import { House, MenuSquare, MessageSquareQuote, UserRound } from 'lucide-react';
import { cn } from '@/utils/classNames';

type MobileBottomNavProps = {
    activeSection: string;
    onAccount: () => void;
    onHome: () => void;
    onMenu: () => void;
    onReviews: () => void;
};

export function MobileBottomNav({ activeSection, onAccount, onHome, onMenu, onReviews }: MobileBottomNavProps) {
    const items = [
        { id: 'home', label: 'Home', icon: House, onClick: onHome },
        { id: 'menu', label: 'Menu', icon: MenuSquare, onClick: onMenu },
        { id: 'reviews', label: 'Reviews', icon: MessageSquareQuote, onClick: onReviews },
        { id: 'account', label: 'Account', icon: UserRound, onClick: onAccount },
    ];

    return (
        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t ui-divider bg-[color:var(--ui-surface-solid)]/96 px-4 py-3 backdrop-blur-xl md:hidden">
            <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <button
                            aria-label={item.label}
                            className={cn(
                                'flex min-h-14 items-center justify-center rounded-full border transition duration-200',
                                isActive
                                    ? 'ui-active-nav text-[color:var(--primary-500)]'
                                    : 'ui-surface-solid text-[color:var(--text-800)] hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)] hover:text-[color:var(--primary-500)]',
                            )}
                            key={item.id}
                            onClick={item.onClick}
                            type="button"
                        >
                            <Icon className="h-5 w-5" />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
