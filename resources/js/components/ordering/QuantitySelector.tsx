import { Minus, Plus } from 'lucide-react';
import { IconButton } from '@/components/common/IconButton';

type QuantitySelectorProps = {
    quantity: number;
    onChange: (quantity: number) => void;
};

export function QuantitySelector({ onChange, quantity }: QuantitySelectorProps) {
    return (
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 p-2">
            <IconButton
                aria-label="Decrease quantity"
                className="h-11 w-11"
                onClick={() => onChange(Math.max(1, quantity - 1))}
            >
                <Minus className="h-4 w-4" />
            </IconButton>
            <span className="min-w-8 text-center text-lg font-semibold">{quantity}</span>
            <IconButton aria-label="Increase quantity" className="h-11 w-11" onClick={() => onChange(quantity + 1)}>
                <Plus className="h-4 w-4" />
            </IconButton>
        </div>
    );
}
