export interface AdminCustomerSummary {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    totalOrders: number;
    totalSpent: number;
    lastOrderAt?: string | null;
    lastVisitAt?: string | null;
    reviewsCount: number;
    status: string;
    address?: string | null;
    city?: string | null;
    notes?: string | null;
    lastLoginAt?: string | null;
    createdAt?: string | null;
}
