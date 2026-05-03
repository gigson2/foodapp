<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Food;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Food>
 */
class FoodFactory extends Factory
{
    protected $model = Food::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'short_description' => fake()->sentence(),
            'image' => null,
            'price' => fake()->randomFloat(2, 18, 96),
            'preparation_time_minutes' => fake()->numberBetween(15, 60),
            'ingredients' => ['goat', 'onions', 'seasoning'],
            'allergens' => [],
            'dietary_labels' => [],
            'is_available' => true,
            'is_featured' => fake()->boolean(35),
            'is_popular' => fake()->boolean(45),
            'sort_order' => fake()->numberBetween(1, 30),
            'seo_title' => fake()->sentence(4),
            'seo_description' => fake()->sentence(),
        ];
    }
}
