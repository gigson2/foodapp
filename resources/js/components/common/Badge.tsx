import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/classNames';

export function Badge({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-[color:var(--text-900)]',
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
