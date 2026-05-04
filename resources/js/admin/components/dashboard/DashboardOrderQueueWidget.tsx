import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminPaginatedResult } from '@/admin/services/adminApiClient';
import type { AdminOrder } from '@/admin/types/adminOrder';
import { formatAdminDateTime } from '@/admin/utils/adminDates';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { getCashStatusMeta, getOrderStatusMeta } from '@/admin/utils/adminStatus';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';

type DashboardOrderQueueWidgetProps = {
    description: string;
    emptyMessage: string;
    eyebrow: string;
    orders: AdminOrder[];
    title: string;
    meta?: AdminPaginatedResult<AdminOrder>['meta'];
    onPageChange: (page: number) => void;
    onView: (orderId: string) => void;
    viewLabel: string;
};

export function DashboardOrderQueueWidget({
    description,
    emptyMessage,
    eyebrow,
    orders,
    title,
    meta,
    onPageChange,
    onView,
    viewLabel,
}: DashboardOrderQueueWidgetProps) {
    return (
        <AdminSectionCard className="overflow-hidden">
            <div className="border-b border-[color:var(--ui-divider)] px-5 py-5 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
                <h2 className="mt-2 text-3xl">{title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
            </div>

            <div className="p-5 sm:p-6">
                {orders.length === 0 ? (
                    <div className="ui-surface-solid rounded-[1.35rem] p-5 text-sm text-muted">
                        {emptyMessage}
                    </div>
                ) : (
                    <>
                        <div className="hidden lg:block">
                            <div className="ui-surface-solid overflow-hidden rounded-[1.4rem]">
                                <div className="grid grid-cols-[1.05fr_1.05fr_1.5fr_0.9fr_0.95fr_0.9fr] gap-4 border-b border-[color:var(--ui-divider)] px-5 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                                    <p>Order</p>
                                    <p>Customer</p>
                                    <p>Items</p>
                                    <p>Status</p>
                                    <p>Total</p>
                                    <p>Date</p>
                                </div>
                                <div className="divide-y divide-[color:var(--ui-divider)]">
                                    {orders.map((order) => {
                                        const statusMeta = getOrderStatusMeta(order.status);
                                        const cashMeta = getCashStatusMeta(order.cashStatus);

                                        return (
                                            <article className="grid grid-cols-[1.05fr_1.05fr_1.5fr_0.9fr_0.95fr_0.9fr] gap-4 px-5 py-4" key={order.id}>
                                                <div>
                                                    <p className="font-semibold">{order.orderNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{order.customerName}</p>
                                                    <p className="mt-1 text-sm text-muted">{order.customerPhone}</p>
                                                </div>
                                                <p className="text-sm leading-7 text-muted">
                                                    {order.items.map((item) => `${item.quantity}x ${item.foodName}`).join(', ')}
                                                </p>
                                                <div className="flex flex-col items-start gap-2">
                                                    <AdminBadge className={statusMeta.className}>{statusMeta.label}</AdminBadge>
                                                    <AdminBadge className={cashMeta.className}>{cashMeta.label}</AdminBadge>
                                                </div>
                                                <p className="text-lg font-semibold">{formatAdminMoney(order.total)}</p>
                                                <div>
                                                    <p className="text-xs text-muted">{formatAdminDateTime(order.createdAt)}</p>
                                                    <button
                                                        className="mt-2 text-sm font-semibold text-[color:var(--primary-500)]"
                                                        onClick={() => onView(order.id)}
                                                        type="button"
                                                    >
                                                        {viewLabel}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:hidden md:grid-cols-2">
                            {orders.map((order) => {
                                const statusMeta = getOrderStatusMeta(order.status);
                                const cashMeta = getCashStatusMeta(order.cashStatus);

                                return (
                                    <article className="ui-surface-raised rounded-[1.4rem] p-4" key={order.id}>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">{order.orderNumber}</p>
                                            <AdminBadge className={statusMeta.className}>{statusMeta.label}</AdminBadge>
                                            <AdminBadge className={cashMeta.className}>{cashMeta.label}</AdminBadge>
                                        </div>

                                        <p className="mt-3 text-sm font-medium">{order.customerName}</p>
                                        <p className="mt-1 text-sm text-muted">{order.customerPhone}</p>
                                        <p className="mt-3 text-sm leading-7 text-muted">
                                            {order.items.map((item) => `${item.quantity}x ${item.foodName}`).join(', ')}
                                        </p>

                                        <div className="mt-4 flex items-end justify-between gap-3">
                                            <div>
                                                <p className="text-lg font-semibold">{formatAdminMoney(order.total)}</p>
                                                <p className="mt-2 text-xs text-muted">{formatAdminDateTime(order.createdAt)}</p>
                                                <button
                                                    className="mt-2 text-sm font-semibold text-[color:var(--primary-500)]"
                                                    onClick={() => onView(order.id)}
                                                    type="button"
                                                >
                                                    {viewLabel}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {meta ? (
                <div className="flex flex-col gap-3 border-t border-[color:var(--ui-divider)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-sm text-muted">
                        Showing {meta.from ?? 0}-{meta.to ?? 0} of {meta.total}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className="ui-surface-solid inline-flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"
                            disabled={meta.currentPage <= 1}
                            onClick={() => onPageChange(meta.currentPage - 1)}
                            type="button"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="min-w-20 text-center text-sm font-semibold">
                            Page {meta.currentPage} / {meta.lastPage}
                        </span>
                        <button
                            className="ui-surface-solid inline-flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"
                            disabled={meta.currentPage >= meta.lastPage}
                            onClick={() => onPageChange(meta.currentPage + 1)}
                            type="button"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : null}
        </AdminSectionCard>
    );
}
