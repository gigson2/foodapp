<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\DatabaseNotificationResource;
use App\Support\AdminPagination;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $request->user()->notifications()->latest();

        if ($request->hasAny(['page', 'per_page'])) {
            $perPage = AdminPagination::resolvePerPage($request);

            return DatabaseNotificationResource::collection(
                $query
                    ->paginate($perPage)
                    ->appends($request->query()),
            );
        }

        return DatabaseNotificationResource::collection(
            $query->get(),
        );
    }

    public function markRead(Request $request, string $id): DatabaseNotificationResource
    {
        /** @var DatabaseNotification $notification */
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return new DatabaseNotificationResource($notification);
    }

    public function markAllRead(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'Notifications marked as read.',
        ]);
    }
}
