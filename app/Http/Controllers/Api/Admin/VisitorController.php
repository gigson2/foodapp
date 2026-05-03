<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VisitorSessionResource;
use App\Models\VisitorSession;
use App\Support\AdminPagination;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VisitorController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $search = $request->string('search')->trim()->toString();

        return VisitorSessionResource::collection(
            VisitorSession::query()
                ->with('user')
                ->withCount('events')
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($nested) use ($search): void {
                        $nested
                            ->where('session_key', 'like', "%{$search}%")
                            ->orWhere('browser', 'like', "%{$search}%")
                            ->orWhere('platform', 'like', "%{$search}%")
                            ->orWhere('landing_page', 'like', "%{$search}%")
                            ->orWhereHas('user', fn ($user) => $user
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('phone', 'like', "%{$search}%"));
                    });
                })
                ->latest('last_seen_at')
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }
}
