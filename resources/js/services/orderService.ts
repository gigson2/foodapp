import type { Customer, Food, Order, OrderItem } from '@/types';
import { notificationService } from '@/services/notificationService';
import { createId, createOrderNumber } from '@/utils/ids';
import { readStorage, writeStorage } from '@/utils/storage';

const ORDER_KEY = 'restaurant.orders';
const listeners = new Set<() => void>();
const ordersByPhoneCache = new Map<string, { source: Order[]; orders: Order[] }>();
let ordersCache = readStorage<Order[]>(ORDER_KEY, []);

function notify() {
    listeners.forEach((listener) => listener());
}

function persist(orders: Order[]) {
    ordersCache = orders;
    ordersByPhoneCache.clear();
    writeStorage(ORDER_KEY, orders);
    notify();
}

export const orderService = {
    getOrders() {
        return ordersCache;
    },
    getOrdersByCustomer(phone: string) {
        const orders = this.getOrders();
        const cached = ordersByPhoneCache.get(phone);

        if (cached && cached.source === orders) {
            return cached.orders;
        }

        const filteredOrders = orders.filter((order) => order.customerPhone === phone);
        ordersByPhoneCache.set(phone, {
            source: orders,
            orders: filteredOrders,
        });

        return filteredOrders;
    },
    hasOrderHistory(phone: string) {
        return this.getOrders().some((order) => order.customerPhone === phone);
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
    removeOrdersByIds(ids: string[]) {
        const idSet = new Set(ids);
        persist(this.getOrders().filter((o) => !idSet.has(o.id)));
    },
    subscribe(listener: () => void) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    },
};
