<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use LogicException;

class OrderStatusController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {
    }

    public function __invoke(UpdateOrderStatusRequest $request, Order $order): OrderResource|JsonResponse
    {
        try {
            $updatedOrder = $this->orderService->updateStatus(
                $order,
                OrderStatus::from($request->string('status')->toString()),
                $request->input('admin_note'),
            );
        } catch (LogicException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return new OrderResource($updatedOrder);
    }
}
