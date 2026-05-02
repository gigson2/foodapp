import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

const buttonVariants = cva(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-500)]/70 disabled:pointer-events-none disabled:opacity-60',
    {
        variants: {
            variant: {
                primary:
                    'bg-[color:var(--primary-500)] text-white shadow-[0_18px_40px_color-mix(in_srgb,var(--primary-500)_32%,transparent)] hover:bg-[color:var(--primary-600)]',
                secondary:
                    'bg-[color:var(--background-200)] text-[color:var(--text-950)] hover:bg-[color:var(--background-300)]',
                ghost:
                    'bg-transparent text-[color:var(--text-950)] hover:bg-white/8',
                accent:
                    'bg-[color:var(--accent-500)] text-[color:var(--accent-50)] shadow-[0_18px_40px_color-mix(in_srgb,var(--accent-500)_28%,transparent)] hover:bg-[color:var(--accent-600)]',
            },
            size: {
                sm: 'min-h-9 px-4 py-2 text-xs',
                md: 'min-h-11 px-5 py-3 text-sm',
                lg: 'min-h-12 px-6 py-3.5 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, size, variant, ...props }: ButtonProps) {
    return <button className={cn(buttonVariants({ className, size, variant }))} {...props} />;
}
