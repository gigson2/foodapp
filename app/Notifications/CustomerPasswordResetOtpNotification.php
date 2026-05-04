<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomerPasswordResetOtpNotification extends Notification
{
    public function __construct(
        protected string $otp,
        protected int $expiresInMinutes,
    ) {
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Your password reset code')
            ->greeting('Hello '.trim((string) ($notifiable->name ?? 'there')).',')
            ->line('Use the code below to reset your password:')
            ->line($this->otp)
            ->line('This code expires in '.$this->expiresInMinutes.' minutes.')
            ->line('If you did not request a password reset, you can ignore this email.');
    }
}