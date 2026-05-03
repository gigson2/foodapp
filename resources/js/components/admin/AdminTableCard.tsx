import type { ReactNode } from 'react';
import { Card } from '@/components/common/Card';

type AdminTableCardProps = {
    children: ReactNode;
    description: string;
    title: string;
};

export function AdminTableCard({ children, description, title }: AdminTableCardProps) {
    return (
        <Card className="theme-panel overflow-hidden p-0">
            <div className="border-b border-white/10 px-5 py-4">
                <h2 className="text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
            </div>
            <div className="overflow-x-auto">{children}</div>
        </Card>
    );
}
