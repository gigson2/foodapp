import { useQuery } from '@tanstack/react-query';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { customerPortalService } from '@/customer/services/customerPortalService';
import { formatDateTime } from '@/utils/admin';

export function CustomerReviewsPage() {
    const reviewsQuery = useQuery({
        queryKey: ['customer-portal', 'reviews'],
        queryFn: customerPortalService.getReviews,
        refetchOnWindowFocus: true,
    });

    if (reviewsQuery.isLoading && !reviewsQuery.data) {
        return (
            <div className="section-shell flex min-h-[40vh] items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    const reviews = reviewsQuery.data ?? [];

    return (
        <div className="section-shell space-y-6 py-6">
            <div>
                <p className="section-eyebrow">Customer dashboard</p>
                <h2 className="mt-4 text-4xl sm:text-5xl">Reviews</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                    Follow the approval status of the reviews you submitted after placing pickup orders.
                </p>
            </div>

            <AdminSectionCard className="overflow-hidden">
                {reviews.length === 0 ? (
                    <div className="px-5 py-10 text-sm text-muted">No submitted reviews yet.</div>
                ) : (
                    <div className="divide-y divide-[color:var(--ui-divider)]">
                        {reviews.map((review) => (
                            <div className="px-5 py-5" key={review.id}>
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="font-semibold">{review.foodName ?? 'General review'}</p>
                                            <span className="ui-outline-accent rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--primary-500)]">{review.status}</span>
                                        </div>
                                        {review.orderNumber ? <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">Order {review.orderNumber}</p> : null}
                                        <p className="mt-3 text-sm leading-7 text-muted">{review.message}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold">{review.rating}/5</p>
                                        <p className="mt-2 text-xs text-muted">{formatDateTime(review.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AdminSectionCard>
        </div>
    );
}
