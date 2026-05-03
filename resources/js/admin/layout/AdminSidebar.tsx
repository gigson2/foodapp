import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { adminPrimaryNav, adminSecondaryNav, adminSettingsNav } from '@/admin/layout/navigation';

type AdminSidebarProps = {
    onLogout: () => void;
};

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            'group flex items-center gap-3 rounded-[1.25rem] px-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition ui-focus-ring',
            isActive
                ? 'ui-active-nav text-[color:var(--primary-500)]'
                : 'ui-surface-solid text-[color:var(--text-900)] hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)]',
        );

    const renderLink = (to: string, label: string, shortLabel: string, Icon: typeof adminPrimaryNav[number]['icon']) => (
        <NavLink className={navClass} key={to} to={to}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">{label}</span>
            <span className="xl:hidden">{shortLabel}</span>
        </NavLink>
    );

    return (
        <aside className="hidden md:block md:w-24 xl:w-[16.25rem]">
            <div className="sticky top-24 space-y-4 pb-6">
                <div className="ui-surface rounded-[1.75rem] p-4">
                    <p className="font-display text-2xl leading-none xl:text-3xl">Dri Africain</p>
                    <p className="mt-2 hidden text-xs uppercase tracking-[0.16em] text-muted xl:block">Traditional Grill LLC</p>
                </div>

                <nav className="space-y-2">
                    {adminPrimaryNav.map((item) => renderLink(item.to!, item.label, item.shortLabel, item.icon))}
                </nav>

                <div className="space-y-2 border-t pt-4 ui-divider">
                    <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Settings</p>
                    {adminSettingsNav.map((item) => renderLink(item.to!, item.label, item.shortLabel, item.icon))}
                </div>

                <div className="space-y-2 border-t pt-4 ui-divider">
                    {adminSecondaryNav.filter((item) => !item.isAction).map((item) => renderLink(item.to!, item.label, item.shortLabel, item.icon))}
                    <button
                        className="ui-focus-ring mb-2 mt-2 flex w-full items-center gap-3 rounded-[1.25rem] border border-rose-500/30 bg-rose-500/12 px-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-rose-400 shadow-[0_14px_28px_rgba(140,40,32,0.12)] transition hover:border-rose-500/42 hover:bg-rose-500/18"
                        onClick={onLogout}
                        type="button"
                    >
                        {(() => {
                            const LogoutIcon = adminSecondaryNav.find((item) => item.isAction)?.icon;

                            return LogoutIcon ? <LogoutIcon className="h-4 w-4 shrink-0" /> : null;
                        })()}
                        <span className="hidden xl:inline">Logout</span>
                        <span className="xl:hidden">Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
