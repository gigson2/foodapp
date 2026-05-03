import type { AdminStatusBreakdownItem } from '@/admin/types/adminDashboard';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { AdminEChart } from '@/admin/components/common/AdminEChart';

type OrderStatusChartProps = {
    breakdown: AdminStatusBreakdownItem[];
};

export function OrderStatusChart({ breakdown }: OrderStatusChartProps) {
    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Order status</p>
            <h2 className="mt-2 text-3xl">Current mix</h2>
            <div className="mt-6">
                <AdminEChart
                    height={320}
                    option={{
                        grid: { left: 24, right: 16, top: 16, bottom: 24, containLabel: true },
                        xAxis: {
                            type: 'category',
                            data: breakdown.map((item) => item.label),
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: [
                            {
                                type: 'bar',
                                data: breakdown.map((item) => item.count),
                                barWidth: '46%',
                                itemStyle: {
                                    borderRadius: [12, 12, 0, 0],
                                },
                            },
                        ],
                    }}
                />
            </div>
        </AdminSectionCard>
    );
}
