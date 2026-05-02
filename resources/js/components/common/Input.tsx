import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    label?: string;
};

export function Input({ className, error, label, ...props }: InputProps) {
    return (
        <label className="block space-y-2">
            {label ? <span className="text-sm font-medium text-[color:var(--text-950)]">{label}</span> : null}
            <input
                className={cn(
                    'w-full rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-[color:var(--text-950)] outline-none transition placeholder:text-[color:var(--text-800)] focus:border-[color:var(--accent-500)]/40 focus:bg-white/10',
                    error ? 'border-[color:var(--primary-500)]/45' : '',
                    className,
                )}
                {...props}
            />
            {error ? <span className="text-sm text-[color:var(--primary-800)]">{error}</span> : null}
        </label>
    );
}
