import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import type { Order } from '@/types';

type RecentOrdersListProps = {
    orders: Order[];
};

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
    if (orders.length === 0) {
        return (
            <EmptyState
                description="Place a pickup order and it will appear here with status updates."
                title="No orders yet"
            />
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <Card className="p-4" key={order.id}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-semibold">{order.orderNumber}</p>
                            <p className="mt-1 text-sm text-muted">{order.items[0]?.foodName}</p>
                            <p className="mt-2 text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <MoneyDisplay amount={order.total} className="text-lg font-semibold" />
                            <div className="mt-2">
                                <OrderStatusBadge status={order.status} />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
