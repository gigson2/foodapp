<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicCategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PublicCategoryResource::collection(
            Category::query()
                ->withCount('foods')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
        );
    }
}
