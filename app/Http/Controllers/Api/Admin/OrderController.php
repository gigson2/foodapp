<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Support\AdminPagination;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();
        $paymentStatus = $request->string('payment_status')->toString();
        $dateFrom = $request->date('date_from');
        $dateTo = $request->date('date_to');

        return OrderResource::collection(
            Order::query()
                ->with(['items', 'user'])
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
                ->when($paymentStatus !== '', fn ($query) => $query->where('payment_status', $paymentStatus))
                ->when($dateFrom, fn ($query) => $query->whereDate('placed_at', '>=', $dateFrom))
                ->when($dateTo, fn ($query) => $query->whereDate('placed_at', '<=', $dateTo))
                ->latest('placed_at')
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order->load(['items', 'user']));
    }
}
