import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className, ...props }: IconButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[color:var(--text-950)] transition hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-500)]/70',
                className,
            )}
            type="button"
            {...props}
        />
    );
}
