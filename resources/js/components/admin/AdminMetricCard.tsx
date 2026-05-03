import type { ReactNode } from 'react';
import { Card } from '@/components/common/Card';

type AdminMetricCardProps = {
    label: string;
    value: ReactNode;
    helper?: string;
};

export function AdminMetricCard({ helper, label, value }: AdminMetricCardProps) {
    return (
        <Card className="theme-panel p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
            <div className="mt-4 text-3xl font-semibold">{value}</div>
            {helper ? <p className="mt-3 text-sm text-muted">{helper}</p> : null}
        </Card>
    );
}
