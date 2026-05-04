import type { AdminOrder } from '@/admin/types/adminOrder';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { getCashStatusMeta, getOrderStatusMeta } from '@/admin/utils/adminStatus';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

type DashboardOrderQuickViewModalProps = {
    isOpen: boolean;
    loading?: boolean;
    mode: 'received' | 'ready';
    order: AdminOrder | null;
    onClose: () => void;
    onCancel?: (orderId: string) => void;
    onMarkCompleted?: (orderId: string) => void;
    onMarkReady?: (orderId: string) => void;
    onStartProcessing?: (orderId: string) => void;
    pending?: boolean;
};

export function DashboardOrderQuickViewModal({
    isOpen,
    loading = false,
    mode,
    order,
    onClose,
    onCancel,
    onMarkCompleted,
    onMarkReady,
    onStartProcessing,
    pending = false,
}: DashboardOrderQuickViewModalProps) {
    return (
        <Modal
            description={mode === 'received'
                ? 'Review the newest customer order and move it into kitchen workflow without leaving the dashboard.'
                : 'Finalize a ready-for-pickup order after the customer collects the food and pays cash.'}
            isOpen={isOpen}
            onClose={onClose}
            panelClassName="max-w-3xl"
            title={mode === 'received' ? 'Pickup queue quick view' : 'Completed orders quick view'}
        >
            {loading || !order ? (
                <div className="py-8 text-sm text-muted">Loading order details...</div>
            ) : (
                <div className="space-y-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Order number</p>
                            <h3 className="mt-2 text-3xl">{order.orderNumber}</h3>
                            <p className="mt-3 text-sm text-muted">{order.customerName} · {order.customerPhone}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <AdminBadge className={getOrderStatusMeta(order.status).className}>{getOrderStatusMeta(order.status).label}</AdminBadge>
                            <AdminBadge className={getCashStatusMeta(order.cashStatus).className}>{getCashStatusMeta(order.cashStatus).label}</AdminBadge>
                        </div>
                    </div>

                    <div className="ui-surface-solid rounded-[1.35rem] p-4">
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                            <div><span className="text-muted">Created:</span> {formatAdminDateTime(order.createdAt)}</div>
                            <div><span className="text-muted">Total:</span> {formatAdminMoney(order.total)}</div>
                            <div><span className="text-muted">Payment:</span> Cash</div>
                            <div><span className="text-muted">Order type:</span> Pickup</div>
                        </div>
                        {order.customerNote ? <p className="mt-4 text-sm text-muted">Customer note: {order.customerNote}</p> : null}
                    </div>

                    <div className="ui-surface-solid rounded-[1.35rem] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Items ordered</p>
                        <div className="mt-4 space-y-3">
                            {order.items.map((item) => (
                                <div className="flex items-center justify-between gap-3 border-b border-[color:var(--ui-divider)] pb-3 last:border-b-0 last:pb-0" key={item.id}>
                                    <div>
                                        <p className="font-semibold">{item.foodName}</p>
                                        <p className="mt-1 text-sm text-muted">Qty {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">{formatAdminMoney(item.lineTotal)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        {mode === 'received' ? (
                            <>
                                <Button disabled={pending || order.status !== 'received'} onClick={() => onStartProcessing?.(order.id)} size="sm" variant="secondary">
                                    Start processing
                                </Button>
                                <Button disabled={pending || order.status !== 'received'} onClick={() => onMarkReady?.(order.id)} size="sm" variant="accent">
                                    Mark ready for pickup
                                </Button>
                                <Button disabled={pending || order.status !== 'received'} onClick={() => onCancel?.(order.id)} size="sm" variant="ghost">
                                    Cancel order
                                </Button>
                            </>
                        ) : (
                            <Button disabled={pending || order.status !== 'ready_for_pickup' || order.cashStatus === 'cash_collected'} onClick={() => onMarkCompleted?.(order.id)} size="sm">
                                Mark completed & cash received
                            </Button>
                        )}
                        <Button onClick={onClose} size="sm" variant="ghost">
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
