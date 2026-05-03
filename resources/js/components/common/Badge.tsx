import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/classNames';

export function Badge({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
    return (
        <span
            className={cn(
                'ui-surface-solid inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-[color:var(--text-900)]',
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
