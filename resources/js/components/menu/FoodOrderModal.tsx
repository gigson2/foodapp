import { Clock3, HandCoins, MapPin } from 'lucide-react';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { QuantitySelector } from '@/components/ordering/QuantitySelector';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useState, useEffect } from 'react';
import type { Food } from '@/types';

type FoodOrderModalProps = {
    food: Food | null;
    isOpen: boolean;
    onClose: () => void;
    onPlaceOrder: (food: Food, quantity: number) => void;
};

export function FoodOrderModal({ food, isOpen, onClose, onPlaceOrder }: FoodOrderModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(1);
    }, [food?.id]);

    if (! food) {
        return null;
    }

    const total = food.price * quantity;

    const content = (
        <div className="space-y-5">
            <img alt={`${food.name} food presentation`} className="h-56 w-full rounded-[1.75rem] object-cover sm:h-72" src={food.image} />

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-muted">{food.category}</p>
                    <h3 className="mt-2 text-3xl font-semibold">{food.name}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{food.description}</p>
                </div>
                <MoneyDisplay amount={food.price} className="text-2xl font-semibold" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <Clock3 className="h-4 w-4" />
                        Prep time
                    </div>
                    <p className="mt-2 text-lg font-semibold">{food.preparationTimeMinutes} min</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <HandCoins className="h-4 w-4" />
                        Payment
                    </div>
                    <p className="mt-2 text-lg font-semibold">Cash only</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <MapPin className="h-4 w-4" />
                        Order type
                    </div>
                    <p className="mt-2 text-lg font-semibold">Pickup</p>
                </Card>
            </div>

            <div className="flex flex-col gap-5 rounded-[1.75rem] border border-white/10 bg-white/6 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-muted">Quantity</p>
                    <div className="mt-3">
                        <QuantitySelector onChange={setQuantity} quantity={quantity} />
                    </div>
                </div>
                <div className="sm:text-right">
                    <p className="text-sm text-muted">Total</p>
                    <MoneyDisplay amount={total} className="mt-2 block text-3xl font-semibold" />
                </div>
            </div>

            <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                <p>Payment is cash only. Please pay when you pick up your order at the restaurant.</p>
                <p>This order is for pickup at the restaurant premises.</p>
            </div>

            <Button
                className="w-full"
                onClick={() => onPlaceOrder(food, quantity)}
                type="button"
            >
                Place Order
            </Button>
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet description="Choose quantity and confirm your pickup order." isOpen={isOpen} onClose={onClose} title="Order food">
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal description="Choose quantity and confirm your pickup order." isOpen={isOpen} onClose={onClose} title="Order food">
            {content}
        </Modal>
    );
}
