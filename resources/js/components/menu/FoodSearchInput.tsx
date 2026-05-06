import { Search } from 'lucide-react';

type FoodSearchInputProps = {
    value: string;
    onChange: (value: string) => void;
};

export function FoodSearchInput({ onChange, value }: FoodSearchInputProps) {
    return (
        <label className="relative block">
            <span className="sr-only">Search the grill menu</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-800)]" />
            <input
                className="w-full rounded-full border border-white/10 bg-transparent py-4 pl-11 pr-4 text-sm text-[color:var(--text-950)] outline-none transition placeholder:text-[color:var(--text-800)] focus:border-[color:var(--accent-500)]/40 focus:bg-white/8"
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search grilled lamb, chicken, mixed packs..."
                type="search"
                value={value}
            />
        </label>
    );
}
