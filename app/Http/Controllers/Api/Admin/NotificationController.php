<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DatabaseNotificationResource;
use App\Support\AdminPagination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $unreadOnly = filter_var($request->query('unread_only', false), FILTER_VALIDATE_BOOL);

        return DatabaseNotificationResource::collection(
            $request->user()
                ->notifications()
                ->when($unreadOnly, fn ($query) => $query->whereNull('read_at'))
                ->latest()
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }

    public function markRead(Request $request, string $id): DatabaseNotificationResource
    {
        /** @var DatabaseNotification $notification */
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return new DatabaseNotificationResource($notification);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'Admin notifications marked as read.',
        ]);
    }
}
