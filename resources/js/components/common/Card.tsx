import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/classNames';

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    return (
        <div className={cn('glass-card theme-panel', className)} {...props}>
            {children}
        </div>
    );
}
