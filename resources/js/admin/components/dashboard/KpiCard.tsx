import { ArrowUpRight } from 'lucide-react';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';

type KpiCardProps = {
    label: string;
    value: string;
    tone?: 'default' | 'primary' | 'accent';
    change?: string;
};

export function KpiCard({ label, value, tone = 'default', change }: KpiCardProps) {
    const toneClass =
        tone === 'primary'
            ? 'ui-outline-accent from-[color:var(--primary-500)]/16 to-transparent'
            : tone === 'accent'
                ? 'ui-outline-gold from-[color:var(--accent-500)]/18 to-transparent'
                : 'ui-outline from-white/8 to-transparent';

    return (
        <AdminSectionCard className={`ui-card-hover bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,255,255,0.94))] dark:bg-gradient-to-br ${toneClass} p-5 sm:p-6`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-3xl font-semibold sm:text-4xl">{value}</p>
                {change ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {change}
                    </span>
                ) : null}
            </div>
        </AdminSectionCard>
    );
}
