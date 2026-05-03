import type { AdminVisitorSession } from '@/types/admin';
import { adminApiClient } from '@/admin/services/adminApiClient';

type AnalyticsResponse = {
    metrics: {
        total_visitors: number;
        today_visitors: number;
        returning_visitors: number;
        food_views: number;
        menu_clicks: number;
        order_starts: number;
        completed_orders: number;
        review_submissions: number;
    };
    device_breakdown: Array<{ device_type: string; total: number }>;
    top_foods: Array<{ id: number; name: string; orders_count: number; revenue: number }>;
    recent_events: {
        data: Array<{
            id: number;
            event_type: string;
            event_name: string;
            page_url?: string | null;
            metadata: Record<string, unknown>;
            created_at: string;
            visitor_session?: { id: number; session_key: string } | null;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number | null;
            to: number | null;
        };
    };
};

export const adminAnalyticsService = {
    async getAnalytics() {
        const response = await adminApiClient.get<AnalyticsResponse>('/admin/analytics');

        return response.data;
    },
    async getVisitors(params: { page?: number; perPage?: number; search?: string }) {
        const response = await adminApiClient.get('/admin/visitors', {
            params: {
                page: params.page,
                per_page: params.perPage,
                search: params.search,
            },
        });

        return response.data as {
            data: AdminVisitorSession[];
            meta: {
                current_page: number;
                last_page: number;
                per_page: number;
                total: number;
                from: number | null;
                to: number | null;
            };
        };
    },
};
