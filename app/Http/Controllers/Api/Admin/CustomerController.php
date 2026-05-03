<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CustomerResource::collection(
            User::query()
                ->with('customerProfile')
                ->where('role', UserRole::Customer->value)
                ->withCount('orders')
                ->addSelect([
                    'lifetime_value' => DB::table('orders')
                        ->selectRaw('COALESCE(SUM(total), 0)')
                        ->whereColumn('orders.user_id', 'users.id'),
                    'last_order_at' => DB::table('orders')
                        ->selectRaw('MAX(placed_at)')
                        ->whereColumn('orders.user_id', 'users.id'),
                ])
                ->latest()
                ->get(),
        );
    }
}
