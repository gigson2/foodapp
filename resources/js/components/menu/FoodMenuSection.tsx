import { EmptyState } from '@/components/common/EmptyState';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { FoodCard } from '@/components/menu/FoodCard';
import { FoodFilterTabs } from '@/components/menu/FoodFilterTabs';
import { FoodSearchInput } from '@/components/menu/FoodSearchInput';
import type { Food } from '@/types';

type FoodMenuSectionProps = {
    activeCategory: string;
    categories: string[];
    foods: Food[];
    onCategoryChange: (category: string) => void;
    onSearchChange: (term: string) => void;
    onSelectFood: (food: Food) => void;
    searchTerm: string;
};

export function FoodMenuSection({
    activeCategory,
    categories,
    foods,
    onCategoryChange,
    onSearchChange,
    onSelectFood,
    searchTerm,
}: FoodMenuSectionProps) {
    return (
        <SectionContainer
            description="Browse grilled goat, grilled chicken, mixed grill packs, and larger trays prepared for clean pickup."
            eyebrow="Pickup Menu"
            id="menu"
            title="Build your order from the grill"
        >
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl">
                        <FoodSearchInput onChange={onSearchChange} value={searchTerm} />
                    </div>
                    <div className="text-sm text-muted">Cash payment only. Pickup only.</div>
                </div>

                <FoodFilterTabs activeCategory={activeCategory} categories={categories} onCategoryChange={onCategoryChange} />

                {foods.length === 0 ? (
                    <EmptyState
                        description="Try another category or search term to find the grilled pack you want."
                        title="No matching grills found"
                    />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {foods.map((food) => (
                            <FoodCard food={food} key={food.id} onSelectFood={onSelectFood} />
                        ))}
                    </div>
                )}
            </div>
        </SectionContainer>
    );
}
