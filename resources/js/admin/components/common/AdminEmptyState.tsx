import { AlertCircle } from 'lucide-react';

type AdminEmptyStateProps = {
    title: string;
    description: string;
};

export function AdminEmptyState({ title, description }: AdminEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[color:var(--primary-500)]">
                <AlertCircle className="h-5 w-5" />
            </div>
            <h2 className="text-2xl">{title}</h2>
            <p className="max-w-lg text-sm leading-7 text-muted">{description}</p>
        </div>
    );
}
