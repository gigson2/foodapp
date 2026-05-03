export type OrderStatus = 'received' | 'processing' | 'ready_for_pickup' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash';
export type OrderType = 'pickup';

export interface OrderItem {
    id: string;
    foodId: string;
    foodName: string;
    price: number;
    quantity: number;
    total: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    subtotal: number;
    total: number;
    paymentMethod: PaymentMethod;
    orderType: OrderType;
    status: OrderStatus;
    paymentStatus?: 'paid' | 'unpaid';
    cashStatus?: 'cash_pending' | 'cash_collected';
    customerNote?: string | null;
    adminNote?: string | null;
    acceptedAt?: string | null;
    completedAt?: string | null;
    cancelledAt?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}
