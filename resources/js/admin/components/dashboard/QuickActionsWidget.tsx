import { Link } from 'react-router-dom';
import type { AdminQuickAction } from '@/admin/types/adminDashboard';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';

type QuickActionsWidgetProps = {
    actions: AdminQuickAction[];
};

export function QuickActionsWidget({ actions }: QuickActionsWidgetProps) {
    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Quick actions</p>
            <h2 className="mt-2 text-3xl">Move fast</h2>
            <div className="mt-5 grid gap-3">
                {actions.map((action) => (
                    <Link className="ui-surface-raised ui-card-hover rounded-[1.35rem] px-4 py-4" key={action.id} to={action.to}>
                        <p className="font-semibold">{action.label}</p>
                        <p className="mt-2 text-sm leading-7 text-muted">{action.description}</p>
                    </Link>
                ))}
            </div>
        </AdminSectionCard>
    );
}
