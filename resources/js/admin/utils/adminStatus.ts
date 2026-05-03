import type { AdminOrderStatus, CashStatus } from '@/admin/types/adminOrder';

export function getOrderStatusMeta(status: AdminOrderStatus) {
    switch (status) {
        case 'received':
            return { label: 'Received', className: 'bg-sky-500/14 text-sky-300 border-sky-500/30' };
        case 'processing':
            return { label: 'Processing', className: 'bg-amber-500/14 text-amber-300 border-amber-500/30' };
        case 'ready_for_pickup':
            return { label: 'Ready for Pickup', className: 'bg-emerald-500/14 text-emerald-300 border-emerald-500/30' };
        case 'completed':
            return { label: 'Completed', className: 'bg-green-500/14 text-green-300 border-green-500/30' };
        case 'cancelled':
            return { label: 'Cancelled', className: 'bg-rose-500/14 text-rose-300 border-rose-500/30' };
        default:
            return { label: status, className: 'bg-white/10 text-[color:var(--text-950)] border-white/10' };
    }
}

export function getCashStatusMeta(status: CashStatus) {
    switch (status) {
        case 'cash_collected':
            return { label: 'Cash Collected', className: 'bg-lime-500/16 text-lime-300 border-lime-500/30' };
        case 'cash_pending':
        default:
            return { label: 'Cash Pending', className: 'bg-orange-500/16 text-orange-300 border-orange-500/30' };
    }
}
