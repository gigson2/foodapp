<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class CustomerReviewModeratedNotification extends Notification implements ShouldQueue
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
            'title' => 'Review updated',
            'body' => sprintf('Your review is now %s.', $this->review->status->value),
            'data' => [
                'kind' => 'review_status',
                'tag' => 'review-'.$this->review->id,
                'review_id' => $this->review->id,
                'status' => $this->review->status->value,
                'url' => '/customer/reviews',
                'renotify' => true,
                'vibrate' => [180, 90, 180],
                'actions' => [
                    ['action' => 'open', 'title' => 'Open reviews'],
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
            'title' => 'Review updated',
            'message' => sprintf('Your review is now %s.', $this->review->status->value),
            'kind' => 'review_status',
            'review_id' => $this->review->id,
            'status' => $this->review->status->value,
        ];
    }
}
