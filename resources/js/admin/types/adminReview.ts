export type AdminReviewStatus = 'pending' | 'approved' | 'rejected';

export interface AdminReviewSummary {
    id: string;
    customerName: string;
    customerPhone: string;
    rating: number;
    message: string;
    foodName?: string;
    status: AdminReviewStatus;
    createdAt: string;
}
