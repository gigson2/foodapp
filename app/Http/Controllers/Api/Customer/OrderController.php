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
        $perPage = max(5, min(50, $request->integer('per_page') ?: 10));
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();
        $dateFrom = $request->date('date_from');
        $dateTo = $request->date('date_to');

        return OrderResource::collection(
            $request->user()
                ->orders()
                ->with('items')
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($nested) use ($search): void {
                        $nested
                            ->where('order_number', 'like', "%{$search}%")
                            ->orWhere('customer_name', 'like', "%{$search}%")
                            ->orWhere('customer_phone', 'like', "%{$search}%")
                            ->orWhereHas('items', fn ($items) => $items->where('food_name', 'like', "%{$search}%"));
                    });
                })
                ->when($status !== '', fn ($query) => $query->where('status', $status))
                ->when($dateFrom, fn ($query) => $query->whereDate('placed_at', '>=', $dateFrom))
                ->when($dateTo, fn ($query) => $query->whereDate('placed_at', '<=', $dateTo))
                ->latest('placed_at')
                ->paginate($perPage)
                ->appends($request->query()),
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
        abort_unless($order->user_id === $request->user()->id, 403);

        return new OrderResource($order->load(['items', 'user']));
    }
}
