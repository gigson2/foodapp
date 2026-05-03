import { Bell, ChartNoAxesCombined, Drumstick, LayoutDashboard, LogOut, MapPinned, Settings2, ShieldCheck, Tags, Users } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AUTH_SESSION_QUERY_KEY } from '@/hooks/useAuthSession';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { adminService } from '@/services/adminService';
import { cn } from '@/utils/classNames';
import type { AdminUser } from '@/types/admin';

type AdminOutletContext = {
    currentUser: AdminUser;
};

type AdminNavItem = {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
    end?: boolean;
};

const navItems: AdminNavItem[] = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Orders', icon: ChartNoAxesCombined },
    { to: '/admin/foods', label: 'Foods', icon: Drumstick },
    { to: '/admin/categories', label: 'Categories', icon: Tags },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/visitors', label: 'Visitors', icon: MapPinned },
    { to: '/admin/settings/company', label: 'Company', icon: Settings2 },
    { to: '/admin/settings/seo', label: 'SEO', icon: ShieldCheck },
    { to: '/admin/notifications', label: 'Notifications', icon: Bell },
];

export function AdminLayout({ currentUser }: AdminOutletContext) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const logoutMutation = useMutation({
        mutationFn: adminService.logout,
        onSuccess: async () => {
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
            await queryClient.clear();
            navigate('/admin/login', { replace: true });
        },
    });

    return (
        <div className="app-surface min-h-screen">
            <div className="section-shell py-5 lg:py-8">
                <div className="grid gap-6 xl:grid-cols-[17.5rem_minmax(0,1fr)]">
                    <aside className="xl:sticky xl:top-6 xl:h-fit">
                        <Card className="theme-panel overflow-hidden p-4">
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="section-eyebrow">Dri Africain</p>
                                        <h1 className="mt-3 text-3xl">Admin Console</h1>
                                    </div>
                                    <ThemeToggle />
                                </div>
                                <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-black/10 p-4">
                                    <p className="font-semibold">{currentUser.name}</p>
                                    <p className="mt-1 text-sm text-muted">{currentUser.email ?? currentUser.phone ?? 'Admin user'}</p>
                                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--primary-500)]">
                                        {currentUser.role}
                                    </p>
                                </div>
                            </div>

                            <nav className="mt-4 space-y-2" aria-label="Admin navigation">
                                {navItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            className={({ isActive }) =>
                                                cn(
                                                    'flex items-center gap-3 rounded-[1.25rem] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition',
                                                    isActive
                                                        ? 'border-[color:var(--primary-500)]/28 bg-[color:var(--primary-500)]/14 text-[color:var(--primary-500)]'
                                                        : 'border-white/10 bg-white/6 hover:border-[color:var(--primary-500)]/20 hover:bg-[color:var(--primary-500)]/8',
                                                )
                                            }
                                            end={item.end}
                                            key={item.to}
                                            to={item.to}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    );
                                })}
                            </nav>

                            <Button
                                className="mt-4 w-full"
                                onClick={() => logoutMutation.mutate()}
                                variant="ghost"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </Card>
                    </aside>

                    <div className="min-w-0 space-y-5">
                        <Card className="theme-panel p-4 sm:p-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Current route</p>
                                    <p className="mt-2 text-lg font-semibold">{location.pathname.replace('/admin', '') || '/dashboard'}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2">Cash pickup operations</span>
                                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2">Live database-backed admin</span>
                                </div>
                            </div>
                        </Card>

                        <Outlet context={{ currentUser }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
