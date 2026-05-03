import { Clock3 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import type { Food } from '@/types';

type FoodCardProps = {
    food: Food;
    onSelectFood: (food: Food) => void;
};

export function FoodCard({ food, onSelectFood }: FoodCardProps) {
    return (
        <Card className="group overflow-hidden rounded-[1.25rem] ui-card-hover">
            <button className="block w-full text-left" onClick={() => onSelectFood(food)} type="button">
                <div className="relative h-52 overflow-hidden border-b ui-divider">
                    <img
                        alt={`${food.name} prepared for pickup ordering`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={food.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,16,15,0.94)] via-[rgba(17,16,15,0.1)] to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {food.tags.slice(0, 2).map((tag) => (
                            <span
                                className="ui-outline-strong rounded-full bg-[rgba(17,16,15,0.7)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-950)]"
                                key={tag}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-900)]">
                                {food.category}
                            </p>
                            <h3 className="mt-2 text-[1.65rem]">{food.name}</h3>
                        </div>
                        <MoneyDisplay amount={food.price} className="text-lg font-semibold text-[color:var(--primary-900)]" />
                    </div>

                    <p className="text-sm leading-7 text-muted">{food.description}</p>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted">
                            <Clock3 className="h-4 w-4" />
                            {food.preparationTimeMinutes} min
                        </div>
                        <span className="ui-outline-gold rounded-full bg-[color:var(--secondary-500)]/14 px-3 py-1 text-xs font-semibold text-[color:var(--secondary-900)]">
                            Available
                        </span>
                    </div>

                    <Button className="w-full" type="button">
                        View / Order
                    </Button>
                </div>
            </button>
        </Card>
    );
}
