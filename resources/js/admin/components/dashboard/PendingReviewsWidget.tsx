import type { AdminPendingReviewSummary } from '@/admin/types/adminDashboard';
import { formatRelativeDayLabel } from '@/admin/utils/adminDates';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';

type PendingReviewsWidgetProps = {
    reviews: AdminPendingReviewSummary[];
};

export function PendingReviewsWidget({ reviews }: PendingReviewsWidgetProps) {
    return (
        <AdminSectionCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Review moderation</p>
                    <h2 className="mt-2 text-3xl">Pending reviews</h2>
                </div>
                <a className="text-sm font-semibold text-[color:var(--primary-500)]" href="/admin/reviews">
                    Review all
                </a>
            </div>
            <div className="mt-5 space-y-4">
                {reviews.length === 0 ? (
                    <div className="ui-surface-solid rounded-[1.3rem] p-4 text-sm text-muted">
                        No pending reviews were submitted in the selected date range.
                    </div>
                ) : null}
                {reviews.map((review) => (
                    <div className="ui-surface-solid rounded-[1.3rem] p-4" key={review.id}>
                        <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">{review.customerName}</p>
                            <p className="text-sm text-[color:var(--accent-500)]">{'★'.repeat(review.rating)}</p>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted">{review.message}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted">{formatRelativeDayLabel(review.createdAt)}</p>
                    </div>
                ))}
            </div>
        </AdminSectionCard>
    );
}
