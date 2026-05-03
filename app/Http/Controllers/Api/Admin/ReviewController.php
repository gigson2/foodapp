<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReviewStatusRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Notifications\CustomerReviewModeratedNotification;
use App\Support\AdminPagination;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();

        return ReviewResource::collection(
            Review::query()
                ->with(['food', 'order', 'user'])
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($nested) use ($search): void {
                        $nested
                            ->where('customer_name', 'like', "%{$search}%")
                            ->orWhere('customer_phone', 'like', "%{$search}%")
                            ->orWhere('message', 'like', "%{$search}%")
                            ->orWhere('food_name', 'like', "%{$search}%");
                    });
                })
                ->when($status !== '', fn ($query) => $query->where('status', $status))
                ->latest()
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }

    public function updateStatus(UpdateReviewStatusRequest $request, Review $review): ReviewResource
    {
        $status = ReviewStatus::from($request->string('status')->toString());
        $attributes = [
            'status' => $status,
            'approved_at' => $status === ReviewStatus::Approved ? now() : null,
            'rejected_at' => $status === ReviewStatus::Rejected ? now() : null,
        ];

        $review->forceFill($attributes)->save();

        if ($review->user) {
            $review->user->notify(new CustomerReviewModeratedNotification($review));
        }

        return new ReviewResource($review->refresh()->load(['food', 'order', 'user']));
    }
}
