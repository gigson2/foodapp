import { Badge } from '@/components/common/Badge';
import type { OrderStatus } from '@/types';

const config: Record<OrderStatus, string> = {
    received: 'bg-[color:var(--secondary-500)]/14 text-[color:var(--secondary-900)]',
    processing: 'bg-[color:var(--background-500)]/14 text-[color:var(--background-900)]',
    ready_for_pickup: 'bg-[color:var(--accent-500)]/18 text-[color:var(--accent-900)]',
    completed: 'bg-white/10 text-[color:var(--text-950)]',
    cancelled: 'bg-[color:var(--primary-500)]/14 text-[color:var(--primary-900)]',
};

const labels: Record<OrderStatus, string> = {
    received: 'Received',
    processing: 'Processing',
    ready_for_pickup: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return <Badge className={config[status]}>{labels[status]}</Badge>;
}
