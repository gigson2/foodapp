import { Star } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import type { Review } from '@/types';

type ReviewCardProps = {
    review: Review;
    showStatus?: boolean;
};

export function ReviewCard({ review, showStatus = false }: ReviewCardProps) {
    return (
        <Card className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">{review.customerName}</h3>
                    <p className="mt-1 text-sm text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                {showStatus ? (
                    <Badge className="bg-white/10 text-[color:var(--text-950)] capitalize">{review.status}</Badge>
                ) : null}
            </div>

            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                    <Star
                        className={index < review.rating ? 'h-4 w-4 fill-[color:var(--accent-500)] text-[color:var(--accent-500)]' : 'h-4 w-4 text-[color:var(--text-800)]'}
                        key={`${review.id}_${index + 1}`}
                    />
                ))}
            </div>

            <p className="text-sm leading-7 text-muted">{review.message}</p>

            {review.foodName ? (
                <p className="text-sm font-medium text-[color:var(--accent-900)]">Ordered: {review.foodName}</p>
            ) : null}
        </Card>
    );
}
