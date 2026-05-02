import { Search } from 'lucide-react';

type FoodSearchInputProps = {
    value: string;
    onChange: (value: string) => void;
};

export function FoodSearchInput({ onChange, value }: FoodSearchInputProps) {
    return (
        <label className="glass-card flex items-center gap-3 px-4 py-3">
            <Search className="h-4 w-4 text-muted" />
            <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search dishes, flavors, or categories"
                value={value}
            />
        </label>
    );
}
