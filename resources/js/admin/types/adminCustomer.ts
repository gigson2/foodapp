export interface AdminCustomerSummary {
    id: string;
    name: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderAt?: string | null;
    lastVisitAt?: string | null;
    reviewsCount: number;
    status: string;
}
