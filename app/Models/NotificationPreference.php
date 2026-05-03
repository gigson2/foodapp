<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'in_app_enabled',
        'push_enabled',
        'email_enabled',
        'preferences',
    ];

    protected function casts(): array
    {
        return [
            'in_app_enabled' => 'boolean',
            'push_enabled' => 'boolean',
            'email_enabled' => 'boolean',
            'preferences' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
