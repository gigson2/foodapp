<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;

class OrderStatusController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {
    }

    public function __invoke(UpdateOrderStatusRequest $request, Order $order): OrderResource
    {
        $updatedOrder = $this->orderService->updateStatus(
            $order,
            OrderStatus::from($request->string('status')->toString()),
            $request->input('admin_note'),
        );

        return new OrderResource($updatedOrder);
    }
}
