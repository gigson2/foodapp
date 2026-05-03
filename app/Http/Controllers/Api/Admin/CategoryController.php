<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Support\AdminPagination;
use App\Support\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function __construct(
        protected FileUploadService $fileUploadService,
    ) {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $search = $request->string('search')->trim()->toString();
        $active = $request->query('is_active');

        return CategoryResource::collection(
            Category::query()
                ->withCount('foods')
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($nested) use ($search): void {
                        $nested
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('slug', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
                })
                ->when($active !== null && $active !== '', fn ($query) => $query->where('is_active', filter_var($active, FILTER_VALIDATE_BOOL)))
                ->orderBy('sort_order')
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }

    public function store(StoreCategoryRequest $request): CategoryResource
    {
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->storePublic($request->file('image'), 'categories');
        }

        $category = Category::query()->create($validated);

        return new CategoryResource($category);
    }

    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category->loadCount('foods'));
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->replacePublic($category->image, $request->file('image'), 'categories');
        }

        $category->fill($validated)->save();

        return new CategoryResource($category->refresh()->loadCount('foods'));
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->foods()->exists()) {
            return response()->json([
                'message' => 'Category cannot be deleted while foods are still assigned to it.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    public function toggleActive(Category $category): JsonResponse
    {
        $category->update(['is_active' => ! $category->is_active]);

        return response()->json([
            'message' => $category->is_active ? 'Category activated.' : 'Category deactivated.',
            'is_active' => $category->is_active,
        ]);
    }
}
