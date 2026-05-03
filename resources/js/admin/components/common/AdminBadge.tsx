import { cn } from '@/utils/classNames';

type AdminBadgeProps = {
    children: React.ReactNode;
    className?: string;
};

export function AdminBadge({ children, className }: AdminBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]',
                className,
            )}
        >
            {children}
        </span>
    );
}
