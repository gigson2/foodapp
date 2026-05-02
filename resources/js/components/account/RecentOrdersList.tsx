import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/common/Card';
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
                description="Your pickup orders will appear here after you place your first grill order."
                title="No orders yet"
            />
        );
    }

    return (
        <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
                <Card className="space-y-4 p-4" key={order.id}>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm text-muted">{order.orderNumber}</p>
                            <h4 className="mt-1 text-lg font-semibold">{order.items[0]?.foodName}</h4>
                        </div>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm text-muted">
                        <span>Qty {order.items[0]?.quantity}</span>
                        <MoneyDisplay amount={order.total} className="font-semibold text-[color:var(--text-950)]" />
                    </div>

                    <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                </Card>
            ))}
        </div>
    );
}
