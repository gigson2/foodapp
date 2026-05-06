<?php

namespace App\Http\Controllers\Api\Customer;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ClaimGuestOrdersController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'orders' => ['required', 'array', 'min:1', 'max:50'],
            'orders.*.order_number' => ['required', 'string', 'max:40'],
            'orders.*.customer_name' => ['required', 'string', 'max:255'],
            'orders.*.subtotal' => ['required', 'numeric', 'min:0'],
            'orders.*.total' => ['required', 'numeric', 'min:0'],
            'orders.*.payment_method' => ['required', Rule::in(['cash'])],
            'orders.*.order_type' => ['required', Rule::in(['pickup'])],
            'orders.*.created_at' => ['required', 'string'],
            'orders.*.items' => ['required', 'array', 'min:1'],
            'orders.*.items.*.food_name' => ['required', 'string', 'max:255'],
            'orders.*.items.*.price' => ['required', 'numeric', 'min:0'],
            'orders.*.items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'orders.*.items.*.total' => ['required', 'numeric', 'min:0'],
        ]);

        $user = $request->user();
        $input = $request->input('orders');

        // Fetch existing order numbers for this user to skip duplicates
        $existingNumbers = Order::query()
            ->where('user_id', $user->id)
            ->pluck('order_number')
            ->flip()
            ->all();

        $claimedCount = 0;

        DB::transaction(function () use ($input, $user, $existingNumbers, &$claimedCount): void {
            foreach ($input as $orderData) {
                $orderNumber = (string) $orderData['order_number'];

                if (isset($existingNumbers[$orderNumber])) {
                    continue;
                }

                $placedAt = null;
                try {
                    $placedAt = \Carbon\Carbon::parse($orderData['created_at']);
                } catch (\Throwable) {
                    $placedAt = now();
                }

                $order = Order::query()->create([
                    'user_id' => $user->id,
                    'order_number' => $orderNumber,
                    'submission_key' => null,
                    'customer_name' => $user->name,
                    'customer_email' => $user->email,
                    'customer_phone' => $user->phone,
                    'delivery_address' => null,
                    'order_type' => OrderType::Pickup,
                    'status' => OrderStatus::Received,
                    'subtotal' => (float) $orderData['subtotal'],
                    'delivery_fee' => 0,
                    'discount' => 0,
                    'tax' => 0,
                    'total' => (float) $orderData['total'],
                    'payment_method' => PaymentMethod::Cash,
                    'payment_status' => PaymentStatus::Unpaid,
                    'customer_note' => null,
                    'placed_at' => $placedAt,
                ]);

                foreach ($orderData['items'] as $item) {
                    $lineTotal = (float) $item['total'];

                    OrderItem::query()->create([
                        'order_id' => $order->id,
                        'food_id' => null,
                        'food_name' => (string) $item['food_name'],
                        'unit_price' => (float) $item['price'],
                        'quantity' => (int) $item['quantity'],
                        'line_total' => $lineTotal,
                        'customer_note' => null,
                    ]);
                }

                $claimedCount++;
            }
        });

        return response()->json([
            'message' => $claimedCount > 0
                ? "Successfully linked {$claimedCount} guest order(s) to your account."
                : 'No new orders to link.',
            'claimed_count' => $claimedCount,
        ]);
    }
}
