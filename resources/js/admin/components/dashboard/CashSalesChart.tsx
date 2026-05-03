import type { AdminSalesPoint } from '@/admin/types/adminDashboard';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { AdminEChart } from '@/admin/components/common/AdminEChart';

type CashSalesChartProps = {
    series: AdminSalesPoint[];
};

export function CashSalesChart({ series }: CashSalesChartProps) {
    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Cash sales</p>
            <h2 className="mt-2 text-3xl">Daily collection</h2>
            <div className="mt-6">
                <AdminEChart
                    height={320}
                    option={{
                        grid: { left: 24, right: 16, top: 16, bottom: 24, containLabel: true },
                        xAxis: {
                            type: 'category',
                            data: series.map((point) => point.label),
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: [
                            {
                                type: 'line',
                                smooth: true,
                                areaStyle: {},
                                data: series.map((point) => point.amount),
                            },
                        ],
                    }}
                />
            </div>
        </AdminSectionCard>
    );
}
