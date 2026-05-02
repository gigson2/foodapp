import { cn } from '@/utils/classNames';

type FoodFilterTabsProps = {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
};

export function FoodFilterTabs({ activeCategory, categories, onCategoryChange }: FoodFilterTabsProps) {
    return (
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {categories.map((category) => (
                <button
                    className={cn(
                        'whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition',
                        activeCategory === category
                            ? 'border-[color:var(--primary-500)] bg-[color:var(--primary-500)] text-white'
                            : 'border-white/10 bg-white/7 text-[color:var(--text-900)] hover:bg-white/12',
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
