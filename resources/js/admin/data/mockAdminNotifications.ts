import type { AdminNotificationItem } from '@/admin/types/adminNotification';

export const mockAdminNotifications: AdminNotificationItem[] = [
    {
        id: 'note_001',
        title: 'New order received',
        message: 'DRI-10241 from Kwame Mensah just entered the pickup queue.',
        type: 'new_order',
        read: false,
        createdAt: '2026-05-03T10:21:00-05:00',
        orderId: 'ord_001',
    },
    {
        id: 'note_002',
        title: 'Review pending approval',
        message: 'A 5-star review is waiting for moderation before it appears on the public homepage.',
        type: 'review_pending',
        read: false,
        createdAt: '2026-05-03T09:15:00-05:00',
        reviewId: 'rev_001',
    },
    {
        id: 'note_003',
        title: 'Cash collected',
        message: 'Cash was collected successfully for DRI-10238 at pickup.',
        type: 'system',
        read: true,
        createdAt: '2026-05-02T18:10:00-05:00',
        orderId: 'ord_004',
    },
];
