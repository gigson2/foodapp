import type { AppNotification, AuthenticatedUser, Order, Review } from '@/types';

export type CustomerDashboardMetrics = {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSpent: number;
    pendingReviews: number;
    unreadNotifications: number;
};

export type CustomerStatusBreakdown = Record<string, number>;

export type CustomerDashboardSummary = {
    dateRange?: {
        from: string;
        to: string;
    };
    metrics: CustomerDashboardMetrics;
    statusBreakdown: CustomerStatusBreakdown;
    recentOrders: Order[];
};

export type CustomerProfileRecord = AuthenticatedUser & {
    customer_profile?: {
        address?: string | null;
        city?: string | null;
        notes?: string | null;
    } | null;
    notification_preference?: {
        in_app_enabled: boolean;
        push_enabled: boolean;
        email_enabled: boolean;
        preferences?: Record<string, boolean>;
    } | null;
};

export type CustomerProfileUpdateInput = {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    notes?: string;
    avatar?: File | null;
    inAppEnabled?: boolean;
    pushEnabled?: boolean;
    emailEnabled?: boolean;
};

export type CustomerPasswordUpdateInput = {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
};

export type CustomerPortalOrder = Order;
export type CustomerPortalNotification = AppNotification;
export type CustomerPortalReview = Review & {
    orderNumber?: string;
};

export type CustomerPaginationMeta = {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type CustomerPaginatedResult<T> = {
    items: T[];
    meta: CustomerPaginationMeta;
};
