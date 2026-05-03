import type { AdminOrder } from '@/admin/types/adminOrder';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { getCashStatusMeta, getOrderStatusMeta } from '@/admin/utils/adminStatus';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';

type RecentOrdersWidgetProps = {
    orders: AdminOrder[];
};

export function RecentOrdersWidget({ orders }: RecentOrdersWidgetProps) {
    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Recent orders</p>
                    <h2 className="mt-2 text-3xl">Pickup queue</h2>
                </div>
                <a className="text-sm font-semibold text-[color:var(--primary-500)]" href="/admin/orders">
                    View all
                </a>
            </div>

            <div className="mt-5 space-y-4">
                {orders.map((order) => {
                    const statusMeta = getOrderStatusMeta(order.status);
                    const cashMeta = getCashStatusMeta(order.cashStatus);

                    return (
                        <div className="ui-surface-raised rounded-[1.4rem] p-4" key={order.id}>
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold">{order.orderNumber}</p>
                                        <AdminBadge className={statusMeta.className}>{statusMeta.label}</AdminBadge>
                                        <AdminBadge className={cashMeta.className}>{cashMeta.label}</AdminBadge>
                                    </div>
                                    <p className="mt-3 text-sm text-muted">{order.customerName} | {order.customerPhone}</p>
                                    <p className="mt-2 text-sm leading-7 text-muted">
                                        {order.items.map((item) => `${item.quantity}x ${item.foodName}`).join(', ')}
                                    </p>
                                </div>
                                <div className="text-left lg:text-right">
                                    <p className="text-2xl font-semibold">{formatAdminMoney(order.total)}</p>
                                    <p className="mt-2 text-sm text-muted">{formatAdminDateTime(order.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminSectionCard>
    );
}
