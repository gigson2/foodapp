import { useMemo, useSyncExternalStore } from 'react';
import { reviewService } from '@/services/reviewService';
import type { Review } from '@/types';

const EMPTY_REVIEWS: Review[] = [];

function subscribe(listener: () => void) {
    return reviewService.subscribe(listener);
}

function getSnapshot() {
    return reviewService.getReviews();
}

export function useLocalReviews(phone?: string | null) {
    const reviews = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const approvedReviews = useMemo(
        () => reviews.filter((review) => review.status === 'approved'),
        [reviews],
    );
    const customerReviews = useMemo(
        () => (phone ? reviews.filter((review) => review.customerPhone === phone) : EMPTY_REVIEWS),
        [phone, reviews],
    );

    return {
        reviews,
        approvedReviews,
        customerReviews,
    };
}
