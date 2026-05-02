import { Clock3, HandCoins, MapPin, PackageCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { QuantitySelector } from '@/components/ordering/QuantitySelector';
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
            <img
                alt={`${food.name} ready for pickup from Dri Africain Traditional Grill LLC`}
                className="h-56 w-full rounded-[1.75rem] object-cover sm:h-72"
                src={food.image}
            />

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-900)]">{food.category}</p>
                    <h3 className="mt-2 text-3xl font-semibold">{food.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{food.description}</p>
                </div>
                <MoneyDisplay amount={food.price} className="text-2xl font-semibold text-[color:var(--primary-900)]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <Clock3 className="h-4 w-4" />
                        Preparation
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
                        <PackageCheck className="h-4 w-4" />
                        Packaging
                    </div>
                    <p className="mt-2 text-lg font-semibold">Neatly packed</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <MapPin className="h-4 w-4" />
                        Pickup
                    </div>
                    <p className="mt-2 text-lg font-semibold">Papillion, NE</p>
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
                <p>Cash payment only. Pay when you pick up at the restaurant.</p>
                <p>Pickup location: 701 Golden Gate Circle, Papillion, NE 68046.</p>
            </div>

            <Button className="w-full" onClick={() => onPlaceOrder(food, quantity)} type="button">
                Place Pickup Order
            </Button>
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet description="Confirm quantity and place your pickup order." isOpen={isOpen} onClose={onClose} title="Order from the grill">
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal description="Confirm quantity and place your pickup order." isOpen={isOpen} onClose={onClose} title="Order from the grill">
            {content}
        </Modal>
    );
}
