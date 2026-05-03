import type { AdminVisitorSummary } from '@/admin/types/adminDashboard';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';

type VisitorSummaryWidgetProps = {
    summary: AdminVisitorSummary;
};

export function VisitorSummaryWidget({ summary }: VisitorSummaryWidgetProps) {
    const metrics = [
        { label: 'Today visitors', value: summary.todayVisitors },
        { label: 'Returning visitors', value: summary.returningVisitors },
        { label: 'Food views', value: summary.foodViews },
        { label: 'Order starts', value: summary.orderStarts },
    ];

    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Visitor activity</p>
            <h2 className="mt-2 text-3xl">CRM pulse</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {metrics.map((metric) => (
                    <div className="ui-surface-solid rounded-[1.25rem] px-4 py-4" key={metric.label}>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{metric.label}</p>
                        <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
                    </div>
                ))}
            </div>
        </AdminSectionCard>
    );
}
