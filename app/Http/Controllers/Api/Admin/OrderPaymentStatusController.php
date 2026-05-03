<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderPaymentStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;

class OrderPaymentStatusController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {
    }

    public function __invoke(UpdateOrderPaymentStatusRequest $request, Order $order): OrderResource
    {
        $updatedOrder = $this->orderService->updatePaymentStatus(
            $order,
            PaymentStatus::from($request->string('payment_status')->toString()),
        );

        return new OrderResource($updatedOrder);
    }
}
