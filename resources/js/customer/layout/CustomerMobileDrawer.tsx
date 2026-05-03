import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { customerPrimaryNav, customerSecondaryNav } from '@/customer/layout/navigation';

type CustomerMobileDrawerProps = {
    brandName: string;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
};

export function CustomerMobileDrawer({
    brandName,
    isOpen,
    onClose,
    onLogout,
}: CustomerMobileDrawerProps) {
    if (! isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70] md:hidden" role="dialog">
            <button
                aria-label="Close customer menu"
                className="absolute inset-0 bg-[rgba(5,3,16,0.42)] backdrop-blur-[2px]"
                onClick={onClose}
                type="button"
            />
            <aside
                className="ui-surface-solid absolute inset-y-0 left-0 flex w-[min(86vw,22rem)] flex-col rounded-r-[2rem] border-r border-[color:var(--ui-divider)] px-4 py-5 shadow-[0_24px_64px_rgba(0,0,0,0.22)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="ui-surface-raised rounded-[1.5rem] p-4">
                    <p className="font-display text-2xl leading-none">{brandName}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">Customer portal</p>
                </div>

                <div className="mt-6 space-y-2"
                >
                    {customerPrimaryNav.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    cn(
                                        'ui-focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                        isActive ? 'ui-active-nav text-[color:var(--primary-500)]' : 'ui-outline hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-muted)]',
                                    )
                                }
                                key={item.key}
                                onClick={onClose}
                                to={item.to!}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>

                <div className="mt-auto space-y-2 pt-6">
                    {customerSecondaryNav.map((item) => {
                        const Icon = item.icon;

                        if (item.isAction) {
                            return (
                                <button
                                    className="ui-focus-ring flex w-full items-center gap-3 rounded-2xl border border-rose-500/28 bg-rose-500/10 px-4 py-3 text-left text-sm font-semibold text-rose-500 transition hover:bg-rose-500/14"
                                    key={item.key}
                                    onClick={() => {
                                        onClose();
                                        onLogout();
                                    }}
                                    type="button"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <NavLink
                                className="ui-focus-ring ui-outline flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-muted)]"
                                key={item.key}
                                onClick={onClose}
                                to={item.to!}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}
