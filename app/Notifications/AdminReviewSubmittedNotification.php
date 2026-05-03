<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdminReviewSubmittedNotification extends Notification
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
            'title' => 'Review pending approval',
            'message' => sprintf('%s submitted a new customer review.', $this->review->customer_name),
            'kind' => 'review_pending',
            'review_id' => $this->review->id,
        ];
    }
}
