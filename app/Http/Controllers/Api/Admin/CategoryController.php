<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CategoryResource::collection(
            Category::query()
                ->withCount('foods')
                ->orderBy('sort_order')
                ->get(),
        );
    }

    public function store(StoreCategoryRequest $request): CategoryResource
    {
        $category = Category::query()->create($request->validated());

        return new CategoryResource($category);
    }

    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category->loadCount('foods'));
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $category->fill($request->validated())->save();

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
}
