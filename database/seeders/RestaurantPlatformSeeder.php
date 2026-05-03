<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Enums\VisitorEventType;
use App\Models\Category;
use App\Models\CompanySetting;
use App\Models\CustomerProfile;
use App\Models\Food;
use App\Models\NotificationPreference;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SeoSetting;
use App\Models\User;
use App\Models\VisitorEvent;
use App\Models\VisitorSession;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RestaurantPlatformSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@driafricain.test'],
            [
                'name' => 'Dri Africain Admin',
                'phone' => '+14025550100',
                'role' => UserRole::Admin->value,
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
                'last_login_at' => now()->subHour(),
            ],
        );

        NotificationPreference::query()->updateOrCreate(
            ['user_id' => $admin->id],
            [
                'in_app_enabled' => true,
                'push_enabled' => true,
                'email_enabled' => true,
                'preferences' => [
                    'new_order' => true,
                    'customer_registered' => true,
                    'review_pending' => true,
                ],
            ],
        );

        CompanySetting::query()->updateOrCreate(
            ['company_name' => 'Dri Africain Traditional Grill LLC'],
            [
                'tagline' => 'Tender grilled chicken and goat packed fresh for pickup',
                'about' => 'Dri Africain Traditional Grill LLC specializes in large-scale grilled chicken and grilled goat prepared with tenderness, neat packaging, and customer satisfaction at the center of every order.',
                'phone' => null,
                'email' => 'hello@driafricain.test',
                'address' => '701 Golden Gate Circle, Papillion, NE 68046',
                'opening_hours' => [
                    'friday' => 'Pre-orders open',
                    'saturday' => '11:00 AM - 10:00 PM',
                    'ordering_cutoff' => 'Saturday 9:00 PM',
                ],
                'logo' => null,
                'favicon' => null,
                'social_links' => [
                    'instagram' => null,
                    'facebook' => null,
                ],
            ],
        );

        $seoPages = [
            [
                'page_key' => 'home',
                'title' => 'Dri Africain Traditional Grill LLC | Grilled Chicken & Goat in Papillion, NE',
                'description' => 'Order tender grilled chicken and goat from Dri Africain Traditional Grill LLC in Papillion, Nebraska. Pickup-only, cash-at-pickup traditional African grill.',
                'keywords' => 'african grill,papillion grilled goat,grilled chicken pickup',
            ],
            [
                'page_key' => 'menu',
                'title' => 'Special Grill Menu | Dri Africain Traditional Grill LLC',
                'description' => 'Browse grilled goat packs, grilled chicken packs, mixed grill trays, and family packages prepared for pickup.',
                'keywords' => 'grilled goat pack,grilled chicken pack,family grill tray',
            ],
        ];

        foreach ($seoPages as $seoPage) {
            SeoSetting::query()->updateOrCreate(
                ['page_key' => $seoPage['page_key']],
                [
                    'title' => $seoPage['title'],
                    'description' => $seoPage['description'],
                    'keywords' => $seoPage['keywords'],
                    'og_image' => '/assets/images/image5.jpeg',
                    'schema_json' => [
                        '@context' => 'https://schema.org',
                        '@type' => 'Restaurant',
                        'name' => 'Dri Africain Traditional Grill LLC',
                    ],
                ],
            );
        }

        $categories = collect([
            ['name' => 'Grilled Goat', 'slug' => 'grilled-goat', 'image' => '/assets/images/image5.jpeg', 'sort_order' => 1],
            ['name' => 'Grilled Chicken', 'slug' => 'grilled-chicken', 'image' => '/assets/images/image6.jpeg', 'sort_order' => 2],
            ['name' => 'Mixed Packs', 'slug' => 'mixed-packs', 'image' => '/assets/images/image1.jpeg', 'sort_order' => 3],
            ['name' => 'Family Packs', 'slug' => 'family-packs', 'image' => '/assets/images/image2.jpeg', 'sort_order' => 4],
            ['name' => 'Extras', 'slug' => 'extras', 'image' => '/assets/images/image4.jpeg', 'sort_order' => 5],
        ])->mapWithKeys(function (array $category): array {
            $record = Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => sprintf('%s prepared with Dri Africain hospitality and pickup-ready presentation.', $category['name']),
                    'image' => $category['image'],
                    'sort_order' => $category['sort_order'],
                    'is_active' => true,
                ],
            );

            return [$category['name'] => $record];
        });

        $foods = [
            [
                'name' => 'Grilled Goat Pack',
                'slug' => 'grilled-goat-pack',
                'category' => 'Grilled Goat',
                'description' => 'Tender grilled goat with smoky seasoning, sliced onions, and fresh tomato garnish packed neatly for pickup.',
                'short_description' => 'Tender goat with neat takeaway presentation.',
                'image' => '/assets/images/image5.jpeg',
                'price' => 30,
                'preparation_time_minutes' => 30,
                'is_featured' => true,
                'is_popular' => true,
            ],
            [
                'name' => 'Spicy Grilled Goat Pack',
                'slug' => 'spicy-grilled-goat-pack',
                'category' => 'Grilled Goat',
                'description' => 'A hotter grilled goat pack finished with pepper-forward spice and professional packaging.',
                'short_description' => 'Pepper-forward goat pack.',
                'image' => '/assets/images/image4.jpeg',
                'price' => 34,
                'preparation_time_minutes' => 34,
                'is_featured' => false,
                'is_popular' => true,
            ],
            [
                'name' => 'Grilled Chicken Pack',
                'slug' => 'grilled-chicken-pack',
                'category' => 'Grilled Chicken',
                'description' => 'Professionally grilled chicken with traditional African seasoning and clean takeaway packaging.',
                'short_description' => 'Neatly packed signature chicken.',
                'image' => '/assets/images/image3.jpeg',
                'price' => 25,
                'preparation_time_minutes' => 24,
                'is_featured' => true,
                'is_popular' => true,
            ],
            [
                'name' => 'Half Grilled Chicken Pack',
                'slug' => 'half-grilled-chicken-pack',
                'category' => 'Grilled Chicken',
                'description' => 'A half chicken portion for a lighter pickup meal, grilled to stay soft, juicy, and flavorful.',
                'short_description' => 'Lighter chicken pickup pack.',
                'image' => '/assets/images/image6.jpeg',
                'price' => 25,
                'preparation_time_minutes' => 20,
                'is_featured' => false,
                'is_popular' => false,
            ],
            [
                'name' => 'Full Grilled Chicken Pack',
                'slug' => 'full-grilled-chicken-pack',
                'category' => 'Grilled Chicken',
                'description' => 'A full grilled chicken prepared in large scale without losing tenderness or flavor.',
                'short_description' => 'Large full chicken package.',
                'image' => '/assets/images/image8.jpeg',
                'price' => 34,
                'preparation_time_minutes' => 32,
                'is_featured' => false,
                'is_popular' => true,
            ],
            [
                'name' => 'Mixed Goat & Chicken Pack',
                'slug' => 'mixed-goat-chicken-pack',
                'category' => 'Mixed Packs',
                'description' => 'A balanced grill box with goat and chicken, onions, and tomatoes for variety in one container.',
                'short_description' => 'Goat and chicken together.',
                'image' => '/assets/images/image1.jpeg',
                'price' => 36,
                'preparation_time_minutes' => 35,
                'is_featured' => true,
                'is_popular' => true,
            ],
            [
                'name' => 'Family Goat Tray',
                'slug' => 'family-goat-tray',
                'category' => 'Family Packs',
                'description' => 'A larger goat tray for family pickup orders, grilled in volume and neatly arranged for serving.',
                'short_description' => 'Goat tray for family orders.',
                'image' => '/assets/images/image2.jpeg',
                'price' => 74,
                'preparation_time_minutes' => 45,
                'is_featured' => true,
                'is_popular' => true,
            ],
            [
                'name' => 'Family Chicken Tray',
                'slug' => 'family-chicken-tray',
                'category' => 'Family Packs',
                'description' => 'Multiple grilled chickens prepared for gatherings and packaged cleanly for convenient pickup.',
                'short_description' => 'Large chicken tray.',
                'image' => '/assets/images/image6.jpeg',
                'price' => 68,
                'preparation_time_minutes' => 42,
                'is_featured' => false,
                'is_popular' => true,
            ],
            [
                'name' => 'Fresh Onion & Tomato Extras',
                'slug' => 'fresh-onion-tomato-extras',
                'category' => 'Extras',
                'description' => 'Extra onions and tomatoes to pair with your grilled packs and trays.',
                'short_description' => 'Fresh side add-on.',
                'image' => '/assets/images/image4.jpeg',
                'price' => 5,
                'preparation_time_minutes' => 8,
                'is_featured' => false,
                'is_popular' => false,
            ],
        ];

        $foodRecords = collect($foods)->mapWithKeys(function (array $food) use ($categories): array {
            $record = Food::query()->updateOrCreate(
                ['slug' => $food['slug']],
                [
                    'category_id' => $categories[$food['category']]->id,
                    'name' => $food['name'],
                    'description' => $food['description'],
                    'short_description' => $food['short_description'],
                    'image' => $food['image'],
                    'price' => $food['price'],
                    'preparation_time_minutes' => $food['preparation_time_minutes'],
                    'ingredients' => ['seasoning', 'onions', 'tomatoes'],
                    'allergens' => [],
                    'dietary_labels' => [],
                    'is_available' => true,
                    'is_featured' => $food['is_featured'],
                    'is_popular' => $food['is_popular'],
                    'sort_order' => 0,
                    'seo_title' => $food['name'].' | Dri Africain Traditional Grill LLC',
                    'seo_description' => $food['short_description'],
                ],
            );

            return [$food['slug'] => $record];
        });

        $customers = User::factory()
            ->count(6)
            ->create()
            ->each(function (User $user): void {
                CustomerProfile::query()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'address' => fake()->streetAddress(),
                        'city' => 'Papillion',
                        'notes' => fake()->boolean(30) ? 'Prefers Saturday afternoon pickup.' : null,
                    ],
                );

                NotificationPreference::query()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'in_app_enabled' => true,
                        'push_enabled' => fake()->boolean(75),
                        'email_enabled' => false,
                        'preferences' => [
                            'order_updates' => true,
                            'marketing' => false,
                        ],
                    ],
                );
            });

        $statusCycle = [
            OrderStatus::Received,
            OrderStatus::Processing,
            OrderStatus::ReadyForPickup,
            OrderStatus::Completed,
            OrderStatus::Cancelled,
            OrderStatus::Completed,
        ];

        foreach ($customers->values() as $index => $customer) {
            $food = $foodRecords->values()[$index % $foodRecords->count()];
            $status = $statusCycle[$index % count($statusCycle)];
            $placedAt = now()->subDays($index)->setTime(14, 0);
            $quantity = $index % 2 === 0 ? 2 : 1;
            $subtotal = $food->price * $quantity;

            $order = Order::query()->create([
                'user_id' => $customer->id,
                'order_number' => 'DRI-'.str_pad((string) ($index + 1), 5, '0', STR_PAD_LEFT),
                'customer_name' => $customer->name,
                'customer_email' => $customer->email,
                'customer_phone' => $customer->phone,
                'delivery_address' => null,
                'order_type' => OrderType::Pickup,
                'status' => $status,
                'subtotal' => $subtotal,
                'delivery_fee' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => $subtotal,
                'payment_method' => PaymentMethod::Cash,
                'payment_status' => $status === OrderStatus::Completed ? PaymentStatus::Paid : PaymentStatus::Unpaid,
                'customer_note' => $index % 3 === 0 ? 'Call when the grill pack is ready.' : null,
                'admin_note' => $status === OrderStatus::Cancelled ? 'Cancelled by customer before preparation.' : null,
                'placed_at' => $placedAt,
                'accepted_at' => $status !== OrderStatus::Received ? $placedAt->copy()->addMinutes(25) : null,
                'completed_at' => $status === OrderStatus::Completed ? $placedAt->copy()->addHours(4) : null,
                'cancelled_at' => $status === OrderStatus::Cancelled ? $placedAt->copy()->addHour() : null,
            ]);

            OrderItem::query()->create([
                'order_id' => $order->id,
                'food_id' => $food->id,
                'food_name' => $food->name,
                'unit_price' => $food->price,
                'quantity' => $quantity,
                'line_total' => $subtotal,
                'customer_note' => $index % 4 === 0 ? 'Extra onions please.' : null,
            ]);
        }

        $visitorSources = [
            ['device' => 'mobile', 'browser' => 'Chrome', 'platform' => 'Android', 'page' => '/'],
            ['device' => 'desktop', 'browser' => 'Safari', 'platform' => 'macOS', 'page' => '/menu'],
            ['device' => 'tablet', 'browser' => 'Chrome', 'platform' => 'iPadOS', 'page' => '/reviews'],
            ['device' => 'desktop', 'browser' => 'Edge', 'platform' => 'Windows', 'page' => '/contact'],
            ['device' => 'mobile', 'browser' => 'Safari', 'platform' => 'iOS', 'page' => '/'],
            ['device' => 'desktop', 'browser' => 'Chrome', 'platform' => 'Windows', 'page' => '/about'],
        ];

        foreach ($visitorSources as $index => $source) {
            $user = $customers[$index] ?? null;
            $session = VisitorSession::query()->create([
                'user_id' => $user?->id,
                'session_key' => Str::uuid()->toString(),
                'ip_hash' => hash('sha256', '192.168.1.'.($index + 10)),
                'user_agent' => sprintf('%s on %s', $source['browser'], $source['platform']),
                'device_type' => $source['device'],
                'browser' => $source['browser'],
                'platform' => $source['platform'],
                'referrer' => $index % 2 === 0 ? 'https://www.google.com' : 'https://www.instagram.com',
                'landing_page' => $source['page'],
                'last_seen_at' => now()->subHours($index * 3),
            ]);

            VisitorEvent::query()->create([
                'visitor_session_id' => $session->id,
                'user_id' => $user?->id,
                'event_type' => VisitorEventType::PageView,
                'event_name' => 'Landing page visit',
                'page_url' => $source['page'],
                'metadata' => ['campaign' => $index % 2 === 0 ? 'google' : 'instagram'],
            ]);

            VisitorEvent::query()->create([
                'visitor_session_id' => $session->id,
                'user_id' => $user?->id,
                'event_type' => VisitorEventType::FoodView,
                'event_name' => 'Food card opened',
                'page_url' => '/menu',
                'metadata' => ['food_slug' => $foodRecords->values()[$index % $foodRecords->count()]->slug],
            ]);
        }
    }
}
