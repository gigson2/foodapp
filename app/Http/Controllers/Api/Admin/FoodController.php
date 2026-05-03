<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFoodRequest;
use App\Http\Requests\Admin\UpdateFoodRequest;
use App\Http\Resources\FoodResource;
use App\Models\Food;
use App\Support\AdminPagination;
use App\Support\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FoodController extends Controller
{
    public function __construct(
        protected FileUploadService $fileUploadService,
    ) {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $search = $request->string('search')->trim()->toString();
        $categoryId = $request->integer('category_id');
        $availability = $request->query('is_available');

        return FoodResource::collection(
            Food::query()
                ->with('category')
                ->withTrashed()
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($nested) use ($search): void {
                        $nested
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('slug', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
                })
                ->when($categoryId > 0, fn ($query) => $query->where('category_id', $categoryId))
                ->when($availability !== null && $availability !== '', fn ($query) => $query->where('is_available', filter_var($availability, FILTER_VALIDATE_BOOL)))
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }

    public function store(StoreFoodRequest $request): FoodResource
    {
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->storePublic($request->file('image'), 'foods');
        }

        $food = Food::query()->create($validated);

        return new FoodResource($food->load('category'));
    }

    public function show(Food $food): FoodResource
    {
        return new FoodResource($food->load('category'));
    }

    public function update(UpdateFoodRequest $request, Food $food): FoodResource
    {
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->replacePublic($food->image, $request->file('image'), 'foods');
        }

        $food->fill($validated)->save();

        return new FoodResource($food->load('category'));
    }

    public function destroy(Food $food): JsonResponse
    {
        $food->delete();

        return response()->json([
            'message' => 'Food archived successfully.',
        ]);
    }

    public function restore(int $id): JsonResponse
    {
        $food = Food::withTrashed()->findOrFail($id);
        $food->restore();

        return response()->json([
            'message' => 'Food restored successfully.',
        ]);
    }
}
