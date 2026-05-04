<?php

namespace Tests\Feature\Public;

use App\Enums\ReviewStatus;
use App\Models\Category;
use App\Models\CompanySetting;
use App\Models\Food;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPayloadExposureTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_reviews_endpoint_omits_internal_identifiers_and_customer_phone(): void
    {
        Review::query()->create([
            'customer_name' => 'Customer Example',
            'customer_phone' => '+14025550123',
            'rating' => 5,
            'message' => 'Excellent pickup experience.',
            'food_name' => 'Jollof Rice',
            'status' => ReviewStatus::Approved,
            'approved_at' => now(),
        ]);

        $response = $this->getJson('/api/reviews');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.customer_name', 'Customer Example')
            ->assertJsonMissingPath('data.0.customer_phone')
            ->assertJsonMissingPath('data.0.user_id')
            ->assertJsonMissingPath('data.0.order_id')
            ->assertJsonMissingPath('data.0.food_id');
    }

    public function test_public_food_category_and_company_payloads_omit_admin_only_fields(): void
    {
        $category = Category::factory()->create();
        $food = Food::factory()->create([
            'category_id' => $category->id,
            'seo_title' => 'Internal SEO title',
            'seo_description' => 'Internal SEO description',
        ]);

        CompanySetting::query()->create([
            'company_name' => 'Dri Foods',
            'tagline' => 'Pickup only',
            'about' => 'Freshly grilled dishes.',
            'phone' => '+14025550123',
            'email' => 'hello@example.com',
            'address' => '123 Main St',
            'pickup_instructions' => 'Use side entrance',
            'cash_only_notice' => 'Cash only at pickup',
            'opening_hours' => ['mon' => '09:00-17:00'],
            'logo' => '/storage/company/logo.png',
            'favicon' => '/storage/company/favicon.png',
            'social_links' => ['instagram' => 'https://example.com/ig'],
        ]);

        $foodsResponse = $this->getJson('/api/foods');
        $foodsResponse
            ->assertOk()
            ->assertJsonPath('data.0.id', $food->id)
            ->assertJsonMissingPath('data.0.category_id')
            ->assertJsonMissingPath('data.0.seo_title')
            ->assertJsonMissingPath('data.0.seo_description')
            ->assertJsonMissingPath('data.0.deleted_at')
            ->assertJsonMissingPath('data.0.created_at');

        $categoriesResponse = $this->getJson('/api/categories');
        $categoriesResponse
            ->assertOk()
            ->assertJsonPath('data.0.id', $category->id)
            ->assertJsonMissingPath('data.0.description')
            ->assertJsonMissingPath('data.0.sort_order')
            ->assertJsonMissingPath('data.0.is_active')
            ->assertJsonMissingPath('data.0.foods_count')
            ->assertJsonMissingPath('data.0.created_at');

        $companyResponse = $this->getJson('/api/company-settings');
        $companyResponse
            ->assertOk()
            ->assertJsonPath('data.company_name', 'Dri Foods')
            ->assertJsonMissingPath('data.created_at');
    }
}
