export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
    id: string;
    customerName: string;
    customerPhone: string;
    rating: number;
    message: string;
    foodName?: string;
    status: ReviewStatus;
    createdAt: string;
}
