import { Button } from '@/components/common/Button';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import type { Review } from '@/types';

type ReviewsSectionProps = {
    reviews: Review[];
    onLeaveReview: () => void;
};

export function ReviewsSection({ onLeaveReview, reviews }: ReviewsSectionProps) {
    return (
        <SectionContainer
            description="Public reviews below are approved customer comments from pickup orders at Dri Africain Traditional Grill LLC."
            eyebrow="Customer Reviews"
            id="reviews"
            title="Trusted by grill customers who care about flavor and packaging"
        >
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl text-sm leading-7 text-muted">
                        The focus is simple: tender grilled meat, neat takeaway packaging, and a pickup experience that respects the customer’s time.
                    </div>
                    <Button onClick={onLeaveReview} size="lg" variant="secondary">
                        Leave a Review
                    </Button>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </SectionContainer>
    );
}
