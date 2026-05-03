import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className, ...props }: IconButtonProps) {
    return (
        <button
            className={cn(
                'ui-focus-ring ui-surface-solid inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--text-950)] transition hover:border-[color:var(--ui-border-strong)] hover:bg-[color:var(--ui-surface-raised)] hover:shadow-[var(--ui-shadow-hover)]',
                className,
            )}
            type="button"
            {...props}
        />
    );
}
