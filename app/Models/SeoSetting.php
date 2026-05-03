<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'page_key',
        'title',
        'description',
        'keywords',
        'og_image',
        'schema_json',
    ];

    protected function casts(): array
    {
        return [
            'schema_json' => 'array',
        ];
    }
}
