<?php

namespace App\Http\Controllers\Api\Customer;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use App\Notifications\AdminReviewSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return ReviewResource::collection(
            $request->user()
                ->reviews()
                ->with(['food', 'order'])
                ->latest()
                ->get(),
        );
    }

    public function store(StoreReviewRequest $request): ReviewResource
    {
        $user = $request->user();
        $foodName = $request->string('food_name')->trim()->toString();

        $eligibleOrder = $user->orders()
            ->with(['items', 'items.food'])
            ->when($foodName !== '', function ($query) use ($foodName): void {
                $query->whereHas('items', function ($itemQuery) use ($foodName): void {
                    $itemQuery->where('food_name', $foodName);
                });
            })
            ->latest('placed_at')
            ->first();

        if (! $eligibleOrder instanceof Order) {
            throw ValidationException::withMessages([
                'phone' => 'Only customers who have ordered from this restaurant can leave a review.',
            ]);
        }

        $matchedItem = $eligibleOrder->items->firstWhere('food_name', $foodName) ?? $eligibleOrder->items->first();

        $review = Review::query()->create([
            'user_id' => $user->id,
            'order_id' => $eligibleOrder->id,
            'food_id' => $matchedItem?->food_id,
            'customer_name' => $user->name,
            'customer_phone' => $user->phone,
            'rating' => $request->integer('rating'),
            'message' => $request->string('message')->trim()->toString(),
            'food_name' => $matchedItem?->food_name ?? ($foodName !== '' ? $foodName : null),
            'status' => ReviewStatus::Pending,
            'approved_at' => null,
            'rejected_at' => null,
        ]);

        User::query()
            ->where('role', 'admin')
            ->get()
            ->each(fn (User $admin) => $admin->notify(new AdminReviewSubmittedNotification($review)));

        return new ReviewResource($review->load(['food', 'order']));
    }
}
