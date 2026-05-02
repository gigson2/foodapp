import { Clock3, Flame, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import type { Food } from '@/types';

type FoodCardProps = {
    food: Food;
    onSelect: (food: Food) => void;
};

export function FoodCard({ food, onSelect }: FoodCardProps) {
    return (
        <Card className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <button className="flex h-full w-full flex-col text-left" onClick={() => onSelect(food)} type="button">
                <div className="relative overflow-hidden">
                    <img
                        alt={`${food.name} food presentation`}
                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-52"
                        src={food.image}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
                        <Badge className="bg-[color:var(--background-50)]/70 text-[color:var(--text-950)]">{food.category}</Badge>
                        {food.isPopular ? (
                            <Badge className="bg-[color:var(--primary-500)]/18 text-[color:var(--primary-900)]">
                                <Flame className="mr-1 h-3.5 w-3.5" />
                                Popular
                            </Badge>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold">{food.name}</h3>
                            <MoneyDisplay amount={food.price} className="text-lg font-semibold" />
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted">{food.description}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2 text-sm text-muted">
                            <Clock3 className="h-4 w-4" />
                            {food.preparationTimeMinutes} min
                        </div>
                        <Button size="sm">
                            <ShoppingBag className="h-4 w-4" />
                            Order
                        </Button>
                    </div>
                </div>
            </button>
        </Card>
    );
}
