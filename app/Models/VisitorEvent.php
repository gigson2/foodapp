<?php

namespace App\Models;

use App\Enums\VisitorEventType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitorEvent extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'visitor_session_id',
        'user_id',
        'event_type',
        'event_name',
        'page_url',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'event_type' => VisitorEventType::class,
            'metadata' => 'array',
        ];
    }

    public function visitorSession(): BelongsTo
    {
        return $this->belongsTo(VisitorSession::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
