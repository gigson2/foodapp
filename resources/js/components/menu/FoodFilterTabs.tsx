import { cn } from '@/utils/classNames';

type FoodFilterTabsProps = {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
};

export function FoodFilterTabs({ activeCategory, categories, onCategoryChange }: FoodFilterTabsProps) {
    return (
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 text-xs font-semibold uppercase tracking-[0.16em] sm:mx-0 sm:px-0">
            {categories.map((category) => (
                <button
                    className={cn(
                        'ui-focus-ring whitespace-nowrap rounded-full px-4 py-3 transition',
                        activeCategory === category
                            ? 'ui-active-nav text-[color:var(--primary-500)]'
                            : 'ui-surface-solid text-[color:var(--text-900)] hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)]',
                    )}
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    type="button"
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
