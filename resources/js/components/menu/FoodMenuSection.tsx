import { EmptyState } from '@/components/common/EmptyState';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { FoodFilterTabs } from '@/components/menu/FoodFilterTabs';
import { FoodSearchInput } from '@/components/menu/FoodSearchInput';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
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
    const leftColumn = foods.filter((_, index) => index % 2 === 0);
    const rightColumn = foods.filter((_, index) => index % 2 === 1);

    const renderList = (list: Food[]) => (
        <div className="space-y-8">
            {list.map((food) => (
                <button className="group block w-full rounded-[1.5rem] text-left" key={food.id} onClick={() => onSelectFood(food)} type="button">
                    <div className="theme-divider flex flex-col gap-4 rounded-[1.5rem] border border-transparent px-3 py-4 transition duration-200 group-hover:border-[color:var(--primary-500)]/22 group-hover:bg-[color:var(--primary-500)]/10 group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                            <img alt={`${food.name} prepared for pickup ordering`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={food.image} />
                        </div>
                        <div className="flex-1 sm:pe-6">
                            <h3 className="text-2xl transition-colors group-hover:text-[color:var(--primary-500)]">{food.name}</h3>
                            <p className="mt-3 text-sm leading-7 text-muted transition-colors group-hover:text-[color:var(--text-900)]">{food.description}</p>
                        </div>
                        <div className="shrink-0 text-left sm:text-right">
                            <MoneyDisplay amount={food.price} className="text-2xl font-semibold text-[color:var(--text-950)] transition-colors group-hover:text-[color:var(--primary-500)]" />
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--primary-500)] transition-colors group-hover:text-[color:var(--accent-500)]">
                                {food.tags[0] ?? 'Fresh Grill'}
                            </p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );

    return (
        <div className="relative">
            <SectionContainer
                align="center"
                className="relative pb-16 lg:pb-24"
                description="Browse professionally grilled lamb, chicken, mixed packs, and extras prepared with clean packaging, respectful service, clear availability, and hospitality policies built around customer satisfaction."
                eyebrow="Our Special Menu"
                id="menu"
                title="Our Special Menus"
            >
                <div className="mb-8 flex justify-center">
                    <img alt="" className="h-10 opacity-80" src="/assets/theme/vec2.svg" />
                </div>

                <div className="mx-auto mb-10 max-w-3xl space-y-5">
                    <FoodSearchInput onChange={onSearchChange} value={searchTerm} />
                    <FoodFilterTabs activeCategory={activeCategory} categories={categories} onCategoryChange={onCategoryChange} />
                </div>

                <div className="theme-border-frame theme-dark-block theme-panel relative overflow-hidden px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
                    <img alt="" className="menu-pattern" src="/assets/theme/menu_pattern.png" />

                    {foods.length === 0 ? (
                        <EmptyState
                            description="Try another category or search term to find the grilled pack you want."
                            title="No matching grills found"
                        />
                    ) : (
                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
                            <div>{renderList(leftColumn)}</div>
                            <div>{renderList(rightColumn)}</div>
                        </div>
                    )}
                </div>
            </SectionContainer>
        </div>
    );
}
