import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/common/Button';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import type { Review } from '@/types';

type ReviewsSectionProps = {
    reviews: Review[];
    onLeaveReview: () => void;
};

export function ReviewsSection({ onLeaveReview, reviews }: ReviewsSectionProps) {
    const [page, setPage] = useState(0);
    const cardsPerPage = 2;
    const pages = Math.max(1, Math.ceil(reviews.length / cardsPerPage));
    const visibleReviews = useMemo(
        () => reviews.slice(page * cardsPerPage, page * cardsPerPage + cardsPerPage),
        [page, reviews],
    );

    return (
        <SectionContainer
            align="center"
            className="pb-16 lg:pb-20"
            description="Approved customer feedback presented in a more content-led section so the page matches the supplied restaurant design language."
            eyebrow="Customer Reviews"
            id="reviews"
            title="What Our Customers Say"
        >
            <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
                <div className="space-y-6 text-left">
                    <h3 className="text-4xl">Trusted by grill customers who value flavor, tenderness, and neat packaging.</h3>
                    <p className="text-base leading-8 text-muted">
                        Public reviews below are approved comments from customers who placed pickup orders through this restaurant.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={onLeaveReview} size="lg">
                            Leave a Review
                        </Button>
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Previous review"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 transition hover:bg-white/12"
                                onClick={() => setPage((current) => (current - 1 + pages) % pages)}
                                type="button"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                aria-label="Next review"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 transition hover:bg-white/12"
                                onClick={() => setPage((current) => (current + 1) % pages)}
                                type="button"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    {visibleReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </SectionContainer>
    );
}
