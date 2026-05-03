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
                    'theme-field ui-focus-ring w-full rounded-2xl px-4 py-3',
                    error ? 'border-[color:var(--primary-500)]/45' : '',
                    className,
                )}
                {...props}
            />
            {error ? <span className="text-sm text-[color:var(--primary-800)]">{error}</span> : null}
        </label>
    );
}
