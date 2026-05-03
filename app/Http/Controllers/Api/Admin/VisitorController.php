<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VisitorSessionResource;
use App\Models\VisitorSession;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VisitorController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return VisitorSessionResource::collection(
            VisitorSession::query()
                ->with('user')
                ->withCount('events')
                ->latest('last_seen_at')
                ->get(),
        );
    }
}
