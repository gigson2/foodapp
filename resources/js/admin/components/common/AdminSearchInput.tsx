import { Search } from 'lucide-react';

type AdminSearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
};

export function AdminSearchInput({ value, onChange, placeholder, label = 'Search' }: AdminSearchInputProps) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--text-950)]">{label}</span>
            <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                    className="theme-field w-full rounded-2xl py-3 pl-11 pr-4"
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    type="search"
                    value={value}
                />
            </div>
        </label>
    );
}
