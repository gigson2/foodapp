<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'company_name',
        'tagline',
        'about',
        'phone',
        'email',
        'address',
        'pickup_instructions',
        'cash_only_notice',
        'opening_hours',
        'logo',
        'favicon',
        'social_links',
    ];

    protected function casts(): array
    {
        return [
            'opening_hours' => 'array',
            'social_links' => 'array',
        ];
    }
}
