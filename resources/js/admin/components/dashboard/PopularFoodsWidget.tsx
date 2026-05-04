import type { AdminPopularFood } from '@/admin/types/adminDashboard';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';

type PopularFoodsWidgetProps = {
    foods: AdminPopularFood[];
};

export function PopularFoodsWidget({ foods }: PopularFoodsWidgetProps) {
    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Popular foods</p>
            <h2 className="mt-2 text-3xl">Best movers</h2>
            <div className="mt-5 space-y-4">
                {foods.length === 0 ? (
                    <div className="ui-surface-solid rounded-[1.25rem] px-4 py-4 text-sm text-muted">
                        No menu sales were recorded in the selected date range.
                    </div>
                ) : null}
                {foods.map((food, index) => (
                    <div className="ui-surface-solid flex items-center justify-between gap-3 rounded-[1.25rem] px-4 py-4" key={food.id}>
                        <div className="flex items-center gap-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary-500)]/12 text-sm font-semibold text-[color:var(--primary-500)]">
                                {index + 1}
                            </span>
                            <div>
                                <p className="font-semibold">{food.name}</p>
                                <p className="mt-1 text-sm text-muted">{food.ordersCount} orders</p>
                            </div>
                        </div>
                        <p className="font-semibold">{formatAdminMoney(food.revenue)}</p>
                    </div>
                ))}
            </div>
        </AdminSectionCard>
    );
}
