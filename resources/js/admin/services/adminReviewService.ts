import type { AdminReviewSummary, AdminReviewStatus } from '@/admin/types/adminReview';
import { adminApiClient, buildAdminQuery, mapPaginatedResponse, type AdminPaginatedResult, type AdminTableParams } from '@/admin/services/adminApiClient';

type ApiReview = {
    id: number;
    customer_name: string;
    customer_phone: string;
    rating: number;
    message: string;
    food_name?: string | null;
    status: AdminReviewStatus;
    created_at: string;
};

function mapReview(review: ApiReview): AdminReviewSummary {
    return {
        id: String(review.id),
        customerName: review.customer_name,
        customerPhone: review.customer_phone,
        rating: review.rating,
        message: review.message,
        foodName: review.food_name ?? undefined,
        status: review.status,
        createdAt: review.created_at,
    };
}

export const adminReviewService = {
    async getReviews(params: AdminTableParams): Promise<AdminPaginatedResult<AdminReviewSummary>> {
        const response = await adminApiClient.get('/admin/reviews', {
            params: buildAdminQuery({
                page: params.page,
                per_page: params.perPage,
                search: params.search,
                status: params.status,
            }),
        });

        return mapPaginatedResponse(response.data, mapReview);
    },
    async updateStatus(reviewId: string | number, status: AdminReviewStatus) {
        const response = await adminApiClient.patch(`/admin/reviews/${reviewId}/status`, { status });

        return mapReview(response.data.data as ApiReview);
    },
};
