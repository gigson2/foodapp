import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

const buttonVariants = cva(
    'ui-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition duration-200 disabled:pointer-events-none disabled:opacity-60',
    {
        variants: {
            variant: {
                primary:
                    'border border-[color:var(--ui-border-accent)] bg-[color:var(--primary-500)] text-white shadow-[0_16px_36px_rgba(203,69,56,0.28)] hover:bg-[color:var(--primary-600)] hover:shadow-[var(--ui-shadow-hover)]',
                secondary:
                    'ui-surface-solid text-[color:var(--text-950)] hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)]',
                glass:
                    'border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/16',
                ghost:
                    'ui-outline bg-transparent text-[color:var(--text-950)] hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-muted)]',
                accent:
                    'border border-[color:var(--ui-border-gold)] bg-[color:var(--accent-500)] text-[color:var(--accent-950)] shadow-[0_16px_36px_rgba(211,145,50,0.24)] hover:bg-[color:var(--accent-600)] hover:shadow-[var(--ui-shadow-hover)]',
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
