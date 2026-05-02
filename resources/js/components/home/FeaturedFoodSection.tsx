import { Sparkles } from 'lucide-react';
import { FoodCard } from '@/components/menu/FoodCard';
import { SectionContainer } from '@/components/layout/SectionContainer';
import type { Food } from '@/types';

type FeaturedFoodSectionProps = {
    foods: Food[];
    onSelectFood: (food: Food) => void;
};

export function FeaturedFoodSection({ foods, onSelectFood }: FeaturedFoodSectionProps) {
    return (
        <SectionContainer
            description="Start with the restaurant signatures that carry the most repeat-order energy."
            eyebrow="Featured dishes"
            id="featured"
            title="Highlights that turn first visits into repeat pickups"
        >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {foods.map((food) => (
                    <FoodCard food={food} key={food.id} onSelect={onSelectFood} />
                ))}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-muted">
                <Sparkles className="h-4 w-4 text-[color:var(--accent-700)]" />
                Popular and featured tags are prepared for backend-driven menu merchandising later.
            </div>
        </SectionContainer>
    );
}
