import {
    Bell,
    LayoutDashboard,
    LogOut,
    MessageSquareQuote,
    ReceiptText,
    Store,
    UserRound,
} from 'lucide-react';

export type CustomerNavItem = {
    key: string;
    label: string;
    shortLabel: string;
    to?: string;
    icon: typeof LayoutDashboard;
    mobile?: boolean;
    isAction?: boolean;
    isExternal?: boolean;
};

export const customerPrimaryNav: CustomerNavItem[] = [
    { key: 'dashboard', label: 'Dashboard', shortLabel: 'Home', to: '/customer/dashboard', icon: LayoutDashboard, mobile: true },
    { key: 'orders', label: 'Orders', shortLabel: 'Orders', to: '/customer/orders', icon: ReceiptText, mobile: true },
    { key: 'notifications', label: 'Notifications', shortLabel: 'Alerts', to: '/customer/notifications', icon: Bell, mobile: true },
    { key: 'reviews', label: 'Reviews', shortLabel: 'Reviews', to: '/customer/reviews', icon: MessageSquareQuote },
    { key: 'profile', label: 'Profile', shortLabel: 'Profile', to: '/customer/profile', icon: UserRound, mobile: true },
];

export const customerSecondaryNav: CustomerNavItem[] = [
    { key: 'store', label: 'Visit Store', shortLabel: 'Store', to: '/', icon: Store, isExternal: true },
    { key: 'logout', label: 'Logout', shortLabel: 'Logout', icon: LogOut, isAction: true },
];

export function getCustomerRouteLabel(pathname: string) {
    const allItems = [...customerPrimaryNav, ...customerSecondaryNav];
    const item = allItems.find((entry) => entry.to && pathname.startsWith(entry.to));

    return item?.label ?? 'Dashboard';
}
