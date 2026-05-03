import {
    Bell,
    ChartColumn,
    Drumstick,
    LayoutDashboard,
    LogOut,
    MessageSquareQuote,
    ReceiptText,
    ShieldUser,
    Settings2,
    Tags,
    Users,
} from 'lucide-react';

export type AdminNavItem = {
    key: string;
    label: string;
    shortLabel: string;
    to?: string;
    icon: typeof LayoutDashboard;
    mobile?: boolean;
    isAction?: boolean;
};

export const adminPrimaryNav: AdminNavItem[] = [
    { key: 'dashboard', label: 'Dashboard', shortLabel: 'Home', to: '/admin/dashboard/overview', icon: LayoutDashboard, mobile: true },
    { key: 'menu', label: 'Menu', shortLabel: 'Menu', to: '/admin/menu', icon: Drumstick, mobile: true },
    { key: 'categories', label: 'Categories', shortLabel: 'Categories', to: '/admin/categories', icon: Tags },
    { key: 'orders', label: 'Orders', shortLabel: 'Orders', to: '/admin/orders', icon: ReceiptText, mobile: true },
    { key: 'customers', label: 'Customers', shortLabel: 'Customers', to: '/admin/customers', icon: Users },
    { key: 'reviews', label: 'Reviews', shortLabel: 'Reviews', to: '/admin/reviews', icon: MessageSquareQuote, mobile: true },
    { key: 'analytics', label: 'Analytics', shortLabel: 'Analytics', to: '/admin/analytics', icon: ChartColumn },
    { key: 'notifications', label: 'Notifications', shortLabel: 'Alerts', to: '/admin/notifications', icon: Bell },
];

export const adminSettingsNav: AdminNavItem[] = [
    { key: 'company', label: 'Company', shortLabel: 'Company', to: '/admin/settings/company', icon: Settings2 },
    { key: 'seo', label: 'SEO', shortLabel: 'SEO', to: '/admin/settings/seo', icon: Settings2 },
    { key: 'pwa', label: 'PWA', shortLabel: 'PWA', to: '/admin/settings/pwa', icon: Settings2 },
];

export const adminSecondaryNav: AdminNavItem[] = [
    { key: 'profile', label: 'Profile', shortLabel: 'Profile', to: '/admin/profile', icon: ShieldUser },
    { key: 'logout', label: 'Logout', shortLabel: 'Logout', icon: LogOut, isAction: true },
];

export function getAdminRouteLabel(pathname: string) {
    const allItems = [...adminPrimaryNav, ...adminSettingsNav, ...adminSecondaryNav];
    const item = allItems.find((entry) => entry.to && pathname.startsWith(entry.to));

    return item?.label ?? 'Dashboard';
}
