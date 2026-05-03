import { LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { adminPrimaryNav, adminSecondaryNav, adminSettingsNav } from '@/admin/layout/navigation';

type AdminMobileDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
};

export function AdminMobileDrawer({ isOpen, onClose, onLogout }: AdminMobileDrawerProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={onClose}>
            <div className="absolute inset-y-0 left-0 w-[85vw] max-w-sm overflow-y-auto border-r border-white/10 bg-[color:var(--background-50)] p-5" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="font-display text-3xl leading-none">Dri Africain</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">Admin dashboard</p>
                    </div>
                    <button aria-label="Close navigation drawer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6" onClick={onClose} type="button">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <nav className="mt-8 space-y-2">
                    {adminPrimaryNav.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 rounded-[1.15rem] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition',
                                        isActive
                                            ? 'border-[color:var(--primary-500)]/26 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]'
                                            : 'border-white/10 bg-white/5 hover:border-[color:var(--primary-500)]/22 hover:bg-[color:var(--primary-500)]/8',
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
                </nav>

                <div className="mt-8 space-y-2 border-t border-white/10 pt-5">
                    <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Settings</p>
                    {adminSettingsNav.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 rounded-[1.15rem] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition',
                                        isActive
                                            ? 'border-[color:var(--primary-500)]/26 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]'
                                            : 'border-white/10 bg-white/5 hover:border-[color:var(--primary-500)]/22 hover:bg-[color:var(--primary-500)]/8',
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

                <div className="mt-8 space-y-2 border-t border-white/10 pt-5">
                    {adminSecondaryNav.filter((item) => !item.isAction).map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 rounded-[1.15rem] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition',
                                        isActive
                                            ? 'border-[color:var(--primary-500)]/26 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]'
                                            : 'border-white/10 bg-white/5 hover:border-[color:var(--primary-500)]/22 hover:bg-[color:var(--primary-500)]/8',
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

                <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-[1.15rem] border border-rose-500/28 bg-rose-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-rose-300" onClick={onLogout} type="button">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}
