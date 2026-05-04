<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
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

    public function test_admin_cannot_upload_svg_for_food_image(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create();

        Sanctum::actingAs($admin);

        $response = $this->post('/api/admin/foods', [
            'category_id' => $category->id,
            'name' => 'SVG Test Food',
            'slug' => 'svg-test-food',
            'description' => 'Should fail validation.',
            'short_description' => 'SVG upload should fail.',
            'image' => UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml'),
            'price' => 20,
            'preparation_time_minutes' => 15,
            'ingredients' => ['spice'],
            'allergens' => [],
            'dietary_labels' => [],
            'is_available' => true,
            'is_featured' => false,
            'is_popular' => false,
            'sort_order' => 1,
        ], [
            'Accept' => 'application/json',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');

        $this->assertDatabaseMissing('foods', [
            'slug' => 'svg-test-food',
        ]);
    }
}
