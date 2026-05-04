import { Clock3, HandCoins, MapPin, PackageCheck } from 'lucide-react';
import { useState } from 'react';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { QuantitySelector } from '@/components/ordering/QuantitySelector';
import { getCompanyAddress, getCompanyLocationLabel, getCompanyName } from '@/utils/company';
import { openDirectionsPrompt } from '@/utils/location';
import type { CompanySettings, Food } from '@/types';

type FoodOrderModalProps = {
    companySettings: CompanySettings | null;
    food: Food | null;
    isOpen: boolean;
    onClose: () => void;
    onPlaceOrder: (food: Food, quantity: number) => void;
    submitting?: boolean;
};

export function FoodOrderModal({ companySettings, food, isOpen, onClose, onPlaceOrder, submitting = false }: FoodOrderModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [quantity, setQuantity] = useState(1);
    const companyName = getCompanyName(companySettings);
    const pickupAddress = getCompanyAddress(companySettings);
    const pickupLocationLabel = getCompanyLocationLabel(companySettings);
    const fridayHours = companySettings?.opening_hours?.friday ?? 'Pre-orders open';
    const saturdayHours = companySettings?.opening_hours?.saturday ?? '11:00 AM to 10:00 PM';
    const orderingCutoff = companySettings?.opening_hours?.ordering_cutoff ?? 'Saturday 9:00 PM';

    if (! food) {
        return null;
    }

    const total = food.price * quantity;

    const content = (
        <div className="space-y-5">
            <div className="ui-surface-raised overflow-hidden rounded-[1.75rem]">
                <img
                    alt={`${food.name} ready for pickup from ${companyName}`}
                    className="h-44 w-full object-cover sm:h-56"
                    src={food.image}
                />
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-900)]">{food.category}</p>
                    <h3 className="mt-2 text-3xl font-semibold">{food.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{food.description}</p>
                </div>
                <MoneyDisplay amount={food.price} className="text-2xl font-semibold text-[color:var(--primary-900)]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <Card className="p-4 ui-surface-raised">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <Clock3 className="h-4 w-4" />
                        Preparation
                    </div>
                    <p className="mt-2 text-lg font-semibold">{food.preparationTimeMinutes} min</p>
                </Card>
                <Card className="p-4 ui-surface-raised">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <HandCoins className="h-4 w-4" />
                        Payment
                    </div>
                    <p className="mt-2 text-lg font-semibold">Cash only</p>
                </Card>
                <Card className="p-4 ui-surface-raised">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <PackageCheck className="h-4 w-4" />
                        Packaging
                    </div>
                    <p className="mt-2 text-lg font-semibold">Neatly packed</p>
                </Card>
                <Card className="p-4 ui-surface-raised">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <MapPin className="h-4 w-4" />
                        Pickup
                    </div>
                    <button
                        className="mt-2 text-left text-lg font-semibold text-[color:var(--text-950)] transition hover:text-[color:var(--primary-500)]"
                        onClick={() => openDirectionsPrompt(pickupAddress)}
                        type="button"
                    >
                        {pickupLocationLabel}
                    </button>
                </Card>
            </div>

            <div className="ui-surface-solid flex flex-col gap-5 rounded-[1.75rem] p-4 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="ui-surface-solid ui-outline-accent space-y-3 rounded-[1.75rem] p-4 text-sm leading-7 text-muted">
                <p>Cash payment only. Pay when you pick up at the restaurant.</p>
                <button
                    className="text-left text-[color:var(--text-900)] underline decoration-white/20 underline-offset-4 transition hover:text-[color:var(--primary-500)]"
                    onClick={() => openDirectionsPrompt(pickupAddress)}
                    type="button"
                >
                    Pickup location: {pickupAddress}.
                </button>
                <p>Friday: {fridayHours}. Grill preparation and pickup happen Saturday {saturdayHours}, with a final ordering cutoff at {orderingCutoff}.</p>
            </div>

            <Button className="w-full" disabled={submitting} onClick={() => onPlaceOrder(food, quantity)} type="button">
                Place Pickup Order
            </Button>
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet
                description="Confirm quantity and place your pickup order."
                isOpen={isOpen}
                onClose={onClose}
                panelClassName="max-w-[min(100%,32rem)]"
                title="Order from the grill"
            >
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal
            description="Confirm quantity and place your pickup order."
            isOpen={isOpen}
            onClose={onClose}
            panelClassName="max-w-3xl"
            title="Order from the grill"
        >
            {content}
        </Modal>
    );
}
