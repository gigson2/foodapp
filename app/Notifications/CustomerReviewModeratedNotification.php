<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CustomerReviewModeratedNotification extends Notification
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
        return ['database'];
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
