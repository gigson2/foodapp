<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicFoodResource;
use App\Models\Food;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FoodController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PublicFoodResource::collection(
            Food::query()
                ->with('category')
                ->where('is_available', true)
                ->whereHas('category', fn ($query) => $query->where('is_active', true))
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->get(),
        );
    }

    public function show(string $slug): PublicFoodResource
    {
        $food = Food::query()
            ->with('category')
            ->where('slug', $slug)
            ->where('is_available', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->firstOrFail();

        return new PublicFoodResource($food);
    }
}
