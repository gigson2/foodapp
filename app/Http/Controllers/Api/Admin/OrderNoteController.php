<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderNoteRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;

class OrderNoteController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {
    }

    public function __invoke(UpdateOrderNoteRequest $request, Order $order): OrderResource
    {
        $updatedOrder = $this->orderService->updateAdminNote(
            $order,
            $request->input('admin_note'),
        );

        return new OrderResource($updatedOrder);
    }
}
