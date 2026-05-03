import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { customerPrimaryNav, customerSecondaryNav } from '@/customer/layout/navigation';

type CustomerSidebarProps = {
    brandLogoUrl?: string | null;
    brandName: string;
    onLogout: () => void;
};

export function CustomerSidebar({ brandLogoUrl, brandName, onLogout }: CustomerSidebarProps) {
    return (
        <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] shrink-0 md:block md:w-[6.25rem] xl:w-[260px]">
            <div className="ui-surface-solid flex h-full flex-col rounded-[2rem] p-4 md:px-3 md:py-4 xl:p-5">
                <div className="ui-surface-raised rounded-[1.75rem] p-4 md:px-3 md:py-4 xl:p-4">
                    <div className="flex items-center gap-3 md:flex-col md:items-center md:text-center xl:flex-row xl:items-center xl:text-left">
                        {brandLogoUrl ? <img alt={`${brandName} logo`} className="h-12 w-auto object-contain" src={brandLogoUrl} /> : null}
                        <div>
                            <p className="hidden font-display text-2xl leading-none xl:block">{brandName}</p>
                            <p className="text-xs uppercase tracking-[0.16em] text-muted md:mt-0 xl:mt-2">Customer portal</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-6 flex-1 space-y-2">
                    {customerPrimaryNav.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    cn(
                                        'ui-focus-ring flex rounded-2xl border border-transparent font-semibold transition md:flex-col md:items-center md:justify-center md:gap-2 md:px-2 md:py-3 md:text-[0.68rem] xl:flex-row xl:items-center xl:justify-start xl:gap-3 xl:px-4 xl:py-3 xl:text-sm',
                                        isActive
                                            ? 'ui-active-nav text-[color:var(--primary-500)]'
                                            : 'ui-outline hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-muted)]',
                                    )
                                }
                                key={item.key}
                                to={item.to!}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden text-center leading-tight xl:inline">{item.label}</span>
                                <span className="text-center leading-tight xl:hidden">{item.shortLabel}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-6 space-y-2 pb-4">
                    {customerSecondaryNav.map((item) => {
                        const Icon = item.icon;

                        if (item.isAction) {
                            return (
                                <button
                                    className="ui-focus-ring flex w-full rounded-2xl border border-rose-500/28 bg-rose-500/10 font-semibold text-rose-500 transition hover:bg-rose-500/14 md:flex-col md:items-center md:justify-center md:gap-2 md:px-2 md:py-3 md:text-[0.68rem] xl:flex-row xl:items-center xl:justify-start xl:gap-3 xl:px-4 xl:py-3 xl:text-sm"
                                    key={item.key}
                                    onClick={onLogout}
                                    type="button"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden text-center leading-tight xl:inline">{item.label}</span>
                                    <span className="text-center leading-tight xl:hidden">{item.shortLabel}</span>
                                </button>
                            );
                        }

                        return (
                            <NavLink
                                className="ui-focus-ring ui-outline flex rounded-2xl font-semibold transition hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-muted)] md:flex-col md:items-center md:justify-center md:gap-2 md:px-2 md:py-3 md:text-[0.68rem] xl:flex-row xl:items-center xl:justify-start xl:gap-3 xl:px-4 xl:py-3 xl:text-sm"
                                key={item.key}
                                to={item.to!}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden text-center leading-tight xl:inline">{item.label}</span>
                                <span className="text-center leading-tight xl:hidden">{item.shortLabel}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
