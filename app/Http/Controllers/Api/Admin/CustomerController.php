<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Models\User;
use App\Support\AdminPagination;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $search = $request->string('search')->trim()->toString();

        return CustomerResource::collection(
            User::query()
                ->with('customerProfile')
                ->where('role', UserRole::Customer->value)
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($nested) use ($search): void {
                        $nested
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
                })
                ->withCount('orders')
                ->withCount('reviews')
                ->addSelect([
                    'lifetime_value' => DB::table('orders')
                        ->selectRaw('COALESCE(SUM(total), 0)')
                        ->whereColumn('orders.user_id', 'users.id'),
                    'last_order_at' => DB::table('orders')
                        ->selectRaw('MAX(placed_at)')
                        ->whereColumn('orders.user_id', 'users.id'),
                    'last_visit_at' => DB::table('visitor_sessions')
                        ->selectRaw('MAX(last_seen_at)')
                        ->whereColumn('visitor_sessions.user_id', 'users.id'),
                ])
                ->latest()
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }
}
