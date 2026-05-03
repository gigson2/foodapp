import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Bell,
    ChartColumnBig,
    ChevronRight,
    Drumstick,
    LayoutDashboard,
    LoaderCircle,
    Map,
    PackageSearch,
    Settings2,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { adminService } from '@/services/adminService';
import type {
    AdminDashboardMetrics,
    AdminOrderStatus,
} from '@/types/admin';

type AdminSection = 'overview' | 'orders' | 'foods' | 'categories' | 'customers' | 'visitors' | 'settings' | 'notifications';

const statusOptions: AdminOrderStatus[] = ['pending', 'received', 'processing', 'ready_for_pickup', 'completed', 'cancelled'];

function formatDateTime(value?: string | null) {
    if (!value) {
        return 'N/A';
    }

    return new Date(value).toLocaleString();
}

function sectionTitle(section: AdminSection) {
    switch (section) {
        case 'overview':
            return 'Operations overview';
        case 'orders':
            return 'Order management';
        case 'foods':
            return 'Food management';
        case 'categories':
            return 'Category management';
        case 'customers':
            return 'Customer records';
        case 'visitors':
            return 'Visitor analytics';
        case 'settings':
            return 'Company and SEO settings';
        case 'notifications':
            return 'Admin notifications';
    }
}

function AdminMetricCard({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
            <div className="mt-4 text-3xl font-semibold">{value}</div>
        </Card>
    );
}

function AdminTableShell({
    children,
    description,
    title,
}: {
    children: React.ReactNode;
    description: string;
    title: string;
}) {
    return (
        <Card className="overflow-hidden p-0">
            <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
            </div>
            <div className="overflow-x-auto">{children}</div>
        </Card>
    );
}

function AdminEmpty({ title }: { title: string }) {
    return <EmptyState description="This dataset is currently empty." title={title} />;
}

