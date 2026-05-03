import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { adminPrimaryNav, adminSecondaryNav, adminSettingsNav } from '@/admin/layout/navigation';

type AdminSidebarProps = {
    companyLogoUrl?: string | null;
    companyName: string;
    onLogout: () => void;
};

export function AdminSidebar({ companyLogoUrl, companyName, onLogout }: AdminSidebarProps) {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            'group ui-focus-ring flex rounded-[1.25rem] font-semibold uppercase tracking-[0.12em] transition md:flex-col md:items-center md:justify-center md:gap-2 md:px-2 md:py-3 md:text-[0.66rem] xl:flex-row xl:items-center xl:justify-start xl:gap-3 xl:px-3 xl:py-3 xl:text-sm',
            isActive
                ? 'ui-active-nav text-[color:var(--primary-500)]'
                : 'ui-surface-solid text-[color:var(--text-900)] hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)]',
        );

    const renderLink = (to: string, label: string, shortLabel: string, Icon: typeof adminPrimaryNav[number]['icon']) => (
        <NavLink className={navClass} key={to} to={to}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden text-center leading-tight xl:inline">{label}</span>
            <span className="text-center leading-tight xl:hidden">{shortLabel}</span>
        </NavLink>
    );

    return (
        <aside className="hidden md:block md:w-[6.25rem] xl:w-[16.25rem]">
            <div className="sticky top-24 space-y-4 pb-6">
                <div className="ui-surface rounded-[1.75rem] p-4 md:px-3 md:py-4 xl:p-4">
                    {companyLogoUrl ? (
                        <img
                            alt={`${companyName} logo`}
                            className="mx-auto mb-3 h-10 w-auto object-contain xl:mx-0"
                            src={companyLogoUrl}
                        />
                    ) : null}
                    <p className="hidden font-display text-2xl leading-none xl:block xl:text-3xl">{companyName}</p>
                    <div className="text-center xl:hidden">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Admin</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {adminPrimaryNav.map((item) => renderLink(item.to!, item.label, item.shortLabel, item.icon))}
                </nav>

                <div className="space-y-2 border-t pt-4 ui-divider">
                    <p className="hidden px-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted xl:block">Settings</p>
                    {adminSettingsNav.map((item) => renderLink(item.to!, item.label, item.shortLabel, item.icon))}
                </div>

                <div className="space-y-2 border-t pt-4 ui-divider">
                    {adminSecondaryNav.filter((item) => !item.isAction).map((item) => renderLink(item.to!, item.label, item.shortLabel, item.icon))}
                    <button
                        className="ui-focus-ring mb-2 mt-2 flex w-full rounded-[1.25rem] border border-rose-500/30 bg-rose-500/12 text-rose-400 shadow-[0_14px_28px_rgba(140,40,32,0.12)] transition hover:border-rose-500/42 hover:bg-rose-500/18 md:flex-col md:items-center md:justify-center md:gap-2 md:px-2 md:py-3 md:text-[0.66rem] xl:flex-row xl:items-center xl:justify-start xl:gap-3 xl:px-3 xl:py-3 xl:text-sm"
                        onClick={onLogout}
                        type="button"
                    >
                        {(() => {
                            const LogoutIcon = adminSecondaryNav.find((item) => item.isAction)?.icon;

                            return LogoutIcon ? <LogoutIcon className="h-4 w-4 shrink-0" /> : null;
                        })()}
                        <span className="hidden text-center leading-tight xl:inline">Logout</span>
                        <span className="text-center leading-tight xl:hidden">Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
