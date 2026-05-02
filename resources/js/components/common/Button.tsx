import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

const buttonVariants = cva(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-500)]/70 disabled:pointer-events-none disabled:opacity-60',
    {
        variants: {
            variant: {
                primary:
                    'bg-[color:var(--primary-500)] text-white shadow-[0_16px_36px_rgba(203,69,56,0.28)] hover:bg-[color:var(--primary-600)]',
                secondary:
                    'border border-white/12 bg-[color:var(--background-200)] text-[color:var(--text-950)] hover:bg-[color:var(--background-300)]',
                ghost:
                    'border border-white/12 bg-transparent text-[color:var(--text-950)] hover:bg-white/8',
                accent:
                    'bg-[color:var(--accent-500)] text-[color:var(--accent-950)] shadow-[0_16px_36px_rgba(211,145,50,0.24)] hover:bg-[color:var(--accent-600)]',
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
