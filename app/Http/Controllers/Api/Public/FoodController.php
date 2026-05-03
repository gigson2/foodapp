<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\FoodResource;
use App\Models\Food;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FoodController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return FoodResource::collection(
            Food::query()
                ->with('category')
                ->where('is_available', true)
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->get(),
        );
    }

    public function show(string $slug): FoodResource
    {
        $food = Food::query()
            ->with('category')
            ->where('slug', $slug)
            ->where('is_available', true)
            ->firstOrFail();

        return new FoodResource($food);
    }
}
