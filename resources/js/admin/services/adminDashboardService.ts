import type { AdminDashboardSnapshot } from '@/admin/types/adminDashboard';
import type { AdminOrder } from '@/admin/types/adminOrder';
import type { AdminReviewSummary } from '@/admin/types/adminReview';
import { adminApiClient } from '@/admin/services/adminApiClient';

type DashboardResponse = {
    date_range?: {
        from: string;
        to: string;
    };
    metrics: {
        total_orders: number;
        today_orders: number;
        received_orders: number;
        processing_orders: number;
        ready_for_pickup_orders: number;
        completed_orders: number;
        cancelled_orders: number;
        total_revenue: number;
        today_revenue: number;
        week_revenue: number;
        month_revenue: number;
        total_customers: number;
        total_visitors: number;
        pending_reviews: number;
        unread_notifications: number;
    };
    recent_orders: ApiOrder[];
    status_breakdown: Array<{ status: AdminOrder['status']; label: string; count: number }>;
    cash_sales_series: Array<{ label: string; amount: number }>;
    popular_foods: Array<{ id: string; name: string; orders_count: number; revenue: number }>;
    pending_reviews_list: ApiReview[];
    visitor_summary: {
        total_visitors: number;
        today_visitors: number;
        returning_visitors: number;
        food_views: number;
        menu_clicks: number;
        order_starts: number;
        completed_orders: number;
        review_submissions: number;
    };
    quick_actions: Array<{ id: string; label: string; description: string; to: string }>;
};

type ApiOrder = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    total: number;
    status: AdminOrder['status'];
    cash_status: AdminOrder['cashStatus'];
    items: Array<{ id: number; food_name: string; quantity: number; unit_price: number; line_total: number }>;
    payment_method: 'cash';
    order_type: 'pickup';
    customer_note?: string | null;
    admin_note?: string | null;
    created_at: string;
    updated_at: string;
    placed_at?: string | null;
};

type ApiReview = {
    id: number;
    customer_name: string;
    customer_phone: string;
    rating: number;
    message: string;
    food_name?: string | null;
    status: AdminReviewSummary['status'];
    created_at: string;
};

function mapOrder(order: ApiOrder): AdminOrder {
    return {
        id: String(order.id),
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        items: order.items.map((item) => ({
            id: String(item.id),
            foodName: item.food_name,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            lineTotal: item.line_total,
        })),
        subtotal: order.total,
        total: order.total,
        paymentMethod: order.payment_method,
        orderType: order.order_type,
        status: order.status,
        cashStatus: order.cash_status,
        customerNote: order.customer_note,
        adminNote: order.admin_note,
        createdAt: order.placed_at ?? order.created_at,
        updatedAt: order.updated_at,
    };
}

function mapPendingReview(review: ApiReview) {
    return {
        id: String(review.id),
        customerName: review.customer_name,
        rating: review.rating,
        message: review.message,
        createdAt: review.created_at,
    };
}

export const adminDashboardService = {
    async getDashboardSnapshot(params?: { dateFrom?: string; dateTo?: string }): Promise<AdminDashboardSnapshot> {
        const response = await adminApiClient.get<DashboardResponse>('/admin/dashboard/overview', {
            params: {
                date_from: params?.dateFrom,
                date_to: params?.dateTo,
            },
        });
        const payload = response.data;

        return {
            dateRange: payload.date_range,
            metrics: {
                totalOrders: payload.metrics.total_orders,
                todayOrders: payload.metrics.today_orders,
                receivedOrders: payload.metrics.received_orders,
                processingOrders: payload.metrics.processing_orders,
                readyForPickupOrders: payload.metrics.ready_for_pickup_orders,
                completedOrders: payload.metrics.completed_orders,
                cancelledOrders: payload.metrics.cancelled_orders,
                totalCashSales: payload.metrics.total_revenue,
                todayCashSales: payload.metrics.today_revenue,
                weeklyCashSales: payload.metrics.week_revenue,
                monthlyCashSales: payload.metrics.month_revenue,
                totalCustomers: payload.metrics.total_customers,
                totalVisitors: payload.metrics.total_visitors,
                pendingReviews: payload.metrics.pending_reviews,
                unreadNotifications: payload.metrics.unread_notifications,
            },
            recentOrders: payload.recent_orders.map(mapOrder),
            statusBreakdown: payload.status_breakdown,
            cashSalesSeries: payload.cash_sales_series,
            popularFoods: payload.popular_foods.map((food) => ({
                id: food.id,
                name: food.name,
                ordersCount: food.orders_count,
                revenue: food.revenue,
            })),
            pendingReviews: payload.pending_reviews_list.map(mapPendingReview),
            visitorSummary: {
                totalVisitors: payload.visitor_summary.total_visitors,
                todayVisitors: payload.visitor_summary.today_visitors,
                returningVisitors: payload.visitor_summary.returning_visitors,
                foodViews: payload.visitor_summary.food_views,
                menuClicks: payload.visitor_summary.menu_clicks,
                orderStarts: payload.visitor_summary.order_starts,
                completedOrders: payload.visitor_summary.completed_orders,
                reviewSubmissions: payload.visitor_summary.review_submissions,
            },
            quickActions: payload.quick_actions,
        };
    },
};
