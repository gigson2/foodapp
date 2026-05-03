<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisitorSession extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'session_key',
        'ip_hash',
        'user_agent',
        'device_type',
        'browser',
        'platform',
        'referrer',
        'landing_page',
        'last_seen_at',
    ];

    protected function casts(): array
    {
        return [
            'last_seen_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(VisitorEvent::class);
    }
}
