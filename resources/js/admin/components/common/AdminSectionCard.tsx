import { cn } from '@/utils/classNames';

type AdminSectionCardProps = {
    children: React.ReactNode;
    className?: string;
};

export function AdminSectionCard({ children, className }: AdminSectionCardProps) {
    return (
        <section className={cn('theme-panel ui-surface rounded-[1.75rem]', className)}>
            {children}
        </section>
    );
}
