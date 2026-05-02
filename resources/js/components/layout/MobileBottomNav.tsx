import { House, MenuSquare, UserRound } from 'lucide-react';
import { cn } from '@/utils/classNames';

type MobileBottomNavProps = {
    activeSection: string;
    onAccount: () => void;
    onHome: () => void;
    onMenu: () => void;
};

export function MobileBottomNav({ activeSection, onAccount, onHome, onMenu }: MobileBottomNavProps) {
    return (
        <nav className="safe-bottom fixed inset-x-4 bottom-3 z-50 md:hidden" aria-label="Mobile primary navigation">
            <div className="glass-card-strong grid grid-cols-3 px-3 py-2">
                <button
                    aria-label="Go to home section"
                    className={cn(
                        'flex h-14 items-center justify-center rounded-2xl transition',
                        activeSection === 'home' ? 'bg-white/12 text-[color:var(--text-950)]' : 'text-muted',
                    )}
                    onClick={onHome}
                    type="button"
                >
                    <House className="h-6 w-6" />
                </button>
                <button
                    aria-label="Go to menu section"
                    className={cn(
                        'flex h-14 items-center justify-center rounded-2xl transition',
                        activeSection === 'menu' ? 'bg-white/12 text-[color:var(--text-950)]' : 'text-muted',
                    )}
                    onClick={onMenu}
                    type="button"
                >
                    <MenuSquare className="h-6 w-6" />
                </button>
                <button
                    aria-label="Open account"
                    className={cn(
                        'flex h-14 items-center justify-center rounded-2xl transition',
                        activeSection === 'account' ? 'bg-white/12 text-[color:var(--text-950)]' : 'text-muted',
                    )}
                    onClick={onAccount}
                    type="button"
                >
                    <UserRound className="h-6 w-6" />
                </button>
            </div>
        </nav>
    );
}
