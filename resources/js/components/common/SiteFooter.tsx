import { cn } from '@/utils/classNames';

type SiteFooterProps = {
    className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
    return (
        <footer className={cn('py-6 text-center text-xs text-muted sm:text-sm', className)}>
            <p>&copy; Bisama Technologies {new Date().getFullYear()}</p>
        </footer>
    );
}
