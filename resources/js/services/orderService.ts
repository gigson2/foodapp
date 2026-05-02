import type { Customer, Food, Order, OrderItem } from '@/types';
import { notificationService } from '@/services/notificationService';
import { createId, createOrderNumber } from '@/utils/ids';
import { readStorage, writeStorage } from '@/utils/storage';

const ORDER_KEY = 'restaurant.orders';
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((listener) => listener());
}

function persist(orders: Order[]) {
    writeStorage(ORDER_KEY, orders);
    notify();
}

export const orderService = {
    getOrders() {
        return readStorage<Order[]>(ORDER_KEY, []);
    },
    getOrdersByCustomer(phone: string) {
        return this.getOrders().filter((order) => order.customerPhone === phone);
    },
    createPickupCashOrder(input: { customer: Customer; food: Food; quantity: number }) {
        const item: OrderItem = {
            id: createId('order_item'),
            foodId: input.food.id,
            foodName: input.food.name,
            price: input.food.price,
            quantity: input.quantity,
            total: input.food.price * input.quantity,
        };

        const order: Order = {
            id: createId('order'),
            orderNumber: createOrderNumber(),
            customerName: input.customer.name,
            customerPhone: input.customer.phone,
            items: [item],
            subtotal: item.total,
            total: item.total,
            paymentMethod: 'cash',
            orderType: 'pickup',
            status: 'received',
            createdAt: new Date().toISOString(),
        };

        persist([order, ...this.getOrders()]);
        notificationService.addOrderNotifications(order);

        return order;
    },
    subscribe(listener: () => void) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    },
};
