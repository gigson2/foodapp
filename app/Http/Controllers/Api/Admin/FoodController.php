<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFoodRequest;
use App\Http\Requests\Admin\UpdateFoodRequest;
use App\Http\Resources\FoodResource;
use App\Models\Food;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FoodController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return FoodResource::collection(
            Food::query()
                ->with('category')
                ->withTrashed()
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->get(),
        );
    }

    public function store(StoreFoodRequest $request): FoodResource
    {
        $food = Food::query()->create($request->validated());

        return new FoodResource($food->load('category'));
    }

    public function show(Food $food): FoodResource
    {
        return new FoodResource($food->load('category'));
    }

    public function update(UpdateFoodRequest $request, Food $food): FoodResource
    {
        $food->fill($request->validated())->save();

        return new FoodResource($food->load('category'));
    }

    public function destroy(Food $food): JsonResponse
    {
        $food->delete();

        return response()->json([
            'message' => 'Food archived successfully.',
        ]);
    }
}
