import { SearchX } from 'lucide-react';

type EmptyStateProps = {
    title: string;
    description: string;
};

export function EmptyState({ description, title }: EmptyStateProps) {
    return (
        <div className="glass-card flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="rounded-full bg-white/10 p-4">
                <SearchX className="h-6 w-6 text-[color:var(--accent-700)]" />
            </div>
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-muted">{description}</p>
            </div>
        </div>
    );
}
