<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Food;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        return OrderResource::collection(
            $request->user()
                ->orders()
                ->with('items')
                ->latest('placed_at')
                ->get(),
        );
    }

    public function store(StoreOrderRequest $request): OrderResource
    {
        $food = Food::query()->where('is_available', true)->findOrFail($request->integer('food_id'));

        $order = $this->orderService->createPickupOrder($request->user(), $food, $request->validated());

        return new OrderResource($order);
    }

    public function show(Request $request, Order $order): OrderResource
    {
        abort_unless($order->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        return new OrderResource($order->load(['items', 'user']));
    }
}
