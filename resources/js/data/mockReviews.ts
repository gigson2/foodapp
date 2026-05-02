import type { Review } from '@/types';

export const mockReviews: Review[] = [
    {
        id: 'review_approved_1',
        customerName: 'Mariam K.',
        customerPhone: '4025551101',
        rating: 5,
        message: 'The goat was very tender and the packaging was clean. Pickup was simple and the flavor stayed consistent all the way home.',
        foodName: 'Grilled Goat Pack',
        status: 'approved',
        createdAt: '2026-04-04T11:15:00.000Z',
    },
    {
        id: 'review_approved_2',
        customerName: 'David O.',
        customerPhone: '4025551102',
        rating: 5,
        message: 'The full grilled chicken had a proper smoky taste and still felt soft. This is the kind of grill I would recommend for family pickup.',
        foodName: 'Full Grilled Chicken Pack',
        status: 'approved',
        createdAt: '2026-04-12T18:25:00.000Z',
    },
    {
        id: 'review_approved_3',
        customerName: 'Angela T.',
        customerPhone: '4025551103',
        rating: 4,
        message: 'I liked the mixed pack because the goat and chicken both came fresh, hot, and neatly arranged in the takeaway container.',
        foodName: 'Mixed Goat & Chicken Pack',
        status: 'approved',
        createdAt: '2026-04-18T13:40:00.000Z',
    },
    {
        id: 'review_pending_1',
        customerName: 'Samuel N.',
        customerPhone: '4025551104',
        rating: 5,
        message: 'Great packaging and very satisfying grill portions. Waiting to order again.',
        foodName: 'Family Goat Tray',
        status: 'pending',
        createdAt: '2026-04-22T16:05:00.000Z',
    },
];
