type FoodFilterTabsProps = {
    activeCategory: string;
    categories: string[];
    onChange: (category: string) => void;
};

export function FoodFilterTabs({ activeCategory, categories, onChange }: FoodFilterTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
                <button
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        activeCategory === category
                            ? 'border-transparent bg-[color:var(--accent-500)] text-[color:var(--accent-50)]'
                            : 'border-white/10 bg-white/7 text-[color:var(--text-900)] hover:bg-white/12'
                    }`}
                    key={category}
                    onClick={() => onChange(category)}
                    type="button"
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
