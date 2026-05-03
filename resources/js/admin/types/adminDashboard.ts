import type { AdminOrder, AdminOrderStatus } from '@/admin/types/adminOrder';

export interface AdminDashboardMetrics {
    totalOrders: number;
    todayOrders: number;
    receivedOrders: number;
    processingOrders: number;
    readyForPickupOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalCashSales: number;
    todayCashSales: number;
    weeklyCashSales: number;
    monthlyCashSales: number;
    totalCustomers: number;
    totalVisitors: number;
    pendingReviews: number;
    unreadNotifications: number;
}

export interface AdminStatusBreakdownItem {
    status: AdminOrderStatus;
    label: string;
    count: number;
}

export interface AdminSalesPoint {
    label: string;
    amount: number;
}

export interface AdminPopularFood {
    id: string;
    name: string;
    ordersCount: number;
    revenue: number;
}

export interface AdminPendingReviewSummary {
    id: string;
    customerName: string;
    rating: number;
    message: string;
    createdAt: string;
}

export interface AdminVisitorSummary {
    totalVisitors: number;
    todayVisitors: number;
    returningVisitors: number;
    foodViews: number;
    menuClicks: number;
    orderStarts: number;
    completedOrders: number;
    reviewSubmissions: number;
}

export interface AdminQuickAction {
    id: string;
    label: string;
    description: string;
    to: string;
}

export interface AdminDashboardSnapshot {
    metrics: AdminDashboardMetrics;
    recentOrders: AdminOrder[];
    statusBreakdown: AdminStatusBreakdownItem[];
    cashSalesSeries: AdminSalesPoint[];
    popularFoods: AdminPopularFood[];
    pendingReviews: AdminPendingReviewSummary[];
    visitorSummary: AdminVisitorSummary;
    quickActions: AdminQuickAction[];
}
