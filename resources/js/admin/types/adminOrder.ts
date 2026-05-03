export type AdminOrderStatus =
    | 'received'
    | 'processing'
    | 'ready_for_pickup'
    | 'completed'
    | 'cancelled';

export type CashStatus = 'cash_pending' | 'cash_collected';

export interface AdminOrderItem {
    id: string;
    foodName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

export interface AdminOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: AdminOrderItem[];
    subtotal: number;
    total: number;
    paymentMethod: 'cash';
    orderType: 'pickup';
    status: AdminOrderStatus;
    cashStatus: CashStatus;
    customerNote?: string | null;
    adminNote?: string | null;
    createdAt: string;
    updatedAt: string;
}
