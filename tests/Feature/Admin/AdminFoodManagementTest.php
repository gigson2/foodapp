<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminFoodManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_food(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/foods', [
            'category_id' => $category->id,
            'name' => 'Weekend Goat Box',
            'slug' => 'weekend-goat-box',
            'description' => 'Large grilled goat box for Saturday pickup.',
            'short_description' => 'Saturday goat box.',
            'image' => '/assets/images/image5.jpeg',
            'price' => 42,
            'preparation_time_minutes' => 35,
            'ingredients' => ['goat', 'onions'],
            'allergens' => [],
            'dietary_labels' => [],
            'is_available' => true,
            'is_featured' => true,
            'is_popular' => true,
            'sort_order' => 1,
            'seo_title' => 'Weekend Goat Box',
            'seo_description' => 'Large grilled goat box.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.slug', 'weekend-goat-box');

        $this->assertDatabaseHas('foods', [
            'slug' => 'weekend-goat-box',
            'name' => 'Weekend Goat Box',
        ]);
    }
}
