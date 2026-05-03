<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return OrderResource::collection(
            Order::query()
                ->with(['items', 'user'])
                ->latest('placed_at')
                ->get(),
        );
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order->load(['items', 'user']));
    }
}
