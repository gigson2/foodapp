import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Modal } from '@/components/common/Modal';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { OrderStatusBadge } from '@/components/ordering/OrderStatusBadge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Order } from '@/types';

type OrderSuccessModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onOpenAccount: () => void;
    order: Order | null;
};

export function OrderSuccessModal({ isOpen, onClose, onOpenAccount, order }: OrderSuccessModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    if (! order) {
        return null;
    }

    const content = (
        <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-[color:var(--secondary-500)]/20 bg-[color:var(--secondary-500)]/10 p-4">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-[color:var(--secondary-700)]" />
                    <div>
                        <p className="font-semibold">Your order has been received.</p>
                        <p className="mt-2 text-sm leading-7 text-muted">
                            You will be notified when it is processed and ready for pickup.
                        </p>
                    </div>
                </div>
            </div>

            <Card className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm text-muted">Order number</p>
                        <p className="mt-1 text-xl font-semibold">{order.orderNumber}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                <div className="grid gap-3 text-sm text-muted sm:grid-cols-2">
                    <div>
                        <p className="font-medium text-[color:var(--text-950)]">{order.customerName}</p>
                        <p>{order.customerPhone}</p>
                    </div>
                    <div>
                        <p className="font-medium text-[color:var(--text-950)]">Payment</p>
                        <p>Cash at pickup</p>
                    </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-semibold">{order.items[0]?.foodName}</p>
                            <p className="mt-1 text-sm text-muted">Quantity: {order.items[0]?.quantity}</p>
                        </div>
                        <MoneyDisplay amount={order.total} className="text-xl font-semibold" />
                    </div>
                </div>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1" onClick={onOpenAccount} variant="secondary">
                    View account
                </Button>
                <Button className="flex-1" onClick={onClose}>
                    Keep browsing
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet
                description="Pickup order summary"
                isOpen={isOpen}
                onClose={onClose}
                title="Order placed successfully"
            >
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal
            description="Pickup order summary"
            isOpen={isOpen}
            onClose={onClose}
            panelClassName="max-w-xl"
            title="Order placed successfully"
        >
            {content}
        </Modal>
    );
}
