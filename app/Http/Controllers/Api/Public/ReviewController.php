<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ReviewResource::collection(
            Review::query()
                ->where('status', ReviewStatus::Approved)
                ->latest('approved_at')
                ->limit(12)
                ->get(),
        );
    }
}
