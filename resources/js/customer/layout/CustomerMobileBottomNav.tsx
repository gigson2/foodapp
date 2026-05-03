import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { customerPrimaryNav } from '@/customer/layout/navigation';

export function CustomerMobileBottomNav() {
    return (
        <nav className="ui-surface-solid fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--ui-divider)] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.7rem)] pt-3 md:hidden">
            <div className="grid grid-cols-4 gap-2">
                {customerPrimaryNav
                    .filter((item) => item.mobile)
                    .slice(0, 4)
                    .map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    cn(
                                        'ui-focus-ring flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
                                        isActive ? 'ui-active-nav text-[color:var(--primary-500)]' : 'ui-outline text-muted',
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
            </div>
        </nav>
    );
}
