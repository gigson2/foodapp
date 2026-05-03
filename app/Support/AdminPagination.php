<?php

namespace App\Support;

use Illuminate\Http\Request;

class AdminPagination
{
    /**
     * @var array<int, int>
     */
    public const PER_PAGE_OPTIONS = [10, 20, 50, 100];

    public static function resolvePerPage(Request $request): int
    {
        $perPage = $request->integer('per_page', 10);

        return in_array($perPage, self::PER_PAGE_OPTIONS, true) ? $perPage : 10;
    }
}
