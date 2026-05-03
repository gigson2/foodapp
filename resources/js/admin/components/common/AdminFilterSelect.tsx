type AdminFilterSelectProps = {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
    label: string;
};

export function AdminFilterSelect({ value, onChange, options, label }: AdminFilterSelectProps) {
    return (
        <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</span>
            <select
                className="theme-field w-full rounded-2xl px-4 py-3"
                onChange={(event) => onChange(event.target.value)}
                value={value}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
