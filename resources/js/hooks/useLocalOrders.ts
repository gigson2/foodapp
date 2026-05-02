import { useSyncExternalStore } from 'react';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';

const EMPTY_ORDERS: Order[] = [];

function subscribe(listener: () => void) {
    return orderService.subscribe(listener);
}

export function useLocalOrders(phone?: string | null) {
    return useSyncExternalStore(
        subscribe,
        () => (phone ? orderService.getOrdersByCustomer(phone) : EMPTY_ORDERS),
        () => EMPTY_ORDERS,
    );
}