export function AdminConsolePage() {
    const queryClient = useQueryClient();
    const [activeSection, setActiveSection] = useState<AdminSection>('overview');
    const [credentials, setCredentials] = useState({ login: 'admin@driafricain.test', password: 'password' });

    const meQuery = useQuery({
        queryKey: ['admin', 'me'],
        queryFn: adminService.getCurrentUser,
        retry: false,
    });

    const isAuthenticated = Boolean(meQuery.data);
    const isAdmin = meQuery.data?.role === 'admin';

    const loginMutation = useMutation({
        mutationFn: adminService.login,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['admin', 'me'] });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: adminService.logout,
        onSuccess: async () => {
            await queryClient.resetQueries({ queryKey: ['admin'] });
        },
    });

    const dashboardQuery = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: adminService.getDashboard,
        enabled: isAdmin,
    });

    const ordersQuery = useQuery({
        queryKey: ['admin', 'orders'],
        queryFn: adminService.getOrders,
        enabled: isAdmin && activeSection === 'orders',
    });

    const foodsQuery = useQuery({
        queryKey: ['admin', 'foods'],
        queryFn: adminService.getFoods,
        enabled: isAdmin && activeSection === 'foods',
    });

    const categoriesQuery = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: adminService.getCategories,
        enabled: isAdmin && activeSection === 'categories',
    });

    const customersQuery = useQuery({
        queryKey: ['admin', 'customers'],
        queryFn: adminService.getCustomers,
        enabled: isAdmin && activeSection === 'customers',
    });

    const visitorsQuery = useQuery({
        queryKey: ['admin', 'visitors'],
        queryFn: adminService.getVisitors,
        enabled: isAdmin && activeSection === 'visitors',
    });

    const settingsQuery = useQuery({
        queryKey: ['admin', 'company-settings'],
        queryFn: adminService.getCompanySettings,
        enabled: isAdmin && activeSection === 'settings',
    });

    const seoQuery = useQuery({
        queryKey: ['admin', 'seo-settings'],
        queryFn: adminService.getSeoSettings,
        enabled: isAdmin && activeSection === 'settings',
    });

    const notificationsQuery = useQuery({
        queryKey: ['admin', 'notifications'],
        queryFn: adminService.getNotifications,
        enabled: isAdmin && activeSection === 'notifications',
    });

    const orderStatusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: AdminOrderStatus }) => adminService.updateOrderStatus(orderId, status),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
                queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
            ]);
        },
    });

    const navItems = useMemo(
        () => [
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders', icon: PackageSearch },
            { id: 'foods', label: 'Foods', icon: Drumstick },
            { id: 'categories', label: 'Categories', icon: ChartColumnBig },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'visitors', label: 'Visitors', icon: Map },
            { id: 'settings', label: 'Settings', icon: Settings2 },
            { id: 'notifications', label: 'Notifications', icon: Bell },
        ] satisfies Array<{ id: AdminSection; label: string; icon: typeof LayoutDashboard }>,
        [],
    );

    if (meQuery.isLoading) {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-16">
                <Card className="w-full max-w-xl p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="section-eyebrow">Admin access</p>
                            <h1 className="mt-4 text-4xl">Dri Africain admin console</h1>
                            <p className="mt-4 text-base leading-8 text-muted">
                                Sign in with your admin email and password to manage orders, foods, categories, visitors, notifications, and settings.
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>

                    <form
                        className="mt-8 space-y-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            loginMutation.mutate(credentials);
                        }}
                    >
                        <Input
                            autoComplete="username"
                            label="Admin email or phone"
                            onChange={(event) => setCredentials((current) => ({ ...current, login: event.target.value }))}
                            placeholder="admin@driafricain.test"
                            value={credentials.login}
                        />
                        <Input
                            autoComplete="current-password"
                            label="Password"
                            onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                            placeholder="Enter password"
                            type="password"
                            value={credentials.password}
                        />

                        {loginMutation.isError ? (
                            <p className="text-sm text-[color:var(--primary-600)]">
                                Unable to sign in with those credentials.
                            </p>
                        ) : null}

                        <Button className="w-full" type="submit">
                            {loginMutation.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                            Sign in to admin
                        </Button>
                    </form>

                    <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                        Demo admin credentials seeded locally:
                        <br />
                        `admin@driafricain.test` / `password`
                    </div>
                </Card>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-16">
                <Card className="w-full max-w-xl p-6 sm:p-8">
                    <h1 className="text-4xl">Admin role required</h1>
                    <p className="mt-4 text-base leading-8 text-muted">
                        This account is authenticated, but it does not have the admin role required for the operations console.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Button onClick={() => logoutMutation.mutate()} variant="ghost">
                            Logout
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const metrics: AdminDashboardMetrics | undefined = dashboardQuery.data?.metrics;
    const recentOrders = dashboardQuery.data?.recentOrders ?? [];
    const orders = ordersQuery.data ?? [];
    const foods = foodsQuery.data ?? [];
    const categories = categoriesQuery.data ?? [];
    const customers = customersQuery.data ?? [];
    const visitors = visitorsQuery.data ?? [];
    const companySettings = settingsQuery.data;
    const seoSettings = seoQuery.data ?? [];
    const notifications = notificationsQuery.data ?? [];

    return (
        <div className="app-surface min-h-screen">
            <div className="section-shell py-6 lg:py-8">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <aside className="lg:sticky lg:top-6 lg:h-fit lg:w-72">
                        <Card className="p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="section-eyebrow">Admin</p>
                                    <h1 className="mt-3 text-3xl">Operations console</h1>
                                </div>
                                <ThemeToggle />
                            </div>

                            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                                <p className="font-semibold">{meQuery.data.name}</p>
                                <p className="mt-1 text-sm text-muted">{meQuery.data.email}</p>
                            </div>

                            <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto lg:flex-col">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;

                                    return (
                                        <button
                                            className={`flex items-center justify-between gap-3 rounded-[1.25rem] border px-4 py-3 text-left transition ${
                                                isActive
                                                    ? 'border-[color:var(--primary-500)]/28 bg-[color:var(--primary-500)]/14 text-[color:var(--primary-500)]'
                                                    : 'border-white/10 bg-white/6 hover:border-[color:var(--primary-500)]/20 hover:bg-[color:var(--primary-500)]/8'
                                            }`}
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            type="button"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon className="h-4 w-4" />
                                                <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.12em]">{item.label}</span>
                                            </span>
                                            <ChevronRight className="h-4 w-4 shrink-0" />
                                        </button>
                                    );
                                })}
                            </div>

                            <Button className="mt-6 w-full" onClick={() => logoutMutation.mutate()} variant="ghost">
                                Logout
                            </Button>
                        </Card>
                    </aside>

                    <section className="min-w-0 flex-1 space-y-5">
                        <Card className="p-5 sm:p-6">
                            <p className="section-eyebrow">Admin section</p>
                            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h2 className="text-4xl">{sectionTitle(activeSection)}</h2>
                                    <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
                                        Manage restaurant operations, visibility, customer records, visitor analytics, and pickup order activity from one place.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {activeSection === 'overview' ? (
                            <div className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <AdminMetricCard label="Total orders" value={metrics ? metrics.total_orders : <LoadingSpinner />} />
                                    <AdminMetricCard label="Pending orders" value={metrics ? metrics.pending_orders : <LoadingSpinner />} />
                                    <AdminMetricCard label="Completed orders" value={metrics ? metrics.completed_orders : <LoadingSpinner />} />
                                    <AdminMetricCard label="Cancelled orders" value={metrics ? metrics.cancelled_orders : <LoadingSpinner />} />
                                    <AdminMetricCard label="Total customers" value={metrics ? metrics.total_customers : <LoadingSpinner />} />
                                    <AdminMetricCard label="Total visitors" value={metrics ? metrics.total_visitors : <LoadingSpinner />} />
                                    <AdminMetricCard label="Today revenue" value={metrics ? <MoneyDisplay amount={metrics.today_revenue} /> : <LoadingSpinner />} />
                                    <AdminMetricCard label="This month revenue" value={metrics ? <MoneyDisplay amount={metrics.month_revenue} /> : <LoadingSpinner />} />
                                </div>

                                <AdminTableShell
                                    description="Most recent pickup orders across the restaurant platform."
                                    title="Recent orders"
                                >
                                    {recentOrders.length === 0 ? (
                                        <AdminEmpty title="No recent orders" />
                                    ) : (
                                        <table className="min-w-full text-sm">
                                            <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                                <tr>
                                                    <th className="px-5 py-4">Order</th>
                                                    <th className="px-5 py-4">Customer</th>
                                                    <th className="px-5 py-4">Item</th>
                                                    <th className="px-5 py-4">Status</th>
                                                    <th className="px-5 py-4">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentOrders.map((order) => (
                                                    <tr className="border-b border-white/6" key={order.id}>
                                                        <td className="px-5 py-4">
                                                            <p className="font-semibold">{order.order_number}</p>
                                                            <p className="mt-1 text-xs text-muted">{formatDateTime(order.placed_at)}</p>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <p>{order.customer_name}</p>
                                                            <p className="mt-1 text-xs text-muted">{order.customer_phone}</p>
                                                        </td>
                                                        <td className="px-5 py-4">{order.items[0]?.food_name ?? 'N/A'}</td>
                                                        <td className="px-5 py-4">
                                                            <OrderStatusBadge status={order.status as never} />
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <MoneyDisplay amount={order.total} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </AdminTableShell>
                            </div>
                        ) : null}

                        {activeSection === 'orders' ? (
                            <AdminTableShell
                                description="Monitor pickup orders and update kitchen-facing statuses."
                                title="Order management"
                            >
                                {ordersQuery.isLoading ? (
                                    <div className="p-6"><LoadingSpinner /></div>
                                ) : orders.length === 0 ? (
                                    <AdminEmpty title="No orders yet" />
                                ) : (
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                            <tr>
                                                <th className="px-5 py-4">Order</th>
                                                <th className="px-5 py-4">Customer</th>
                                                <th className="px-5 py-4">Item</th>
                                                <th className="px-5 py-4">Placed</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4">Update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr className="border-b border-white/6 align-top" key={order.id}>
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold">{order.order_number}</p>
                                                        <p className="mt-1 text-xs text-muted">
                                                            <MoneyDisplay amount={order.total} />
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p>{order.customer_name}</p>
                                                        <p className="mt-1 text-xs text-muted">{order.customer_phone}</p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p>{order.items[0]?.food_name ?? 'N/A'}</p>
                                                        <p className="mt-1 text-xs text-muted">Qty {order.items[0]?.quantity ?? 0}</p>
                                                    </td>
                                                    <td className="px-5 py-4">{formatDateTime(order.placed_at)}</td>
                                                    <td className="px-5 py-4">
                                                        <OrderStatusBadge status={order.status as never} />
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <select
                                                            className="theme-field w-full rounded-xl px-3 py-2"
                                                            defaultValue={order.status}
                                                            onChange={(event) =>
                                                                orderStatusMutation.mutate({
                                                                    orderId: order.id,
                                                                    status: event.target.value as AdminOrderStatus,
                                                                })}
                                                        >
                                                            {statusOptions.map((status) => (
                                                                <option key={status} value={status}>
                                                                    {status}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </AdminTableShell>
                        ) : null}

                        {activeSection === 'foods' ? (
                            <AdminTableShell
                                description="Current foods available to the public ordering interface."
                                title="Foods"
                            >
                                {foodsQuery.isLoading ? (
                                    <div className="p-6"><LoadingSpinner /></div>
                                ) : foods.length === 0 ? (
                                    <AdminEmpty title="No foods configured" />
                                ) : (
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                            <tr>
                                                <th className="px-5 py-4">Food</th>
                                                <th className="px-5 py-4">Category</th>
                                                <th className="px-5 py-4">Availability</th>
                                                <th className="px-5 py-4">Price</th>
                                                <th className="px-5 py-4">Prep</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {foods.map((food) => (
                                                <tr className="border-b border-white/6" key={food.id}>
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold">{food.name}</p>
                                                        <p className="mt-1 text-xs text-muted">{food.short_description ?? food.description}</p>
                                                    </td>
                                                    <td className="px-5 py-4">{food.category?.name ?? 'N/A'}</td>
                                                    <td className="px-5 py-4">{food.is_available ? 'Available' : 'Hidden'}</td>
                                                    <td className="px-5 py-4"><MoneyDisplay amount={food.price} /></td>
                                                    <td className="px-5 py-4">{food.preparation_time_minutes} min</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </AdminTableShell>
                        ) : null}

                        {activeSection === 'categories' ? (
                            <AdminTableShell
                                description="Public-facing food category structure and activation state."
                                title="Categories"
                            >
                                {categoriesQuery.isLoading ? (
                                    <div className="p-6"><LoadingSpinner /></div>
                                ) : categories.length === 0 ? (
                                    <AdminEmpty title="No categories configured" />
                                ) : (
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                            <tr>
                                                <th className="px-5 py-4">Category</th>
                                                <th className="px-5 py-4">Slug</th>
                                                <th className="px-5 py-4">Foods</th>
                                                <th className="px-5 py-4">Active</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((category) => (
                                                <tr className="border-b border-white/6" key={category.id}>
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold">{category.name}</p>
                                                        <p className="mt-1 text-xs text-muted">{category.description}</p>
                                                    </td>
                                                    <td className="px-5 py-4">{category.slug}</td>
                                                    <td className="px-5 py-4">{category.foods_count ?? 0}</td>
                                                    <td className="px-5 py-4">{category.is_active ? 'Yes' : 'No'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </AdminTableShell>
                        ) : null}

                        {activeSection === 'customers' ? (
                            <AdminTableShell
                                description="Customer accounts, order counts, and lifetime value."
                                title="Customers"
                            >
                                {customersQuery.isLoading ? (
                                    <div className="p-6"><LoadingSpinner /></div>
                                ) : customers.length === 0 ? (
                                    <AdminEmpty title="No customers yet" />
                                ) : (
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                            <tr>
                                                <th className="px-5 py-4">Customer</th>
                                                <th className="px-5 py-4">Orders</th>
                                                <th className="px-5 py-4">Lifetime value</th>
                                                <th className="px-5 py-4">Last order</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map((customer) => (
                                                <tr className="border-b border-white/6" key={customer.id}>
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold">{customer.name}</p>
                                                        <p className="mt-1 text-xs text-muted">{customer.phone ?? customer.email ?? 'N/A'}</p>
                                                    </td>
                                                    <td className="px-5 py-4">{customer.orders_count ?? 0}</td>
                                                    <td className="px-5 py-4"><MoneyDisplay amount={customer.lifetime_value ?? 0} /></td>
                                                    <td className="px-5 py-4">{formatDateTime(customer.last_order_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </AdminTableShell>
                        ) : null}

                        {activeSection === 'visitors' ? (
                            <AdminTableShell
                                description="Privacy-conscious visitor session analytics with hashed IP tracking."
                                title="Visitors"
                            >
                                {visitorsQuery.isLoading ? (
                                    <div className="p-6"><LoadingSpinner /></div>
                                ) : visitors.length === 0 ? (
                                    <AdminEmpty title="No visitor sessions recorded" />
                                ) : (
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                                            <tr>
                                                <th className="px-5 py-4">Device</th>
                                                <th className="px-5 py-4">Landing page</th>
                                                <th className="px-5 py-4">Referrer</th>
                                                <th className="px-5 py-4">Events</th>
                                                <th className="px-5 py-4">Last seen</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visitors.map((visitor) => (
                                                <tr className="border-b border-white/6" key={visitor.id}>
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold">{visitor.device_type ?? 'Unknown'}</p>
                                                        <p className="mt-1 text-xs text-muted">{visitor.browser} on {visitor.platform}</p>
                                                    </td>
                                                    <td className="px-5 py-4">{visitor.landing_page ?? 'N/A'}</td>
                                                    <td className="px-5 py-4">{visitor.referrer ?? 'Direct'}</td>
                                                    <td className="px-5 py-4">{visitor.events_count ?? 0}</td>
                                                    <td className="px-5 py-4">{formatDateTime(visitor.last_seen_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </AdminTableShell>
                        ) : null}

                        {activeSection === 'settings' ? (
                            <div className="grid gap-5 xl:grid-cols-[0.55fr_0.45fr]">
                                <Card className="p-5">
                                    <h3 className="text-2xl">Company settings</h3>
                                    {settingsQuery.isLoading || !companySettings ? (
                                        <div className="mt-6"><LoadingSpinner /></div>
                                    ) : (
                                        <div className="mt-6 space-y-4 text-sm leading-7">
                                            <div>
                                                <p className="font-semibold">{companySettings.company_name}</p>
                                                <p className="text-muted">{companySettings.tagline}</p>
                                            </div>
                                            <p>{companySettings.about}</p>
                                            <p className="text-muted">{companySettings.address}</p>
                                            <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                                                {Object.entries(companySettings.opening_hours).map(([key, value]) => (
                                                    <div className="flex items-center justify-between gap-3" key={key}>
                                                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                                        <span className="text-muted">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>

                                <Card className="p-5">
                                    <h3 className="text-2xl">SEO settings</h3>
                                    {seoQuery.isLoading ? (
                                        <div className="mt-6"><LoadingSpinner /></div>
                                    ) : seoSettings.length === 0 ? (
                                        <AdminEmpty title="No SEO settings configured" />
                                    ) : (
                                        <div className="mt-6 space-y-4">
                                            {seoSettings.map((setting) => (
                                                <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4" key={setting.id}>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{setting.page_key}</p>
                                                    <p className="mt-2 font-semibold">{setting.title}</p>
                                                    <p className="mt-2 text-sm leading-7 text-muted">{setting.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        ) : null}

                        {activeSection === 'notifications' ? (
                            <AdminTableShell
                                description="Database-backed admin notifications for platform activity."
                                title="Notifications"
                            >
                                {notificationsQuery.isLoading ? (
                                    <div className="p-6"><LoadingSpinner /></div>
                                ) : notifications.length === 0 ? (
                                    <AdminEmpty title="No admin notifications yet" />
                                ) : (
                                    <div className="divide-y divide-white/6">
                                        {notifications.map((notification) => (
                                            <div className="px-5 py-4" key={notification.id}>
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <p className="font-semibold">{notification.type}</p>
                                                    <span className="text-xs text-muted">{formatDateTime(notification.created_at)}</span>
                                                </div>
                                                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-muted">
                                                    {JSON.stringify(notification.data, null, 2)}
                                                </pre>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </AdminTableShell>
                        ) : null}
                    </section>
                </div>
            </div>
        </div>
    );
}
