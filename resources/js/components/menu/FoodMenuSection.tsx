import { EmptyState } from '@/components/common/EmptyState';
import { FoodCard } from '@/components/menu/FoodCard';
import { FoodFilterTabs } from '@/components/menu/FoodFilterTabs';
import { FoodSearchInput } from '@/components/menu/FoodSearchInput';
import { SectionContainer } from '@/components/layout/SectionContainer';
import type { Food } from '@/types';

type FoodMenuSectionProps = {
    activeCategory: string;
    categories: string[];
    foods: Food[];
    onCategoryChange: (category: string) => void;
    onSearchChange: (value: string) => void;
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
            description="Search, filter, and open a dish to control quantity before creating a pickup order."
            eyebrow="Menu"
            id="menu"
            title="A menu flow designed for quick decisions on every screen size"
        >
            <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
                <FoodFilterTabs activeCategory={activeCategory} categories={categories} onChange={onCategoryChange} />
                <FoodSearchInput onChange={onSearchChange} value={searchTerm} />
            </div>

            {foods.length === 0 ? (
                <EmptyState
                    description="Try another category or search term. The current filters did not match any available dishes."
                    title="No dishes found"
                />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {foods.map((food) => (
                        <FoodCard food={food} key={food.id} onSelect={onSelectFood} />
                    ))}
                </div>
            )}
        </SectionContainer>
    );
}
