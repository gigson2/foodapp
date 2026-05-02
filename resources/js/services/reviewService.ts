import type { Review } from '@/types';
import { mockReviews } from '@/data/mockReviews';
import { authService } from '@/services/authService';
import { notificationService } from '@/services/notificationService';
import { orderService } from '@/services/orderService';
import { createId } from '@/utils/ids';
import { readStorage, writeStorage } from '@/utils/storage';

const REVIEW_KEY = 'restaurant.reviews';
const listeners = new Set<() => void>();
let reviewsCache = readStorage<Review[]>(REVIEW_KEY, mockReviews);

function notify() {
    listeners.forEach((listener) => listener());
}

function persist(reviews: Review[]) {
    reviewsCache = reviews;
    writeStorage(REVIEW_KEY, reviews);
    notify();
}

export const reviewService = {
    getReviews() {
        return reviewsCache;
    },
    getApprovedReviews() {
        return this.getReviews().filter((review) => review.status === 'approved');
    },
    getReviewsByPhone(phone: string) {
        const normalizedPhone = authService.normalizePhone(phone);

        return this.getReviews().filter((review) => review.customerPhone === normalizedPhone);
    },
    canSubmitReview(input: { name: string; phone: string }) {
        const normalizedPhone = authService.normalizePhone(input.phone);
        const customer = authService.getCurrentCustomer();

        if (customer && customer.phone === normalizedPhone) {
            return true;
        }

        return orderService.hasOrderHistory(normalizedPhone);
    },
    addPendingReview(input: {
        customerName: string;
        customerPhone: string;
        rating: number;
        message: string;
        foodName?: string;
    }) {
        const review: Review = {
            id: createId('review'),
            customerName: input.customerName.trim(),
            customerPhone: authService.normalizePhone(input.customerPhone),
            rating: input.rating,
            message: input.message.trim(),
            foodName: input.foodName?.trim() || undefined,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        persist([review, ...this.getReviews()]);
        notificationService.addReviewPendingNotification({
            customerName: review.customerName,
            reviewId: review.id,
            foodName: review.foodName,
        });

        return review;
    },
    subscribe(listener: () => void) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    },
};
