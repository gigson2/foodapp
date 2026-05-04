<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class AdminReviewSubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Review $review,
    ) {
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'webpush'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toWebPush(object $notifiable): array
    {
        return [
            'title' => 'Review pending approval',
            'body' => sprintf('%s submitted a new customer review.', $this->review->customer_name),
            'data' => [
                'kind' => 'review_pending',
                'tag' => 'review-'.$this->review->id,
                'review_id' => $this->review->id,
                'url' => '/admin/reviews',
                'renotify' => true,
                'vibrate' => [200, 100, 240],
                'actions' => [
                    ['action' => 'open', 'title' => 'Review now'],
                ],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Review pending approval',
            'message' => sprintf('%s submitted a new customer review.', $this->review->customer_name),
            'kind' => 'review_pending',
            'review_id' => $this->review->id,
        ];
    }
}
