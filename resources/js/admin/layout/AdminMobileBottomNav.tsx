import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { adminPrimaryNav } from '@/admin/layout/navigation';

type AdminMobileBottomNavProps = {
    onOpenMore: () => void;
};

export function AdminMobileBottomNav({ onOpenMore }: AdminMobileBottomNavProps) {
    const mobileItems = adminPrimaryNav.filter((item) => item.mobile).slice(0, 4);

    return (
        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t ui-divider bg-[color:var(--ui-surface-solid)]/96 px-3 py-3 backdrop-blur-xl md:hidden">
            <div className="grid grid-cols-5 gap-2">
                {mobileItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            className={({ isActive }) =>
                                cn(
                                    'flex flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted transition',
                                    isActive ? 'ui-active-nav text-[color:var(--primary-500)]' : 'ui-surface-solid hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)]',
                                )
                            }
                            key={item.key}
                            to={item.to!}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.shortLabel}</span>
                        </NavLink>
                    );
                })}

                <button className="ui-surface-solid ui-focus-ring flex flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted transition hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)]" onClick={onOpenMore} type="button">
                    <span className="text-base leading-none">•••</span>
                    <span>More</span>
                </button>
            </div>
        </nav>
    );
}
